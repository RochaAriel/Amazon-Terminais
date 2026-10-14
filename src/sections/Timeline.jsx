import NorthRoutesMap from "../components/NorthRoutesMap.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { timeline } from "../data/siteData.js";

export default function Timeline() {
  return (
    <section id="trajetoria" className="section-soft relative overflow-clip bg-brand-light py-20" data-reveal>
      {/* Fundo: mapa do Brasil com envios de Manaus para a Região Norte (barco e caminhão) */}
      <NorthRoutesMap />
      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Nossa Trajetória" title="Uma história construída em Manaus." description="Da distribuição de aço ao terminal portuário: os principais marcos do grupo Amazon Aço." />
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-slate-300/70 lg:block" />
          <div className="grid gap-6">
            {timeline.map((item, index) => (
              <article key={item.year} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className={`relative grid gap-6 lg:grid-cols-2 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                <div className={index % 2 === 0 ? "lg:pr-12" : "lg:col-start-2 lg:pl-12"}>
                  <div className="timeline-surface rounded-[2rem] border border-slate-200 bg-white/80 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-sm font-black uppercase tracking-[0.28em] text-brand-red-dark">{item.year}</p>
                    <h3 className="mt-3 text-2xl font-black text-brand-blue">{item.title}</h3>
                    <p className="theme-text-muted mt-4 leading-7 text-slate-600">{item.text}</p>
                  </div>
                </div>
                <span className="absolute left-1/2 top-8 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-brand-red-dark shadow-lg lg:block" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
