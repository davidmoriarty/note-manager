// client/src/lib/note-preview.ts
export function notePreviewText(
  markdown: string,
  opts?: { maxChars?: number; codeLines?: number; includeHeading?: boolean },
) {
  const maxChars = opts?.maxChars ?? 180;
  const codeLines = opts?.codeLines ?? 3;
  const includeHeading = opts?.includeHeading ?? true;

  const md = markdown ?? "";

  // First heading (optional context for cards)
  const headingMatch = md.match(/^\s{0,3}#{1,6}\s+(.+)\s*$/m);
  const heading = headingMatch?.[1]?.trim();

  // Prefer a short fenced-code snippet (multi-line)
  const fenceMatch = md.match(/```(\w+)?\s*\n([\s\S]*?)```/);
  if (fenceMatch) {
    const body = fenceMatch[2] ?? "";

    const lines = body
      .split("\n")
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0)
      .slice(0, Math.max(1, codeLines));

    if (lines.length) {
      const snippet = lines.join("\n");
      const out =
        includeHeading && heading ? `${heading}\n\n${snippet}` : snippet;

      return truncate(out, maxChars);
    }
  }

  // Strip common markdown while keeping readable structure
  let s = md;

  // Remove fenced code blocks entirely (handled above)
  s = s.replace(/```[\s\S]*?```/g, " ");

  // Inline code → plain
  s = s.replace(/`([^`]+)`/g, "$1");

  // Images → alt text
  s = s.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  // Links → label
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Headings / blockquotes
  s = s.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  s = s.replace(/^\s{0,3}>\s?/gm, "");

  // Checkbox bullets
  s = s.replace(/^\s*[-*+]\s+\[( |x|X)\]\s+/gm, "• ");

  // Normal list bullets
  s = s.replace(/^\s*[-*+]\s+/gm, "• ");
  s = s.replace(/^\s*\d+\.\s+/gm, "• ");

  // Horizontal rules
  s = s.replace(/^\s*---+\s*$/gm, " ");

  // Remove emphasis markers
  s = s.replace(/[*_~]+/g, "");

  // Collapse whitespace, keep a few lines
  s = s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6)
    .join("\n");

  return truncate(s, maxChars);
}

function truncate(s: string, maxChars: number) {
  if (s.length <= maxChars) return s;
  return `${s.slice(0, maxChars - 1).trimEnd()}…`;
}

export function stripHtmlOutsideCodeFences(src: string) {
  const parts = src.split(/```[\s\S]*?```/g);
  const fences = src.match(/```[\s\S]*?```/g) ?? [];

  const cleanedParts = parts.map((p) => {
    const noTags = p.replace(
      /<\/?(ul|ol|li|p|br|h[1-6]|blockquote|div|span|pre|code)\b[^>]*>/gi,
      "",
    );

    // Prevent “indented text becomes code block” after HTML stripping
    return noTags.replace(/^\s{2,}(?=\S)/gm, "");
  });

  let out = "";
  for (let i = 0; i < cleanedParts.length; i++) {
    out += cleanedParts[i] ?? "";
    if (fences[i]) out += fences[i];
  }
  return out;
}
