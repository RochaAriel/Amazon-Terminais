import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  palette,
  ship as shipSpec,
  quay as quaySpec,
  mooring as mooringSpec,
  gangway as gangwaySpec,
  craneCycle,
  cranes as craneSpecs,
  crane as craneSpec,
  cargo as cargoSpec,
  camera as cameraSpec,
  render as renderSpec,
} from "./portSceneSpec.js";

// Cena procedural (só código, sem modelos externos): navio atracado no píer com 3 guindastes
// descarregando bobinas e contêineres. Determinística: o estado depende só do tempo `t`,
// então o mesmo `t` sempre gera o mesmo quadro (prefers-reduced-motion e testes).

const CYCLES_PER_ROUND = cargoSpec.slotSlewOffsets.length;
const START_TIME = craneCycle.duration * 2.4; // começa com o píer já com carga
const UP = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const HOOK_BLOCK_OFFSET = 0.12; // bloco do gancho fica acima do ponto de içamento

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};
const lerp = (a, b, k) => a + (b - a) * k;
const phaseProgress = (f, [start, end]) => smooth((f - start) / (end - start));

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Helpers de geometria ----------
function mesh(geometry, material, name, { cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geometry, material);
  m.name = name;
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

function boxGeo(w, h, d, x = 0, y = 0, z = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

function cylGeo(radiusTop, radiusBottom, height, segments, { x = 0, y = 0, z = 0, rotX = 0, rotZ = 0 } = {}) {
  const g = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
  if (rotX) g.rotateX(rotX);
  if (rotZ) g.rotateZ(rotZ);
  g.translate(x, y, z);
  return g;
}

// Barra cilíndrica entre dois pontos (treliças, corrimãos, braços)
function strutGeo(a, b, radius, radial = 6) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const length = dir.length();
  const g = new THREE.CylinderGeometry(radius, radius, length, radial);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()));
  const mid = a.clone().add(b).multiplyScalar(0.5);
  g.translate(mid.x, mid.y, mid.z);
  return g;
}

function merge(geometries) {
  const merged = mergeGeometries(geometries, false);
  geometries.forEach((g) => g.dispose());
  return merged;
}

// ---------- Texturas procedurais (canvas, semente fixa) ----------
function canvasTexture(width, height, draw, { color = true, repeat = [1, 1] } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d"), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...repeat);
  return texture;
}

function concreteTexture(rand) {
  return canvasTexture(1024, 192, (ctx, w, h) => {
    ctx.fillStyle = palette.quay;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i += 1) {
      const shade = rand() < 0.5 ? 0 : 255;
      ctx.fillStyle = `rgba(${shade},${shade},${shade},${0.025 + rand() * 0.05})`;
      ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 2);
    }
    // Juntas de dilatação das placas do píer
    ctx.strokeStyle = "rgba(20,24,34,0.45)";
    ctx.lineWidth = 2;
    for (let x = 0; x <= w; x += w / 14) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, h * 0.52);
    ctx.lineTo(w, h * 0.52);
    ctx.stroke();
  });
}

function corrugationTexture() {
  return canvasTexture(128, 8, (ctx, w, h) => {
    for (let x = 0; x < w; x += 1) {
      const v = Math.round(128 + 110 * Math.sin((x / w) * Math.PI * 2 * 18));
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, 0, 1, h);
    }
  }, { color: false });
}

function waterNormalTexture() {
  const size = 256;
  // Ondas com números de onda inteiros: textura emenda sem costura
  const waves = [
    [1, 2, 0.6, 0.3],
    [3, -1, 0.35, 1.7],
    [-2, 3, 0.25, 2.9],
    [5, 1, 0.12, 0.8],
    [-4, -5, 0.08, 4.1],
  ];
  return canvasTexture(size, size, (ctx, w, h) => {
    const image = ctx.createImageData(w, h);
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const u = x / w;
        const v = y / h;
        let dx = 0;
        let dy = 0;
        waves.forEach(([kx, ky, amp, phase]) => {
          const c = Math.cos(Math.PI * 2 * (kx * u + ky * v) + phase) * amp * Math.PI * 2;
          dx += c * kx;
          dy += c * ky;
        });
        const n = new THREE.Vector3(-dx * 0.012, -dy * 0.012, 1).normalize();
        const i = (y * w + x) * 4;
        image.data[i] = (n.x * 0.5 + 0.5) * 255;
        image.data[i + 1] = (n.y * 0.5 + 0.5) * 255;
        image.data[i + 2] = (n.z * 0.5 + 0.5) * 255;
        image.data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
  }, { color: false, repeat: [14, 14] });
}

// Ambiente para reflexos metálicos: céu em degradê nas cores da marca + "softboxes" de luz
function buildEnvironment(renderer) {
  const envScene = new THREE.Scene();
  const sky = new THREE.SphereGeometry(50, 32, 16);
  const colors = [];
  const top = new THREE.Color("#3a4ea8");
  const horizon = new THREE.Color(palette.brandDarkBlue);
  const bottom = new THREE.Color("#04060f");
  const position = sky.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const k = position.getY(i) / 50;
    const c = k > 0 ? horizon.clone().lerp(top, k) : horizon.clone().lerp(bottom, -k);
    colors.push(c.r, c.g, c.b);
  }
  sky.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const skyMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
  envScene.add(new THREE.Mesh(sky, skyMaterial));

  const panels = [
    { pos: [0, 40, 12], size: [40, 20], intensity: 3.2, color: "#ffffff" },
    { pos: [38, 14, 22], size: [16, 12], intensity: 2.4, color: "#e8eeff" },
    { pos: [-30, 10, 30], size: [14, 8], intensity: 1.2, color: "#ffd9c7" },
  ];
  const extras = [];
  panels.forEach((p) => {
    const geometry = new THREE.PlaneGeometry(...p.size);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color).multiplyScalar(p.intensity), side: THREE.DoubleSide });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(...p.pos);
    panel.lookAt(0, 0, 0);
    envScene.add(panel);
    extras.push(geometry, material);
  });

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  sky.dispose();
  skyMaterial.dispose();
  extras.forEach((item) => item.dispose());
  return target;
}

// ---------- Casco ----------
function hullShape() {
  const half = shipSpec.beam / 2;
  const sternX = -shipSpec.length / 2;
  const bowX = shipSpec.length / 2;
  const r = shipSpec.sternRadius;
  const shoulder = bowX - shipSpec.bowLength;
  const s = new THREE.Shape();
  s.moveTo(sternX + r, -half);
  s.lineTo(shoulder, -half);
  s.quadraticCurveTo(bowX - 0.6, -half + 0.1, bowX, 0);
  s.quadraticCurveTo(bowX - 0.6, half - 0.1, shoulder, half);
  s.lineTo(sternX + r, half);
  s.quadraticCurveTo(sternX, half, sternX, half - r);
  s.lineTo(sternX, -half + r);
  s.quadraticCurveTo(sternX, -half, sternX + r, -half);
  return s;
}

