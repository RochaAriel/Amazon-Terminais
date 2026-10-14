import SectionTitle from "../components/SectionTitle.jsx";

const cards = [
  ["Mais de 20 anos em Manaus", "Desde março de 2003 no mercado do aço, com equipe própria e representantes comerciais em todo o Brasil."],
  ["Indústria na Região Norte", "Produção de tubos, perfis, chapas e telhas de aço em uma unidade com cerca de 75 mil m² de área construída."],
  ["Terminal próprio", "O Terminal de Uso Privado aproxima navio, pátio e indústria, com mais controle sobre prazos e sobre a carga que chega à região."],
];

export default function Institutional() {
  return (
    <section id="institucional" className="section-light bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle title="Do aço ao porto: um grupo que cresce com Manaus." description="Fundado em 2003 como distribuidor de aço, o grupo Amazon Aço se tornou indústria e referência na Região Norte. Com a Amazon Terminais, passou a operar também a porta de entrada da sua carga." />
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
