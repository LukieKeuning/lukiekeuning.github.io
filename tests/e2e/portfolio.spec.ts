import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Profile } from "../../src/types/profile";

test("CV facts, portrait, contact links and original download work in both languages", async ({
  page,
}, testInfo) => {
  await page.goto("./");
  for (const language of ["nl", "en"] as const) {
    await page
      .getByRole("button", { name: language.toUpperCase(), exact: true })
      .click();
    await expect(page.locator("#education")).toContainText("Dalton Den Haag");
    await expect(page.locator(".qualifications")).toContainText(
      language === "nl"
        ? "Propedeuse Bouwkunde"
        : "Built Environment propaedeutic diploma",
    );
    await expect(page.locator(".qualifications")).toContainText("VOL-VCA");
    await expect(page.locator(".qualifications")).toContainText(
      language === "nl" ? "23 mrt 2026" : "23 Mar 2026",
    );
    await expect(page.locator("#experience .experience-row")).toHaveCount(4);
    await expect(
      page.locator("#contact a[href='mailto:lukiekeuning@gmail.com']"),
    ).toBeAttached();
    await expect(
      page.locator("#contact a[href='tel:0625403062']"),
    ).toBeAttached();
    const portrait = page.getByRole("img", {
      name:
        language === "nl"
          ? "Portret van Lukie Keuning"
          : "Portrait of Lukie Keuning",
      exact: true,
    });
    await portrait.scrollIntoViewIfNeeded();
    await expect(portrait).toBeVisible();
    await expect
      .poll(() =>
        portrait.evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBe(1400);
    await expect(page.locator("#about")).toContainText(
      language === "nl" ? "teamspeler" : "team player",
    );
    await expect(page.locator("#about")).toContainText(
      language === "nl" ? "optoppingen" : "adding storeys",
    );
    await page.locator("#about").screenshot({
      path: path.join(
        ".tools",
        `about-${testInfo.project.name}-${language}.png`,
      ),
    });
    await expect(page.locator("#interests .interest-card")).toHaveCount(4);
    await expect(
      page.locator("#interests .interest-card").nth(2),
    ).toContainText("Matty Jutte");
    await page.locator("#interests").screenshot({
      path: path.join(
        ".tools",
        `interests-${testInfo.project.name}-${language}.png`,
      ),
    });
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#home .text-button").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("lukie-keuning.pdf");
    expect(await readFile((await download.path())!)).toEqual(
      await readFile("public/cv/lukie-keuning.pdf"),
    );
  }
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(
    /Vlierboomstraat|19 jaar|tweedejaars|stageplek|070-/,
  );
});

test("reduced motion keeps the drawing static and preferences work without storage", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    });
  });
  await page.goto("./");
  await expect(page.locator(".building-svg")).toBeVisible();
  expect(
    await page
      .locator(".draw-phase")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await page.getByRole("button", { name: "Gebouw", exact: true }).click();
  await page.locator(".blueprint").screenshot({
    path: path.join(".tools", `building-${testInfo.project.name}-light.png`),
  });
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator(".hero-role")).toHaveText(
    "Built Environment Student",
  );
  await page.getByRole("button", { name: "Switch color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator(".blueprint").screenshot({
    path: path.join(".tools", `building-${testInfo.project.name}-dark.png`),
  });
  await page.getByRole("button", { name: "Blueprint", exact: true }).click();
  await expect(page.locator(".blueprint")).not.toHaveClass(/is-finished/);
});

test("Dutch content and illustration remain available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.locator(".hero-role")).toHaveText("Student Bouwkunde");
  await expect(page.locator(".building-svg")).toBeVisible();
  await expect(page.locator("#experience")).toContainText("Vinsa vastgoed");
  await context.close();
});

