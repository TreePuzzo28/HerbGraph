export interface ParsedRelationship {
  target: string;
}

const wikilinkPattern = /^\[\[([^\]|#^]+)(?:\|([^\]]+))?\]\]$/;

export function parseRelationship(
  value: string,
  sourcePath: string,
  field: string,
): ParsedRelationship {
  const match = wikilinkPattern.exec(value.trim());
  if (!match) {
    throw new Error(
      `${sourcePath}: ${field} contains unsupported relationship value "${value}"`,
    );
  }

  const target = match[1].trim();
  const displayText = match[2]?.trim();
  if (!target || (match[2] !== undefined && !displayText)) {
    throw new Error(
      `${sourcePath}: ${field} contains malformed wikilink "${value}"`,
    );
  }

  return { target };
}
