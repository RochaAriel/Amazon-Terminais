import Icon from "../components/Icon.jsx";
import Sparkline from "../components/Sparkline.jsx";
import { operationRows } from "../data/siteData.js";

const highlights = [
  "Operação orientada por eficiência e segurança",
  "Controle de acesso, rastreabilidade e governança",
  "Base pronta para portal do cliente e integrações futuras",
];

export default function Infrastructure() {
  return (
    <section id="infraestrutura" className="section-light bg-white py-20" data-reveal>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-brand-red-dark">Infraestrutura</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-brand-blue md:text-6xl">Estrutura preparada para operações de alta exigência.</h2>
          <p className="theme-text-muted mt-6 text-lg leading-8 text-slate-600">A página pode destacar terminal, berços, pátio, controle operacional, segurança, compliance, sustentabilidade e capacidade logística.</p>
          <div className="mt-8 space-y-4">
            {highlights.map((item) => (
              <div key={item} className="surface flex items-center gap-3 rounded-2xl border border-slate-200 bg-brand-light p-4">
                <Icon name="check" className="h-5 w-5 text-brand-red-dark" />
                <p className="theme-text-strong font-semibold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="soft-float overflow-hidden rounded-[2.5rem] bg-brand-blue p-6 text-white shadow-2xl shadow-blue-950/20">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">Status Operacional</p>
                <h3 className="mt-2 text-2xl font-black">Centro de Controle</h3>
              </div>
              <span className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">Ambiente estável</span>
            </div>
            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
              {operationRows.map((row) => (
                <div key={row[0]} className="grid gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-4 text-sm last:border-b-0 md:grid-cols-4">
                  <span className="font-black text-white">{row[0]}</span>
                  <span className="text-white/65">{row[1]}</span>
                  <span className="text-white/80">{row[2]}</span>
                  <span className={`font-black ${row[3] === "Atenção" ? "text-amber-200" : "text-emerald-200"}`}>{row[3]}</span>
                </div>
              ))}
            </div>
            <Sparkline />
          </div>
        </div>
      </div>
    </section>
  );
}
