import { test, expect } from "@playwright/test";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

test.describe("SEO homes", () => {
  test("PT-PT home tem canonical e alternates PT-PT/PT-BR", async ({ page }) => {
    await page.goto(`${SITE}/pt-pt/`, { waitUntil: "domcontentloaded" });
    const canonical = page.locator('link[rel="canonical"]');
    const altPt = page.locator('link[rel="alternate"][hreflang="pt-PT"]');
    const altBr = page.locator('link[rel="alternate"][hreflang="pt-BR"]');

    await expect(canonical).toHaveAttribute("href", new RegExp(`/pt-pt/?$`));
    await expect(altPt).toHaveAttribute("href", new RegExp(`/pt-pt/?$`));
    await expect(altBr).toHaveAttribute("href", new RegExp(`/pt-br/?$`));

    const title = await page.title();
    expect(title.toLowerCase()).toContain("conversor");
  });

  test("PT-BR home tem canonical e alternates PT-BR/PT-PT", async ({ page }) => {
    await page.goto(`${SITE}/pt-br/`, { waitUntil: "domcontentloaded" });
    const canonical = page.locator('link[rel="canonical"]');
    const altPt = page.locator('link[rel="alternate"][hreflang="pt-PT"]');
    const altBr = page.locator('link[rel="alternate"][hreflang="pt-BR"]');

    await expect(canonical).toHaveAttribute("href", new RegExp(`/pt-br/?$`));
    await expect(altPt).toHaveAttribute("href", new RegExp(`/pt-pt/?$`));
    await expect(altBr).toHaveAttribute("href", new RegExp(`/pt-br/?$`));
  });
});

