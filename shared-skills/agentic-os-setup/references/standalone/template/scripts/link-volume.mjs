// At startup, if a Railway volume is mounted at /app/data, redirect the
// `.runs/` and `public/data/` directories there so state survives redeploys.
// No-op locally.
import fs from "node:fs";
import path from "node:path";

const VOLUME = "/app/data";
if (!fs.existsSync(VOLUME)) {
  console.log(`[link-volume] no volume at ${VOLUME}; skipping`);
  process.exit(0);
}

function linkInto(realDir, linkPath) {
  fs.mkdirSync(realDir, { recursive: true });
  try {
    const st = fs.lstatSync(linkPath);
    if (st.isSymbolicLink()) {
      const target = fs.readlinkSync(linkPath);
      if (path.resolve(target) === path.resolve(realDir)) {
        console.log(`[link-volume] ${linkPath} -> ${realDir} (already)`);
        return;
      }
      fs.unlinkSync(linkPath);
    } else if (st.isDirectory()) {
      // Migrate existing contents into the volume on first boot, then replace with symlink.
      for (const f of fs.readdirSync(linkPath)) {
        const src = path.join(linkPath, f);
        const dst = path.join(realDir, f);
        if (!fs.existsSync(dst)) fs.cpSync(src, dst, { recursive: true });
      }
      fs.rmSync(linkPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(linkPath);
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  fs.symlinkSync(realDir, linkPath, "dir");
  console.log(`[link-volume] ${linkPath} -> ${realDir}`);
}

linkInto(path.join(VOLUME, "runs"), path.resolve(".runs"));
linkInto(path.join(VOLUME, "snapshots"), path.resolve("public", "data"));
