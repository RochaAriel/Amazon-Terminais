import BrandName from "./BrandName.jsx";
import Icon from "./Icon.jsx";
import { navItems } from "../data/siteData.js";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between pl-2 pr-5 lg:pl-3 lg:pr-8">
        <BrandName />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex" aria-label="Menu principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover-text-brand-blue">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="#contato" className="rounded-full border border-brand-blue-subtle px-5 py-2.5 text-sm font-bold text-brand-blue transition hover-bg-brand-blue hover:text-white">
            Portal do Cliente
          </a>
          <a href="#contato" className="rounded-full bg-brand-red-dark px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover-bg-brand-red-dark">
            Fale Conosco
          </a>
        </div>
        <a href="#contato" className="rounded-2xl border border-slate-200 p-3 text-brand-blue lg:hidden" aria-label="Ir para contato">
          <Icon name="menu" className="h-5 w-5" />
        </a>
      </div>
    </header>
  );
}
