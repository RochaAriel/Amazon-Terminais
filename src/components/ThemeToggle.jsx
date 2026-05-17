import Icon from "./Icon.jsx";

export default function ThemeToggle({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className="theme-float-toggle group inline-flex items-center gap-2 rounded-full border border-brand-blue-soft bg-white px-4 py-3 text-xs font-black text-brand-blue transition hover:-translate-y-1 hover-border-brand-red-soft hover-text-brand-red"
      aria-pressed={isDark}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      <Icon name={isDark ? "sun" : "moon"} className="h-5 w-5" />
      <span>{isDark ? "Claro" : "Dark"}</span>
    </button>
  );
}
