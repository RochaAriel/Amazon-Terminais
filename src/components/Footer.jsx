export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-5 lg:px-8">
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-3 text-[12px] text-slate-500 md:min-h-5 md:items-center md:justify-center">
        <p className="font-medium text-left md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">© 2026 Amazon Terminais. Layout conceitual para apresentação.</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4 text-center font-semibold md:w-auto">
          <a href="#institucional" className="hover-text-brand-blue">A Empresa</a>
          <a href="#qualidade" className="hover-text-brand-blue">Qualidade</a>
          <a href="#contato" className="hover-text-brand-blue">SAC</a>
          <a href="#contato" className="hover-text-brand-blue">Trabalhe Conosco</a>
        </div>
      </div>
    </footer>
  );
}
