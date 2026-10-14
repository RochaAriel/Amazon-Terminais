import { useEffect, useMemo, useRef } from "react";
import { cities, mapSize, rivers, routes, states } from "../data/northRoutesMap.js";

// Mapa do Brasil com envios a partir de Manaus para toda a Região Norte e para os estados do Sul.
// Rotas fluviais (barco) e rodoviárias (caminhão). Intermodais: Rio Branco e Palmas; Curitiba,
// Florianópolis e Porto Alegre seguem de barco até Porto Velho e de caminhão pela BR-364/BR-163.
// Fica no fundo da seção "Nossa Trajetória", fixo na tela (sticky) enquanto os marcos rolam por cima.

const SPEED = { boat: 42, road: 58 }; // unidades do viewBox por segundo
const TRANSFER_PAUSE = 0.9; // segundos parado na troca barco -> caminhão
const DWELL = 2.6; // segundos parado no destino antes de voltar a Manaus
const FLEET = 5; // envios simultâneos
const MAX_LEG = 9; // duração máxima de um trecho (segundos)

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function measure(pts) {
  const cum = [0];
  for (let i = 1; i < pts.length; i += 1) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, cum, len: cum[cum.length - 1] };
}

function pointAt(line, t) {
  const target = t * line.len;
  let i = 1;
  while (i < line.cum.length - 1 && line.cum[i] < target) i += 1;
  const seg = line.cum[i] - line.cum[i - 1] || 1;
  const f = (target - line.cum[i - 1]) / seg;
  const [ax, ay] = line.pts[i - 1];
  const [bx, by] = line.pts[i];
  return { x: ax + (bx - ax) * f, y: ay + (by - ay) * f, angle: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI };
}

const pathD = (pts) => `M${pts.map(([x, y]) => `${x},${y}`).join("L")}`;

const LABEL_OFFSET = {
  right: { dx: 9, dy: 4, anchor: "start" },
  left: { dx: -9, dy: 4, anchor: "end" },
  above: { dx: 0, dy: -9, anchor: "middle" },
  below: { dx: 0, dy: 17, anchor: "middle" },
};

function Boat() {
  return (
    <g className="nr-craft-boat">
      <path d="M-7,1.2 L7,1.2 L4.6,4.8 L-4.8,4.8 Z" />
      <path className="nr-craft-detail" d="M-3.6,1 L-3.6,-3.6 L1.6,-3.6 L1.6,1 Z" />
    </g>
  );
}

function Truck() {
  return (
    <g className="nr-craft-truck">
      <rect x="-7.5" y="-3.2" width="10" height="6.4" rx="1" />
      <path d="M2.8,-2.6 L6,-2.6 L7.6,0 L7.6,3.2 L2.8,3.2 Z" />
      <circle className="nr-craft-detail" cx="-4.6" cy="3.6" r="1.4" />
      <circle className="nr-craft-detail" cx="4.6" cy="3.6" r="1.4" />
    </g>
  );
}