test("Dutch homepage, sample projects, illustration and persistent preferences", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("./");
  await expect(page.locator("h1")).toContainText("Lukie");
  await expect(page.locator("html")).toHaveAttribute("lang", "nl");
  await expect(page.locator("#projects .project-tile")).toHaveCount(3);
  await expect(page.locator("#contact")).toBeAttached();
  await expect(
    page.locator("#home").getByRole("link", { name: "Download CV" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Gebouw", exact: true }).click();
  await expect(page.locator(".blueprint")).toHaveClass(/is-finished/);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator(".hero-role")).toHaveText(
    "Built Environment Student",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#about h2")).toHaveText("An introduction.");
  await expect(page.locator("#education .institution").first()).toHaveText(
    "The Hague University of Applied Sciences",
  );
  await expect(page.locator("#experience h3").first()).toHaveText("Employee");
  const periods = page.locator("#experience .experience-period");
  await expect(periods.nth(0)).toContainText("Aug 2026");
  await expect(periods.nth(0)).toContainText("present");
  await expect(periods.nth(1)).toContainText("Aug 2024");
  await expect(periods.nth(1)).toContainText("Aug 2026");
  await expect(periods.nth(1)).not.toContainText("present");
  await expect(page.locator("#skills")).toContainText(
    "Working with older adults",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Switch color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(errors).toEqual([]);
});

test("responsive navigation and no horizontal overflow", async ({
  page,
  isMobile,
}) => {
  await page.goto("./");
  if (isMobile) {
    await page.getByRole("button", { name: "Menu openen of sluiten" }).click();
    await expect(page.locator("#navigation")).toBeVisible();
  }
  await page
    .locator("#navigation")
    .getByRole("link", { name: "Ervaring", exact: true })
    .click();
  await expect(page).toHaveURL(/#experience$/);
  if (isMobile) await expect(page.locator("#navigation")).not.toBeVisible();
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("skills building selects layers without hiding skills", async ({
  page,
}, testInfo) => {
  const layers: Record<string, string> = {
    professional: "foundation",
    architecture: "structure",
    software: "workshop",
    other: "finish",
  };
  async function configuredGroups(language: "nl" | "en") {
    const { profile } = JSON.parse(
      await readFile(
        new URL(`../../src/data/${language}.json`, import.meta.url),
        "utf8",
      ),
    ) as { profile: Profile };
    const order = Object.keys(layers);
    const rank = (id: string) =>
      order.includes(id) ? order.indexOf(id) : order.length;
    return profile.skills
      .filter((group) => group.items.some(Boolean))
      .sort((a, b) => rank(a.id) - rank(b.id));
  }
  const groups = await configuredGroups("nl");
  test.skip(groups.length === 0, "No skill groups configured");
  const expectedItems = groups.flatMap((group) => group.items.filter(Boolean));
  await page.goto("./");
  const skills = page.locator("#skills");
  await expect(skills.locator(".skills-building-card")).toHaveCount(
    groups.length,
  );
  await expect(skills.locator(".skills-building-card li")).toHaveText(
    expectedItems,
  );
  for (const [index, group] of groups.entries()) {
    const button = skills.locator(".skills-building-card button").nth(index);
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    if (layers[group.id]) {
      await expect(
        skills.locator(`.skills-layer.${layers[group.id]}`),
      ).toHaveClass(/is-active/);
    }
    await expect(skills.locator(".skills-building-card li")).toHaveText(
      expectedItems,
    );
  }
  const button = skills.locator(".skills-building-card button").first();
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await skills.locator(".skills-building").screenshot({
    path: path.join(".tools", `skills-${testInfo.project.name}-light.png`),
    style:
      ".site-header,.skip-link { visibility: hidden; } .skills-building-figure { position: static; }",
  });
  await page.getByRole("button", { name: "Wissel kleurthema" }).click();
  await page.getByRole("button", { name: "EN", exact: true }).click();
  const englishGroups = await configuredGroups("en");
  await expect(skills.locator(".skills-building-card")).toHaveCount(
    englishGroups.length,
  );
  await expect(skills.locator(".skills-building-card li")).toHaveText(
    englishGroups.flatMap((group) => group.items.filter(Boolean)),
  );
  await skills.scrollIntoViewIfNeeded();
  await skills.locator(".skills-building").screenshot({
    path: path.join(".tools", `skills-${testInfo.project.name}-dark.png`),
    style:
      ".site-header,.skip-link { visibility: hidden; } .skills-building-figure { position: static; }",
  });
});

test("static export contains facts and all referenced assets resolve", async ({
  request,
}) => {
  const response = await request.get("./");
  const html = await response.text();
  expect(html).toContain("Lukie");
  expect(html).toContain("Avonturia");
  const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("/") && !value.startsWith("//"));
  for (const asset of new Set(assets))
    expect((await request.get(asset)).status(), asset).toBe(200);
});

test("project details are centred, responsive and keyboard accessible", async ({
  page,
}, testInfo) => {
  await page.goto("./");
  for (const language of ["nl", "en"] as const) {
    await page
      .getByRole("button", { name: language.toUpperCase(), exact: true })
      .click();
    const tile = page.locator(".project-tile").first();
    await tile.click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.locator("h2")).toHaveText(
      language === "nl"
        ? "Wonen rond een binnentuin"
        : "Living around a courtyard",
    );
    await expect(modal.locator("img")).toHaveCount(1);
    await expect
      .poll(() =>
        modal
          .locator("img")
          .evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);
    const bounds = await modal.boundingBox();
    const viewport = page.viewportSize()!;
    expect(bounds).not.toBeNull();
    expect(
      Math.abs(bounds!.x + bounds!.width / 2 - viewport.width / 2),
    ).toBeLessThan(2);
    expect(
      Math.abs(bounds!.y + bounds!.height / 2 - viewport.height / 2),
    ).toBeLessThan(2);
    expect(
      await modal.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: path.join(
        ".tools",
        `project-dialog-${testInfo.project.name}-${language}.png`,
      ),
    });
    await page.keyboard.press("Escape");
    await expect(modal).toHaveCount(0);
    await expect(tile).toBeFocused();
    await tile.click();
    await page
      .getByRole("button", {
        name: language === "nl" ? "Sluiten" : "Close",
        exact: true,
      })
      .click();
    await expect(modal).toHaveCount(0);
  }
});
