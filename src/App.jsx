import { useState } from "react";
import Header from "./components/Header.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import Footer from "./components/Footer.jsx";
import MaintenanceModal from "./components/MaintenanceModal.jsx";
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

// Aviso de manutenção ligado por padrão. Para desligar no build: VITE_MAINTENANCE=false
const MAINTENANCE_ENABLED = import.meta.env.VITE_MAINTENANCE !== "false";
const MAINTENANCE_DISMISSED_KEY = "at-maintenance-dismissed";

function wasMaintenanceDismissed() {
  try {
    return window.sessionStorage.getItem(MAINTENANCE_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberMaintenanceDismissed() {
  try {
    window.sessionStorage.setItem(MAINTENANCE_DISMISSED_KEY, "1");
  } catch {
    // sessionStorage indisponível (aba anônima restrita, etc.): o aviso só volta a aparecer no próximo carregamento.
  }
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [isMaintenanceVisible, setIsMaintenanceVisible] = useState(() => MAINTENANCE_ENABLED && !wasMaintenanceDismissed());
  useRevealOnScroll();

  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));

  const closeMaintenance = () => {
    rememberMaintenanceDismissed();
    setIsMaintenanceVisible(false);
  };

  return (
    <main className={`theme-shell theme-${theme} min-h-screen bg-white text-slate-900`}>
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
      {isMaintenanceVisible ? <MaintenanceModal onClose={closeMaintenance} /> : null}
    </main>
  );
}
