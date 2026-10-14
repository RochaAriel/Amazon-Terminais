import Icon from "../components/Icon.jsx";
import { terminalFacts } from "../data/siteData.js";

const highlights = [
  "Operação contínua, 24 horas por dia",
  "Controle de acesso e monitoramento por câmeras",
  "Integração direta com o complexo industrial do grupo",
];

export default function Infrastructure() {
  return (
    <section id="infraestrutura" className="section-light bg-white py-20" data-reveal>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-brand-red-dark">Infraestrutura</p>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-brand-blue sm:text-4xl md:text-5xl xl:text-6xl">Estrutura própria para operações de alta exigência.</h2>
          <p className="theme-text-muted mt-6 text-lg leading-8 text-slate-600">O terminal fica no Puraquequara, zona leste de Manaus, ao lado do complexo industrial da Amazon Aço. Opera como Terminal de Uso Privado, autorizado pelo Governo Federal e regulado pela ANTAQ.</p>
          <div className="mt-8 space-y-4">
            {highlights.map((item) => (
              <div key={item} className="surface flex items-center gap-3 rounded-2xl border border-slate-200 bg-brand-light p-4">
                <Icon name="check" className="h-5 w-5 shrink-0 text-brand-red-dark" />
                <p className="theme-text-strong font-semibold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="soft-float overflow-hidden rounded-[2.5rem] bg-brand-blue p-6 text-white shadow-2xl shadow-blue-950/20">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">Dados do terminal</p>
                <h3 className="mt-2 text-2xl font-black">Ficha técnica</h3>
              </div>
              <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">Manaus/AM</span>
            </div>
            <dl className="mt-6 overflow-hidden rounded-3xl border border-white/10">
              {terminalFacts.map(([label, value]) => (
                <div key={label} className="grid gap-1 border-b border-white/10 bg-white/[0.04] px-4 py-4 text-sm last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="font-black text-white/60">{label}</dt>
                  <dd className="font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
