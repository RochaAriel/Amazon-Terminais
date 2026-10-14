// Valida os dados estáticos no build/CI, e não no navegador.
// Antes essa checagem rodava no render e derrubava o site inteiro se um array mudasse de tamanho.
import {
  stats,
  services,
  terminalFacts,
  news,
  timeline,
  governancePillars,
  contactTypes,
  navItems,
} from "../src/data/siteData.js";

const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function nonEmptyArray(value, name) {
  check(Array.isArray(value) && value.length > 0, `${name} deve ser um array não vazio.`);
}

nonEmptyArray(stats, "stats");
nonEmptyArray(services, "services");
nonEmptyArray(terminalFacts, "terminalFacts");
nonEmptyArray(news, "news");
nonEmptyArray(timeline, "timeline");
nonEmptyArray(governancePillars, "governancePillars");
nonEmptyArray(navItems, "navItems");

check(stats.every((item) => item.label && item.value), "stats: cada item precisa de label e value.");
check(services.every((item) => item.title && item.description && item.icon), "services: cada item precisa de title, description e icon.");
check(terminalFacts.every((row) => Array.isArray(row) && row.length === 2 && row[0] && row[1]), "terminalFacts: cada linha precisa de [rótulo, valor].");
check(news.every((item) => item.date && item.title && item.text), "news: cada item precisa de date, title e text.");
check(timeline.every((item) => item.year && item.title && item.text), "timeline: cada item precisa de year, title e text.");
check(governancePillars.every((item) => item.title && item.text && item.icon), "governancePillars: cada item precisa de title, text e icon.");
check(contactTypes.length >= 1, "contactTypes precisa de pelo menos 1 tipo.");
check(navItems.every((item) => item.label && item.href?.startsWith("#")), "navItems: cada item precisa de label e href âncora (#).");

const keys = (list, getKey) => list.map(getKey);
const hasDuplicates = (list) => new Set(list).size !== list.length;
check(!hasDuplicates(keys(services, (item) => item.title)), "services: títulos duplicados quebram a key do React.");
check(!hasDuplicates(keys(timeline, (item) => item.year)), "timeline: anos duplicados quebram a key do React.");
check(!hasDuplicates(keys(navItems, (item) => item.href)), "navItems: hrefs duplicados quebram a key do React.");
check(!hasDuplicates(keys(news, (item) => item.title)), "news: títulos duplicados quebram a key do React.");
check(!hasDuplicates(keys(terminalFacts, (row) => row[0])), "terminalFacts: rótulos duplicados quebram a key do React.");

if (errors.length > 0) {
  console.error(["Site data check failed:", ...errors.map((message) => `- ${message}`)].join("\n"));
  process.exit(1);
}

console.log("Site data check passed.");
