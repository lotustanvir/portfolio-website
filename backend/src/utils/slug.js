export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(slug) {
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${slug}-${suffix}`;
}
