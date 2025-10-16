import { test, expect } from "@playwright/test";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getJsonLdTypes(page: any) {
  const handles = await page.locator('script[type="application/ld+json"]').all();
  const types: string[] = [];
  for (const h of handles) {
    const txt = await h.textContent();
    if (!txt) continue;
    try {
      const data = JSON.parse(txt);
      if (Array.isArray(data)) {
        data.forEach((d) => d && d["@type"] && types.push(String(d["@type"])));
      } else if (data && data["@type"]) {
        types.push(String(data["@type"]));
      }
    } catch {}
  }
  return types;
}

test.describe("SEO amount pages", () => {
  test("PT-PT BRL→EUR /pt-pt/reais-em-euros/100", async ({ page }) => {
    await page.goto(`${SITE}/pt-pt/reais-em-euros/100`, { waitUntil: "domcontentloaded" });
    const canonical = page.locator('link[rel="canonical"]');
    const altPt = page.locator('link[rel="alternate"][hreflang="pt-PT"]');
    const altBr = page.locator('link[rel="alternate"][hreflang="pt-BR"]');

    await expect(canonical).toHaveAttribute("href", new RegExp(`/pt-pt/reais-em-euros/100/?$`));
    await expect(altPt).toHaveAttribute("href", new RegExp(`/pt-pt/reais-em-euros/100/?$`));
    await expect(altBr).toHaveAttribute("href", new RegExp(`/pt-br/reais-em-euros/100/?$`));

    const h1 = await page.locator("h1").first().textContent();
    expect(h1).toMatch(/100\s*BRL/i);
    expect(h1).toMatch(/EUR/i);

    const types = await getJsonLdTypes(page);
    expect(types).toContain("FAQPage");
    expect(types).toContain("BreadcrumbList");
  });

  test("PT-BR EUR→BRL /pt-br/euros-em-reais/100", async ({ page }) => {
    await page.goto(`${SITE}/pt-br/euros-em-reais/100`, { waitUntil: "domcontentloaded" });
    const canonical = page.locator('link[rel="canonical"]');
    const altPt = page.locator('link[rel="alternate"][hreflang="pt-PT"]');
    const altBr = page.locator('link[rel="alternate"][hreflang="pt-BR"]');

    await expect(canonical).toHaveAttribute("href", new RegExp(`/pt-br/euros-em-reais/100/?$`));
    await expect(altPt).toHaveAttribute("href", new RegExp(`/pt-pt/euros-em-reais/100/?$`));
    await expect(altBr).toHaveAttribute("href", new RegExp(`/pt-br/euros-em-reais/100/?$`));

    const h1 = await page.locator("h1").first().textContent();
    expect(h1).toMatch(/100\s*EUR/i);
    expect(h1).toMatch(/BRL/i);

    const types = await getJsonLdTypes(page);
    expect(types).toContain("FAQPage");
    expect(types).toContain("BreadcrumbList");
  });
});

