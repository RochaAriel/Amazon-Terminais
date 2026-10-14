import { useEffect, useRef, useState } from "react";
import BrandName from "./BrandName.jsx";
import Icon from "./Icon.jsx";
import { navItems } from "../data/siteData.js";

const MOBILE_MENU_ID = "menu-mobile";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef(null);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    // Fecha ao passar para o layout desktop (xl), onde o menu completo já aparece no header.
    const desktopQuery = window.matchMedia("(min-width: 80rem)");
    const handleBreakpoint = (event) => {
      if (event.matches) setIsMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleBreakpoint);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleBreakpoint);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between pl-2 pr-5 lg:pl-3 lg:pr-8">
        <BrandName />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 xl:flex" aria-label="Menu principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="whitespace-nowrap transition hover:text-brand-blue">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto mr-3 hidden items-center gap-3 md:flex xl:ml-0 xl:mr-0">
          <a href="#contato" className="whitespace-nowrap rounded-full border border-brand-blue/25 px-5 py-2.5 text-sm font-bold text-brand-blue transition hover:bg-brand-blue hover:text-white">
            Portal do Cliente
          </a>
          <a href="#contato" className="whitespace-nowrap rounded-full bg-brand-red-dark px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:bg-brand-red-dark-hover">
            Fale Conosco
          </a>
        </div>
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-2xl border border-slate-200 p-3 text-brand-blue xl:hidden"
          aria-expanded={isMenuOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <Icon name={isMenuOpen ? "close" : "menu"} className="h-5 w-5" />
        </button>
      </div>

      <div
        id={MOBILE_MENU_ID}
        hidden={!isMenuOpen}
        className="mobile-menu-panel border-t border-slate-200/80 bg-white shadow-lg xl:hidden"
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3" aria-label="Menu principal (mobile)">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-base font-semibold text-slate-600 transition hover:bg-brand-light hover:text-brand-blue"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 grid gap-3 border-t border-slate-200/80 pt-4 pb-2 md:hidden">
            <a href="#contato" onClick={closeMenu} className="rounded-full border border-brand-blue/25 px-5 py-3 text-center text-sm font-bold text-brand-blue transition hover:bg-brand-blue hover:text-white">
              Portal do Cliente
            </a>
            <a href="#contato" onClick={closeMenu} className="rounded-full bg-brand-red-dark px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-red-900/15 transition hover:bg-brand-red-dark-hover">
              Fale Conosco
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
