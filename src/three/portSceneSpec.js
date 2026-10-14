// Especificação da cena do hero: navio graneleiro atracado no píer, com 3 guindastes de bordo
// descarregando bobinas de aço e contêineres.
// Modelo genérico e estilizado (sem foto de referência). Medidas em unidades da cena (~1 un = 10 m).
// Só dados: a construção dos objetos fica em createPortScene.js.

export const palette = {
  // Cores da marca (mesmos valores do @theme em src/index.css)
  brandBlue: "#1E2E7A",
  brandDarkBlue: "#0D173F",
  brandRed: "#ED1C24",
  brandRedDark: "#B3261E",
  brandLight: "#F5F7FA",
  // Neutros dos materiais da cena
  water: "#16255F",
  deck: "#3B4A6B",
  hatch: "#2A3760",
  hold: "#070C22",
  quay: "#6B7385",
  quayCap: "#525A6C",
  quayEdge: "#F5F7FA",
  fender: "#14171F",
  bollard: "#2B313C",
  steel: "#B9C1CC",
  darkSteel: "#3A4150",
  glass: "#0B1636",
  rope: "#D6CDBA",
  cable: "#E5E7EB",
  lamp: "#FFF4D6",
};

export const ship = {
  length: 16,
  beam: 3,
  // Casco: do fundo (abaixo da linha d'água) até o convés
  hullBottomY: -0.7,
  bootTopY: 0.15, // faixa vermelha até um pouco acima da linha d'água
  deckY: 0.95,
  bowLength: 2.4, // comprimento da proa afilada
  sternRadius: 0.6,
  bob: { amplitude: 0.03, speed: 0.6, roll: 0.005 },
  railing: { from: -5.5, to: 5.5, spacing: 0.42, height: 0.24 },
  superstructure: {
    x: -6.6, // popa
    blocks: [
      { w: 2.2, h: 0.55, d: 2.6 },
      { w: 1.9, h: 0.5, d: 2.3 },
      { w: 1.6, h: 0.45, d: 2.0 },
      { w: 1.2, h: 0.35, d: 2.9 }, // passadiço com asas
    ],
    funnel: { x: -7.35, w: 0.55, h: 0.9, d: 0.75 },
    lifeboatBlock: 1,
  },
  forecastle: { x: 6.7, length: 1.6, height: 0.35 },
  // 4 porões entre a superestrutura e a proa
  hatches: [
    { x: -4.2, length: 2.1, width: 2.0 },
    { x: -1.2, length: 2.1, width: 2.0 },
    { x: 1.8, length: 2.1, width: 2.0 },
    { x: 4.8, length: 2.1, width: 2.0 },
  ],
  coamingHeight: 0.22,
};

export const quay = {
  zStart: 1.85, // borda do píer (lado do costado de boreste)
  depth: 3.6,
  topY: 0.35,
  xFrom: -9.5,
  xTo: 10,
  fenders: [-6.5, -3.8, -1.1, 1.6, 4.3, 7.0],
  bollards: [-7.2, -4.4, -0.6, 2.4, 5.4, 8.3],
  lightMasts: [-4.6, 9.4],
  // Pilhas fixas de contêineres no fundo do píer (fora das vagas de descarga)
  staticStacks: [
    { x: -8.0, columns: 3, tiers: 2 },
    { x: 7.0, columns: 3, tiers: 2 },
  ],
};

// Cabos de amarração: ponto no convés (x, z) até o cabeço do píer (índice em quay.bollards)
export const mooring = [
  { from: [7.1, 1.15], bollard: 5 }, // lançante de proa
  { from: [6.0, 1.3], bollard: 3 }, // espringue de vante
  { from: [-5.9, 1.3], bollard: 2 }, // espringue de ré
  { from: [-7.7, 0.9], bollard: 0 }, // lançante de popa
];

export const gangway = { x: -5.15 };

// Ciclo de cada guindaste (segundos). Fases em fração do ciclo.
export const craneCycle = {
  duration: 11,
  phases: {
    hoistFromHold: [0.0, 0.14],
    slewToQuay: [0.14, 0.42],
    lowerToQuay: [0.42, 0.55],
    release: [0.55, 0.6],
    hoistEmpty: [0.6, 0.68],
    slewToHold: [0.68, 0.9],
    lowerToHold: [0.9, 1.0],
  },
  safeHookY: 2.7, // altura do gancho durante o giro
};

// 3 lanças entre os porões. Cada uma descarrega um porão vizinho.
// slew: ângulo do giro (rad) em volta do pedestal; luff: elevação da lança (rad).
export const cranes = [
  {
    id: "crane-aft",
    x: -2.7,
    cargo: "coil",
    hatchIndex: 0,
    pick: { slew: Math.PI, luff: 1.22 }, // sobre o porão de ré
    drop: { slew: Math.PI * 1.5, luff: 0.62 }, // sobre o píer
    phaseOffset: 0,
  },
  {
    id: "crane-mid",
    x: 0.3,
    cargo: "container",
    hatchIndex: 2,
    pick: { slew: Math.PI * 2, luff: 1.22 }, // sobre o porão de vante
    drop: { slew: Math.PI * 1.5, luff: 0.62 },
    phaseOffset: 0.36,
  },
  {
    id: "crane-fwd",
    x: 3.3,
    cargo: "coil",
    hatchIndex: 3,
    pick: { slew: Math.PI * 2, luff: 1.22 },
    drop: { slew: Math.PI * 1.5, luff: 0.62 },
    phaseOffset: 0.68,
  },
];

export const crane = {
  pedestal: { radius: 0.24, height: 0.9 },
  house: { w: 0.75, h: 0.5, d: 0.62 },
  boom: { length: 4.3, pivotOffsetX: 0.3, pivotY: 0.18, baseWidth: 0.3, tipWidth: 0.13, bays: 11 },
  hookBlock: { w: 0.16, h: 0.2, d: 0.12 },
};

export const cargo = {
  coil: { outerRadius: 0.3, innerRadius: 0.11, width: 0.42, sling: 0.3 },
  container: { length: 1.15, height: 0.46, width: 0.46, spreaderHang: 0.32 },
  containerColors: [palette.brandRed, palette.brandBlue, palette.brandLight, palette.brandRedDark],
  // Variações de giro na descarga: cada item cai numa vaga diferente do píer (~0,7 un entre vagas)
  slotSlewOffsets: [-0.28, -0.093, 0.093, 0.28],
};

export const camera = {
  fov: 30,
  focus: [0.9, 1.5, 1.7], // centro do enquadramento
  radius: 7.9, // raio da esfera que precisa caber na tela (o zoom se ajusta à proporção do canvas)
  // Celular: o píer é mais comprido que a esfera, então a câmera se afasta para não cortar a popa e a proa
  radiusNarrow: 10.4,
  narrowWidth: 340, // largura do canvas (px) em que vale radiusNarrow
  wideWidth: 640, // a partir desta largura vale radius (tablet e desktop não mudam)
  direction: [12.9, 10.8, 18.4], // de onde a câmera olha (só a direção importa)
  swayDegrees: 5, // oscilação lenta (desligada com prefers-reduced-motion)
  swaySpeed: 0.12,
};

export const render = {
  maxPixelRatio: 1.5,
  shadowMapSize: 2048,
  seed: 20261009, // texturas procedurais determinísticas
};