function hullSegment(fromY, toY, materials, name) {
  const geometry = new THREE.ExtrudeGeometry(hullShape(), { depth: toY - fromY, bevelEnabled: false, curveSegments: 20 });
  geometry.rotateX(-Math.PI / 2); // extrusão vira altura (Y)
  const m = mesh(geometry, materials, name);
  m.position.y = fromY;
  return m;
}

function buildRailing(mats) {
  const group = new THREE.Group();
  group.name = "deck-railing";
  const { from, to, spacing, height } = shipSpec.railing;
  const z = shipSpec.beam / 2 - 0.04;
  const y0 = shipSpec.deckY;
  const count = Math.floor((to - from) / spacing) + 1;
  const stanchions = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.01, 0.01, height, 5), mats.light, count * 2);
  stanchions.name = "railing-stanchions";
  const m = new THREE.Matrix4();
  let i = 0;
  [-1, 1].forEach((side) => {
    for (let k = 0; k < count; k += 1) {
      m.makeTranslation(from + k * spacing, y0 + height / 2, side * z);
      stanchions.setMatrixAt(i, m);
      i += 1;
    }
  });
  group.add(stanchions);
  const rails = [];
  [-1, 1].forEach((side) => {
    [height, height * 0.5].forEach((h) => {
      rails.push(strutGeo(new THREE.Vector3(from, y0 + h, side * z), new THREE.Vector3(to, y0 + h, side * z), 0.012, 5));
    });
  });
  group.add(mesh(merge(rails), mats.light, "railing-rails", { receive: false }));
  return group;
}

function buildHatch(hatch, open, mats) {
  const group = new THREE.Group();
  group.name = open ? "hatch-open" : "hatch-closed";
  group.position.set(hatch.x, shipSpec.deckY, 0);
  const h = shipSpec.coamingHeight;
  const t = 0.08;
  const { length: L, width: W } = hatch;

  // Braçola com reforços verticais (stays) do lado de fora
  const parts = [
    boxGeo(L, h, t, 0, h / 2, -W / 2),
    boxGeo(L, h, t, 0, h / 2, W / 2),
    boxGeo(t, h, W, -L / 2, h / 2, 0),
    boxGeo(t, h, W, L / 2, h / 2, 0),
    boxGeo(L + 0.06, 0.03, 0.12, 0, h, -W / 2), // aba superior
    boxGeo(L + 0.06, 0.03, 0.12, 0, h, W / 2),
  ];
  for (let x = -L / 2 + 0.2; x <= L / 2 - 0.15; x += 0.35) {
    [-1, 1].forEach((side) => parts.push(boxGeo(0.025, h * 0.85, 0.09, x, h * 0.42, side * (W / 2 + 0.08))));
  }
  group.add(mesh(merge(parts), mats.hatch, "coaming"));

  // Tampa com nervuras transversais
  const coverGeo = (length, x, y) => {
    const g = [boxGeo(length, 0.1, W, x, y, 0)];
    for (let rx = x - length / 2 + 0.12; rx < x + length / 2 - 0.05; rx += 0.24) {
      g.push(boxGeo(0.035, 0.04, W - 0.08, rx, y + 0.07, 0));
    }
    return g;
  };

  if (open) {
    const hold = mesh(new THREE.PlaneGeometry(L - t, W - t), mats.hold, "hold-opening", { cast: false });
    hold.rotation.x = -Math.PI / 2;
    hold.position.y = 0.01;
    group.add(hold);
    // Tampas dobráveis recolhidas e empilhadas na ponta da braçola
    const stowed = [...coverGeo(0.5, L / 2 + 0.32, 0.12), ...coverGeo(0.5, L / 2 + 0.32, 0.26)];
    group.add(mesh(merge(stowed), mats.hatch, "hatch-covers-stowed"));
  } else {
    group.add(mesh(merge(coverGeo(L, 0, h + 0.05)), mats.hatch, "hatch-covers-closed"));
  }
  return group;
}

