import { useMemo } from "react";
import { movementData } from "../data/siteData.js";

export default function Sparkline() {
  const { points, gatePoints } = useMemo(() => {
    const buildPoints = (key) =>
      movementData
        .map((item, index) => {
          const x = (index / (movementData.length - 1)) * 100;
          const y = 100 - item[key];
          return `${x},${y}`;
        })
        .join(" ");

    return { points: buildPoints("carga"), gatePoints: buildPoints("gate") };
  }, []);

  return (
    <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-brand-chart p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Movimentação semanal</p>
          <p className="text-xs text-white/55">Carga x fluxo de gate</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">Demo</span>
      </div>
      <svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible" role="img" aria-label="Gráfico demonstrativo de movimentação semanal">
        <defs>
          <linearGradient id="redFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-red-dark)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--brand-red-dark)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="blueFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`${points} 100,100 0,100`} fill="url(#redFill)" stroke="none" />
        <polyline points={`${gatePoints} 100,100 0,100`} fill="url(#blueFill)" stroke="none" />
        <polyline className="motion-draw-line" points={points} fill="none" stroke="var(--brand-red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <polyline className="motion-draw-line motion-draw-line-slow" points={gatePoints} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.8" />
      </svg>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-white/50">
        {movementData.map((item) => (
          <span key={item.day}>{item.day}</span>
        ))}
      </div>
    </div>
  );
}
