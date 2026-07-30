import type { Response } from "express";
import type {
  OAuthServerProvider,
  AuthorizationParams,
} from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type {
  OAuthClientInformationFull,
  OAuthTokens,
  OAuthTokenRevocationRequest,
} from "@modelcontextprotocol/sdk/shared/auth.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import {
  InvalidGrantError,
  InvalidTokenError,
} from "@modelcontextprotocol/sdk/server/auth/errors.js";

import { ALLOWED_EMAILS, STATIC_MCP_BEARER } from "../config.js";
import { clientsStore } from "./clients.js";
import { createPending, consumePending, touchPending } from "./pending.js";
import { createCode, consumeCode, peekCode } from "./codes.js";
import { createSession, getSession } from "./sessions.js";
import { authWithPassword, requestPasswordReset } from "./pocketbase.js";
import {
  signAccessToken,
  verifyAccessJwt,
  issueRefreshToken,
  redeemRefreshToken,
  revokeRefreshToken,
  ACCESS_TOKEN_TTL_SEC,
} from "./tokens.js";

export const LOGIN_PATH = "/oauth/login";
export const RESET_PATH = "/oauth/reset-request";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface Banner { type: "info" | "success" | "error"; text: string }

function renderLoginPage(params: {
  state: string;
  error?: string;
  banner?: Banner;
  email?: string;
}): string {
  const err = params.error ? `<p class="err">${escapeHtml(params.error)}</p>` : "";
  const banner = params.banner
    ? `<p class="banner banner-${params.banner.type}">${escapeHtml(params.banner.text)}</p>`
    : "";
  const emailVal = params.email ? escapeHtml(params.email) : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sign in to Relay Vault MCP</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; }
  .card { background: #1e293b; padding: 2rem 2.25rem; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,.3); }
  h1 { font-size: 1.25rem; margin: 0 0 .5rem; }
  p.sub { color: #94a3b8; margin: 0 0 1.5rem; font-size: .9rem; }
  label { display: block; font-size: .85rem; margin-bottom: .35rem; color: #cbd5e1; }
  input { width: 100%; box-sizing: border-box; padding: .625rem .75rem; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #f1f5f9; font-size: .95rem; margin-bottom: 1rem; }
  input:focus { outline: none; border-color: #38bdf8; }
  button { width: 100%; padding: .7rem; background: #38bdf8; color: #0f172a; border: 0; border-radius: 8px; font-weight: 600; font-size: .95rem; cursor: pointer; }
  button:hover { background: #7dd3fc; }
  button.secondary { background: transparent; color: #cbd5e1; border: 1px solid #334155; font-weight: 500; }
  button.secondary:hover { background: #0f172a; border-color: #38bdf8; color: #e0f2fe; }
  .err { background: #450a0a; border: 1px solid #7f1d1d; color: #fecaca; padding: .6rem .75rem; border-radius: 8px; font-size: .85rem; margin-bottom: 1rem; }
  .banner { padding: .6rem .75rem; border-radius: 8px; font-size: .85rem; margin-bottom: 1rem; }
  .banner-info { background: #0c4a6e; border: 1px solid #0369a1; color: #bae6fd; }
  .banner-success { background: #064e3b; border: 1px solid #059669; color: #bbf7d0; }
  .banner-error { background: #450a0a; border: 1px solid #7f1d1d; color: #fecaca; }
  .hint { color: #64748b; font-size: .75rem; margin-top: 1rem; text-align: center; }
  details { margin-top: 1.25rem; border-top: 1px solid #334155; padding-top: 1.25rem; }
  summary { cursor: pointer; color: #94a3b8; font-size: .85rem; list-style: none; user-select: none; }
  summary:hover { color: #cbd5e1; }
  summary::-webkit-details-marker { display: none; }
  summary:before { content: "\\203A  "; display: inline-block; transition: transform .15s; }
  details[open] summary:before { transform: rotate(90deg); }
  details .sub2 { color: #64748b; font-size: .8rem; margin: .75rem 0 1rem; line-height: 1.4; }
</style>
</head>
<body>
<div class="card">
  <h1>Sign in to Relay Vault</h1>
  <p class="sub">Use your Relay.md email and password.</p>
  ${banner}${err}
  <form method="POST" action="${LOGIN_PATH}">
    <input type="hidden" name="state" value="${escapeHtml(params.state)}">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" value="${emailVal}" required autofocus>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required>
    <button type="submit">Sign in</button>
  </form>
  <details>
    <summary>Forgot password or haven't set one yet?</summary>
    <p class="sub2">If you signed up with Google / GitHub / Microsoft, your account may not have a password. Enter your email and we'll send a reset link from Relay.md. Come back to this page once you've set a password.</p>
    <form method="POST" action="${RESET_PATH}">
      <input type="hidden" name="state" value="${escapeHtml(params.state)}">
      <label for="reset_email">Email</label>
      <input id="reset_email" name="email" type="email" autocomplete="email" value="${emailVal}" required>
      <button type="submit" class="secondary">Send reset email</button>
    </form>
  </details>
</div>
</body>
</html>`;
}

function renderErrorPage(title: string, body: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>body{font-family:-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}.card{background:#1e293b;padding:2rem;border-radius:12px;max-width:420px}h1{margin:0 0 .75rem;color:#fca5a5}p{color:#cbd5e1}</style>
</head><body><div class="card"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p><p>You can close this tab.</p></div></body></html>`;
}

export class RelayOAuthProvider implements OAuthServerProvider {
  get clientsStore(): OAuthRegisteredClientsStore {
    return clientsStore;
  }

  async authorize(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ): Promise<void> {
    const pending = createPending({
      claudeClientId: client.client_id,
      claudeRedirectUri: params.redirectUri,
      claudeState: params.state,
      claudeCodeChallenge: params.codeChallenge,
      claudeResource: params.resource?.toString(),
    });

    res.status(200).type("text/html").send(renderLoginPage({ state: pending.ourState }));
  }

  async challengeForAuthorizationCode(
    _client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    const code = peekCode(authorizationCode);
    if (!code) throw new InvalidGrantError("invalid or expired authorization code");
    return code.codeChallenge;
  }

  async exchangeAuthorizationCode(
    client: OAuthClientInformationFull,
    authorizationCode: string,
    _codeVerifier?: string,
    _redirectUri?: string,
    _resource?: URL
  ): Promise<OAuthTokens> {
    const code = consumeCode(authorizationCode);
    if (!code) throw new InvalidGrantError("invalid or expired authorization code");
    if (code.clientId !== client.client_id) {
      throw new InvalidGrantError("code was issued to a different client");
    }

    const session = getSession(code.sid);
    if (!session) throw new InvalidGrantError("session no longer exists");

    const accessToken = await signAccessToken({
      sid: session.sid,
      email: session.email,
      clientId: client.client_id,
    });
    const refreshToken = issueRefreshToken(session.sid, client.client_id);

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL_SEC,
      refresh_token: refreshToken,
    };
  }

  async exchangeRefreshToken(
    client: OAuthClientInformationFull,
    refreshToken: string,
    _scopes?: string[],
    _resource?: URL
  ): Promise<OAuthTokens> {
    const redeemed = redeemRefreshToken(refreshToken);
    if (!redeemed) throw new InvalidGrantError("invalid or expired refresh token");
    if (redeemed.clientId !== client.client_id) {
      throw new InvalidGrantError("refresh token was issued to a different client");
    }
    const session = getSession(redeemed.sid);
    if (!session) {
      revokeRefreshToken(refreshToken);
      throw new InvalidGrantError("session no longer exists");
    }

    const accessToken = await signAccessToken({
      sid: session.sid,
      email: session.email,
      clientId: client.client_id,
    });

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL_SEC,
      refresh_token: refreshToken,
    };
  }

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    if (STATIC_MCP_BEARER && token === STATIC_MCP_BEARER) {
      return {
        token,
        clientId: "static-bearer",
        scopes: [],
        expiresAt: Math.floor(Date.now() / 1000) + 60 * 60,
        extra: { mode: "static" },
      };
    }

    try {
      const verified = await verifyAccessJwt(token);
      const session = getSession(verified.sid);
      if (!session) throw new InvalidTokenError("session no longer exists");
      return {
        token,
        clientId: verified.clientId,
        scopes: [],
        expiresAt: verified.expSec,
        extra: {
          mode: "oauth",
          sid: verified.sid,
          email: verified.email,
        },
      };
    } catch (err: any) {
      if (err instanceof InvalidTokenError) throw err;
      throw new InvalidTokenError(err.message || "invalid access token");
    }
  }

  async revokeToken(
    _client: OAuthClientInformationFull,
    request: OAuthTokenRevocationRequest
  ): Promise<void> {
    const token = request.token;
    if (request.token_type_hint === "refresh_token" || !request.token_type_hint) {
      revokeRefreshToken(token);
    }
  }
}

/**
 * Handle POST /oauth/login (form submission).
 */
export async function handleLogin(params: {
  state: string;
  email: string;
  password: string;
}): Promise<
  | { redirectUrl: string }
  | { pageHtml: string; status: number }
> {
  const pending = consumePending(params.state);
  if (!pending) {
    return { pageHtml: renderErrorPage("Session expired", "Your sign-in link is no longer valid. Please restart the connection from Claude."), status: 400 };
  }

  if (!params.email || !params.password) {
    const fresh = createPending({
      claudeClientId: pending.claudeClientId,
      claudeRedirectUri: pending.claudeRedirectUri,
      claudeState: pending.claudeState,
      claudeCodeChallenge: pending.claudeCodeChallenge,
      claudeResource: pending.claudeResource,
    });
    return {
      pageHtml: renderLoginPage({
        state: fresh.ourState,
        error: "Email and password are required.",
        email: params.email,
      }),
      status: 400,
    };
  }

  let pb;
  try {
    pb = await authWithPassword({
      identity: params.email.trim(),
      password: params.password,
    });
  } catch (err: any) {
    const freshPending = createPending({
      claudeClientId: pending.claudeClientId,
      claudeRedirectUri: pending.claudeRedirectUri,
      claudeState: pending.claudeState,
      claudeCodeChallenge: pending.claudeCodeChallenge,
      claudeResource: pending.claudeResource,
    });
    return {
      pageHtml: renderLoginPage({
        state: freshPending.ourState,
        error: err.message || "Sign-in failed",
        email: params.email,
      }),
      status: 401,
    };
  }

  if (ALLOWED_EMAILS.length && !ALLOWED_EMAILS.includes(pb.email)) {
    return {
      pageHtml: renderErrorPage("Not authorized", `Your account (${pb.email}) is not in the allow-list for this server.`),
      status: 403,
    };
  }

  // Login succeeded — consume pending for real.

  const session = createSession({
    pbToken: pb.pbToken,
    pbTokenExp: pb.pbTokenExp,
    email: pb.email,
    recordId: pb.recordId,
  });

  const code = createCode({
    sid: session.sid,
    clientId: pending.claudeClientId,
    redirectUri: pending.claudeRedirectUri,
    codeChallenge: pending.claudeCodeChallenge,
    resource: pending.claudeResource,
  });

  const finalRedirect = new URL(pending.claudeRedirectUri);
  finalRedirect.searchParams.set("code", code.code);
  if (pending.claudeState) finalRedirect.searchParams.set("state", pending.claudeState);
  return { redirectUrl: finalRedirect.toString() };
}

/**
 * Handle POST /oauth/reset-request (form submission). Always responds with
 * the login page and a neutral banner ("If that email matches..."); never
 * leaks whether an account exists.
 */
export async function handleResetRequest(params: {
  state: string;
  email: string;
}): Promise<{ pageHtml: string; status: number }> {
  const pending = touchPending(params.state);
  if (!pending) {
    return {
      pageHtml: renderErrorPage(
        "Session expired",
        "Your sign-in link is no longer valid. Please restart the connection from Claude."
      ),
      status: 400,
    };
  }

  const email = (params.email || "").trim();
  if (!email) {
    return {
      pageHtml: renderLoginPage({
        state: pending.ourState,
        error: "Enter an email to send a reset link.",
      }),
      status: 400,
    };
  }

  try {
    await requestPasswordReset(email);
  } catch (err: any) {
    console.error("[reset-request] error:", err.message);
    // Still return the neutral banner to avoid leaking account existence.
  }

  return {
    pageHtml: renderLoginPage({
      state: pending.ourState,
      email,
      banner: {
        type: "success",
        text: `If ${email} has a Relay.md account, a password reset email is on its way. Check your inbox, set a password, then come back here to sign in.`,
      },
    }),
    status: 200,
  };
}