function buildSuperstructure(mats) {
  const spec = shipSpec.superstructure;
  const group = new THREE.Group();
  group.name = "superstructure";

  const frontPanes = [];
  const sidePanes = [];
  let y = shipSpec.deckY;
  const blockBases = [];
  spec.blocks.forEach((block, index) => {
    blockBases.push(y);
    const deckBlock = mesh(new THREE.BoxGeometry(block.w, block.h, block.d), mats.light, `accommodation-${index}`);
    deckBlock.position.set(spec.x, y + block.h / 2, 0);
    group.add(deckBlock);
    // Beiral de cada pavimento
    const eave = mesh(new THREE.BoxGeometry(block.w + 0.06, 0.03, block.d + 0.06), mats.lightTrim, `eave-${index}`, { receive: false });
    eave.position.set(spec.x, y + block.h, 0);
    group.add(eave);
    const wy = y + block.h * 0.56;
    const nFront = Math.max(1, Math.floor((block.d - 0.3) / 0.24));
    for (let k = 0; k < nFront; k += 1) {
      frontPanes.push([spec.x + block.w / 2 + 0.006, wy, -((nFront - 1) * 0.24) / 2 + k * 0.24]);
    }
    const nSide = Math.max(1, Math.floor((block.w - 0.3) / 0.28));
    [-1, 1].forEach((side) => {
      for (let k = 0; k < nSide; k += 1) {
        sidePanes.push([spec.x - ((nSide - 1) * 0.28) / 2 + k * 0.28, wy, side * (block.d / 2 + 0.006)]);
      }
    });
    y += block.h;
  });
  const topY = y;

  // Janelas (vidro escuro reflexivo)
  const addPanes = (list, geometry, name) => {
    const panes = new THREE.InstancedMesh(geometry, mats.glass, list.length);
    panes.name = name;
    const m = new THREE.Matrix4();
    list.forEach((p, i) => panes.setMatrixAt(i, m.makeTranslation(...p)));
    group.add(panes);
  };
  addPanes(frontPanes, new THREE.BoxGeometry(0.012, 0.14, 0.17), "windows-front");
  addPanes(sidePanes, new THREE.BoxGeometry(0.2, 0.14, 0.012), "windows-side");

  // Botes salva-vidas com turcos (davits) nos dois bordos
  const lb = spec.blocks[spec.lifeboatBlock];
  const lbY = blockBases[spec.lifeboatBlock] + 0.18;
  [-1, 1].forEach((side) => {
    const z = side * (lb.d / 2 + 0.17);
    const boatGeo = new THREE.CapsuleGeometry(0.1, 0.55, 4, 12);
    boatGeo.rotateZ(Math.PI / 2);
    boatGeo.scale(1, 0.85, 1);
    const boat = mesh(boatGeo, mats.red, `lifeboat-${side < 0 ? "port" : "starboard"}`);
    boat.position.set(spec.x, lbY, z);
    group.add(boat);
    const canopy = mesh(boxGeo(0.45, 0.06, 0.12), mats.light, "lifeboat-canopy");
    canopy.position.set(spec.x, lbY + 0.1, z);
    group.add(canopy);
    const davits = [];
    [-0.3, 0.3].forEach((dx) => {
      const base = new THREE.Vector3(spec.x + dx, lbY - 0.16, side * (lb.d / 2 + 0.01));
      const elbow = new THREE.Vector3(spec.x + dx, lbY + 0.2, side * (lb.d / 2 + 0.06));
      const tip = new THREE.Vector3(spec.x + dx, lbY + 0.2, z);
      davits.push(strutGeo(base, elbow, 0.018), strutGeo(elbow, tip, 0.016));
    });
    group.add(mesh(merge(davits), mats.darkSteel, "davits"));
  });

  // Chaminé com faixa vermelha, capa e escapes
  const { funnel } = spec;
  const fy = topY - 0.35;
  const funnelGeo = new THREE.BoxGeometry(funnel.w, funnel.h, funnel.d);
  const funnelMesh = mesh(funnelGeo, mats.blue, "funnel");
  funnelMesh.position.set(funnel.x, fy + funnel.h / 2, 0);
  const band = mesh(new THREE.BoxGeometry(funnel.w + 0.02, 0.18, funnel.d + 0.02), mats.red, "funnel-band");
  band.position.set(funnel.x, fy + funnel.h * 0.62, 0);
  const cap = mesh(new THREE.BoxGeometry(funnel.w + 0.04, 0.06, funnel.d + 0.04), mats.darkSteel, "funnel-cap");
  cap.position.set(funnel.x, fy + funnel.h + 0.03, 0);
  const pipes = mesh(merge([
    cylGeo(0.045, 0.045, 0.22, 10, { x: funnel.x - 0.08, y: fy + funnel.h + 0.12, z: -0.12 }),
    cylGeo(0.045, 0.045, 0.22, 10, { x: funnel.x - 0.08, y: fy + funnel.h + 0.12, z: 0.12 }),
  ]), mats.darkSteel, "exhaust-pipes");
  group.add(funnelMesh, band, cap, pipes);

  // Mastro do passadiço com radar giratório e luz de navegação
  const mastX = spec.x + 0.05;
  const mast = mesh(merge([
    cylGeo(0.028, 0.035, 0.85, 8, { x: mastX, y: topY + 0.425 }),
    boxGeo(0.03, 0.03, 0.8, mastX, topY + 0.62, 0),
    strutGeo(new THREE.Vector3(mastX, topY + 0.02, -0.3), new THREE.Vector3(mastX, topY + 0.55, 0), 0.012),
    strutGeo(new THREE.Vector3(mastX, topY + 0.02, 0.3), new THREE.Vector3(mastX, topY + 0.55, 0), 0.012),
  ]), mats.light, "mast");
  group.add(mast);
  const radar = new THREE.Group();
  radar.name = "radar";
  radar.position.set(mastX, topY + 0.88, 0);
  radar.add(mesh(cylGeo(0.04, 0.05, 0.06, 10), mats.darkSteel, "radar-base"));
  radar.add(mesh(boxGeo(0.07, 0.035, 0.6, 0, 0.05, 0), mats.light, "radar-antenna"));
  group.add(radar);
  const navLight = mesh(new THREE.SphereGeometry(0.03, 10, 8), mats.navLight, "nav-light", { cast: false, receive: false });
  navLight.position.set(mastX, topY + 0.97, 0);
  group.add(navLight);

  return { group, radar, navLight };
}

function buildForecastle(mats) {
  const fc = shipSpec.forecastle;
  const group = new THREE.Group();
  group.name = "forecastle";
  const deckTop = shipSpec.deckY + fc.height;
  const body = mesh(new THREE.BoxGeometry(fc.length, fc.height, shipSpec.beam * 0.62), mats.hullUpper, "forecastle-deck");
  body.position.set(fc.x, shipSpec.deckY + fc.height / 2, 0);
  group.add(body);
  // Molinetes (cabrestantes) das âncoras
  const windlass = mesh(merge([
    cylGeo(0.09, 0.09, 0.22, 14, { x: fc.x + 0.1, y: deckTop + 0.1, z: -0.38, rotX: Math.PI / 2 }),
    cylGeo(0.09, 0.09, 0.22, 14, { x: fc.x + 0.1, y: deckTop + 0.1, z: 0.38, rotX: Math.PI / 2 }),
    boxGeo(0.16, 0.08, 0.5, fc.x + 0.1, deckTop + 0.04, 0),
  ]), mats.darkSteel, "windlass");
  // Mastro de proa
  const foremast = mesh(cylGeo(0.022, 0.028, 0.7, 8, { x: fc.x + 0.55, y: deckTop + 0.35 }), mats.light, "foremast");
  group.add(windlass, foremast);
  // Escovéns (saída da corrente da âncora) nos dois bordos
  [-1, 1].forEach((side) => {
    const hawse = mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), mats.darkSteel, "hawse-pipe", { cast: false });
    hawse.position.set(shipSpec.length / 2 - 1.15, shipSpec.deckY - 0.18, side * (shipSpec.beam / 2 - 0.22));
    hawse.rotation.y = side * 0.55;
    group.add(hawse);
  });
  return group;
}

// ---------- Lança em treliça ----------
function latticeBoomGeometry() {
  const { length: L, baseWidth, tipWidth, bays } = craneSpec.boom;
  const corner = (t, sy, sz) => {
    const w = lerp(baseWidth, tipWidth, t) / 2;
    return new THREE.Vector3(t * L, sy * w, sz * w);
  };
  const parts = [];
  const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  corners.forEach(([sy, sz]) => parts.push(strutGeo(corner(0, sy, sz), corner(1, sy, sz), 0.022, 6)));
  // Faces: [cantos A e B que formam cada face]
  const faces = [
    [[1, -1], [1, 1]],
    [[-1, -1], [-1, 1]],
    [[-1, 1], [1, 1]],
    [[-1, -1], [1, -1]],
  ];
  for (let i = 0; i < bays; i += 1) {
    const t0 = i / bays;
    const t1 = (i + 1) / bays;
    faces.forEach(([a, b]) => {
      const [from, to] = i % 2 === 0 ? [a, b] : [b, a];
      parts.push(strutGeo(corner(t0, ...from), corner(t1, ...to), 0.011, 4)); // diagonal
      parts.push(strutGeo(corner(t1, ...a), corner(t1, ...b), 0.01, 4)); // travessa
    });
  }
  return merge(parts);
}

