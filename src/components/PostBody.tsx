import type { ReactNode } from "react";

/**
 * Minimal renderer for the markdown-lite format used in `lib/posts.ts`
 * ("## " headings, "- " bullets, "**bold**", blank-line-separated blocks).
 * A full markdown pipeline is overkill for hand-authored editorial content;
 * swap this for MDX if the client wants a CMS later.
 */
export default function PostBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n{2,}/);

  return (
    <div className="prose-body">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return <h2 key={i}>{block.slice(3)}</h2>;
        }
        if (block.startsWith("- ")) {
          return (
            <ul key={i}>
              {block.split("\n").map((line, j) => (
                <li key={j}>{inline(line.replace(/^-\s*/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(block)) {
          return (
            <ol key={i} className="mb-5 grid list-decimal gap-2 pl-5">
              {block.split("\n").map((line, j) => (
                <li key={j} className="pl-1 leading-relaxed text-body">
                  {inline(line.replace(/^\d+\.\s*/, ""))}
                </li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}

/** Handles **bold** spans only — the one inline mark the copy uses. */
function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}
