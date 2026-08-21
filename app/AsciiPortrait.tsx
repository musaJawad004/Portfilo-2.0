"use client";

import { useEffect, useRef, useState } from "react";

import { DotmCircular7 } from "@/components/ui/dotm-circular-7";

const GLYPHS = [
  ".",
  ":",
  "•",
  "+",
  "*",
  "#",
  "@",
  "/",
  "\\",
  "|",
  "-",
  "=",
  "%",
];

type Cell = {
  x: number;
  y: number;
  density: number;
  glyphIndex: number;
  alternateGlyphIndex: number;
  phase: number;
};

export function AsciiPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const image = new Image();
    image.decoding = "async";
    image.src = "/assets/muhammad-musa-redline-source.png";

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cells: Cell[] = [];
    let animationId = 0;
    let startFrameId = 0;
    let startSecondFrameId = 0;
    let readyTimer = 0;
    let lastFrame = 0;
    let started = false;
    let startQueued = false;
    let readyScheduled = false;
    const loaderStartedAt = performance.now();

    const revealPortrait = () => {
      if (readyScheduled) return;
      readyScheduled = true;
      const elapsed = performance.now() - loaderStartedAt;
      const delay = Math.max(0, 2000 - elapsed);
      readyTimer = window.setTimeout(() => setIsReady(true), delay);
    };

    function rebuild() {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height || !image.complete) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(bounds.width * pixelRatio);
      canvas.height = Math.floor(bounds.height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);

      const cellSize = bounds.width < 700 ? 6 : 7;
      const columns = Math.max(54, Math.floor(bounds.width / cellSize));
      const rows = Math.max(60, Math.floor(bounds.height / (cellSize * 1.18)));
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = columns;
      sampleCanvas.height = rows;
      const sample = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sample) return;

      // The user's red guide sits at roughly 51.5% of the original portrait.
      // Sample only above it: head, shoulders, and upper chest, nothing below.
      const sourceWidth = image.naturalWidth;
      const sourceHeight = image.naturalHeight * 0.515;
      const sourceX = 0;
      const sourceY = 0;

      sample.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        columns,
        rows,
      );

      const pixels = sample.getImageData(0, 0, columns, rows).data;
      const nextCells: Cell[] = [];

      const luminanceAt = (column: number, row: number) => {
        const safeColumn = Math.max(0, Math.min(columns - 1, column));
        const safeRow = Math.max(0, Math.min(rows - 1, row));
        const offset = (safeRow * columns + safeColumn) * 4;
        return (
          pixels[offset] * 0.2126 +
          pixels[offset + 1] * 0.7152 +
          pixels[offset + 2] * 0.0722
        );
      };

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const offset = (row * columns + column) * 4;
          const luminance =
            pixels[offset] * 0.2126 +
            pixels[offset + 1] * 0.7152 +
            pixels[offset + 2] * 0.0722;
          const baseDensity = Math.max(
            0,
            Math.min(1, (246 - luminance) / 218),
          );
          const horizontalEdge = Math.abs(
            luminanceAt(column + 1, row) - luminanceAt(column - 1, row),
          );
          const verticalEdge = Math.abs(
            luminanceAt(column, row + 1) - luminanceAt(column, row - 1),
          );
          const edgeDensity = Math.min(
            1,
            (horizontalEdge + verticalEdge) / 118,
          );
          const density = Math.max(baseDensity, edgeDensity * 0.92);

          if (density < 0.045) continue;

          const seed = column * 7 + row * 11;
          let palette: string[];

          if (edgeDensity > 0.16) {
            if (verticalEdge > horizontalEdge * 1.25) {
              palette = ["-", "=", "-", "+"];
            } else if (horizontalEdge > verticalEdge * 1.25) {
              palette = ["|", "/", "\\", "|"];
            } else {
              palette = ["+", "*", "#", "@", "%"];
            }
          } else if (density < 0.2) {
            palette = [".", ":", "•"];
          } else if (density < 0.48) {
            palette = [":", "•", "+", "*", "-", "="];
          } else {
            palette = ["+", "*", "#", "@", "%", "=", "-"];
          }

          const chosenGlyph = palette[seed % palette.length];
          const alternateGlyph = palette[(seed + 1) % palette.length];

          nextCells.push({
            x: column * (bounds.width / columns),
            y: row * (bounds.height / rows),
            density,
            glyphIndex: GLYPHS.indexOf(chosenGlyph),
            alternateGlyphIndex: GLYPHS.indexOf(alternateGlyph),
            phase: ((column * 0.73 + row * 1.17) % 12) * 0.7,
          });
        }
      }

      cells = nextCells;
      draw(0);
      revealPortrait();
    }

    function draw(time: number) {
      const bounds = canvas.getBoundingClientRect();
      context.clearRect(0, 0, bounds.width, bounds.height);
      const fontSize = bounds.width < 700 ? 6 : 7;
      context.font = `500 ${fontSize}px "Space Mono", monospace`;
      context.textBaseline = "top";

      for (const cell of cells) {
        const pulse = reducedMotion
          ? 0
          : Math.sin(time * 0.00145 + cell.phase);
        const glyphIndex =
          !reducedMotion && pulse > 0.32
            ? cell.alternateGlyphIndex
            : cell.glyphIndex;
        const baseAlpha = Math.min(
          0.94,
          0.12 + cell.density * 0.82,
        );
        const alpha = reducedMotion
          ? baseAlpha
          : Math.max(0.08, Math.min(0.98, baseAlpha + pulse * 0.1));
        context.fillStyle = `rgba(17, 17, 17, ${alpha})`;
        const movement = reducedMotion ? 0 : pulse * 0.32;
        context.fillText(
          GLYPHS[glyphIndex],
          cell.x + movement,
          cell.y - movement * 0.45,
        );
      }
    }

    function animate(time: number) {
      if (time - lastFrame > 90) {
        draw(time);
        lastFrame = time;
      }
      animationId = window.requestAnimationFrame(animate);
    }

    const startPortrait = () => {
      if (started) return;
      started = true;
      rebuild();
      if (!reducedMotion) animationId = window.requestAnimationFrame(animate);
    };

    const queuePortraitStart = () => {
      if (startQueued) return;
      startQueued = true;
      startFrameId = window.requestAnimationFrame(() => {
        startSecondFrameId = window.requestAnimationFrame(startPortrait);
      });
    };

    image.addEventListener("load", queuePortraitStart);
    if (image.complete) queuePortraitStart();

    const observer = new ResizeObserver(rebuild);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      image.removeEventListener("load", queuePortraitStart);
      window.cancelAnimationFrame(startFrameId);
      window.cancelAnimationFrame(startSecondFrameId);
      window.clearTimeout(readyTimer);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      className={`portrait-canvas-wrap ${isReady ? "is-ready" : "is-loading"}`}
      aria-hidden="true"
    >
      {!isReady && (
        <div className="portrait-loader">
          <DotmCircular7 size={32} dotSize={4} speed={1} color="#111111" />
          <span>RENDERING ASCII</span>
        </div>
      )}
      <canvas ref={canvasRef} className="portrait-canvas" />
    </div>
  );
}