// ---------- Guindaste de bordo ----------
function buildCrane(spec, mats, boomGeometry) {
  const root = new THREE.Group();
  root.name = spec.id;
  root.position.set(spec.x, shipSpec.deckY, 0);

  const { radius: pr, height: ph } = craneSpec.pedestal;
  root.add(mesh(merge([
    cylGeo(pr, pr * 1.12, ph, 24, { y: ph / 2 }),
    cylGeo(pr * 1.45, pr * 1.5, 0.06, 24, { y: 0.03 }), // flange da base
    cylGeo(pr * 1.25, pr * 1.25, 0.05, 24, { y: ph - 0.025 }), // flange do topo
  ]), mats.light, "pedestal"));

  // Escada de acesso no pedestal
  const ladder = [];
  const lz = pr + 0.05;
  [-0.06, 0.06].forEach((dx) => ladder.push(strutGeo(new THREE.Vector3(dx, 0.05, lz), new THREE.Vector3(dx, ph, lz), 0.008, 4)));
  for (let ry = 0.12; ry < ph; ry += 0.1) {
    ladder.push(strutGeo(new THREE.Vector3(-0.06, ry, lz), new THREE.Vector3(0.06, ry, lz), 0.006, 4));
  }
  root.add(mesh(merge(ladder), mats.darkSteel, "pedestal-ladder", { receive: false }));

  root.add(mesh(cylGeo(pr * 1.2, pr * 1.2, 0.08, 24, { y: ph + 0.04 }), mats.darkSteel, "slewing-ring"));

  // Casaria giratória (slew)
  const house = new THREE.Group();
  house.name = "house";
  house.position.y = ph + 0.08;
  const { w, h, d } = craneSpec.house;
  house.add(mesh(merge([
    boxGeo(w, h, d, 0, h / 2, 0),
    boxGeo(w + 0.04, 0.03, d + 0.04, 0, h, 0), // beiral do teto
  ]), mats.light, "house-body"));
  const cab = mesh(boxGeo(0.26, 0.3, 0.24, w / 2 - 0.12, h * 0.5, d / 2 + 0.12), mats.light, "operator-cab");
  const cabGlass = mesh(merge([
    boxGeo(0.012, 0.16, 0.2, w / 2 + 0.012, h * 0.58, d / 2 + 0.12),
    boxGeo(0.2, 0.16, 0.012, w / 2 - 0.12, h * 0.58, d / 2 + 0.245),
  ]), mats.glass, "cab-glass", { cast: false });
  house.add(cab, cabGlass);
  // Guincho e respiros no teto
  house.add(mesh(merge([
    cylGeo(0.08, 0.08, d * 0.7, 14, { x: -w / 2 + 0.18, y: h + 0.1, rotX: Math.PI / 2 }),
    boxGeo(0.12, 0.08, 0.12, 0.12, h + 0.05, -0.15),
    boxGeo(0.12, 0.08, 0.12, 0.12, h + 0.05, 0.15),
  ]), mats.darkSteel, "winch-and-vents"));

  // Pórtico em "A" que segura o cabo de amantilho
  const apex = new THREE.Vector3(-0.04, h + 0.62, 0);
  house.add(mesh(merge([
    strutGeo(new THREE.Vector3(-w / 2 + 0.06, h, -d / 2 + 0.06), apex.clone().setZ(-0.07), 0.024),
    strutGeo(new THREE.Vector3(-w / 2 + 0.06, h, d / 2 - 0.06), apex.clone().setZ(0.07), 0.024),
    strutGeo(new THREE.Vector3(0.12, h, -d / 2 + 0.08), apex.clone().setZ(-0.07), 0.018),
    strutGeo(new THREE.Vector3(0.12, h, d / 2 - 0.08), apex.clone().setZ(0.07), 0.018),
    cylGeo(0.035, 0.035, 0.2, 10, { x: apex.x, y: apex.y, rotX: Math.PI / 2 }),
  ]), mats.boom, "a-frame"));
  const toppingAnchor = new THREE.Object3D();
  toppingAnchor.name = "topping-anchor";
  toppingAnchor.position.copy(apex);
  house.add(toppingAnchor);

  // Lança (luff): gira em Z a partir do pino na frente da casaria
  const boomPivot = new THREE.Group();
  boomPivot.name = "boom-pivot";
  boomPivot.position.set(craneSpec.boom.pivotOffsetX, craneSpec.boom.pivotY, 0);
  const L = craneSpec.boom.length;
  boomPivot.add(mesh(boomGeometry, mats.boom, "boom-lattice"));
  boomPivot.add(mesh(merge([
    cylGeo(0.035, 0.035, craneSpec.boom.baseWidth + 0.12, 10, { rotX: Math.PI / 2 }), // pino do pé da lança
    boxGeo(0.16, 0.12, craneSpec.boom.tipWidth + 0.06, L, 0, 0), // cabeça da lança
  ]), mats.darkSteel, "boom-pins"));
  boomPivot.add(mesh(merge([
    cylGeo(0.07, 0.07, 0.03, 16, { x: L + 0.04, y: -0.02, z: -0.035, rotX: Math.PI / 2 }),
    cylGeo(0.07, 0.07, 0.03, 16, { x: L + 0.04, y: -0.02, z: 0.035, rotX: Math.PI / 2 }),
  ]), mats.steel, "boom-sheaves"));
  const tip = new THREE.Object3D();
  tip.name = "boom-tip";
  tip.position.set(L + 0.04, -0.06, 0);
  boomPivot.add(tip);
  house.add(boomPivot);

  root.add(house);
  return { root, house, boomPivot, tip, toppingAnchor };
}

// Moitão (bloco do gancho) com polias e gancho
function hookGeometry() {
  const { w, h, d } = craneSpec.hookBlock;
  const y0 = HOOK_BLOCK_OFFSET;
  const hook = new THREE.TorusGeometry(0.05, 0.016, 8, 18, Math.PI * 1.45);
  hook.rotateZ(Math.PI * 0.8);
  hook.translate(0.01, 0.055, 0);
  return merge([
    boxGeo(w, h, 0.025, 0, y0 + h / 2, -d / 2),
    boxGeo(w, h, 0.025, 0, y0 + h / 2, d / 2),
    cylGeo(0.065, 0.065, d - 0.03, 16, { y: y0 + h * 0.62, rotX: Math.PI / 2 }),
    cylGeo(0.02, 0.02, 0.07, 8, { y: y0 - 0.02 }),
    hook,
  ]);
}

