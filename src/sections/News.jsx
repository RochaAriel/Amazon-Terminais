import Icon from "../components/Icon.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { news } from "../data/siteData.js";

export default function News() {
  return (
    <section className="section-soft bg-brand-light py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Comunicação" title="Notícias e comunicados institucionais." description="Espaço para publicações, avisos, atualizações operacionais, certificações, projetos e conteúdos corporativos." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {news.map((item, index) => (
            <article key={item} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className="surface rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-red-dark">Publicação 0{index + 1}</p>
              <h3 className="mt-5 text-xl font-black leading-8 text-brand-blue">{item}</h3>
              <p className="theme-text-muted mt-4 text-sm leading-7 text-slate-600">Texto demonstrativo para apresentar a área de comunicação da empresa com uma linguagem moderna e institucional.</p>
              <a href="#contato" className="mt-8 inline-flex items-center gap-2 text-sm font-black text-brand-red-dark">
                Ler mais <Icon name="arrow" className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
