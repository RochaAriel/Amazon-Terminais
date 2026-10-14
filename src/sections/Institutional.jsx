import SectionTitle from "../components/SectionTitle.jsx";

const cards = [
  ["Origem no aço", "A Amazon Aço iniciou suas atividades em Manaus em 2003, na distribuição de ferro e aço. A atividade industrial e o terminal portuário vieram nas etapas seguintes."],
  ["Presença industrial", "O grupo produz tubos, perfis, chapas e telhas de aço. Sua unidade industrial no Puraquequara reúne cerca de 75 mil m² de área construída."],
  ["Ligação com o porto", "A Amazon Terminais integra a estrutura logística do grupo, ligando a movimentação portuária às atividades do complexo industrial em Manaus."],
];

export default function Institutional() {
  return (
    <section id="institucional" className="section-light bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Quem somos" title="A operação portuária do grupo Amazon Aço." description="A Amazon Terminais faz parte de uma trajetória que começou na distribuição de aço em Manaus. O terminal próprio integra o transporte de cargas à estrutura industrial do grupo no Puraquequara." />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cards.map(([title, text], index) => (
            <div key={title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className="surface rounded-[2rem] border border-slate-200 bg-brand-light p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-8 h-2 w-20 rounded-full bg-brand-red-dark" />
              <h3 className="text-2xl font-black text-brand-blue">{title}</h3>
              <p className="theme-text-muted mt-4 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
