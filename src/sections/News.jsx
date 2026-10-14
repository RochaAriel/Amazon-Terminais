import SectionTitle from "../components/SectionTitle.jsx";
import { news } from "../data/siteData.js";

export default function News() {
  return (
    <section className="section-soft bg-brand-light py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Registro institucional" title="Marcos do terminal e do grupo." description="Registros históricos sobre a autorização do terminal, o projeto de ampliação e a origem da Amazon Aço." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {news.map((item, index) => (
            <article key={item.title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className="surface rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-red-dark">{item.date}</p>
              <h3 className="mt-5 text-xl font-black leading-8 text-brand-blue">{item.title}</h3>
              <p className="theme-text-muted mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
