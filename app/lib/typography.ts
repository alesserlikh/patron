const nonBreakingSpace = "\u00a0";

/** A short word or a number must stay with the next token in its fragment. */
export function needsNextWord(token: string): boolean {
  const core = token.replace(/^[^\p{L}\p{N}+-]+|[^\p{L}\p{N}%+°]+$/gu, "");
  return (
    /^\p{L}{1,2}$/u.test(core) ||
    /^[+-]?\p{N}+(?:[.,:/–—−-]\p{N}+)*[%+°]*$/u.test(core)
  );
}

/** Presentation only: content, input values and API payloads keep normal spaces. */
export function typography(value: string | number, continues = false): string {
  const text = String(value);
  return text.replace(
    /(\S+)([^\S\r\n]+)/gu,
    (match, token: string, space: string, offset: number) => {
      const next = text.slice(offset + match.length);
      // A newline or the end of the fragment ends this rule.
      if ((!next || /^[\r\n]/u.test(next)) && !(continues && !next))
        return match;
      return needsNextWord(token) ? token + nonBreakingSpace : token + space;
    },
  );
}

/** Keep the coloured words of the manifesto together across inline spans. */
export function typographyGroups<T extends { t: string }>(
  tokens: readonly T[],
): T[][] {
  const groups: T[][] = [];
  let group: T[] = [];
  for (const token of tokens) {
    group.push(token);
    if (!needsNextWord(token.t)) {
      groups.push(group);
      group = [];
    }
  }
  if (group.length) groups.push(group);
  return groups;
}
