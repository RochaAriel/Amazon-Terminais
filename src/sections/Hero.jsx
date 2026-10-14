import Icon from "../components/Icon.jsx";
import HeroPortScene from "../components/HeroPortScene.jsx";
import { stats } from "../data/siteData.js";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-brand-dark-blue text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:46px_46px] opacity-30" />
      <div className="pulse-orb absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand-red-dark/30 blur-3xl" />
      <div className="pulse-orb absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pt-16 pb-6 sm:pt-20 lg:px-8 xl:grid-cols-[1.05fr_.95fr] xl:py-28">
        <div data-reveal="fade-right">
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            Logística portuária com a força do aço.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            A Amazon Terminais é o Terminal de Uso Privado do grupo Amazon Aço, no Puraquequara, em Manaus, próximo ao Encontro das Águas. Estrutura própria para receber navios e movimentar cargas com segurança, controle e operação contínua.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <a
              href="#operacoes"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-red-dark px-6 py-4 text-center text-sm font-black sm:px-7 sm:text-base text-white shadow-xl shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-brand-red-dark-hover"
            >
              Conheça nossa operação
              <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>

            <a
              href="#infraestrutura"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-4 text-center text-sm font-bold sm:px-7 sm:text-base text-white backdrop-blur transition hover:bg-white/15"
            >
              Ver infraestrutura
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.075] p-4 backdrop-blur-xl sm:p-5"
              >
                <p className="text-2xl font-black text-white sm:text-3xl">{item.value}</p>
                <p className="mt-2 text-sm font-semibold text-white/80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna direita fica livre: a cena 3D ocupa esse lado inteiro da hero */}
        <div className="hidden xl:block" aria-hidden="true" />
      </div>

      <HeroPortScene />
    </section>
  );
}
