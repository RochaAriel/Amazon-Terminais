export default function SectionTitle({ eyebrow, title, description, light = false }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className={`mb-3 text-xs font-bold uppercase tracking-[0.35em] ${light ? "text-white/70" : "text-brand-red-dark"}`}>{eyebrow}</p>
      <h2 className={`text-3xl font-black tracking-tight md:text-5xl ${light ? "text-white" : "text-brand-blue"}`}>{title}</h2>
      <p className={`mt-5 text-base leading-7 md:text-lg ${light ? "text-white/70" : "theme-text-muted text-slate-600"}`}>{description}</p>
    </div>
  );
}
