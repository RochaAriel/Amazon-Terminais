import { lazy, Suspense } from "react";

// O Three.js fica num chunk separado: o restante do site carrega sem esperar pelo 3D.
const PortSceneCanvas = lazy(() => import("./PortSceneCanvas.jsx"));

// Desktop (xl, 1280px+): ocupa o lado direito inteiro da hero, sangrando até a borda da tela.
// Abaixo disso (celular, tablet e notebook pequeno): bloco de largura total abaixo do texto.
// As bordas somem em degradê (máscara) para a cena se misturar ao fundo da hero.
export default function HeroPortScene() {
  return (
    <div
      className="relative h-[300px] w-full sm:h-[440px] lg:h-[540px] xl:absolute xl:inset-y-0 xl:right-0 xl:h-auto xl:w-[58%] 2xl:w-[60%]"
      data-reveal="fade-left"
      style={{ "--reveal-delay": "120ms" }}
    >
      <div className="hero-scene-mask absolute inset-0">
        <Suspense fallback={null}>
          <PortSceneCanvas />
        </Suspense>
      </div>
    </div>
  );
}
