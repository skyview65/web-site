// Yalnızca saf dolgu seslerini siler ("um", "ııı", "eee") — "yani", "şey" gibi
// gerçek sözcüklere dokunmaz. local-flow/local_flow/cleaner.py ile eşdeğerdir.
const FILLER_RE =
  /(^|\s)(?:u+m+|u+h+|e+r+m+|h+m+|m+h+m+|e{2,}|ı{2,}|a{3,}|ö{2,})(?=[\s,.;:!?]|$)[,.]?/giu;

export function stripFillers(text: string): string {
  return text
    .replace(FILLER_RE, "$1")
    .replace(/\s+([,.;:!?])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .trim();
}
