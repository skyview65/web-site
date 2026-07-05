/**
 * Prefixes a public/ asset path with the build-time base path so plain
 * <img>/link references keep working when the site is exported under a
 * subpath (e.g. GitHub Pages). Next's router handles this for <Link>,
 * but not for raw asset URLs.
 */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
