import { EUR_TO_BRL_AMOUNTS, BRL_TO_EUR_AMOUNTS, SITE_URL } from "@/data/seo";

function build() {
  const base = SITE_URL.replace(/\/$/, "");
  const urls: string[] = [];
  for (const a of EUR_TO_BRL_AMOUNTS) {
    urls.push(`${base}/pt-pt/euros-em-reais/${a}`);
    urls.push(`${base}/pt-br/euros-em-reais/${a}`);
  }
  for (const a of BRL_TO_EUR_AMOUNTS) {
    urls.push(`${base}/pt-pt/reais-em-euros/${a}`);
    urls.push(`${base}/pt-br/reais-em-euros/${a}`);
  }
  return urls;
}

if (require.main === module) {
  const list = build();
  console.log(`Total: ${list.length}`);
  for (const u of list) console.log(u);
}

export { build };