function spreaderGeometry() {
  const { length } = cargoSpec.container;
  const y = -cargoSpec.container.spreaderHang;
  const parts = [
    boxGeo(0.06, 0.06, length + 0.04, -0.17, y, 0),
    boxGeo(0.06, 0.06, length + 0.04, 0.17, y, 0),
    boxGeo(0.4, 0.07, 0.08, 0, y, -length / 2 + 0.05),
    boxGeo(0.4, 0.07, 0.08, 0, y, length / 2 - 0.05),
    boxGeo(0.12, 0.08, 0.16, 0, y + 0.02, 0),
  ];
  [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => parts.push(boxGeo(0.05, 0.05, 0.05, sx * 0.19, y - 0.045, sz * (length / 2 - 0.04)))));
  return merge(parts);
}

// ---------- Carga ----------
function coilGeometry() {
  const { outerRadius: R, innerRadius: r, width } = cargoSpec.coil;
  const half = width / 2;
  // Seção da bobina (anel com cantos chanfrados) girada em torno do eixo: bobina oca
  const points = [
    new THREE.Vector2(r, -half),
    new THREE.Vector2(R - 0.02, -half),
    new THREE.Vector2(R, -half + 0.02),
    new THREE.Vector2(R, half - 0.02),
    new THREE.Vector2(R - 0.02, half),
    new THREE.Vector2(r, half),
    new THREE.Vector2(r, -half),
  ];
  const geometry = new THREE.LatheGeometry(points, 40);
  geometry.rotateX(Math.PI / 2); // eixo da bobina ao longo de Z
  return geometry;
}

function createCargoMesh(type, shared, mats, { alongX = false } = {}) {
  if (type === "coil") {
    const m = mesh(shared.coil, mats.coil, "steel-coil");
    // Cintas de amarração em volta da bobina
    m.add(mesh(shared.coilBands, mats.darkSteel, "coil-bands", { cast: false }));
    return { mesh: m, height: cargoSpec.coil.outerRadius * 2, hang: cargoSpec.coil.sling };
  }
  const { height } = cargoSpec.container;
  const material = new THREE.MeshStandardMaterial({
    color: cargoSpec.containerColors[0],
    roughness: 0.55,
    metalness: 0.35,
    bumpMap: shared.corrugation,
    bumpScale: 1.2,
  });
  const m = mesh(alongX ? shared.containerAlongX : shared.container, material, "container");
  m.add(new THREE.LineSegments(alongX ? shared.containerEdgesAlongX : shared.containerEdges, mats.edge));
  m.add(mesh(alongX ? shared.cornerCastingsAlongX : shared.cornerCastings, mats.darkSteel, "corner-castings", { cast: false }));
  return { mesh: m, height, hang: cargoSpec.container.spreaderHang + 0.06 };
}

function setCargoColor(cargoItem, colorIndex) {
  if (cargoItem.mesh.name !== "container") return;
  const colors = cargoSpec.containerColors;
  cargoItem.mesh.material.color.set(colors[((colorIndex % colors.length) + colors.length) % colors.length]);
}

function cornerCastingsGeometry(w, h, l) {
  const parts = [];
  [-1, 1].forEach((sx) => [-1, 1].forEach((sy) => [-1, 1].forEach((sz) => {
    parts.push(boxGeo(0.05, 0.05, 0.05, sx * (w / 2 - 0.02), sy * (h / 2 - 0.02), sz * (l / 2 - 0.02)));
  })));
  return merge(parts);
}

// ---------- Píer ----------
function buildQuay(mats, shared) {
  const group = new THREE.Group();
  group.name = "quay";
  const width = quaySpec.xTo - quaySpec.xFrom;
  const cx = (quaySpec.xFrom + quaySpec.xTo) / 2;
  const bodyHeight = quaySpec.topY + 0.9;
  const body = mesh(new THREE.BoxGeometry(width, bodyHeight, quaySpec.depth), mats.quay, "quay-deck");
  body.position.set(cx, quaySpec.topY - bodyHeight / 2, quaySpec.zStart + quaySpec.depth / 2);
  group.add(body);

  // Viga de coroamento na borda + faixa de segurança
  const cap = mesh(new THREE.BoxGeometry(width, 0.14, 0.3), mats.quayCap, "quay-capping-beam");
  cap.position.set(cx, quaySpec.topY - 0.05, quaySpec.zStart + 0.15);
  const edge = mesh(new THREE.BoxGeometry(width, 0.01, 0.06), mats.quayEdge, "quay-edge-line", { cast: false });
  edge.position.set(cx, quaySpec.topY + 0.025, quaySpec.zStart + 0.24);
  group.add(cap, edge);

  // Defensas cilíndricas de borracha penduradas na face do píer
  group.add(mesh(merge(quaySpec.fenders.map((x) => cylGeo(0.14, 0.14, 0.95, 18, { x, y: quaySpec.topY - 0.32, z: quaySpec.zStart - 0.12, rotZ: Math.PI / 2 }))), mats.fender, "fenders"));

  // Cabeços de amarração (formato de cogumelo)
  const bollardProfile = [
    new THREE.Vector2(0, 0), new THREE.Vector2(0.09, 0), new THREE.Vector2(0.07, 0.04),
    new THREE.Vector2(0.06, 0.13), new THREE.Vector2(0.09, 0.16), new THREE.Vector2(0.09, 0.19), new THREE.Vector2(0, 0.19),
  ];
  group.add(mesh(merge(quaySpec.bollards.map((x) => {
    const g = new THREE.LatheGeometry(bollardProfile, 16);
    g.translate(x, quaySpec.topY + 0.03, quaySpec.zStart + 0.38);
    return g;
  })), mats.bollard, "bollards"));

  // Postes de iluminação do píer
  quaySpec.lightMasts.forEach((x, index) => {
    const z = quaySpec.zStart + quaySpec.depth - 0.35;
    group.add(mesh(merge([
      cylGeo(0.05, 0.07, 3.2, 10, { x, y: quaySpec.topY + 1.6, z }),
      boxGeo(0.5, 0.08, 0.24, x, quaySpec.topY + 3.2, z - 0.06),
      cylGeo(0.12, 0.14, 0.1, 12, { x, y: quaySpec.topY + 0.05, z }),
    ]), mats.darkSteel, `light-mast-${index}`));
    const lamp = mesh(boxGeo(0.44, 0.015, 0.18, x, quaySpec.topY + 3.155, z - 0.06), mats.lamp, `lamp-${index}`, { cast: false, receive: false });
    group.add(lamp);
  });

  // Pilhas fixas de contêineres no fundo do píer
  quaySpec.staticStacks.forEach((stack, si) => {
    const { length, height, width: cw } = cargoSpec.container;
    for (let c = 0; c < stack.columns; c += 1) {
      for (let tier = 0; tier < stack.tiers; tier += 1) {
        const item = createCargoMesh("container", shared, mats, { alongX: true });
        setCargoColor(item, si * 3 + c * 2 + tier);
        item.mesh.position.set(stack.x + (c - (stack.columns - 1) / 2) * (length + 0.06), quaySpec.topY + height / 2 + tier * (height + 0.01), quaySpec.zStart + quaySpec.depth - cw / 2 - 0.15);
        group.add(item.mesh);
      }
    }
  });
  return group;
}

