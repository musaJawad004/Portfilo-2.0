import type { BlogVisual as BlogVisualName } from "./blogData";

export function BlogVisual({ visual, label }: { visual: BlogVisualName; label: string }) {
  return (
    <div className={`blog-visual blog-visual-${visual}`} aria-label={`${label} abstract illustration`} role="img">
      <span className="blog-visual-grid" aria-hidden="true" />
      <span className="blog-visual-orbit blog-visual-orbit-a" aria-hidden="true" />
      <span className="blog-visual-orbit blog-visual-orbit-b" aria-hidden="true" />
      <span className="blog-visual-code" aria-hidden="true">
        {visual === "agent" && "A→T→A"}
        {visual === "rag" && "R↔G"}
        {visual === "claude" && "C.03"}
        {visual === "return" && "H+AI"}
        {visual === "tuning" && "ƒ(x)"}
        {visual === "local" && "LCL"}
      </span>
      <span className="blog-visual-scan" aria-hidden="true" />
    </div>
  );
}
