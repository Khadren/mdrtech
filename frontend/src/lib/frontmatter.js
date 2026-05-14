/**
 * Minimal YAML-ish frontmatter parser for blog/project content.
 *
 * Supports the subset we actually use:
 *   - key: value pairs
 *   - quoted strings (single or double)
 *   - bare strings (everything up to end-of-line)
 *   - numbers
 *   - booleans (true / false)
 *   - ISO dates kept as strings (the consumer can wrap in Date)
 *   - flat arrays: [a, b, "c"]
 *
 * Returns { ...fields, content } where `content` is the markdown body
 * after the closing `---` line. If no frontmatter is found, returns
 * { content: raw }.
 */
export function parseFrontmatter(raw) {
  const match = raw.match(
    /^[\s\uFEFF]*---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/
  );
  if (!match) return { content: raw };

  const fields = {};
  const lines = match[1].split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const rawVal = line.slice(idx + 1).trim();
    fields[key] = parseValue(rawVal);
  }

  return { ...fields, content: match[2] };
}

function parseValue(val) {
  if (val === "") return "";
  if (val === "true") return true;
  if (val === "false") return false;
  if (val === "null" || val === "~") return null;
  if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val);
  if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1);
  if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1);
  if (val.startsWith("[") && val.endsWith("]")) {
    const inner = val.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((s) => parseValue(s.trim()));
  }
  return val;
}
