export const brand = {
  name: "Amazon Terminais",
  tagline: "Operações Portuárias",
  colors: {
    blue: "#1E2E7A",
    darkBlue: "#0D173F",
    red: "#ED1C24",
    redDark: "#B3261E",
    redDarkHover: "#9D1F19",
    light: "#F5F7FA",
    ink: "#0F172A",
  },
};

export const movementData = [
  { day: "Seg", carga: 38, gate: 22 },
  { day: "Ter", carga: 52, gate: 31 },
  { day: "Qua", carga: 46, gate: 28 },
  { day: "Qui", carga: 68, gate: 45 },
  { day: "Sex", carga: 74, gate: 53 },
  { day: "Sáb", carga: 59, gate: 41 },
  { day: "Dom", carga: 83, gate: 63 },
];

export const stats = [
  { label: "Operação contínua", value: "24/7" },
  { label: "Pátio monitorado", value: "100%" },
  { label: "Tempo médio de gate", value: "12 min" },
  { label: "Status operacional", value: "Online" },
];

export const services = [
  {
    title: "Operações Portuárias",
    description: "Gestão de atracação, movimentação, armazenagem e apoio à operação com foco em previsibilidade.",
    icon: "ship",
  },
  {
    title: "Gate e Controle",
    description: "Fluxo de veículos, segurança de acesso, registro operacional e validação de entrada e saída.",
    icon: "gate",
  },
  {
    title: "Logística Integrada",
    description: "Conexão estratégica entre terminal, clientes, modais e cadeia logística regional.",
    icon: "route",
  },
  {
    title: "Tecnologia Operacional",
    description: "Indicadores, painéis, rastreabilidade e suporte à decisão para uma operação moderna.",
    icon: "chart",
  },
];

export const operationRows = [
  ["Berço 01", "Atracado", "MV Amazon Star", "Estável"],
  ["Gate Principal", "Fluxo", "132 veículos", "Normal"],
  ["Pátio A3", "Ocupação", "78%", "Atenção"],
  ["Segurança", "CFTV/OCR", "Online", "Seguro"],
];

export const news = [
  "Amazon Terminais fortalece presença digital com nova experiência institucional",
  "Operação portuária amplia foco em segurança, eficiência e rastreabilidade",
  "Tecnologia e governança operacional como pilares para o crescimento logístico",
];

export const timeline = [
  {
    year: "2003",
    title: "Origem do grupo",
    text: "Consolidação de uma atuação regional voltada à qualidade, atendimento e crescimento sustentável.",
  },
  {
    year: "2008",
    title: "Expansão operacional",
    text: "Fortalecimento da estrutura logística e evolução dos processos para atender novas demandas.",
  },
  {
    year: "2013",
    title: "Modernização e crescimento",
    text: "Ampliação da capacidade, padronização de rotinas e desenvolvimento de novas frentes de negócio.",
  },
  {
    year: "Hoje",
    title: "Operações portuárias",
    text: "Terminal preparado para uma operação mais segura, integrada, rastreável e conectada ao futuro logístico da região.",
  },
];

export const governancePillars = [
  {
    title: "Satisfação do Cliente",
    text: "Atendimento com excelência, clareza nas informações e foco na continuidade operacional.",
    icon: "check",
  },
  {
    title: "Melhoria Contínua",
    text: "Evolução constante dos processos, indicadores e rotinas para elevar o padrão de entrega.",
    icon: "chart",
  },
  {
    title: "Gestão por Processos",
    text: "Procedimentos padronizados para garantir segurança, previsibilidade e controle operacional.",
    icon: "gate",
  },
  {
    title: "Gestão de Riscos",
    text: "Identificação, controle e mitigação de riscos ligados à operação, pessoas e infraestrutura.",
    icon: "shield",
  },
  {
    title: "Sustentabilidade",
    text: "Responsabilidade ambiental, boas práticas e compromisso com o desenvolvimento regional.",
    icon: "leaf",
  },
];

export const contactTypes = ["Comercial", "Operações", "SAC", "Trabalhe Conosco", "Fornecedores", "Institucional"];

export const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "A Empresa", href: "#institucional" },
  { label: "Trajetória", href: "#trajetoria" },
  { label: "Operações", href: "#operacoes" },
  { label: "Infraestrutura", href: "#infraestrutura" },
  { label: "Qualidade", href: "#qualidade" },
  { label: "Contato", href: "#contato" },
];

export function validateStaticData() {
  return (
    Array.isArray(movementData) &&
    movementData.length === 7 &&
    stats.length === 4 &&
    services.length === 4 &&
    operationRows.length === 4 &&
    news.length === 3 &&
    timeline.length === 4 &&
    governancePillars.length === 5 &&
    contactTypes.length >= 4 &&
    navItems.every((item) => item.label && item.href)
  );
}
