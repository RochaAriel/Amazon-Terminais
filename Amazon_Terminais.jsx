import React, { useEffect, useMemo, useState } from "react";

const brand = {
  name: "Amazon Terminais",
  tagline: "Operações Portuárias",
};

const movementData = [
  { day: "Seg", carga: 38, gate: 22 },
  { day: "Ter", carga: 52, gate: 31 },
  { day: "Qua", carga: 46, gate: 28 },
  { day: "Qui", carga: 68, gate: 45 },
  { day: "Sex", carga: 74, gate: 53 },
  { day: "Sáb", carga: 59, gate: 41 },
  { day: "Dom", carga: 83, gate: 63 },
];

const stats = [
  { label: "Operação contínua", value: "24/7" },
  { label: "Pátio monitorado", value: "100%" },
  { label: "Tempo médio de gate", value: "12 min" },
  { label: "Status operacional", value: "Online" },
];

const services = [
  {
    title: "Operações Portuárias",
    description: "Gestão de atracação, movimentação, armazenagem e apoio à operação com foco em previsibilidade.",
    icon: "ship",
  },
  {
    title: "Gate e Controle",
    description: "Fluxo de veículos, segurança de acesso, registro operacional e validação de entrada e saída.",
    icon: "gate",
  },
  {
    title: "Logística Integrada",
    description: "Conexão estratégica entre terminal, clientes, modais e cadeia logística regional.",
    icon: "route",
  },
  {
    title: "Tecnologia Operacional",
    description: "Indicadores, painéis, rastreabilidade e suporte à decisão para uma operação moderna.",
    icon: "chart",
  },
];

const operationRows = [
  ["Berço 01", "Atracado", "MV Amazon Star", "Estável"],
  ["Gate Principal", "Fluxo", "132 veículos", "Normal"],
  ["Pátio A3", "Ocupação", "78%", "Atenção"],
  ["Segurança", "CFTV/OCR", "Online", "Seguro"],
];

const news = [
  "Amazon Terminais fortalece presença digital com nova experiência institucional",
  "Operação portuária amplia foco em segurança, eficiência e rastreabilidade",
  "Tecnologia e governança operacional como pilares para o crescimento logístico",
];

const timeline = [
  {
    year: "2003",
    title: "Origem do grupo",
    text: "Consolidação de uma atuação regional voltada à qualidade, atendimento e crescimento sustentável.",
  },
  {
    year: "2008",
    title: "Expansão operacional",
    text: "Fortalecimento da estrutura logística e evolução dos processos para atender novas demandas.",
  },
  {
    year: "2013",
    title: "Modernização e crescimento",
    text: "Ampliação da capacidade, padronização de rotinas e desenvolvimento de novas frentes de negócio.",
  },
  {
    year: "Hoje",
    title: "Operações portuárias",
    text: "Terminal preparado para uma operação mais segura, integrada, rastreável e conectada ao futuro logístico da região.",
  },
];

const governancePillars = [
  {
    title: "Satisfação do Cliente",
    text: "Atendimento com excelência, clareza nas informações e foco na continuidade operacional.",
    icon: "check",
  },
  {
    title: "Melhoria Contínua",
    text: "Evolução constante dos processos, indicadores e rotinas para elevar o padrão de entrega.",
    icon: "chart",
  },
  {
    title: "Gestão por Processos",
    text: "Procedimentos padronizados para garantir segurança, previsibilidade e controle operacional.",
    icon: "gate",
  },
  {
    title: "Gestão de Riscos",
    text: "Identificação, controle e mitigação de riscos ligados à operação, pessoas e infraestrutura.",
    icon: "shield",
  },
  {
    title: "Sustentabilidade",
    text: "Responsabilidade ambiental, boas práticas e compromisso com o desenvolvimento regional.",
    icon: "leaf",
  },
];

const contactTypes = ["Comercial", "Operações", "SAC", "Trabalhe Conosco", "Fornecedores", "Institucional"];

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "A Empresa", href: "#institucional" },
  { label: "Trajetória", href: "#trajetoria" },
  { label: "Operações", href: "#operacoes" },
  { label: "Infraestrutura", href: "#infraestrutura" },
  { label: "Qualidade", href: "#qualidade" },
  { label: "Contato", href: "#contato" },
];

