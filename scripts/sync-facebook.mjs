#!/usr/bin/env node
/**
 * Pulls public Page posts, photos and events from the Facebook Graph API
 * into src/content/facebook/*.json so the static site can rebuild.
 *
 * Runs only when FB_PAGE_TOKEN is set. A page admin must authorize a Page
 * access token once (pages_read_engagement / pages_read_user_content as
 * required by Meta at the time of authorization) and store it as the
 * GitHub Actions secret FB_PAGE_TOKEN. Never commit the token.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const token = process.env.FB_PAGE_TOKEN || "";
const pageId = process.env.FB_PAGE_ID || "100064781585925";
const version = process.env.FB_GRAPH_VERSION || "v21.0";

function log(msg) {
  console.log(`[facebook-sync] ${msg}`);
}

if (!token) {
  log("FB_PAGE_TOKEN is not set. Skipping (this is expected until a page admin authorizes the token).");
  process.exit(0);
}

async function graph(path, fields) {
  const url = new URL(`https://graph.facebook.com/${version}/${path}`);
  url.searchParams.set("access_token", token);
  if (fields) url.searchParams.set("fields", fields);
  url.searchParams.set("limit", "25");
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Graph ${path} ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

function writeJson(rel, data) {
  const file = resolve(root, rel);
  return mkdir(dirname(file), { recursive: true }).then(() =>
    writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8")
  );
}

try {
  const settings = JSON.parse(
    await readFile(resolve(root, "src/content/site/settings.json"), "utf8")
  );
  const id = process.env.FB_PAGE_ID || settings.facebookPageId || pageId;

  const [posts, photos, events] = await Promise.all([
    graph(`${id}/posts`, "id,message,created_time,permalink_url,full_picture"),
    graph(`${id}/photos`, "id,name,created_time,link,images"),
    graph(`${id}/events`, "id,name,description,start_time,end_time,place,cover,ticket_uri"),
  ]);

  const now = new Date().toISOString();
  await writeJson("src/content/facebook/posts.json", {
    updatedAt: now,
    source: "facebook-graph",
    items: (posts.data || []).map((p) => ({
      id: p.id,
      message: p.message || "",
      createdAt: p.created_time,
      permalink: p.permalink_url || "",
      picture: p.full_picture || "",
    })),
  });
  await writeJson("src/content/facebook/photos.json", {
    updatedAt: now,
    source: "facebook-graph",
    items: (photos.data || []).map((p) => ({
      id: p.id,
      name: p.name || "",
      createdAt: p.created_time,
      link: p.link || "",
      picture: p.images?.[0]?.source || "",
    })),
  });
  await writeJson("src/content/facebook/events.json", {
    updatedAt: now,
    source: "facebook-graph",
    items: (events.data || []).map((e) => ({
      id: e.id,
      name: e.name || "",
      description: e.description || "",
      startTime: e.start_time || "",
      endTime: e.end_time || "",
      place: e.place?.name || "",
      address: e.place?.location
        ? [e.place.location.street, e.place.location.city, e.place.location.state, e.place.location.zip]
            .filter(Boolean)
            .join(", ")
        : "",
      cover: e.cover?.source || "",
      ticketsUrl: e.ticket_uri || "",
    })),
  });
  log("Wrote posts, photos and events into src/content/facebook/.");
} catch (err) {
  console.error(`[facebook-sync] ${err.message || err}`);
  process.exit(1);
}
