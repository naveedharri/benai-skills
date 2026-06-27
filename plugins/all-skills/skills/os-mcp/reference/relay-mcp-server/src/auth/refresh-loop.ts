import { listSessions, updateSession, deleteSession, type Session } from "./sessions.js";
import { refreshPbToken } from "./pocketbase.js";

const REFRESH_INTERVAL_MS = 30 * 60_000;
const REFRESH_WINDOW_SEC = 6 * 60 * 60;
const INLINE_REFRESH_WINDOW_SEC = 5 * 60;

let timer: NodeJS.Timeout | null = null;

async function refreshOne(session: Session): Promise<void> {
  try {
    const next = await refreshPbToken(session.pbToken);
    updateSession(session.sid, {
      pbToken: next.pbToken,
      pbTokenExp: next.pbTokenExp,
    });
  } catch (err: any) {
    console.error(`[refresh-loop] session ${session.sid.slice(0, 8)} refresh failed: ${err.message}`);
    if (err.message.includes("401") || err.message.includes("403")) {
      deleteSession(session.sid);
    }
  }
}

export function startRefreshLoop(): void {
  if (timer) return;
  timer = setInterval(async () => {
    const now = Math.floor(Date.now() / 1000);
    for (const s of listSessions()) {
      if (s.pbTokenExp && s.pbTokenExp - now < REFRESH_WINDOW_SEC) {
        await refreshOne(s);
      }
    }
  }, REFRESH_INTERVAL_MS);
  if (timer && typeof timer.unref === "function") timer.unref();
}

export async function ensureFreshPbToken(sid: string): Promise<string | null> {
  const sessions = listSessions().filter(s => s.sid === sid);
  const session = sessions[0];
  if (!session) return null;
  const now = Math.floor(Date.now() / 1000);
  if (session.pbTokenExp && session.pbTokenExp - now < INLINE_REFRESH_WINDOW_SEC) {
    await refreshOne(session);
    const updated = listSessions().find(s => s.sid === sid);
    return updated?.pbToken || null;
  }
  return session.pbToken;
}
