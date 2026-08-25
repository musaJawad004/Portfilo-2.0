import type { ReactNode } from "react";
import type { ArticleBlock } from "../../lib/newsletter-articles";
import { Mermaid } from "./Mermaid";

// Minimal inline formatter: **bold**, `code`, and [text](url). Enough for
// editorial prose without pulling in a full markdown runtime.
function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|`([^`]+?)`|\[([^\]]+?)\]\(([^)]+?)\)/g;
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<code key={key++}>{match[2]}</code>);
    } else if (match[3] !== undefined && match[4] !== undefined) {
      const external = /^https?:/.test(match[4]);
      nodes.push(
        <a key={key++} href={match[4]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {match[3]}
        </a>,
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "lead":
      return <p className="mmn-lead">{inline(block.text)}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "p":
      return <p>{inline(block.text)}</p>;
    case "figure":
      return (
        <figure className="mmn-figure">
          <div className="mmn-figure-frame">
            <Mermaid code={block.diagram} />
          </div>
          {block.caption && <figcaption>{inline(block.caption)}</figcaption>}
        </figure>
      );
    case "code":
      return (
        <div className="mmn-code">
          {block.caption && <span className="mmn-code-cap">{block.caption}</span>}
          <pre>
            <code data-lang={block.lang}>{block.code}</code>
          </pre>
        </div>
      );
    case "callout":
      return (
        <aside className={`mmn-callout tone-${block.tone}`}>
          <span className="mmn-callout-label">{block.label}</span>
          <p>{inline(block.text)}</p>
        </aside>
      );
    case "table":
      return (
        <figure className="mmn-table-wrap">
          <table className="mmn-table">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{inline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && <figcaption>{inline(block.caption)}</figcaption>}
        </figure>
      );
    case "sources":
      return (
        <div className="mmn-sources">
          <span className="mmn-kicker">Primary sources</span>
          <ul>
            {block.items.map((item) => (
              <li key={item.url}>
                {item.type && <em>{item.type}</em>}
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="mmn-prose mmn-authored">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}
