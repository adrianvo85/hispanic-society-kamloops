#!/usr/bin/env node
/**
 * Restore self-hosted fonts and official logo files when they are missing
 * (for example on a fresh CI checkout that cannot store binaries through
 * the text-only publisher). Also fetches and encodes the Mixkit hero video
 * when ffmpeg is available.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const payloadDir = join(root, "scripts/asset-payloads");

function restorePayloads() {
  if (!existsSync(payloadDir)) return;
  for (const name of readdirSync(payloadDir).filter((n) => n.endsWith(".json"))) {
    const data = JSON.parse(readFileSync(join(payloadDir, name), "utf8"));
    for (const item of data.files || []) {
      const dest = join(root, item.path);
      if (existsSync(dest)) continue;
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, Buffer.from(item.base64, "base64"));
      console.log("restored", item.path);
    }
  }
}

function have(cmd) {
  try {
    execFileSync(cmd, ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    try {
      execFileSync(cmd, ["-hide_banner"], { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }
}

async function ensureHero() {
  const mp4 = join(root, "public/videos/hero.mp4");
  const webm = join(root, "public/videos/hero.webm");
  const poster = join(root, "public/videos/hero-poster.jpg");
  const still = join(root, "public/images/stock/papel-picado.jpg");
  if (existsSync(mp4) && existsSync(webm) && existsSync(poster)) return;
  const srcUrl = "https://assets.mixkit.co/videos/34435/34435-720.mp4";
  const tmp = join(root, "public/videos/_mixkit-34435.mp4");
  mkdirSync(join(root, "public/videos"), { recursive: true });
  console.log("downloading hero source", srcUrl);
  const res = await fetch(srcUrl);
  if (!res.ok) throw new Error(`Hero download failed: ${res.status}`);
  writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
  if (have("ffmpeg")) {
    if (!existsSync(mp4)) {
      execFileSync("ffmpeg", ["-y", "-i", tmp, "-an", "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4], { stdio: "inherit" });
    }
    if (!existsSync(webm)) {
      execFileSync("ffmpeg", ["-y", "-i", mp4, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "33", "-row-mt", "1", "-pix_fmt", "yuv420p", webm], { stdio: "inherit" });
    }
    if (!existsSync(poster)) {
      execFileSync("ffmpeg", ["-y", "-ss", "2", "-i", tmp, "-frames:v", "1", "-q:v", "3", poster], { stdio: "inherit" });
    }
  } else {
    if (!existsSync(mp4)) writeFileSync(mp4, readFileSync(tmp));
    console.warn("ffmpeg not found; using the Mixkit MP4 as-is and skipping WebM/poster encode.");
  }
  if (existsSync(poster) && !existsSync(still)) {
    writeFileSync(still, readFileSync(poster));
  }
}

restorePayloads();
await ensureHero();
console.log("ensure-assets: done");
