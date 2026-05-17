import { useState } from "react";
import Header from "./components/Header.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import Institutional from "./sections/Institutional.jsx";
import Timeline from "./sections/Timeline.jsx";
import Operations from "./sections/Operations.jsx";
import Infrastructure from "./sections/Infrastructure.jsx";
import Governance from "./sections/Governance.jsx";
import Sustainability from "./sections/Sustainability.jsx";
import News from "./sections/News.jsx";
import Contact from "./sections/Contact.jsx";
import useRevealOnScroll from "./hooks/useRevealOnScroll.js";
import { brand, validateStaticData } from "./data/siteData.js";

export default function App() {
  const [theme, setTheme] = useState("light");
  useRevealOnScroll();

  const isDataValid = validateStaticData();
  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));

  const brandThemeVariables = {
    "--brand-blue": brand.colors.blue,
    "--brand-dark-blue": brand.colors.darkBlue,
    "--brand-red": brand.colors.red,
    "--brand-red-dark": brand.colors.redDark,
    "--brand-red-dark-hover": brand.colors.redDarkHover,
    "--brand-light": brand.colors.light,
    "--brand-ink": brand.colors.ink,
  };

  if (!isDataValid) {
    return <div className="p-6 text-sm text-red-700">Erro ao carregar os dados do site.</div>;
  }

  return (
    <main className={`theme-shell theme-${theme} min-h-screen bg-white text-slate-900`} style={brandThemeVariables}>
      <Header />
      <ThemeToggle theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Institutional />
      <Timeline />
      <Operations />
      <Infrastructure />
      <Governance />
      <Sustainability />
      <News />
      <Contact />
      <Footer />
    </main>
  );
}
