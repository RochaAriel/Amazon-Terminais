export default function BrandName({ className = "" }) {
  return (
    <a href="#inicio" className={`group flex shrink-0 items-center gap-3 ${className}`} aria-label="Amazon Terminais">
      <span className="flex h-9 w-1.5 rounded-full bg-brand-red transition group-hover:h-10" />
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap text-[20px] font-black uppercase tracking-[-0.04em] text-brand-blue md:text-[22px]">
          Amazon <span className="text-brand-red">Terminais</span>
        </span>
      </span>
    </a>
  );
}
