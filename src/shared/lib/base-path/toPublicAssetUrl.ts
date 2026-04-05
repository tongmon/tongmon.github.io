export function toPublicAssetUrl(relativePath: string) {
  const normalizedPath = relativePath.replace(/^\/+/, "");

  return `${import.meta.env.BASE_URL}${normalizedPath}`;
}
