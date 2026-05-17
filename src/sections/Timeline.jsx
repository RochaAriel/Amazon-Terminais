import SectionTitle from "../components/SectionTitle.jsx";
import { timeline } from "../data/siteData.js";

export default function Timeline() {
  return (
    <section id="trajetoria" className="section-soft bg-brand-light py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Nossa Trajetória" title="Uma evolução construída com estrutura, confiança e visão regional." description="Inspirada na comunicação institucional do grupo, esta seção apresenta marcos de crescimento e posiciona a Amazon Terminais como continuidade de uma história voltada à qualidade e expansão operacional." />
        <div className="relative mt-16">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-slate-200 md:left-1/2 md:block" />
          <div className="grid gap-6">
            {timeline.map((item, index) => (
              <article key={item.year} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className={`relative grid gap-6 md:grid-cols-2 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                <div className={index % 2 === 0 ? "md:pr-12" : "md:col-start-2 md:pl-12"}>
                  <div className="timeline-surface rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-sm font-black uppercase tracking-[0.28em] text-brand-red-dark">{item.year}</p>
                    <h3 className="mt-3 text-2xl font-black text-brand-blue">{item.title}</h3>
                    <p className="theme-text-muted mt-4 leading-7 text-slate-600">{item.text}</p>
                  </div>
                </div>
                <span className="absolute left-1/2 top-8 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-brand-red-dark shadow-lg md:block" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