export default function NorthRoutesMap() {
  const containerRef = useRef(null);
  const craftRefs = useRef([]);
  const trailRefs = useRef([]);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Trajetos medidos (cada envio = 1 ou 2 trechos)
  const journeys = useMemo(
    () => routes.map((route) => ({ ...route, legs: route.legs.map((leg) => ({ mode: leg.mode, line: measure(leg.pts) })) })),
    [],
  );

  const manaus = cities.find((city) => city.kind === "hub");

  useEffect(() => {
    if (reducedMotion) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    // Estado de cada embarcação/caminhão da frota. A ordem dos destinos é fixa (determinística).
    let nextRoute = 0;
    const fleet = Array.from({ length: FLEET }, (_, i) => ({
      index: i,
      phase: "wait",
      start: i * 2.2, // partidas escalonadas
      journey: null,
      leg: 0,
      flip: 1,
    }));

    const setCraft = (unit, mode, pos, opacity) => {
      const el = craftRefs.current[unit.index];
      if (!el) return;
      el.querySelector("[data-mode='boat']").style.display = mode === "boat" ? "" : "none";
      el.querySelector("[data-mode='road']").style.display = mode === "road" ? "" : "none";
      // Ícone sempre na horizontal; só espelha quando o trajeto segue para a esquerda
      // (com folga perto da vertical para não ficar trocando de lado em trechos norte-sul)
      const a = Math.abs(pos.angle);
      if (a < 80) unit.flip = 1;
      else if (a > 100) unit.flip = -1;
      const flip = unit.flip;
      el.setAttribute("transform", `translate(${pos.x.toFixed(1)},${pos.y.toFixed(1)}) scale(${(1.7 * flip).toFixed(2)},1.7)`);
      el.style.opacity = String(opacity);
    };

    const setTrail = (unit, legIndex, journey, progress, opacity) => {
      journey.legs.forEach((leg, i) => {
        const el = trailRefs.current[unit.index]?.[i];
        if (!el) return;
        if (i < legIndex) {
          el.style.strokeDashoffset = "0";
        } else if (i === legIndex) {
          el.style.strokeDashoffset = String(leg.line.len * (1 - progress));
        } else {
          el.style.strokeDashoffset = String(leg.line.len);
        }
        el.style.opacity = String(opacity);
      });
      // Esconde trechos que sobraram de um envio anterior com mais trechos
      for (let i = journey.legs.length; i < 2; i += 1) {
        const el = trailRefs.current[unit.index]?.[i];
        if (el) el.style.opacity = "0";
      }
    };

    const assign = (unit, now) => {
      const journey = journeys[nextRoute % journeys.length];
      nextRoute += 1;
      unit.journey = journey;
      unit.leg = 0;
      unit.phase = "travel";
      unit.start = now;
      journey.legs.forEach((leg, i) => {
        const el = trailRefs.current[unit.index]?.[i];
        if (!el) return;
        el.setAttribute("d", pathD(leg.line.pts));
        el.setAttribute("class", `nr-trail nr-trail-${leg.mode}`);
        el.style.strokeDasharray = String(leg.line.len);
      });
    };

    let frame = 0;
    let clock = 0;
    let last = 0;
    let running = false;

    const tick = (ms) => {
      const dt = last ? Math.min((ms - last) / 1000, 0.1) : 0;
      last = ms;
      clock += dt;

      fleet.forEach((unit) => {
        const local = clock - unit.start;
        if (unit.phase === "wait") {
          if (local >= 0) assign(unit, clock);
          return;
        }
        const { journey } = unit;
        const leg = journey.legs[unit.leg];
        // Trechos longos (rodovias até o Sul) andam mais rápido para não passar de MAX_LEG segundos
        const duration = Math.min(MAX_LEG, Math.max(3, leg.line.len / SPEED[leg.mode]));

        if (unit.phase === "travel") {
          const raw = Math.min(1, local / duration);
          const t = ease(raw);
          setCraft(unit, leg.mode, pointAt(leg.line, t), Math.min(1, local / 0.6));
          setTrail(unit, unit.leg, journey, t, 0.85);
          if (raw >= 1) {
            unit.phase = unit.leg < journey.legs.length - 1 ? "transfer" : "arrived";
            unit.start = clock;
          }
          return;
        }

        if (unit.phase === "transfer") {
          if (local >= TRANSFER_PAUSE) {
            unit.leg += 1;
            unit.phase = "travel";
            unit.start = clock;
          }
          return;
        }

        // arrived: o ícone e o rastro somem devagar, depois sai um novo envio de Manaus
        const fade = Math.max(0, 1 - local / DWELL);
        const end = pointAt(leg.line, 1);
        setCraft(unit, leg.mode, end, fade);
        setTrail(unit, journey.legs.length - 1, journey, 1, 0.85 * fade);
        if (local >= DWELL) assign(unit, clock);
      });

      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      frame = window.requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };

    // Só anima com a seção na tela e a aba visível
    let onScreen = false;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && document.visibilityState !== "hidden") start();
      else stop();
    });
    observer.observe(container);
    const onVisibility = () => {
      if (onScreen && document.visibilityState !== "hidden") start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [journeys, reducedMotion]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-2">
        <svg
          viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
          className="nr-map h-full max-h-[920px] w-auto max-w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <clipPath id="nr-brazil">
              {states.map((state) => (
                <path key={state.id} d={state.d} />
              ))}
            </clipPath>
          </defs>

          <g>
            {states.map((state) => (
              <path key={state.id} d={state.d} className={state.north ? "nr-state nr-state-north" : "nr-state"} />
            ))}
          </g>

          <g clipPath="url(#nr-brazil)">
            {rivers.map((river, i) => (
              <path key={`${river.name}-${i}`} d={river.d} className="nr-river" style={{ strokeWidth: river.w }} />
            ))}
          </g>

          {/* Rotas: traçado fixo e discreto; com movimento reduzido, fica mais visível no lugar da animação */}
          <g className={reducedMotion ? "nr-routes nr-routes-static" : "nr-routes"}>
            {routes.flatMap((route) =>
              route.legs.map((leg, i) => <path key={`${route.to}-${i}`} d={pathD(leg.pts)} className={`nr-route nr-route-${leg.mode}`} />),
            )}
          </g>

          {/* Rastros e veículos animados */}
          {!reducedMotion && (
            <g>
              {Array.from({ length: FLEET }, (_, unit) => (
                <g key={unit}>
                  {[0, 1].map((leg) => (
                    <path
                      key={leg}
                      ref={(el) => {
                        trailRefs.current[unit] = trailRefs.current[unit] || [];
                        trailRefs.current[unit][leg] = el;
                      }}
                      className="nr-trail"
                      style={{ opacity: 0 }}
                    />
                  ))}
                </g>
              ))}
            </g>
          )}

          <g>
            {cities.map((city) => {
              const label = LABEL_OFFSET[city.label];
              const radius = city.kind === "hub" ? 6 : city.kind === "capital" ? 4.2 : 3;
              return (
                <g key={city.name} transform={`translate(${city.x},${city.y})`}>
                  {city.kind === "hub" && !reducedMotion && <circle className="nr-hub-pulse" r="6" />}
                  <circle className={`nr-city nr-city-${city.kind}`} r={radius} />
                  <text className={`nr-label nr-label-${city.kind}`} x={label.dx} y={label.dy} textAnchor={label.anchor}>
                    {city.name}
                  </text>
                </g>
              );
            })}
          </g>

          {!reducedMotion && (
            <g>
              {Array.from({ length: FLEET }, (_, unit) => (
                <g key={unit} ref={(el) => (craftRefs.current[unit] = el)} style={{ opacity: 0 }} transform={`translate(${manaus.x},${manaus.y})`}>
                  <g data-mode="boat">
                    <Boat />
                  </g>
                  <g data-mode="road" style={{ display: "none" }}>
                    <Truck />
                  </g>
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
