import Icon from "../components/Icon.jsx";
import HeroRoutesMap from "../components/HeroRoutesMap.jsx";
import { stats } from "../data/siteData.js";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-brand-dark-blue text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:46px_46px] opacity-30" />
      <div className="pulse-orb absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand-red-dark-30 blur-3xl" />
      <div className="pulse-orb absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
        <div data-reveal="fade-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/85 backdrop-blur">
            <Icon name="anchor" className="h-4 w-4" /> Operações Portuárias
          </span>

          <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Solidez portuária com presença digital premium.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Um conceito moderno para a Amazon Terminais, combinando identidade institucional, tecnologia operacional e comunicação clara para clientes, parceiros e stakeholders.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#operacoes"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-red-dark px-7 py-4 font-black text-white shadow-xl shadow-red-950/30 transition hover:-translate-y-0.5 hover-bg-brand-red-dark"
            >
              Conheça nossa operação
              <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>

            <a
              href="#infraestrutura"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              Ver infraestrutura
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.075] p-5 backdrop-blur-xl"
              >
                <p className="text-3xl font-black text-white">{item.value}</p>
                <p className="mt-2 text-sm font-semibold text-white/80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroRoutesMap />
      </div>
    </section>
  );
}
