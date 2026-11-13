/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const ts = require("typescript");
require.extensions[".ts"] = (m, filename) =>
  m._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    filename,
  );
const { hero } = require("../content/patron/hero.ts");
const { lead } = require("../content/patron/lead.ts");
const { about } = require("../content/patron/about.ts");
const { stats } = require("../content/patron/stats.ts");
const { services, servicesCopy } = require("../content/patron/servises.ts");
const { cases, casesCopy } = require("../content/patron/cases.ts");
const { phases, processCopy } = require("../content/patron/process.ts");
const { ui, contacts, navigation } = require("../content/patron/ui.ts");
const { visitorCopy } = require("../content/patron/visitor.ts");
const { chromium } = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const base = process.env.PATRON_BASE_URL || "http://localhost:3000";
const out = "docs/patron-copy";
fs.mkdirSync(out, { recursive: true });
const results = [];
const normalize = (s) => s.replace(/\s+/g, " ").trim().toLocaleLowerCase("ru");
async function contains(locator, strings) {
  const actual = normalize(await locator.textContent());
  for (const expected of strings)
    assert.ok(actual.includes(normalize(expected)), `Missing: ${expected}`);
}
async function check(name, run) {
  try {
    await run();
    results.push({ name, status: "PASS" });
    console.log("PASS", name);
  } catch (error) {
    results.push({ name, status: "FAIL", error: error.stack });
    console.log("FAIL", name, error.message);
  }
}
async function close(p) {
  await p.keyboard.press("Escape");
  await p.locator("[data-overlay-root]").waitFor({ state: "detached" });
}
(async () => {
  await check(
    "Every screen, shared UI and visitor string has a live consumer",
    async () => {
      const files = fs
        .readdirSync("app/components/patron")
        .filter((f) => /\.tsx?$/.test(f));
      const source = files
        .map((f) => fs.readFileSync("app/components/patron/" + f, "utf8"))
        .join("\n");
      for (const [prefix, data] of [
        ["ui", ui],
        ["hero", hero],
        ["lead", lead],
        ["about", about],
        ["stats", stats],
        ["servicesCopy", servicesCopy],
        ["casesCopy", casesCopy],
        ["processCopy", processCopy],
        ["text", visitorCopy],
      ]) {
        for (const key of Object.keys(data).filter(
          (key) => typeof data[key] === "string",
        ))
          assert.ok(
            source.includes(prefix + "." + key),
            `Unused ${prefix}.${key}`,
          );
      }
    },
  );
  const browser = await chromium.launch();
  try {
    for (const width of [1440, 390]) {
      const c = await browser.newContext({ viewport: { width, height: 900 } });
      await c.addCookies([
        { name: "patron_cookie_choice", value: "essential", url: base },
      ]);
      const p = await c.newPage();
      await p.addInitScript(() =>
        sessionStorage.setItem("patron_geo_decision", "decided"),
      );
      await p.goto(base, { waitUntil: "networkidle" });
      await p.addStyleTag({
        content:
          "html,body,.pt{scroll-behavior:auto!important;scroll-snap-type:none!important}*,*::before,*::after{animation:none!important;transition:none!important}",
      });
      await check(
        `${width}: sections, manifesto, facts, contacts and navigation`,
        async () => {
          for (const n of navigation) {
            await contains(p.locator(`#${n.id} .lbl`).first().locator(".."), [
              n.label,
            ]);
            await contains(p.locator(`#legal nav a[href="#${n.id}"]`), [
              n.label,
            ]);
          }
          await contains(
            p.locator("#agency"),
            about.manifesto.map(([text]) => text),
          );
          await contains(p.locator(".hero"), [
            hero.eyebrow,
            ui.tagline,
            hero.event,
            hero.word,
            hero.description,
            ui.discussProject,
          ]);
          await contains(p.locator("#legal"), [
            contacts.email,
            contacts.telegram,
            ui.copyright,
            visitorCopy.settings,
          ]);
          assert.equal(
            await p.locator('#legal a[href^="mailto:"]').getAttribute("href"),
            "mailto:" + contacts.email,
          );
          await contains(p.locator('[aria-label="' + stats.label + '"]'), [
            stats.yearsValue,
            stats.yearsLabel,
            stats.countriesValue,
            stats.countriesLabel,
            stats.projectsValue,
            stats.projectsLabel,
            stats.guestsValue,
            stats.guestsLabel,
          ]);
          if (width === 390) {
            await p
              .getByRole("button", { name: ui.menuOpen, exact: true })
              .dispatchEvent("click");
            for (const n of navigation)
              await contains(p.locator(`.mlink[href="#${n.id}"]`), [n.label]);
            await close(p);
          } else
            await contains(
              p.locator(".hdr nav"),
              navigation.map((n) => n.label),
            );
        },
      );
      await check(`${width}: all five service details`, async () => {
        for (const s of services) {
          await p
            .locator("#services .srow")
            .filter({ hasText: s.title })
            .dispatchEvent("click");
          const article = p.locator("#services article[aria-hidden=false]");
          await article.waitFor({ state: "visible" });
          await contains(article, [
            s.title,
            s.lead,
            ...s.items,
            s.ctaLabel || servicesCopy.discussPrefix + s.cta,
            s.n + servicesCopy.totalSuffix,
          ]);
          await p
            .getByRole("button", {
              name: servicesCopy.backToOverview,
              exact: true,
            })
            .dispatchEvent("click");
        }
      });
      await check(`${width}: all three case cards and dialogs`, async () => {
        for (let i = 0; i < cases.length; i++) {
          const data = cases[i];
          await p.locator("#cases .seg").nth(i).dispatchEvent("click");
          const card = p.locator("#cases figure.on");
          await contains(card, [
            data.title,
            data.client,
            data.place,
            data.year,
            data.big,
            data.bigLabel,
            data.dur,
          ]);
          await card.locator(".cta").dispatchEvent("click");
          const dialog = p.locator("#case-dialog");
          await dialog.waitFor();
          await contains(dialog, [
            data.title,
            data.task,
            data.solution,
            data.numbersLabel,
            data.measure,
            ...data.numbers.flat(),
          ]);
          await close(p);
        }
      });
      await check(`${width}: all six process dialogs`, async () => {
        for (let i = 0; i < phases.length; i++) {
          const data = phases[i];
          await p.locator("#process .ph").nth(i).dispatchEvent("click");
          const dialog = p.locator("#phase-dialog");
          await dialog.waitFor();
          await contains(dialog, [
            data.title,
            data.time,
            data.goal,
            ...data.items,
            data.result,
            data.sync,
            `${i + 1} / ${phases.length}`,
          ]);
          await close(p);
        }
      });
      await check(
        `${width}: brief validation, delivery error and success copy`,
        async () => {
          await p.locator(".hero .cta").dispatchEvent("click");
          const form = p.locator("#brief-dialog form");
          await form.waitFor();
          await contains(form, [
            lead.namePlaceholder,
            lead.contactPlaceholder,
            lead.companyLabel,
            lead.guestsLabel,
            lead.taskLabel,
            lead.hint,
            ...lead.formats,
            ...lead.scales,
          ]);
          // The button stays disabled until required fields are ready. Exercise
          // the form's independent validation guard with a submit event.
          await form.dispatchEvent("submit");
          await form
            .getByText(lead.nameError, { exact: true })
            .first()
            .waitFor();
          await contains(form, [lead.nameError, lead.contactError]);
          await form.locator("input[name=name]").fill("Проверка");
          await form.locator("input[name=contact]").fill("@copy_check");
          await form.dispatchEvent("submit");
          await form
            .getByText(lead.consentError, { exact: true })
            .first()
            .waitFor();
          await contains(form, [lead.consentError]);
          await form.locator("input[type=checkbox]").check({ force: true });
          let attempts = 0;
          await p.route("**/api/lead", (r) =>
            ++attempts === 1
              ? r.fulfill({ status: 503, json: { ok: false } })
              : r.fulfill({
                  json: { ok: true, id: "copy-check", delivered: true },
                }),
          );
          await form.locator("button[type=submit]").dispatchEvent("click");
          await form
            .getByText(lead.deliveryUnavailable, { exact: true })
            .waitFor();
          await form
            .getByRole("button", { name: lead.retry, exact: true })
            .dispatchEvent("click");
          await p
            .locator("#brief-dialog")
            .getByText(lead.thanksPrefix + "Проверка" + lead.thanksSuffix, {
              exact: true,
            })
            .waitFor();
          await contains(p.locator("#brief-dialog"), [
            lead.replyPrefix + "@copy_check" + lead.replySuffix,
          ]);
          assert.equal(attempts, 2);
          await close(p);
        },
      );
      await check(`${width}: cookie banner and city dialog`, async () => {
        await p
          .locator(".visitor-settings button")
          .last()
          .dispatchEvent("click");
        const banner = p.locator(".cookie-banner");
        await banner.waitFor();
        await contains(banner, [
          visitorCopy.cookiesLabel,
          visitorCopy.cookiesLead,
          visitorCopy.cookiesDetail,
          visitorCopy.cookiesAllow,
          visitorCopy.cookiesNecessary,
        ]);
        await p
          .getByRole("button", {
            name: visitorCopy.cookiesNecessary,
            exact: true,
          })
          .click();
        await p
          .locator(".visitor-settings button")
          .first()
          .dispatchEvent("click");
        const dialog = p.locator(".visitor-sheet");
        await dialog.waitFor();
        await contains(dialog, [
          visitorCopy.locationTitle,
          visitorCopy.locationLead,
          visitorCopy.locationPrivacy,
          visitorCopy.locationFallback,
          visitorCopy.locate,
          visitorCopy.useMoscow,
          visitorCopy.attribution,
        ]);
        await p.screenshot({ path: `${out}/${width}-location.png` });
        await close(p);
      });
      await c.close();
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  if (results.some((r) => r.status === "FAIL")) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
