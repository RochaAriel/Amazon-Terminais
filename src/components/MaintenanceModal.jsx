function AmazonALogo() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:h-44 md:w-44">
      <div className="absolute -inset-3 rounded-[2.4rem] border border-white/10" />
      <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.22),rgba(255,255,255,0.05))]" />
      <div className="absolute inset-x-3 top-3 h-10 rounded-full bg-white/20 blur-md" />
      <div className="absolute left-3 top-4 h-[70%] w-[28%] rounded-full bg-white/10 blur-lg" />
      <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04)]" />

      <svg
        viewBox="0 0 1146 1280"
        role="img"
        aria-label="Logo Amazon Terminais"
        className="relative z-10 h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
      >
        <path d="M573 0 L1146 1212 L875 1212 L584 598 L267 1212 L0 1212 Z" fill="#ED1C24" />
        <path d="M294 1012 L856 1012 L584 1280 Z" fill="#162262" />
      </svg>
    </div>
  );
}

export default function MaintenanceModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0D173F]/95 px-5 py-8 text-white backdrop-blur-xl">
      <style>{`
        @keyframes maintenancePulse {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .75; transform: scale(1.15); }
        }

        @keyframes maintenanceLine {
          0% { transform: translateX(-100%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes logoBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }

        .maintenance-pulse {
          animation: maintenancePulse 2.4s ease-in-out infinite;
        }

        .maintenance-line {
          animation: maintenanceLine 2.8s ease-in-out infinite;
        }

        .logo-breath {
          animation: logoBreath 3.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .maintenance-pulse,
          .maintenance-line,
          .logo-breath {
            animation: none;
          }
        }
      `}</style>

      <div className="maintenance-pulse absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#ED1C24]/20 blur-3xl" />
      <div className="maintenance-pulse absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-title"
        className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.075] shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute left-0 top-0 h-[3px] w-full overflow-hidden bg-white/10">
          <div className="maintenance-line h-full w-1/2 bg-[#ED1C24]" />
        </div>

        <div className="grid min-h-[460px] lg:grid-cols-[0.9fr_1.25fr]">
          <aside className="relative flex items-center justify-center overflow-hidden border-b border-white/10 bg-[#07102D]/50 p-10 lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(237,28,36,.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,.09),rgba(255,255,255,.02))]" />

            <div className="absolute left-8 top-8 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/55">
              Amazon Terminais
            </div>

            <div className="logo-breath relative flex flex-col items-center text-center">
              <AmazonALogo />

              <div className="mt-8 max-w-xs">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#ED1C24]">Ambiente protegido</p>

                <p className="mt-3 text-sm leading-6 text-white/58">
                  Estamos preparando uma experiência institucional mais estável, moderna e segura.
                </p>
              </div>
            </div>
          </aside>

          <section className="relative flex flex-col justify-center p-8 md:p-12 lg:p-14">
            <span className="w-fit rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-white/70">
              Aviso temporário
            </span>

            <h1 id="maintenance-title" className="mt-7 max-w-xl text-4xl font-black tracking-tight md:text-6xl">
              Site em manutenção
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/70 md:text-lg">
              Estamos realizando ajustes técnicos para melhorar a experiência, desempenho e apresentação institucional
              do site.
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-sm font-bold text-white">Status</p>
                <p className="mt-1 text-xs font-semibold text-emerald-200">Ajustes em andamento</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-sm font-bold text-white">Operação</p>
                <p className="mt-1 text-xs font-semibold text-white/55">Ambiente institucional</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full bg-[#B3261E] px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-[#9D1F19]"
              >
                Entendi, acessar site
              </button>

              <p className="text-sm leading-6 text-white/45">
                O acesso está liberado para visualização do ambiente em desenvolvimento.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
