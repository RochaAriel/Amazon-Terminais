// Textos do site com base em informações públicas do grupo Amazon Aço e da ANTAQ.
// Fontes: material institucional da Amazon Aço (Rede Aço, 2024), Revista do Aço (out/2019)
// e Acórdão nº 320-2021-ANTAQ (jun/2021).

export const brand = {
  name: "Amazon Terminais",
  // Cores da marca: fonte única em src/index.css (@theme).
};

export const stats = [
  { label: "Terminal de Uso Privado", value: "TUP" },
  { label: "Operação contínua", value: "24/7" },
  { label: "Início do grupo em Manaus", value: "2003" },
  { label: "Localização do terminal", value: "Manaus" },
];

export const services = [
  {
    title: "Entrada e saída de veículos",
    description: "Controle de acesso de veículos, com validação de entrada e saída e registro das movimentações no terminal.",
    icon: "gate",
  },
  {
    title: "Integração com a indústria",
    description: "Ligação entre a operação portuária e o complexo industrial da Amazon Aço para organizar o fluxo de cargas do grupo.",
    icon: "route",
  },
  {
    title: "Acompanhamento das cargas",
    description: "Câmeras e sistemas de gestão apoiam o registro das movimentações e o acompanhamento da rotina operacional.",
    icon: "chart",
  },
];

// Ficha do terminal (seção Infraestrutura): [rótulo, valor]
export const terminalFacts = [
  ["Modalidade", "Terminal de Uso Privado (TUP)"],
  ["Autorização", "Contrato de Adesão nº 01/2018, Governo Federal"],
  ["Regulação", "ANTAQ"],
  ["Endereço", "Av. Puraquequara, 5.328, Puraquequara, Manaus/AM"],
  ["Operação", "24 horas, 7 dias por semana"],
];

export const news = [
  {
    date: "Junho de 2021",
    title: "ANTAQ reconhece a viabilidade da ampliação do terminal",
    text: "A agência aprovou a viabilidade locacional do projeto de ampliação da área do Terminal de Uso Privado no Puraquequara.",
  },
  {
    date: "2018",
    title: "Terminal de Uso Privado autorizado pelo Governo Federal",
    text: "O Contrato de Adesão nº 01/2018 autoriza a exploração do terminal portuário do grupo Amazon Aço em Manaus.",
  },
  {
    date: "Desde 2003",
    title: "Mais de duas décadas de Amazon Aço em Manaus",
    text: "A trajetória do grupo começou na distribuição de ferro e aço em Manaus, em março de 2003.",
  },
];

export const timeline = [
  {
    year: "2003",
    title: "Início em Manaus",
    text: "Em março de 2003, a Amazon Aço começa a atuar em Manaus como distribuidora de ferro e aço.",
  },
  {
    year: "2008",
    title: "Primeira indústria",
    text: "Inauguração da primeira unidade industrial, com cerca de 21 mil m², no Polo Industrial de Manaus.",
  },
  {
    year: "2013",
    title: "Nova estrutura no Puraquequara",
    text: "Transferência para a unidade industrial no Puraquequara, com cerca de 75 mil m² de área construída, próxima ao Encontro das Águas.",
  },
  {
    year: "2018",
    title: "Terminal de Uso Privado",
    text: "Assinatura do Contrato de Adesão nº 01/2018 com o Governo Federal para a exploração do terminal portuário.",
  },
  {
    year: "2021",
    title: "Viabilidade locacional reconhecida",
    text: "A ANTAQ reconhece a viabilidade locacional do projeto de ampliação da área do terminal.",
  },
  {
    year: "Hoje",
    title: "Amazon Terminais",
    text: "Terminal em operação 24 horas por dia, integrado ao complexo industrial e à logística do grupo.",
  },
];

export const governancePillars = [
  {
    title: "Atendimento",
    text: "Comunicar com clareza as informações necessárias ao atendimento de clientes e parceiros.",
    icon: "check",
  },
  {
    title: "Melhoria Contínua",
    text: "Revisar rotinas e indicadores para identificar ajustes nos processos do terminal.",
    icon: "chart",
  },
  {
    title: "Gestão por Processos",
    text: "Organizar as etapas de trabalho com procedimentos definidos e registros da operação.",
    icon: "gate",
  },
  {
    title: "Gestão de Riscos",
    text: "Identificar riscos à equipe, à carga e à infraestrutura para orientar medidas de prevenção.",
    icon: "shield",
  },
  {
    title: "Sustentabilidade",
    text: "Considerar os impactos ambientais da atividade portuária no planejamento da operação.",
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