function buildMooringAndGangway(mats) {
  const group = new THREE.Group();
  group.name = "mooring";
  const ropes = [];
  const bitts = [];
  mooringSpec.forEach(({ from: [x, z], bollard }) => {
    const start = new THREE.Vector3(x, shipSpec.deckY + 0.14, z);
    const end = new THREE.Vector3(quaySpec.bollards[bollard], quaySpec.topY + 0.15, quaySpec.zStart + 0.38);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y -= 0.28;
    ropes.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start, mid, end), 24, 0.014, 5, false));
    // Cabeços duplos no convés
    bitts.push(cylGeo(0.045, 0.045, 0.16, 10, { x: x - 0.07, y: shipSpec.deckY + 0.08, z }), cylGeo(0.045, 0.045, 0.16, 10, { x: x + 0.07, y: shipSpec.deckY + 0.08, z }));
  });
  group.add(mesh(merge(ropes), mats.rope, "mooring-lines", { receive: false }));

  // Prancha de embarque do convés até o píer
  const a = new THREE.Vector3(gangwaySpec.x, shipSpec.deckY + 0.06, shipSpec.beam / 2 - 0.12);
  const b = new THREE.Vector3(gangwaySpec.x + 1.15, quaySpec.topY + 0.02, quaySpec.zStart + 0.95);
  const dir = new THREE.Vector3().subVectors(b, a);
  const side = new THREE.Vector3().crossVectors(dir, UP).normalize().multiplyScalar(0.1);
  const board = new THREE.BoxGeometry(dir.length(), 0.025, 0.2);
  board.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(X_AXIS, dir.clone().normalize()));
  const mid = a.clone().add(b).multiplyScalar(0.5);
  board.translate(mid.x, mid.y, mid.z);
  const rail = [board];
  [1, -1].forEach((s) => {
    const off = side.clone().multiplyScalar(s);
    const ra = a.clone().add(off).add(new THREE.Vector3(0, 0.2, 0));
    const rb = b.clone().add(off).add(new THREE.Vector3(0, 0.2, 0));
    rail.push(strutGeo(ra, rb, 0.01, 5));
    for (let k = 0; k <= 4; k += 1) {
      const p = a.clone().lerp(b, k / 4).add(off);
      rail.push(strutGeo(p, p.clone().add(new THREE.Vector3(0, 0.2, 0)), 0.008, 4));
    }
  });
  group.add(mesh(merge(rail), mats.light, "gangway"));
  return { group, bitts: merge(bitts) };
}

// Posição no píer onde a lança deixa a carga (ponta da lança no giro/elevação de descarga)
function dropPoint(spec, slewOffset) {
  const slew = spec.drop.slew + slewOffset;
  const radius = craneSpec.boom.pivotOffsetX + craneSpec.boom.length * Math.cos(spec.drop.luff);
  return new THREE.Vector3(spec.x + Math.cos(slew) * radius, quaySpec.topY, -Math.sin(slew) * radius);
}

// Estado do guindaste no instante `t` (puro: só depende do tempo)
function craneStateAt(spec, cargoHeight, hang, t) {
  const position = t / craneCycle.duration + spec.phaseOffset;
  const cycle = Math.floor(position);
  const f = position - cycle;
  const p = craneCycle.phases;
  const slot = cycle % CYCLES_PER_ROUND;
  const slewOffset = cargoSpec.slotSlewOffsets[slot];

  const holdHookY = shipSpec.deckY - 0.08 + hang; // carga inteira abaixo da boca do porão
  const quayHookY = quaySpec.topY + cargoHeight + hang;
  const safeY = craneCycle.safeHookY;

  let slewK = 0; // 0 = posição de pega (porão), 1 = posição de descarga (píer)
  let hookY = safeY;
  let carrying = true;

  if (f < p.hoistFromHold[1]) {
    hookY = lerp(holdHookY, safeY, phaseProgress(f, p.hoistFromHold));
  } else if (f < p.slewToQuay[1]) {
    slewK = phaseProgress(f, p.slewToQuay);
  } else if (f < p.lowerToQuay[1]) {
    slewK = 1;
    hookY = lerp(safeY, quayHookY, phaseProgress(f, p.lowerToQuay));
  } else if (f < p.release[1]) {
    slewK = 1;
    hookY = quayHookY;
    carrying = false;
  } else if (f < p.hoistEmpty[1]) {
    slewK = 1;
    hookY = lerp(quayHookY, safeY, phaseProgress(f, p.hoistEmpty));
    carrying = false;
  } else if (f < p.slewToHold[1]) {
    slewK = 1 - phaseProgress(f, p.slewToHold);
    carrying = false;
  } else {
    hookY = lerp(safeY, holdHookY, phaseProgress(f, p.lowerToHold));
    carrying = false;
  }

  return {
    cycle,
    f,
    slot,
    carrying,
    slew: lerp(spec.pick.slew, spec.drop.slew + slewOffset, slewK),
    luff: lerp(spec.pick.luff, spec.drop.luff, slewK),
    hookY,
    shipInfluence: 1 - slewK, // perto do navio o gancho acompanha o balanço do casco
  };
}

function lineBetween(material, name, pairs = 1) {
  const points = Array.from({ length: pairs * 2 }, () => new THREE.Vector3());
  const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), material);
  line.name = name;
  line.frustumCulled = false;
  return line;
}

function setSegment(line, index, from, to) {
  const position = line.geometry.attributes.position;
  position.setXYZ(index * 2, from.x, from.y, from.z);
  position.setXYZ(index * 2 + 1, to.x, to.y, to.z);
  position.needsUpdate = true;
}

