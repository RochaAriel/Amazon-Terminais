import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MANAUS = {
  name: "Manaus, Amazonas",
  coordinates: [-60.0217, -3.119],
};

const routes = [
  { id: "miami", name: "Miami", region: "América do Norte", coordinates: [-80.1918, 25.7617], delay: "0s" },
  { id: "rotterdam", name: "Rotterdam", region: "Europa", coordinates: [4.4777, 51.9244], delay: "0.35s" },
  { id: "dubai", name: "Dubai", region: "Oriente Médio", coordinates: [55.2708, 25.2048], delay: "0.7s" },
  { id: "shanghai", name: "Shanghai", region: "Ásia", coordinates: [121.4737, 31.2304], delay: "1.05s" },
  { id: "luanda", name: "Luanda", region: "África", coordinates: [13.2344, -8.839], delay: "1.4s" },
  { id: "santos", name: "Santos", region: "Brasil", coordinates: [-46.3336, -23.9608], delay: "1.75s" },
];

export default function HeroRoutesMap() {
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [geoData, setGeoData] = useState(null);
  const [hasGeoError, setHasGeoError] = useState(false);
  const activeRoute = routes[activeRouteIndex];

  useEffect(() => {
    const controller = new AbortController();

    fetch(geoUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Falha ao carregar mapa: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setGeoData(data);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Não foi possível carregar o mapa de rotas", error);
          setHasGeoError(true);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveRouteIndex((currentIndex) => (currentIndex + 1) % routes.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative" data-reveal="fade-left" style={{ "--reveal-delay": "120ms" }}>
      <style>{`/* styles omitted for brevity in source control readability */
        @keyframes routeFlow { 0% { stroke-dashoffset: 28; opacity: .35; } 50% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: .35; } }
        @keyframes routeGlow { 0%, 100% { opacity: .25; } 50% { opacity: .8; } }
        @keyframes pulsePoint { 0%, 100% { transform: scale(1); opacity: .85; } 50% { transform: scale(1.55); opacity: .22; } }
        @keyframes floatShip { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .hero-map-route { stroke-dasharray: 12 16; animation: routeFlow 1.9s linear infinite; }
        .hero-map-route-glow { animation: routeGlow 2.4s ease-in-out infinite; }
        .hero-map-pulse { transform-box: fill-box; transform-origin: center; animation: pulsePoint 2.2s ease-in-out infinite; }
        .hero-map-ship { animation: floatShip 2.6s ease-in-out infinite; }
      `}</style>

      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-white/15 via-brand-red-dark-20 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-brand-panel p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_45%,rgba(237,28,36,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />

          <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">Mapa estratégico</p>
              <h3 className="mt-2 text-2xl font-black text-white">Rotas para Manaus</h3>
            </div>
            <div className="status-pulse rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">Online</div>
          </div>

          <div className="relative z-10 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07102D]/60">
            {hasGeoError ? (
              <div className="flex min-h-[340px] items-center justify-center p-8 text-center text-sm text-white/80">
                Não foi possível carregar o mapa global agora. As rotas e operações continuam disponíveis nas seções abaixo.
              </div>
            ) : (
              <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 165 }} width={980} height={560} className="h-auto w-full">
                <ZoomableGroup center={[-30, 12]} zoom={1} minZoom={1} maxZoom={2.6} translateExtent={[[-120, -80], [1100, 650]]}>
                  {geoData ? (
                    <Geographies geography={geoData}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="rgba(255,255,255,.16)"
                            stroke="rgba(255,255,255,.18)"
                            strokeWidth={0.4}
                            style={{ default: { outline: "none" }, hover: { fill: "rgba(255,255,255,.24)", outline: "none" }, pressed: { outline: "none" } }}
                          />
                        ))
                      }
                    </Geographies>
                  ) : null}

                  {routes.map((route) => {
                    const isActive = activeRoute.id === route.id;
                    return (
                      <g key={route.id}>
                        <Line from={route.coordinates} to={MANAUS.coordinates} stroke={isActive ? "#ED1C24" : "rgba(255,255,255,.26)"} strokeWidth={isActive ? 4.5 : 2.3} className="hero-map-route-glow" strokeLinecap="round" />
                        <Line from={route.coordinates} to={MANAUS.coordinates} stroke={isActive ? "#FFFFFF" : "rgba(255,255,255,.48)"} strokeWidth={isActive ? 2.2 : 1.35} className="hero-map-route" strokeLinecap="round" style={{ animationDelay: route.delay }} />
                      </g>
                    );
                  })}

                  {routes.map((route, index) => {
                    const isActive = activeRoute.id === route.id;
                    return (
                      <Marker key={`${route.id}-marker`} coordinates={route.coordinates}>
                        <g className="hero-map-ship" style={{ animationDelay: route.delay, cursor: "pointer" }} onClick={() => setActiveRouteIndex(index)}>
                          <circle r={isActive ? 9 : 6} fill={isActive ? "#ED1C24" : "#FFFFFF"} opacity={isActive ? 1 : 0.82} />
                          <circle r={isActive ? 15 : 10} fill="none" stroke={isActive ? "rgba(237,28,36,.45)" : "rgba(255,255,255,.25)"} className="hero-map-pulse" />
                        </g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
