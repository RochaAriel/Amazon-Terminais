import { useEffect, useRef, useState } from "react";
import { createPortScene } from "../three/createPortScene.js";

// Quadro mostrado quando o usuário prefere menos movimento: guindastes no meio da operação.
const STATIC_FRAME_TIME = 4.2;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch {
    return false;
  }
}

export default function PortSceneCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    if (!supportsWebGL()) {
      setHasFailed(true);
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let portScene;

    try {
      portScene = createPortScene(canvas, { reducedMotion });
    } catch (error) {
      console.error("Não foi possível iniciar a cena 3D do porto", error);
      setHasFailed(true);
      return undefined;
    }

    let frameId = 0;
    let elapsed = reducedMotion ? STATIC_FRAME_TIME : 0;
    let lastTime = 0;
    let isOnScreen = true;
    let isPageVisible = document.visibilityState !== "hidden";

    const renderOnce = () => portScene.update(elapsed);

    const loop = (now) => {
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;
      elapsed += delta;
      portScene.update(elapsed);
      frameId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (reducedMotion || frameId || !isOnScreen || !isPageVisible) return;
      lastTime = 0;
      frameId = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!frameId) return;
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const resize = () => {
      portScene.resize(container.clientWidth, container.clientHeight);
      if (!frameId) renderOnce();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Pausa a animação fora da tela e com a aba em segundo plano (economiza CPU/GPU e bateria)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isOnScreen = entry.isIntersecting;
      if (isOnScreen) start();
      else stop();
    });
    intersectionObserver.observe(container);

    const handleVisibility = () => {
      isPageVisible = document.visibilityState !== "hidden";
      if (isPageVisible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      portScene.dispose();
    };
  }, []);

  if (hasFailed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-white/70">
        Não foi possível exibir a animação 3D neste navegador. As operações continuam descritas nas seções abaixo.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        role="img"
        aria-label="Animação 3D de um navio atracado no píer com três guindastes de bordo descarregando bobinas de aço e contêineres."
      />
    </div>
  );
}
