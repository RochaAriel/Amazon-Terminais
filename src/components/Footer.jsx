export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-5 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center text-[12px] text-slate-500 md:flex-row md:justify-between md:text-left">
        <p className="font-medium">© 2026 Amazon Terminais. Manaus/AM.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-semibold">
          <a href="#institucional" className="hover:text-brand-blue">A Empresa</a>
          <a href="#qualidade" className="hover:text-brand-blue">Qualidade</a>
          <a href="#contato" className="hover:text-brand-blue">SAC</a>
          <a href="#contato" className="hover:text-brand-blue">Trabalhe Conosco</a>
        </div>
      </div>
    </footer>
  );
}
