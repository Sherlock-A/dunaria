interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9À-ɏḀ-ỿ-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractHeadings(content: string): Heading[] {
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim().replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
    headings.push({ level, text, id: slugify(text) });
  }
  return headings;
}

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table des matières"
      className="hidden lg:block sticky top-28 w-52 shrink-0 self-start"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-night-600/40">
        Sommaire
      </p>
      <ul className="space-y-2 border-l border-sand-300 pl-4">
        {headings.map((h) => (
          <li key={`${h.id}-${h.level}`}>
            <a
              href={`#${h.id}`}
              className={`block text-sm leading-snug transition-colors hover:text-gold ${
                h.level === 3
                  ? "pl-2 text-night-600/50 text-xs"
                  : "text-night-700"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
