export type Lang = "en" | "es";

export function baseUrl(): string {
  return (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "";
}

export function withBase(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:") || path.startsWith("mailto:")) {
    return path;
  }
  const base = baseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function pagePath(lang: Lang, slug = ""): string {
  const base = baseUrl();
  const prefix = lang === "es" ? `${base}/es` : base;
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return clean ? `${prefix}/${clean}/` : `${prefix}/`;
}

export function switchLang(lang: Lang, currentPath: string): string {
  const other: Lang = lang === "en" ? "es" : "en";
  const base = baseUrl();
  let rest = currentPath;
  if (base && rest.startsWith(base)) rest = rest.slice(base.length);
  rest = rest.replace(/^\/es(?=\/|$)/, "");
  rest = rest.replace(/^\/+/, "").replace(/\/+$/, "");
  return pagePath(other, rest);
}

export function htmlLang(lang: Lang): string {
  return lang === "es" ? "es" : "en-CA";
}

export function withLang(target: Lang, currentPath: string): string {
  const base = baseUrl();
  let rest = currentPath || "/";
  if (base && rest.startsWith(base)) rest = rest.slice(base.length);
  rest = rest.replace(/^\/es(?=\/|$)/, "");
  rest = rest.replace(/^\/+/, "").replace(/\/+$/, "");
  return pagePath(target, rest);
}
