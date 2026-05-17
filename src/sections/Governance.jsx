import Icon from "../components/Icon.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { governancePillars } from "../data/siteData.js";

export default function Governance() {
  return (
    <section id="qualidade" className="section-light bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Qualidade e Governança" title="Pilares institucionais aplicados à operação portuária." description="Uma área inspirada na política de qualidade do grupo, adaptada para comunicar segurança, melhoria contínua, gestão de riscos e sustentabilidade na rotina do terminal." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {governancePillars.map((pillar, index) => (
            <article key={pillar.title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 70}ms` }} className="surface group rounded-[2rem] border border-slate-200 bg-brand-light p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white transition group-hover-bg-brand-red-dark">
                <Icon name={pillar.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black leading-6 text-brand-blue">{pillar.title}</h3>
              <p className="theme-text-muted mt-4 text-sm leading-7 text-slate-600">{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
