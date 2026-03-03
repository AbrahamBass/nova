export function joinPath(prefix: string, path: string): string {
  return `/${[prefix, path]
    .map((p) => p.replace(/^\/|\/$/g, ""))
    .filter(Boolean)
    .join("/")}`;
}

export function normalizePath(path: string): string {
  const cleaned = path
    .replace(/\/+/g, "/") // colapsa //
    .replace(/\/$/, "") // quita slash final
    .replace(/^([^/])/, "/$1"); // asegura slash inicial

  if (!/^\/[a-zA-Z0-9\/:_-]*$/.test(cleaned)) {
    throw new Error(`Invalid path: ${path}`);
  }

  return cleaned;
}
