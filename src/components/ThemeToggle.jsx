import Icon from "./Icon.jsx";

export default function ThemeToggle({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className="theme-float-toggle group inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white p-3 text-xs font-black sm:px-4 text-brand-blue transition hover:-translate-y-1 hover:border-brand-red/40 hover:text-brand-red"
      aria-pressed={isDark}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      <Icon name={isDark ? "sun" : "moon"} className="h-5 w-5" />
      <span className="hidden sm:inline">{isDark ? "Claro" : "Dark"}</span>
    </button>
  );
}
