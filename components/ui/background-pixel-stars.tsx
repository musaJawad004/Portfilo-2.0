"use client";

import { memo, useCallback, useEffect, useRef } from "react";

const STAR_COLORS = ["#f5f5f1", "#c8c9c5", "#92958f", "#b8c6d8"] as const;
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

type BackgroundStar = {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
};

type TrailPoint = { x: number; y: number; opacity: number };

type ShootingStar = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  trail: TrailPoint[];
};

type BackgroundPixelStarsProps = {
  className?: string;
};

export const BackgroundPixelStars = memo(function BackgroundPixelStars({
  className = "",
}: BackgroundPixelStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const shootingTimerRef = useRef<number | null>(null);
  const starsRef = useRef<BackgroundStar[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const lastFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));

    const area = rect.width * rect.height;
    const starCount = Math.min(110, Math.max(54, Math.floor(area * 0.00034)));
    const upperClusterCount = Math.min(20, Math.floor(starCount * 0.34));
    starsRef.current = Array.from({ length: starCount }, (_, index) => {
      const fillUpperZone = index < upperClusterCount;
      return {
        x: (fillUpperZone ? 0.05 + Math.random() * 0.7 : Math.random()) * canvas.width,
        y: (fillUpperZone ? 0.04 + Math.random() * 0.34 : Math.random()) * canvas.height,
        size: (Math.random() > 0.82 ? 2.4 : Math.random() > 0.46 ? 1.6 : 1) * ratio,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]!,
        opacity: 0.3 + Math.random() * 0.68,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.8,
        driftX: (Math.random() - 0.5) * 0.09 * ratio,
        driftY: (0.025 + Math.random() * 0.08) * ratio,
      };
    });
  }, []);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (timestamp - lastFrameRef.current < FRAME_INTERVAL) {
      frameRef.current = requestAnimationFrame(draw);
      return;
    }
    lastFrameRef.current = timestamp;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of starsRef.current) {
      if (!reducedMotionRef.current) {
        star.x += star.driftX;
        star.y += star.driftY;
        if (star.x < -8) star.x = canvas.width + 8;
        if (star.x > canvas.width + 8) star.x = -8;
        if (star.y > canvas.height + 8) star.y = -8;
      }

      const twinkle = reducedMotionRef.current
        ? 1
        : 0.62 + Math.sin(timestamp * 0.001 * star.speed + star.phase) * 0.38;
      context.globalAlpha = Math.max(0.12, star.opacity * twinkle);
      context.fillStyle = star.color;
      context.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
    }

    if (!reducedMotionRef.current) {
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.trail = star.trail
          .map((point) => ({ ...point, opacity: point.opacity - 0.055 }))
          .filter((point) => point.opacity > 0);
        star.trail.push({ x: star.x, y: star.y, opacity: 0.82 });
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        for (const point of star.trail) {
          context.globalAlpha = point.opacity;
          context.fillStyle = "#c8c9c5";
          context.fillRect(Math.round(point.x), Math.round(point.y), 2, 2);
        }
        context.globalAlpha = 1;
        context.fillStyle = "#f5f5f1";
        context.fillRect(Math.round(star.x), Math.round(star.y), 5, 2);

        return star.x < canvas.width + 24 && star.y < canvas.height + 24;
      });
    }

    context.globalAlpha = 1;
    if (!reducedMotionRef.current) frameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;
    sizeCanvas();

    const launchShootingStar = () => {
      if (!reducedMotionRef.current && canvasRef.current) {
        shootingStarsRef.current.push({
          x: Math.random() * canvasRef.current.width * 0.72,
          y: -8,
          angle: 0.8 + Math.random() * 0.32,
          speed: 6 + Math.random() * 3.5,
          trail: [],
        });
      }
      shootingTimerRef.current = window.setTimeout(launchShootingStar, 1400 + Math.random() * 2600);
    };

    const restart = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      reducedMotionRef.current = motionQuery.matches;
      draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(() => {
      sizeCanvas();
      if (reducedMotionRef.current) draw(performance.now());
    });
    resizeObserver.observe(canvas);
    motionQuery.addEventListener("change", restart);
    frameRef.current = requestAnimationFrame(draw);
    shootingTimerRef.current = window.setTimeout(launchShootingStar, 700);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (shootingTimerRef.current) window.clearTimeout(shootingTimerRef.current);
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", restart);
    };
  }, [draw, sizeCanvas]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
});

export default BackgroundPixelStars;
