export function resolveBasePath(repository = "", override?: string): string {
  if (override !== undefined) {
    const value = override.trim().replace(/^\/+|\/+$/g, "");
    if (
      value &&
      (!/^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/.test(value) ||
        value.split("/").some((part) => part === "." || part === ".."))
    ) {
      throw new Error("Invalid base path");
    }
    return value ? `/${value}` : "";
  }
  const name = repository.split("/")[1] ?? "";
  return !name || name.toLowerCase().endsWith(".github.io") ? "" : `/${name}`;
}

export function assetPath(
  path: string,
  base = process.env.NEXT_PUBLIC_BASE_PATH ?? "",
): string {
  if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const normalized = `/${path.replace(/^\/+/, "")}`;
  return base && (normalized === base || normalized.startsWith(`${base}/`))
    ? normalized
    : `${base}${normalized}`;
}

export function safeExternalUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