const iconPaths = {
  ship: <><path d="M3 17h18" /><path d="M5 17 7 8h10l2 9" /><path d="M9 8V4h6v4" /><path d="M6 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" /></>,
  gate: <><rect x="4" y="7" width="16" height="11" rx="2" /><path d="M8 18V7" /><path d="M16 18V7" /><path d="M4 12h16" /></>,
  route: <><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M9 6h4a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h4" /></>,
  chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16V9" /><path d="M12 16V6" /><path d="M16 16v-4" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  leaf: <><path d="M5 19c7-1 13-7 14-14-7 1-13 7-14 14Z" /><path d="M5 19c4-4 8-7 14-14" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
  anchor: <><circle cx="12" cy="5" r="3" /><path d="M12 8v13" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /><path d="m5 16 3-4 3 4" /><path d="m19 16-3-4-3 4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>,
  moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z" />,
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name] || iconPaths.anchor}
    </svg>
  );
}

function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!elements.length) return undefined;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function AnimationStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      .maintenance-backdrop { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 50% 15%, rgba(237,28,36,.22), transparent 34%), rgba(5,8,22,.82); backdrop-filter: blur(14px); }
      .maintenance-card { width: min(560px, 100%); overflow: hidden; border: 1px solid rgba(255,255,255,.16); border-radius: 34px; background: linear-gradient(145deg, rgba(15,23,42,.96), rgba(13,23,63,.96)); color: #fff; box-shadow: 0 36px 100px rgba(0,0,0,.42); animation: maintenanceCardIn 680ms cubic-bezier(.2,.8,.2,1) both; }
      .maintenance-card::before { content: ""; display: block; height: 5px; background: linear-gradient(90deg, #ED1C24, #ffffff, #1E2E7A); }
      .maintenance-pulse { animation: maintenancePing 1.7s ease-in-out infinite; }
      .maintenance-loader { height: 4px; width: 100%; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.12); }
      .maintenance-loader span { display: block; height: 100%; width: 38%; border-radius: inherit; background: #ED1C24; animation: maintenanceSlide 1.45s ease-in-out infinite; }
      @keyframes maintenanceCardIn { from { opacity: 0; transform: translateY(22px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes maintenancePing { 0%, 100% { box-shadow: 0 0 0 0 rgba(237,28,36,.28); } 50% { box-shadow: 0 0 0 12px rgba(237,28,36,0); } }
      @keyframes maintenanceSlide { 0% { transform: translateX(-110%); } 50% { transform: translateX(85%); } 100% { transform: translateX(280%); } }
      [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 720ms ease, transform 720ms cubic-bezier(.2,.8,.2,1), box-shadow 240ms ease, border-color 240ms ease, background-color 240ms ease; transition-delay: var(--reveal-delay, 0ms); }
      [data-reveal="fade-left"] { transform: translateX(28px); }
      [data-reveal="fade-right"] { transform: translateX(-28px); }
      [data-reveal="zoom"] { transform: scale(.96); }
      [data-reveal].is-visible { opacity: 1; transform: translate(0, 0) scale(1); }
      .soft-float { animation: softFloat 7s ease-in-out infinite; }
      .pulse-orb { animation: pulseOrb 8s ease-in-out infinite; }
      .status-pulse { animation: statusPulse 1.8s ease-in-out infinite; }
      .motion-draw-line { stroke-dasharray: 260; stroke-dashoffset: 260; animation: drawLine 1.65s ease forwards; }
      .motion-draw-line-slow { animation-delay: 180ms; }
      @keyframes softFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes pulseOrb { 0%, 100% { opacity: .55; transform: scale(1); } 50% { opacity: .85; transform: scale(1.08); } }
      @keyframes statusPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,.28); } 50% { box-shadow: 0 0 0 8px rgba(52,211,153,0); } }
      @keyframes drawLine { to { stroke-dashoffset: 0; } }
      .theme-shell { transition: background-color 260ms ease, color 260ms ease; }
      .theme-dark { background: #050816 !important; color: #F8FAFC !important; }
      .theme-dark header { background-color: rgba(8, 13, 32, .94) !important; border-color: rgba(148, 163, 184, .18) !important; }
      .theme-dark section:not(#inicio), .theme-dark footer { background-color: #050816 !important; color: #F8FAFC !important; }
      .theme-dark section:not(#inicio) .bg-white, .theme-dark section:not(#inicio) [class*="bg-white"], .theme-dark section:not(#inicio) [class*="bg-[#F5F7FA]"], .theme-dark section:not(#inicio) [class*="bg-[#F8FAFC]"] { background-color: #0B122B !important; }
      .theme-dark section:not(#inicio) input, .theme-dark section:not(#inicio) select, .theme-dark section:not(#inicio) textarea { background-color: #111A38 !important; border-color: rgba(148, 163, 184, .28) !important; color: #F8FAFC !important; }
      .theme-dark section:not(#inicio) input::placeholder, .theme-dark section:not(#inicio) textarea::placeholder { color: #94A3B8 !important; }
      .theme-dark section:not(#inicio) article, .theme-dark section:not(#inicio) [class*="rounded-[2rem]"], .theme-dark section:not(#inicio) [class*="rounded-2xl"], .theme-dark footer { border-color: rgba(148, 163, 184, .18) !important; }
      .theme-dark [class*="text-[#1E2E7A]"], .theme-dark .text-slate-900, .theme-dark .text-slate-800, .theme-dark .text-slate-700 { color: #F8FAFC !important; }
      .theme-dark .text-slate-600, .theme-dark .text-slate-500, .theme-dark .text-slate-400 { color: #CBD5E1 !important; }
      .theme-dark section:not(#inicio) p:not([class*="text-[#B3261E]"]):not([class*="text-[#ED1C24]"]), .theme-dark section:not(#inicio) h2, .theme-dark section:not(#inicio) h3, .theme-dark section:not(#inicio) label, .theme-dark footer p, .theme-dark footer a { color: inherit; }
      .theme-dark .border-slate-200, .theme-dark .border-slate-200\/80 { border-color: rgba(148, 163, 184, .18) !important; }
      .theme-float-toggle { position: fixed; right: 24px; bottom: 24px; z-index: 80; box-shadow: 0 24px 60px rgba(15, 23, 42, .22); }
      .theme-dark .theme-float-toggle { background-color: #F8FAFC !important; color: #0D173F !important; border-color: rgba(255,255,255,.22) !important; box-shadow: 0 24px 60px rgba(0,0,0,.42); }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } [data-reveal] { opacity: 1; transform: none; transition: none; } .soft-float, .pulse-orb, .status-pulse, .motion-draw-line, .motion-draw-line-slow, .maintenance-pulse, .maintenance-loader span, .maintenance-card { animation: none; } }
    `}</style>
  );
}

function MaintenancePopup({ onConfirm }) {
  return (
    <div className="maintenance-backdrop" role="dialog" aria-modal="true" aria-labelledby="maintenance-title" aria-describedby="maintenance-description">
      <div className="maintenance-card">
        <div className="p-8 text-center md:p-10">
          <div className="maintenance-pulse mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ED1C24]/20 text-[#ED1C24]">
            <Icon name="shield" className="h-8 w-8" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/55">Amazon Terminais</p>
          <h2 id="maintenance-title" className="mt-4 text-4xl font-black tracking-tight md:text-5xl">SITE EM MANUTENÇÃO</h2>
          <p id="maintenance-description" className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/70 md:text-base">
            Estamos ajustando nossa experiência digital. Clique em continuar para visualizar a prévia do site.
          </p>
          <div className="maintenance-loader mt-8" aria-hidden="true"><span /></div>
          <button type="button" onClick={onConfirm} className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ED1C24] px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#c9161d] focus:outline-none focus:ring-4 focus:ring-white/20 md:w-auto">
            Confirmar e acessar
            <Icon name="arrow" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandName({ className = "" }) {
  return (
    <a href="#inicio" className={`group flex items-center gap-3 ${className}`} aria-label="Amazon Terminais">
      <span className="flex h-9 w-1.5 rounded-full bg-[#ED1C24] transition group-hover:h-10" />
      <span className="flex flex-col leading-none">
        <span className="text-[20px] font-black uppercase tracking-[-0.04em] text-[#1E2E7A] md:text-[22px]">
          Amazon <span className="text-[#ED1C24]">Terminais</span>
        </span>
        <span className="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-[#1E2E7A]/70 md:text-[10px]">{brand.tagline}</span>
      </span>
    </a>
  );
}

function SectionTitle({ eyebrow, title, description, light = false }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className={`mb-3 text-xs font-bold uppercase tracking-[0.35em] ${light ? "text-white/70" : "text-[#B3261E]"}`}>{eyebrow}</p>
      <h2 className={`text-3xl font-black tracking-tight md:text-5xl ${light ? "text-white" : "text-[#1E2E7A]"}`}>{title}</h2>
      <p className={`mt-5 text-base leading-7 md:text-lg ${light ? "text-white/70" : "text-slate-600"}`}>{description}</p>
    </div>
  );
}

function ThemeToggle({ theme, onToggleTheme }) {
  const isDark = theme === "dark";
  return (
    <button type="button" onClick={onToggleTheme} className="theme-float-toggle group inline-flex items-center gap-2 rounded-full border border-[#1E2E7A]/20 bg-white px-4 py-3 text-xs font-black text-[#1E2E7A] transition hover:-translate-y-1 hover:border-[#ED1C24]/40 hover:text-[#ED1C24]" aria-pressed={isDark} aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"} title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}>
      <Icon name={isDark ? "sun" : "moon"} className="h-5 w-5" />
      <span>{isDark ? "Claro" : "Dark"}</span>
    </button>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between pl-2 pr-5 lg:pl-3 lg:pr-8">
        <BrandName />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex" aria-label="Menu principal">
          {navItems.map((item) => <a key={item.href} href={item.href} className="transition hover:text-[#1E2E7A]">{item.label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="#contato" className="rounded-full border border-[#1E2E7A]/25 px-5 py-2.5 text-sm font-bold text-[#1E2E7A] transition hover:bg-[#1E2E7A] hover:text-white">Portal do Cliente</a>
          <a href="#contato" className="rounded-full bg-[#B3261E] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:bg-[#9d1f19]">Fale Conosco</a>
        </div>
        <a href="#contato" className="rounded-2xl border border-slate-200 p-3 text-[#1E2E7A] lg:hidden" aria-label="Ir para contato"><Icon name="menu" className="h-5 w-5" /></a>
      </div>
    </header>
  );
}

function Sparkline() {
  const { points, gatePoints } = useMemo(() => {
    const buildPoints = (key) => movementData.map((item, index) => {
      const x = (index / (movementData.length - 1)) * 100;
      const y = 100 - item[key];
      return `${x},${y}`;
    }).join(" ");
    return { points: buildPoints("carga"), gatePoints: buildPoints("gate") };
  }, []);

  return (
    <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[#0A1233]/80 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div><p className="text-sm font-bold text-white">Movimentação semanal</p><p className="text-xs text-white/55">Carga x fluxo de gate</p></div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">Demo</span>
      </div>
      <svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible" role="img" aria-label="Gráfico demonstrativo de movimentação semanal">
        <defs>
          <linearGradient id="redFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#B3261E" stopOpacity="0.35" /><stop offset="100%" stopColor="#B3261E" stopOpacity="0" /></linearGradient>
          <linearGradient id="blueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" /><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" /></linearGradient>
        </defs>
        <polyline points={`${points} 100,100 0,100`} fill="url(#redFill)" stroke="none" />
        <polyline points={`${gatePoints} 100,100 0,100`} fill="url(#blueFill)" stroke="none" />
        <polyline className="motion-draw-line" points={points} fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <polyline className="motion-draw-line motion-draw-line-slow" points={gatePoints} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.8" />
      </svg>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-white/50">{movementData.map((item) => <span key={item.day}>{item.day}</span>)}</div>
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#0D173F] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:46px_46px] opacity-30" />
      <div className="pulse-orb absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#B3261E]/30 blur-3xl" />
      <div className="pulse-orb absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
        <div data-reveal="fade-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/85 backdrop-blur"><Icon name="anchor" className="h-4 w-4" /> Operações Portuárias</span>
          <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Solidez portuária com presença digital premium.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Um conceito moderno para a Amazon Terminais, combinando identidade institucional, tecnologia operacional e comunicação clara para clientes, parceiros e stakeholders.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#operacoes" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#B3261E] px-7 py-4 font-black text-white shadow-xl shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-[#9d1f19]">Conheça nossa operação <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" /></a>
            <a href="#infraestrutura" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/15">Ver infraestrutura</a>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">{stats.map((item) => <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.075] p-5 backdrop-blur-xl"><p className="text-3xl font-black text-white">{item.value}</p><p className="mt-2 text-sm font-semibold text-white/80">{item.label}</p></div>)}</div>
        </div>
        <div className="relative" data-reveal="fade-left" style={{ "--reveal-delay": "120ms" }}>
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-white/15 via-[#B3261E]/20 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[2rem] border border-white/10 bg-[#101C4B]/90 p-5">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">Painel executivo</p><h3 className="mt-2 text-2xl font-black text-white">Operação em tempo real</h3></div><div className="status-pulse rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">Online</div></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">{operationRows.map((row) => <div key={row[0]} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"><p className="text-sm font-bold text-white">{row[0]}</p><p className="mt-1 text-xs text-white/55">{row[1]} • {row[2]}</p><p className={`mt-3 text-xs font-black ${row[3] === "Atenção" ? "text-amber-200" : "text-emerald-200"}`}>{row[3]}</p></div>)}</div>
              <Sparkline />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Institutional() {
  const cards = [
    ["Credibilidade", "Visual limpo, hierarquia forte e linguagem institucional para transmitir solidez."],
    ["Eficiência", "Conteúdo organizado para clientes encontrarem rapidamente serviços, contatos e informações."],
    ["Autoridade", "Design premium com foco em operação portuária, tecnologia e governança."],
  ];
  return (
    <section id="institucional" className="bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Institucional" title="Uma marca forte precisa de uma experiência digital à altura." description="A nova proposta mantém a seriedade corporativa da Amazon Terminais, mas entrega uma leitura mais moderna, objetiva e confiável para o público institucional." />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">{cards.map(([title, text], index) => <div key={title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className="rounded-[2rem] border border-slate-200 bg-[#F8FAFC] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-8 h-2 w-20 rounded-full bg-[#B3261E]" /><h3 className="text-2xl font-black text-[#1E2E7A]">{title}</h3><p className="mt-4 leading-7 text-slate-600">{text}</p></div>)}</div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section id="trajetoria" className="bg-[#F5F7FA] py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Nossa Trajetória" title="Uma evolução construída com estrutura, confiança e visão regional." description="Inspirada na comunicação institucional do grupo, esta seção apresenta marcos de crescimento e posiciona a Amazon Terminais como continuidade de uma história voltada à qualidade e expansão operacional." />
        <div className="relative mt-16"><div className="absolute left-4 top-0 hidden h-full w-px bg-slate-200 md:left-1/2 md:block" /><div className="grid gap-6">{timeline.map((item, index) => <article key={item.year} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className={`relative grid gap-6 md:grid-cols-2 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}><div className={index % 2 === 0 ? "md:pr-12" : "md:col-start-2 md:pl-12"}><div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><p className="text-sm font-black uppercase tracking-[0.28em] text-[#B3261E]">{item.year}</p><h3 className="mt-3 text-2xl font-black text-[#1E2E7A]">{item.title}</h3><p className="mt-4 leading-7 text-slate-600">{item.text}</p></div></div><span className="absolute left-1/2 top-8 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-[#B3261E] shadow-lg md:block" /></article>)}</div></div>
      </div>
    </section>
  );
}

function Operations() {
  return (
    <section id="operacoes" className="bg-[#F5F7FA] py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Operações" title="Áreas estratégicas apresentadas com clareza." description="Uma estrutura visual preparada para mostrar capacidades, diferenciais e serviços da operação portuária com linguagem executiva." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{services.map((service, index) => <article key={service.title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 80}ms` }} className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E2E7A] text-white transition group-hover:bg-[#B3261E]"><Icon name={service.icon} className="h-7 w-7" /></div><h3 className="text-xl font-black text-[#1E2E7A]">{service.title}</h3><p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p><a href="#contato" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#B3261E]">Saiba mais <Icon name="arrow" className="h-4 w-4" /></a></article>)}</div>
      </div>
    </section>
  );
}

function Infrastructure() {
  const highlights = ["Operação orientada por eficiência e segurança", "Controle de acesso, rastreabilidade e governança", "Base pronta para portal do cliente e integrações futuras"];
  return (
    <section id="infraestrutura" className="bg-white py-20" data-reveal>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
        <div><p className="text-sm font-black uppercase tracking-[0.28em] text-[#B3261E]">Infraestrutura</p><h2 className="mt-5 text-4xl font-black tracking-tight text-[#1E2E7A] md:text-6xl">Estrutura preparada para operações de alta exigência.</h2><p className="mt-6 text-lg leading-8 text-slate-600">A página pode destacar terminal, berços, pátio, controle operacional, segurança, compliance, sustentabilidade e capacidade logística.</p><div className="mt-8 space-y-4">{highlights.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4"><Icon name="check" className="h-5 w-5 text-[#B3261E]" /><p className="font-semibold text-slate-700">{item}</p></div>)}</div></div>
        <div className="soft-float overflow-hidden rounded-[2.5rem] bg-[#1E2E7A] p-6 text-white shadow-2xl shadow-blue-950/20"><div className="rounded-[2rem] border border-white/10 bg-white/10 p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">Status Operacional</p><h3 className="mt-2 text-2xl font-black">Centro de Controle</h3></div><span className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">Ambiente estável</span></div><div className="mt-6 overflow-hidden rounded-3xl border border-white/10">{operationRows.map((row) => <div key={row[0]} className="grid gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-4 text-sm last:border-b-0 md:grid-cols-4"><span className="font-black text-white">{row[0]}</span><span className="text-white/65">{row[1]}</span><span className="text-white/80">{row[2]}</span><span className={`font-black ${row[3] === "Atenção" ? "text-amber-200" : "text-emerald-200"}`}>{row[3]}</span></div>)}</div><Sparkline /></div></div>
      </div>
    </section>
  );
}

function Governance() {
  return (
    <section id="qualidade" className="bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Qualidade e Governança" title="Pilares institucionais aplicados à operação portuária." description="Uma área inspirada na política de qualidade do grupo, adaptada para comunicar segurança, melhoria contínua, gestão de riscos e sustentabilidade na rotina do terminal." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">{governancePillars.map((pillar, index) => <article key={pillar.title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 70}ms` }} className="group rounded-[2rem] border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E2E7A] text-white transition group-hover:bg-[#B3261E]"><Icon name={pillar.icon} className="h-6 w-6" /></div><h3 className="text-lg font-black leading-6 text-[#1E2E7A]">{pillar.title}</h3><p className="mt-4 text-sm leading-7 text-slate-600">{pillar.text}</p></article>)}</div>
      </div>
    </section>
  );
}

function Sustainability() {
  const items = [["ESG", "Práticas sustentáveis, responsabilidade ambiental e evolução contínua."], ["Segurança", "Procedimentos, controle, monitoramento e cultura operacional."], ["Inovação", "Digitalização de processos, indicadores e melhoria de gestão."]];
  return (
    <section id="sustentabilidade" className="bg-[#0D173F] py-20 text-white" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle light eyebrow="Sustentabilidade" title="Segurança, responsabilidade e visão de futuro." description="Uma área para comunicar ESG, segurança do trabalho, compromisso ambiental, processos internos e governança operacional." /><div className="mt-14 grid gap-6 md:grid-cols-3">{items.map(([title, text], index) => <div key={title} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur"><div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${index === 0 ? "bg-emerald-400/15 text-emerald-200" : "bg-[#B3261E]/20 text-red-100"}`}><Icon name={index === 0 ? "leaf" : index === 1 ? "shield" : "chart"} className="h-7 w-7" /></div><h3 className="text-2xl font-black">{title}</h3><p className="mt-4 leading-7 text-white/65">{text}</p></div>)}</div></div>
    </section>
  );
}

function News() {
  return (
    <section className="bg-[#F5F7FA] py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionTitle eyebrow="Comunicação" title="Notícias e comunicados institucionais." description="Espaço para publicações, avisos, atualizações operacionais, certificações, projetos e conteúdos corporativos." /><div className="mt-12 grid gap-6 md:grid-cols-3">{news.map((item, index) => <article key={item} data-reveal="zoom" style={{ "--reveal-delay": `${index * 90}ms` }} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><p className="text-xs font-black uppercase tracking-[0.25em] text-[#B3261E]">Publicação 0{index + 1}</p><h3 className="mt-5 text-xl font-black leading-8 text-[#1E2E7A]">{item}</h3><p className="mt-4 text-sm leading-7 text-slate-600">Texto demonstrativo para apresentar a área de comunicação da empresa com uma linguagem moderna e institucional.</p><a href="#contato" className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#B3261E]">Ler mais <Icon name="arrow" className="h-4 w-4" /></a></article>)}</div></div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contato" className="bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]"><div className="relative overflow-hidden rounded-[2.75rem] bg-[#1E2E7A] p-8 text-white shadow-2xl shadow-blue-950/20 md:p-10"><div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#B3261E]/40 blur-3xl" /><div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" /><div className="relative"><p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Fale Conosco</p><h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Atendimento institucional para clientes, parceiros e fornecedores.</h2><p className="mt-6 text-lg leading-8 text-white/75">Centralize solicitações comerciais, operacionais, SAC, fornecedores e assuntos institucionais em um canal claro e profissional.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{contactTypes.map((type) => <div key={type} className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-white/85">{type}</div>)}</div></div></div><form className="rounded-[2.75rem] border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm md:p-8"><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-slate-700">Nome<input type="text" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E2E7A]" placeholder="Seu nome" /></label><label className="text-sm font-bold text-slate-700">E-mail<input type="email" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E2E7A]" placeholder="email@empresa.com" /></label><label className="text-sm font-bold text-slate-700">Telefone<input type="tel" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E2E7A]" placeholder="(00) 00000-0000" /></label><label className="text-sm font-bold text-slate-700">Empresa<input type="text" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E2E7A]" placeholder="Nome da empresa" /></label><label className="text-sm font-bold text-slate-700 md:col-span-2">Tipo de solicitação<select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E2E7A]" defaultValue="Comercial">{contactTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label className="text-sm font-bold text-slate-700 md:col-span-2">Mensagem<textarea className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E2E7A]" placeholder="Descreva sua solicitação" /></label></div><button type="button" className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#B3261E] px-8 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-[#9d1f19] md:w-auto">Enviar solicitação <Icon name="arrow" className="h-5 w-5" /></button></form></div></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-5 lg:px-8">
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-3 text-[12px] text-slate-500 md:min-h-5 md:items-center md:justify-center">
        <p className="font-medium text-left md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">© 2026 Amazon Terminais. Layout conceitual para apresentação.</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4 text-center font-semibold md:w-auto"><a href="#institucional" className="hover:text-[#1E2E7A]">A Empresa</a><a href="#qualidade" className="hover:text-[#1E2E7A]">Qualidade</a><a href="#contato" className="hover:text-[#1E2E7A]">SAC</a><a href="#contato" className="hover:text-[#1E2E7A]">Trabalhe Conosco</a></div>
      </div>
    </footer>
  );
}

function validateStaticData() {
  return (
    Array.isArray(movementData) &&
    movementData.length === 7 &&
    movementData.every((item) => typeof item.carga === "number" && typeof item.gate === "number") &&
    stats.length === 4 &&
    services.length === 4 &&
    operationRows.length === 4 &&
    news.length === 3 &&
    timeline.length === 4 &&
    governancePillars.length === 5 &&
    contactTypes.length >= 4 &&
    navItems.every((item) => item.label && item.href)
  );
}

export default function AmazonTerminaisSite() {
  const [theme, setTheme] = useState("light");
  const [showMaintenance, setShowMaintenance] = useState(true);
  useRevealOnScroll();

  const isDataValid = validateStaticData();
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[2rem] border border-white/10 bg-[#101C4B]/90 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">Painel executivo</p>
                  <h3 className="mt-2 text-2xl font-black text-white">Operação em tempo real</h3>
                </div>
                <div className="status-pulse rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">Online</div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {operationRows.map((row) => (
                  <div key={row[0]} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-sm font-bold text-white">{row[0]}</p>
                    <p className="mt-1 text-xs text-white/55">{row[1]} • {row[2]}</p>
                    <p className={`mt-3 text-xs font-black ${row[3] === "Atenção" ? "text-amber-200" : "text-emerald-200"}`}>{row[3]}</p>
                  </div>
                ))}
              </div>
              <Sparkline />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Institutional() {
  const cards = [
    ["Credibilidade", "Visual limpo, hierarquia forte e linguagem institucional para transmitir solidez."],
    ["Eficiência", "Conteúdo organizado para clientes encontrarem rapidamente serviços, contatos e informações."],
    ["Autoridade", "Design premium com foco em operação portuária, tecnologia e governança."],
  ];

  return (
    <section id="institucional" className="bg-white py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Institucional" title="Uma marca forte precisa de uma experiência digital à altura." description="A nova proposta mantém a seriedade corporativa da Amazon Termina