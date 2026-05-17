import { brand } from "../data/siteData.js";

export default function BrandName({ className = "" }) {
  return (
    <a href="#inicio" className={`group flex items-center gap-3 ${className}`} aria-label="Amazon Terminais">
      <span className="flex h-9 w-1.5 rounded-full bg-brand-red transition group-hover:h-10" />
      <span className="flex flex-col leading-none">
        <span className="text-[20px] font-black uppercase tracking-[-0.04em] text-brand-blue md:text-[22px]">
          Amazon <span className="text-brand-red">Terminais</span>
        </span>
        <span className="theme-text-muted mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-brand-blue-muted md:text-[10px]">
          {brand.tagline}
        </span>
      </span>
    </a>
  );
}