export function createPortScene(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, renderSpec.maxPixelRatio));
  // A cena usa só materiais nativos do Three.js (nenhum shader próprio). Ler o log de compilação só
  // gera ruído: no Windows (ANGLE/Direct3D) o compilador HLSL emite "warning X4122" para as constantes
  // internas do chunk `packing` do Three.js. Desligar a checagem também evita a sincronização com a GPU
  // a cada shader compilado, como recomenda a documentação do Three.js para produção.
  renderer.debug.checkShaderErrors = false;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const rand = mulberry32(renderSpec.seed);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(palette.brandDarkBlue, 28, 58);
  const envTarget = buildEnvironment(renderer);
  scene.environment = envTarget.texture;

  const textures = {
    concrete: concreteTexture(rand),
    corrugation: corrugationTexture(),
    water: waterNormalTexture(),
  };
  textures.concrete.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const std = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1, ...options });
  const mats = {
    hullUpper: std(palette.brandBlue, { roughness: 0.42, metalness: 0.35 }),
    hullLower: std(palette.brandRed, { roughness: 0.5, metalness: 0.25 }),
    sheer: std(palette.brandLight, { roughness: 0.4, metalness: 0.2 }),
    deck: std(palette.deck, { roughness: 0.82, metalness: 0.15 }),
    hatch: std(palette.hatch, { roughness: 0.55, metalness: 0.45 }),
    hold: new THREE.MeshBasicMaterial({ color: palette.hold }),
    light: std(palette.brandLight, { roughness: 0.4, metalness: 0.15 }),
    lightTrim: std("#d9dee8", { roughness: 0.45, metalness: 0.3 }),
    blue: std(palette.brandBlue, { roughness: 0.4, metalness: 0.35 }),
    red: std(palette.brandRed, { roughness: 0.45, metalness: 0.2 }),
    boom: std(palette.brandRedDark, { roughness: 0.36, metalness: 0.6 }),
    glass: std(palette.glass, { roughness: 0.08, metalness: 0.9 }),
    steel: std(palette.steel, { roughness: 0.25, metalness: 0.95 }),
    coil: std(palette.steel, { roughness: 0.22, metalness: 0.92 }),
    darkSteel: std(palette.darkSteel, { roughness: 0.35, metalness: 0.85 }),
    quay: std("#ffffff", { map: textures.concrete, roughness: 0.92, metalness: 0.02 }),
    quayCap: std(palette.quayCap, { roughness: 0.85 }),
    quayEdge: new THREE.MeshBasicMaterial({ color: palette.quayEdge }),
    fender: std(palette.fender, { roughness: 0.9 }),
    bollard: std(palette.bollard, { roughness: 0.4, metalness: 0.8 }),
    rope: std(palette.rope, { roughness: 0.9 }),
    lamp: new THREE.MeshBasicMaterial({ color: palette.lamp }),
    navLight: new THREE.MeshBasicMaterial({ color: palette.brandRed }),
    water: std(palette.water, { roughness: 0.16, metalness: 0.2, normalMap: textures.water, normalScale: new THREE.Vector2(0.55, 0.55) }),
    edge: new THREE.LineBasicMaterial({ color: "#0b1020", transparent: true, opacity: 0.5 }),
    cable: new THREE.LineBasicMaterial({ color: palette.cable }),
  };

  // Luz
  scene.add(new THREE.HemisphereLight("#cfd8ff", palette.brandDarkBlue, 0.6));
  const sun = new THREE.DirectionalLight("#fff6ea", 2.4);
  sun.position.set(8, 14, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(renderSpec.shadowMapSize, renderSpec.shadowMapSize);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 11, bottom: -11, near: 1, far: 45 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);

  // Água com ondulação (normal map procedural rolando devagar)
  const water = mesh(new THREE.PlaneGeometry(120, 120), mats.water, "water", { cast: false });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // Geometrias compartilhadas da carga
  const { width: cw, height: chh, length: cl } = cargoSpec.container;
  const shared = {
    coil: coilGeometry(),
    coilBands: merge([-0.12, 0.12].map((z) => {
      const g = new THREE.TorusGeometry(cargoSpec.coil.outerRadius + 0.004, 0.006, 6, 40);
      g.translate(0, 0, z);
      return g;
    })),
    container: new THREE.BoxGeometry(cw, chh, cl),
    containerAlongX: new THREE.BoxGeometry(cl, chh, cw),
    corrugation: textures.corrugation,
  };
  shared.containerEdges = new THREE.EdgesGeometry(shared.container);
  shared.containerEdgesAlongX = new THREE.EdgesGeometry(shared.containerAlongX);
  shared.cornerCastings = cornerCastingsGeometry(cw, chh, cl);
  shared.cornerCastingsAlongX = cornerCastingsGeometry(cl, chh, cw);

  scene.add(buildQuay(mats, shared));

  // Navio
  const shipGroup = new THREE.Group();
  shipGroup.name = "ship";
  shipGroup.add(hullSegment(shipSpec.hullBottomY, shipSpec.bootTopY, [mats.hullLower, mats.hullLower], "hull-boot-top"));
  shipGroup.add(hullSegment(shipSpec.bootTopY, shipSpec.deckY, [mats.deck, mats.hullUpper], "hull-topsides"));
  const sheer = hullSegment(shipSpec.deckY - 0.1, shipSpec.deckY - 0.05, [mats.sheer, mats.sheer], "hull-sheer-strake");
  sheer.scale.set(1.004, 1, 1.02);
  sheer.castShadow = false;
  shipGroup.add(sheer);
  shipGroup.add(buildRailing(mats));
  shipGroup.add(buildForecastle(mats));
  const usedHatches = new Set(craneSpecs.map((spec) => spec.hatchIndex));
  shipSpec.hatches.forEach((hatch, index) => shipGroup.add(buildHatch(hatch, usedHatches.has(index), mats)));
  const superstructure = buildSuperstructure(mats);
  shipGroup.add(superstructure.group);
  const mooring = buildMooringAndGangway(mats);
  shipGroup.add(mesh(mooring.bitts, mats.darkSteel, "deck-bitts"));
  scene.add(mooring.group);

  const boomGeometry = latticeBoomGeometry();
  const cranes = craneSpecs.map((spec) => {
    const parts = buildCrane(spec, mats, boomGeometry);
    shipGroup.add(parts.root);
    return { spec, ...parts };
  });
  scene.add(shipGroup);

  // Gancho, cabos e carga (no espaço do mundo: a carga vai do navio para o píer)
  shared.hook = hookGeometry();
  shared.spreader = spreaderGeometry();
  const tipWorld = new THREE.Vector3();
  const anchorWorld = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();

  cranes.forEach((c, craneIndex) => {
    const hook = new THREE.Group();
    hook.name = "hook";
    hook.add(mesh(shared.hook, mats.darkSteel, "hook-block"));
    const isContainer = c.spec.cargo === "container";
    if (isContainer) {
      hook.add(mesh(shared.spreader, mats.boom, "spreader"));
      const wires = lineBetween(mats.cable, "spreader-wires", 4);
      const y = -cargoSpec.container.spreaderHang + 0.03;
      [[-0.17, -0.5], [0.17, -0.5], [-0.17, 0.5], [0.17, 0.5]].forEach(([x, z], i) => setSegment(wires, i, new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)));
      hook.add(wires);
    }
    scene.add(hook);

    const hoistWires = lineBetween(mats.cable, "hoist-wires", 2);
    const toppingWires = lineBetween(mats.cable, "topping-wires", 2);
    scene.add(hoistWires, toppingWires);

    const hooked = createCargoMesh(c.spec.cargo, shared, mats);
    scene.add(hooked.mesh);
    let slings = null;
    if (!isContainer) {
      slings = lineBetween(mats.cable, "slings", 2);
      setSegment(slings, 0, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -cargoSpec.coil.sling, -0.16));
      setSegment(slings, 1, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -cargoSpec.coil.sling, 0.16));
      hook.add(slings);
    }

    // Vagas no píer (uma carga por vaga, reaproveitadas a cada rodada)
    const slots = cargoSpec.slotSlewOffsets.map((offset) => {
      const item = createCargoMesh(c.spec.cargo, shared, mats);
      const point = dropPoint(c.spec, offset);
      item.mesh.position.set(point.x, point.y + item.height / 2, point.z);
      item.mesh.visible = false;
      scene.add(item.mesh);
      return item;
    });

    Object.assign(c, { craneIndex, hook, hoistWires, toppingWires, hooked, slings, slots });
  });

  // Câmera: enquadra uma esfera em volta da cena; o zoom se ajusta à proporção do canvas
  const camera = new THREE.PerspectiveCamera(cameraSpec.fov, 1, 0.1, 120);
  const focus = new THREE.Vector3(...cameraSpec.focus);
  const viewDir = new THREE.Vector3(...cameraSpec.direction).normalize();
  let viewDistance = 30;

  function update(elapsed) {
    const t = START_TIME + elapsed;

    // Balanço suave do navio atracado
    const bob = Math.sin(t * shipSpec.bob.speed) * shipSpec.bob.amplitude;
    shipGroup.position.y = bob;
    shipGroup.rotation.x = Math.sin(t * shipSpec.bob.speed * 0.8) * shipSpec.bob.roll;
    superstructure.radar.rotation.y = t * 1.3;
    superstructure.navLight.visible = Math.sin(t * 3.2) > -0.2;
    textures.water.offset.set(t * 0.0045, t * 0.003);

    const sway = reducedMotion ? 0 : THREE.MathUtils.degToRad(cameraSpec.swayDegrees) * Math.sin(t * cameraSpec.swaySpeed);
    camera.position.copy(focus).add(viewDir.clone().applyAxisAngle(UP, sway).multiplyScalar(viewDistance));
    camera.lookAt(focus);

    shipGroup.updateMatrixWorld(true);
    cranes.forEach((c) => {
      const { height: cargoHeight, hang } = c.hooked;
      const state = craneStateAt(c.spec, cargoHeight, hang, t);
      c.house.rotation.y = state.slew;
      c.boomPivot.rotation.z = state.luff;
      c.house.updateMatrixWorld(true);
      c.tip.getWorldPosition(tipWorld);
      c.toppingAnchor.getWorldPosition(anchorWorld);

      const hookY = state.hookY + bob * state.shipInfluence;
      c.hook.position.set(tipWorld.x, hookY, tipWorld.z);
      const blockTop = hookY + HOOK_BLOCK_OFFSET + craneSpec.hookBlock.h * 0.62;
      // Dois ramais do cabo de içamento e dois do amantilho
      setSegment(c.hoistWires, 0, tmpA.set(tipWorld.x, tipWorld.y, tipWorld.z - 0.035), tmpB.set(tipWorld.x, blockTop, tipWorld.z - 0.035));
      setSegment(c.hoistWires, 1, tmpA.set(tipWorld.x, tipWorld.y, tipWorld.z + 0.035), tmpB.set(tipWorld.x, blockTop, tipWorld.z + 0.035));
      setSegment(c.toppingWires, 0, anchorWorld, tipWorld);
      setSegment(c.toppingWires, 1, tmpA.copy(anchorWorld).add(new THREE.Vector3(0, 0.03, 0)), tmpB.copy(tipWorld).add(new THREE.Vector3(0, 0.05, 0)));

      // Cor do contêiner muda a cada ciclo (ciclo atual = carga no gancho)
      setCargoColor(c.hooked, state.cycle + c.craneIndex);
      c.hooked.mesh.visible = state.carrying;
      if (c.slings) c.slings.visible = state.carrying;
      c.hooked.mesh.position.set(tipWorld.x, hookY - hang - cargoHeight / 2, tipWorld.z);

      // Cargas no píer: rodada atual até o ciclo corrente; a rodada anterior some no início da nova
      const round = Math.floor(state.cycle / CYCLES_PER_ROUND);
      const placedThisRound = state.slot + (state.carrying || state.f < craneCycle.phases.release[0] ? 0 : 1);
      const clearing = state.slot === 0 && state.f < 0.3;
      c.slots.forEach((item, index) => {
        const fromPreviousRound = index >= placedThisRound;
        const cycleOfItem = fromPreviousRound ? (round - 1) * CYCLES_PER_ROUND + index : round * CYCLES_PER_ROUND + index;
        let scale = 1;
        let visible = !fromPreviousRound;
        if (fromPreviousRound && clearing) {
          visible = true;
          scale = 1 - smooth(state.f / 0.3);
        }
        item.mesh.visible = visible && scale > 0.02 && cycleOfItem >= 0;
        item.mesh.scale.setScalar(Math.max(scale, 0.001));
        setCargoColor(item, cycleOfItem + c.craneIndex);
      });
    });

    renderer.render(scene, camera);
  }

  function resize(width, height) {
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    const vFov = THREE.MathUtils.degToRad(cameraSpec.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const narrowK = clamp01((cameraSpec.wideWidth - width) / (cameraSpec.wideWidth - cameraSpec.narrowWidth));
    const radius = lerp(cameraSpec.radius, cameraSpec.radiusNarrow, narrowK);
    viewDistance = radius / Math.sin(Math.min(vFov, hFov) / 2);
  }

  function dispose() {
    const disposedTextures = new Set();
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      const list = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
      list.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value && value.isTexture && !disposedTextures.has(value)) {
            value.dispose();
            disposedTextures.add(value);
          }
        });
        material.dispose();
      });
    });
    Object.values(shared).forEach((item) => item && item.dispose && item.dispose());
    Object.values(textures).forEach((texture) => texture.dispose());
    envTarget.dispose();
    // Devolve o contexto WebGL ao estado padrão (ex.: UNPACK_FLIP_Y deixado ligado pelas CanvasTextures).
    // Sem isso, um novo renderer no mesmo canvas (StrictMode em dev, remontagem) gera o aviso
    // "texImage3D: FLIP_Y or PREMULTIPLY_ALPHA isn't allowed for uploading 3D textures".
    renderer.resetState();
    renderer.dispose();
  }

  return { update, resize, dispose, scene };
}
