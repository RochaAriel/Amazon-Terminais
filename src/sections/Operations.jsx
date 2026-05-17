import Icon from "../components/Icon.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { services } from "../data/siteData.js";

export default function Operations() {
  return (
    <section id="operacoes" className="section-soft bg-brand-light py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Operações" title="Áreas estratégicas apresentadas com clareza." description="Uma estrutura visual preparada para mostrar capacidades, diferenciais e serviços da operação portuária com linguagem executiva." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <article key={service.title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 80}ms` }} className="surface group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white transition group-hover-bg-brand-red-dark">
                <Icon name={service.icon} className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-brand-blue">{service.title}</h3>
              <p className="theme-text-muted mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
              <a href="#contato" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-brand-red-dark">
                Saiba mais <Icon name="arrow" className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
