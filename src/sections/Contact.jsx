import Icon from "../components/Icon.jsx";
import { contactTypes } from "../data/siteData.js";

export default function Contact() {
  return (
    <section id="contato" className="section-light bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div className="relative overflow-hidden rounded-[2.75rem] bg-brand-blue p-8 text-white shadow-2xl shadow-blue-950/20 md:p-10">
            <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-brand-red-dark-40 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" />
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Fale Conosco</p>
              <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Atendimento institucional para clientes, parceiros e fornecedores.</h2>
              <p className="mt-6 text-lg leading-8 text-white/75">Centralize solicitações comerciais, operacionais, SAC, fornecedores e assuntos institucionais em um canal claro e profissional.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {contactTypes.map((type) => (
                  <div key={type} className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-white/85">
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form className="form-surface rounded-[2.75rem] border border-slate-200 bg-brand-light p-6 shadow-sm md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">
                Nome
                <input type="text" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus-border-brand-blue" placeholder="Seu nome" />
              </label>
              <label className="text-sm font-bold text-slate-700">
                E-mail
                <input type="email" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus-border-brand-blue" placeholder="email@empresa.com" />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Telefone
                <input type="tel" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus-border-brand-blue" placeholder="(00) 00000-0000" />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Empresa
                <input type="text" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus-border-brand-blue" placeholder="Nome da empresa" />
              </label>
              <label className="text-sm font-bold text-slate-700 md:col-span-2">
                Tipo de solicitação
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus-border-brand-blue" defaultValue="Comercial">
                  {contactTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-slate-700 md:col-span-2">
                Mensagem
                <textarea className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus-border-brand-blue" placeholder="Descreva sua solicitação" />
              </label>
            </div>
            <button type="button" className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-red-dark px-8 py-4 font-black text-white transition hover:-translate-y-0.5 hover-bg-brand-red-dark md:w-auto">
              Enviar solicitação
              <Icon name="arrow" className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
