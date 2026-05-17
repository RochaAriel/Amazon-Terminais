import Icon from "../components/Icon.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const items = [
  ["ESG", "Práticas sustentáveis, responsabilidade ambiental e evolução contínua."],
  ["Segurança", "Procedimentos, controle, monitoramento e cultura operacional."],
  ["Inovação", "Digitalização de processos, indicadores e melhoria de gestão."],
];

export default function Sustainability() {
  return (
    <section id="sustentabilidade" className="bg-brand-dark-blue py-20 text-white" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle light eyebrow="Sustentabilidade" title="Segurança, responsabilidade e visão de futuro." description="Uma área para comunicar ESG, segurança do trabalho, compromisso ambiental, processos internos e governança operacional." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map(([title, text], index) => (
            <div key={title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur">
              <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${index === 0 ? "bg-emerald-400/15 text-emerald-200" : "bg-brand-red-dark-20 text-red-100"}`}>
                <Icon name={index === 0 ? "leaf" : index === 1 ? "shield" : "chart"} className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-7 text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
