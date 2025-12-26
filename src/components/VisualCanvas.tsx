import React, { useEffect, useMemo, useRef, useState } from "react";
import type { VisualSpec } from "../logic/models";

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  visual: VisualSpec,
  size: number,
  selected: Set<number>
): void => {
  const cols = visual.cols ?? 1;
  const rows = visual.rows ?? 1;
  const total = cols * rows;
  const cellSize = size / Math.max(cols, rows);

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#fffaf2";
  ctx.fillRect(0, 0, size, size);

  const shadedCount =
    visual.mode === "read"
      ? Math.min(visual.shaded ?? 0, total)
      : selected.size;

  for (let i = 0; i < total; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellSize;
    const y = row * cellSize;

    const isShaded =
      visual.mode === "read" ? i < shadedCount : selected.has(i);

    ctx.fillStyle = isShaded ? "#d45f2a" : "#f9f2e7";
    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
  }

  ctx.strokeStyle = "#d8cbbd";
  ctx.lineWidth = 1;
  for (let c = 0; c <= cols; c += 1) {
    ctx.beginPath();
    ctx.moveTo(c * cellSize, 0);
    ctx.lineTo(c * cellSize, rows * cellSize);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r += 1) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellSize);
    ctx.lineTo(cols * cellSize, r * cellSize);
    ctx.stroke();
  }
};

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  visual: VisualSpec,
  size: number,
  selected: Set<number>
): void => {
  const sectors = visual.sectors ?? 1;
  const center = size / 2;
  const radius = size * 0.42;
  const total = sectors;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#fffaf2";
  ctx.fillRect(0, 0, size, size);

  const shadedCount =
    visual.mode === "read"
      ? Math.min(visual.shaded ?? 0, total)
      : selected.size;

  for (let i = 0; i < sectors; i += 1) {
    const startAngle = (Math.PI * 2 * i) / sectors - Math.PI / 2;
    const endAngle = (Math.PI * 2 * (i + 1)) / sectors - Math.PI / 2;

    const isShaded =
      visual.mode === "read" ? i < shadedCount : selected.has(i);

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = isShaded ? "#d45f2a" : "#f9f2e7";
    ctx.fill();
    ctx.strokeStyle = "#d8cbbd";
    ctx.stroke();
  }
};

const getGridIndex = (
  x: number,
  y: number,
  visual: VisualSpec,
  size: number
): number | null => {
  const cols = visual.cols ?? 1;
  const rows = visual.rows ?? 1;
  const cellSize = size / Math.max(cols, rows);
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  if (col < 0 || row < 0 || col >= cols || row >= rows) {
    return null;
  }
  return row * cols + col;
};

const getSectorIndex = (
  x: number,
  y: number,
  visual: VisualSpec,
  size: number
): number | null => {
  const sectors = visual.sectors ?? 1;
  const center = size / 2;
  const dx = x - center;
  const dy = y - center;
  const radius = Math.sqrt(dx * dx + dy * dy);
  if (radius > size * 0.42) {
    return null;
  }
  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) {
    angle += Math.PI * 2;
  }
  return Math.floor((angle / (Math.PI * 2)) * sectors);
};

const totalParts = (visual: VisualSpec): number => {
  if (visual.type === "grid") {
    return (visual.cols ?? 1) * (visual.rows ?? 1);
  }
  return visual.sectors ?? 1;
};

const VisualCanvas: React.FC<{
  visual: VisualSpec;
  resetKey: string;
  onSelectionChange?: (selected: number, total: number) => void;
}> = ({ visual, resetKey, onSelectionChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const size = 220;

  const total = useMemo(() => totalParts(visual), [visual]);

  useEffect(() => {
    setSelected(new Set());
  }, [resetKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.scale(dpr, dpr);

    if (visual.type === "grid") {
      drawGrid(ctx, visual, size, selected);
    } else {
      drawCircle(ctx, visual, size, selected);
    }
  }, [visual, selected]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (visual.mode !== "shade") {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const index =
      visual.type === "grid"
        ? getGridIndex(x, y, visual, size)
        : getSectorIndex(x, y, visual, size);

    if (index === null) {
      return;
    }

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      onSelectionChange?.(next.size, total);
      return next;
    });
  };

  return (
    <div className="visual-canvas">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        role="img"
        aria-label={`${visual.type} ${total}`}
      />
      {visual.mode === "shade" ? (
        <p className="visual-hint">
          {selected.size}/{total}
        </p>
      ) : null}
    </div>
  );
};

export default VisualCanvas;
