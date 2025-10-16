export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eurossemreais.com";

// 50 montantes — EUR (p/ EUR→BRL) e BRL (p/ BRL→EUR)
export const EUR_TO_BRL_AMOUNTS: number[] = [
  1, 5, 10, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 250, 300,
  350, 400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000,
  3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000, 20000,
  25000, 30000, 40000, 50000, 75000, 100000,
];

export const BRL_TO_EUR_AMOUNTS: number[] = [
  10, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 250, 300, 350,
  400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000, 3500,
  4000, 4500, 5000, 7000, 10000, 12000, 15000, 20000, 25000, 30000, 40000,
  50000, 70000, 100000, 150000, 200000, 300000, 500000, 750000,
];

// HEAD terms (sem placeholders)
export const KEYWORDS_PT_PT_EUR_TO_BRL = [
  "converter euros em reais",
  "euro para real",
  "conversor euro real",
  "câmbio euro real hoje",
  "taxa euro real hoje",
  "EUR para BRL",
  "cotação euro",
  "valor do euro hoje",
  "taxa de câmbio BCE",
];

export const KEYWORDS_PT_PT_BRL_TO_EUR = [
  "converter reais em euros",
  "real para euro",
  "conversor real euro",
  "câmbio real euro hoje",
  "taxa real euro hoje",
  "BRL para EUR",
  "cotação do euro",
  "valor do euro hoje",
  "taxa de câmbio BCE",
];

export const KEYWORDS_PT_BR_EUR_TO_BRL = [
  "converter euros em reais",
  "euro para real hoje",
  "conversor euro real",
  "câmbio euro real agora",
  "taxa euro real",
  "EUR para BRL",
  "cotação do euro",
  "valor do euro hoje",
];

export const KEYWORDS_PT_BR_BRL_TO_EUR = [
  "converter reais em euros",
  "real para euro hoje",
  "conversor real euro",
  "câmbio real euro agora",
  "taxa real euro",
  "BRL para EUR",
  "cotação do euro",
  "valor do euro hoje",
];

// Long-tails com {amount}
export const TEMPLATES_PT_PT_EUR_TO_BRL = [
  "quanto são {amount} euros em reais",
  "converter {amount}€ em reais",
  "valor de {amount} euros em reais hoje",
];

export const TEMPLATES_PT_PT_BRL_TO_EUR = [
  "quanto são {amount} reais em euros",
  "converter {amount} R$ em euros",
  "valor de {amount} reais em euros hoje",
];

export const TEMPLATES_PT_BR_EUR_TO_BRL = [
  "quanto é {amount} euros em reais",
  "converter {amount}€ para reais",
  "valor de {amount} euros em reais hoje",
];

export const TEMPLATES_PT_BR_BRL_TO_EUR = [
  "quanto é {amount} reais em euros",
  "converter {amount} R$ para euros",
  "valor de {amount} reais em euros hoje",
];

// Títulos (≤60c), Descrições (140–160c), H1
export function titlePtPtEurToBrl(amount: number) {
  return `Converter ${amount} EUR em BRL — câmbio hoje`;
}
export function titlePtBrBrlToEur(amount: number) {
  return `Converter ${amount} BRL em EUR — câmbio hoje`;
}
// Complementares
export function titlePtPtBrlToEur(amount: number) {
  return `Converter ${amount} BRL em EUR — câmbio hoje`;
}
export function titlePtBrEurToBrl(amount: number) {
  return `Converter ${amount} EUR em BRL — câmbio hoje`;
}
export function metaPtPtEurToBrl(amount: number) {
  return `Vê quanto são ${amount} euros em reais agora. Conversor EUR→BRL com dados do BCE, histórico 7/30/90/365 e exportar CSV.`;
}
export function metaPtBrBrlToEur(amount: number) {
  return `Veja quanto é R$ ${amount} em euros agora. Conversor BRL→EUR com dados do BCE, histórico 7/30/90/365 e exportar CSV.`;
}
export function metaPtPtBrlToEur(amount: number) {
  return `Vê quanto são R$ ${amount} em euros agora. Conversor BRL→EUR com dados do BCE, histórico 7/30/90/365 e exportar CSV.`;
}
export function metaPtBrEurToBrl(amount: number) {
  return `Veja quanto é ${amount} euros em reais agora. Conversor EUR→BRL com dados do BCE, histórico 7/30/90/365 e exportar CSV.`;
}
export function h1EurToBrl(amount: number) {
  return `Converter ${amount} EUR em BRL`;
}
export function h1BrlToEur(amount: number) {
  return `Converter ${amount} BRL em EUR`;
}

// Canonical/hreflang helpers
export function canonical(path: string) {
  return `${SITE_URL}${path}`;
}
export function alternates(ptPtPath: string, ptBrPath: string) {
  return {
    languages: {
      "pt-PT": canonical(ptPtPath),
      "pt-BR": canonical(ptBrPath),
    },
  } as const;
}

// Gera lista final de keywords (HEAD + long-tails)
export function keywords(
  locale: "pt-PT" | "pt-BR",
  dir: "EUR_TO_BRL" | "BRL_TO_EUR",
  amount: number
): string[] {
  const base =
    locale === "pt-PT"
      ? dir === "EUR_TO_BRL"
        ? KEYWORDS_PT_PT_EUR_TO_BRL
        : KEYWORDS_PT_PT_BRL_TO_EUR
      : dir === "EUR_TO_BRL"
      ? KEYWORDS_PT_BR_EUR_TO_BRL
      : KEYWORDS_PT_BR_BRL_TO_EUR;

  const tmpls =
    locale === "pt-PT"
      ? dir === "EUR_TO_BRL"
        ? TEMPLATES_PT_PT_EUR_TO_BRL
        : TEMPLATES_PT_PT_BRL_TO_EUR
      : dir === "EUR_TO_BRL"
      ? TEMPLATES_PT_BR_EUR_TO_BRL
      : TEMPLATES_PT_BR_BRL_TO_EUR;

  const longs = tmpls.map((t) => t.replace("{amount}", String(amount)));
  return Array.from(new Set([...base, ...longs]));
}

// Homes helpers
export function homeTitle(locale: "pt-PT" | "pt-BR") {
  return locale === "pt-PT"
    ? "Conversor de Euro para Real e Real para Euro — Hoje"
    : "Conversor de Euro para Real e Real para Euro — Hoje";
}

export function homeMeta(locale: "pt-PT" | "pt-BR") {
  return locale === "pt-PT"
    ? "Converte EUR↔BRL com taxa de hoje (dados BCE), histórico 7/30/90/365 e exportar CSV. Simples, rápido e sem ruído."
    : "Converta EUR↔BRL com a taxa de hoje (dados BCE), histórico 7/30/90/365 e exportar CSV. Simples, rápido e sem ruído.";
}

export function homePaths(locale: "pt-PT" | "pt-BR") {
  return locale === "pt-PT"
    ? { self: "/pt-pt/", alt: "/pt-br/" }
    : { self: "/pt-br/", alt: "/pt-pt/" };
}
