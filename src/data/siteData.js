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
  { label: "m² de área construída", value: "75 mil" },
];

export const services = [
  {
    title: "Gate e Controle",
    description: "Fluxo de veículos, segurança de acesso, registro operacional e validação de entrada e saída.",
    icon: "gate",
  },
  {
    title: "Logística Integrada",
    description: "Ligação direta entre o terminal, o complexo industrial do grupo e os clientes, com menos etapas entre o navio e o destino da carga.",
    icon: "route",
  },
  {
    title: "Tecnologia Operacional",
    description: "Monitoramento por câmeras, controle de acesso e sistemas de gestão para acompanhar cada movimento no terminal.",
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
    text: "Da distribuição de aço à indústria e ao terminal próprio, o grupo cresce junto com a Região Norte.",
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
    text: "Mudança para uma unidade maior e mais moderna, com cerca de 75 mil m² de área construída, próxima ao Encontro das Águas.",
  },
  {
    year: "2018",
    title: "Terminal de Uso Privado",
    text: "Assinatura do Contrato de Adesão nº 01/2018 com o Governo Federal para a exploração do terminal portuário.",
  },
  {
    year: "2021",
    title: "Ampliação aprovada",
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
