import type { NewsletterSection } from "../../lib/newsletter-data";

export function ArticleVisuals({ section }: { section: NewsletterSection }) {
  return <>
    {section.note && <aside className="mmn-note"><span>✎</span><p>{section.note}</p></aside>}
    {section.flow && <div className="mmn-flow" aria-label="Process flow">
      {section.flow.map((step, index) => <div className="mmn-flow-step" key={step}>
        <span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>
        {index < section.flow!.length - 1 && <i aria-hidden="true">→</i>}
      </div>)}
    </div>}
    {section.table && <div className="mmn-table-wrap"><table className="mmn-table">
      <thead><tr>{section.table.columns.map(column => <th key={column}>{column}</th>)}</tr></thead>
      <tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
    </table></div>}
    {section.mindMap && <div className="mmn-mindmap" aria-label={`${section.mindMap.center} mind map`}>
      <div className="mmn-mindmap-center">{section.mindMap.center}</div>
      {section.mindMap.branches.map((branch, index) => <div className={`mmn-mindmap-branch branch-${index + 1}`} key={branch}><span>{branch}</span></div>)}
      <svg viewBox="0 0 800 360" aria-hidden="true"><path d="M400 180 C300 120 250 80 160 68"/><path d="M400 180 C510 110 560 80 650 68"/><path d="M400 180 C300 250 250 280 160 294"/><path d="M400 180 C510 250 560 280 650 294"/></svg>
    </div>}
  </>;
}
