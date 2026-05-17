import SectionTitle from "../components/SectionTitle.jsx";

const cards = [
  ["Credibilidade", "Visual limpo, hierarquia forte e linguagem institucional para transmitir solidez."],
  ["Eficiência", "Conteúdo organizado para clientes encontrarem rapidamente serviços, contatos e informações."],
  ["Autoridade", "Design premium com foco em operação portuária, tecnologia e governança."],
];

export default function Institutional() {
  return (
    <section id="institucional" className="section-light bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Institucional" title="Uma marca forte precisa de uma experiência digital à altura." description="A nova proposta mantém a seriedade corporativa da Amazon Terminais, mas entrega uma leitura mais moderna, objetiva e confiável para o público institucional." />
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
