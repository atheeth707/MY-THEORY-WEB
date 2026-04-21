import { useRef, useEffect } from 'react';

interface MiniGraphProps {
  data: { x: number; y: number }[];
  width?: number;
  height?: number;
  color?: string;
  label?: string;
  xLabel?: string;
  yLabel?: string;
}

export default function MiniGraph({ data, width = 220, height = 120, color = '#00ffcc', label = '', xLabel = '', yLabel = '' }: MiniGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, width, height);
    
    const pad = { top: 20, right: 10, bottom: 25, left: 10 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;
    
    const maxX = Math.max(...data.map(d => d.x));
    const maxY = Math.max(...data.map(d => Math.abs(d.y)), 1e-10);
    const minY = Math.min(...data.map(d => d.y), 0);
    const rangeY = maxY - minY || 1;
    
    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * h;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + w, y);
      ctx.stroke();
    }
    
    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    data.forEach((d, i) => {
      const x = pad.left + (d.x / maxX) * w;
      const y = pad.top + h - ((d.y - minY) / rangeY) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Fill gradient
    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + h);
    gradient.addColorStop(0, color + '30');
    gradient.addColorStop(1, color + '00');
    ctx.lineTo(pad.left + w, pad.top + h);
    ctx.lineTo(pad.left, pad.top + h);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px monospace';
    if (label) {
      ctx.fillStyle = color;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(label, pad.left, 12);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '8px monospace';
    if (xLabel) ctx.fillText(xLabel, pad.left + w / 2 - 15, height - 2);
    if (yLabel) {
      ctx.save();
      ctx.translate(6, pad.top + h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(yLabel, -10, 0);
      ctx.restore();
    }
  }, [data, width, height, color, label, xLabel, yLabel]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="rounded-lg"
    />
  );
}
