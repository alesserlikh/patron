/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const pw = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const out = "docs/patron-migration/screenshots";
const results = [];
const check = async (name, fn) => {
  try {
    await fn();
    results.push({ name, status: "PASS" });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.message });
    console.log("FAIL", name, e.message.slice(0, 500));
  }
};
const snap = async (page, name) => {
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${name}.png` });
};
async function go(page, selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
}
async function close(page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  assert.equal(await page.locator("[data-overlay-root]").count(), 0);
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
}
(async () => {
  fs.mkdirSync(out, { recursive: true });
  for (const engine of (
    process.env.PATRON_ENGINES || "chromium,firefox,webkit"
  ).split(",")) {
    let browser;
    try {
      browser = await (
        engine === "firefox" && process.env.PATRON_FIREFOX_PLAYWRIGHT
          ? require(process.env.PATRON_FIREFOX_PLAYWRIGHT).firefox
          : pw[engine]
      ).launch({ headless: true });
    } catch (e) {
      results.push({
        name: engine + " availability",
        status: "UNAVAILABLE",
        error: e.message,
      });
      continue;
    }
    try {
      const widths =
        engine === "chromium"
          ? [
              [1440, 900],
              [390, 844],
              [360, 800],
              [768, 1024],
              [834, 1194],
              [1024, 768],
              [1194, 834],
              [1920, 1080],
            ]
          : [
              [1440, 900],
              [390, 844],
            ];
      for (const [width, height] of widths) {
        const context = await browser.newContext({
          viewport: { width, height },
          reducedMotion: "no-preference",
        });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto("http://localhost:3109", { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(3800);
        await check(`${engine} ${width} initial layout`, async () => {
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
            false,
          );
          assert.equal(await page.locator("h1").count(), 1);
          assert.equal(await page.locator(".srow").count(), 5);
          assert.equal(await page.locator(".mph>li").count(), 6);
          assert.equal(await page.locator(".cmedia").count(), 3);
          assert.equal(await page.evaluate(() => scrollY), 0);
          assert.equal(
            await page.locator("[id]").evaluateAll((es) => {
              const ids = es.map((e) => e.id);
              return ids.length - new Set(ids).size;
            }),
            0,
          );
        });
        if (![1440, 390].includes(width) || engine !== "chromium") {
          await check(`${engine} ${width} overlay / fallback`, async () => {
            await page.locator(".hero .cta").click();
            await page.locator("#brief-dialog").waitFor();
            await close(page);
            await go(page, "#services");
            await page.locator(".srow").first().click();
            await page.waitForTimeout(950);
            assert.equal(await page.locator(".svtrack.v1").count(), 1);
            assert.equal(
              await page.locator("#services .stk article.on").count(),
              1,
            );
          });
          await check(`${engine} ${width} console`, () =>
            assert.deepEqual(errors, []),
          );
          await context.close();
          continue;
        }
        await context.tracing.start({ screenshots: true, snapshots: true });
        await check(`${width} hero expand/collapse`, async () => {
          await page.locator(".hlens").click();
          assert.equal(await page.locator(".hero.hx").count(), 1);
          await snap(page, `${width}-hero-expanded`);
          await page.locator(".hctl button").click();
          assert.equal(await page.locator(".hero.hx").count(), 0);
        });
        if (width === 390) {
          await check("mobile menu / Escape / focus", async () => {
            const burger = page.locator(".hdr .burger");
            await burger.click();
            assert.equal(await page.locator("#mnav.open").count(), 1);
            assert.equal(
              await page.locator("#patron-page").evaluate((e) => e.inert),
              true,
            );
            await snap(page, "390-menu");
            await close(page);
            assert.equal(
              await burger.evaluate((e) => e === document.activeElement),
              true,
            );
            await burger.click();
            await page.locator('#mnav a[href="#services"]').click();
            await page.waitForTimeout(900);
            assert.equal(await page.locator("#mnav").count(), 0);
          });
        }
        await check(`${width} services / all 5 / keyboard`, async () => {
          await go(page, "#services");
          await snap(page, `${width}-services-overview`);
          await page.locator(".srow").first().click();
          await page.waitForTimeout(1000);
          for (let i = 0; i < 5; i++) {
            await page.locator(".seg5 [role=tab]").nth(i).click();
            await page.waitForTimeout(700);
            assert.equal(
              await page.locator("#services .stk article.on h3").textContent(),
              ["Стратегия", "Креатив", "События", "Продакшн", "Аналитика"][i],
            );
            await snap(page, `${width}-service-${i + 1}`);
          }
          assert.equal(
            await page
              .locator('#services button[aria-label="Следующее направление"]')
              .isDisabled(),
            true,
          );
          await page.locator(".seg5 [role=tab]").last().focus();
          await page.keyboard.press("Home");
          assert.equal(
            await page
              .locator(".seg5 [aria-selected=true]")
              .textContent()
              .then((x) => x.includes("01")),
            true,
          );
          await page.keyboard.press("ArrowRight");
          assert.equal(
            await page
              .locator(".seg5 [aria-selected=true]")
              .textContent()
              .then((x) => x.includes("02")),
            true,
          );
        });
        await check(`${width} services pointer drag / cancel`, async () => {
          const panel = page.locator(".svp");
          const b = await panel.boundingBox();
          await page.mouse.move(b.x + 200, b.y + 100);
          await page.mouse.down();
          await page.mouse.move(b.x + 310, b.y + 100, { steps: 8 });
          await page.mouse.up();
          await page.waitForTimeout(1000);
          assert.equal(await page.locator(".svtrack.v1").count(), 0);
          await panel.dispatchEvent("pointerdown", {
            pointerId: 42,
            clientX: b.x + 180,
            clientY: b.y + 100,
            button: 0,
          });
          await panel.dispatchEvent("pointercancel", { pointerId: 42 });
          assert.equal(await page.locator(".svp.drag").count(), 0);
        });
        await check(`${width} cases / dialogs / prefill`, async () => {
          await go(page, "#cases");
          for (let i = 0; i < 3; i++) {
            await page.locator(".segs button").nth(i).click();
            await page.waitForTimeout(650);
            await snap(page, `${width}-case-${i + 1}`);
            assert.equal(await page.locator(".cmedia.on").count(), 1);
            assert.equal(
              await page.locator(".cmedia.on .glass").isDisabled(),
              true,
            );
            await page.locator(".cmedia.on .cta").click();
            await snap(page, `${width}-case-dialog-${i + 1}`);
            assert.equal(await page.locator("#case-dialog").count(), 1);
            await close(page);
          }
          await page.locator(".cmedia.on .cta").click();
          await page.locator("#case-dialog .cta").click();
          await page.locator("#brief-dialog").waitFor();
          assert.equal(
            await page
              .locator("#brief-dialog .ctx")
              .textContent()
              .then((x) => x.includes("Holiday Ops")),
            true,
          );
          assert.equal(
            await page.locator("#brief-dialog select").inputValue(),
            "300 — 3 000",
          );
          await snap(page, `${width}-brief-prefill`);
          await close(page);
        });
        await check(`${width} all phases / cyclic keyboard`, async () => {
          await go(page, "#process");
          for (let i = 0; i < 6; i++) {
            const selector = width === 390 ? ".mph button" : ".tl .ph";
            await page.locator(selector).nth(i).click();
            await snap(page, `${width}-phase-dialog-${i + 1}`);
            assert.equal(await page.locator("#phase-dialog").count(), 1);
            await page.keyboard.press("ArrowRight");
            assert.equal(
              await page
                .locator("#phase-dialog .lbl.num")
                .last()
                .textContent()
                .then((x) => x.trim()),
              `${((i + 1) % 6) + 1} / 6`,
            );
            await close(page);
          }
        });
        await check(
          `${width} shared form / consent / validation / real transport contract`,
          async () => {
            await go(page, "#brief");
            let form = page.locator("#brief form");
            await form.locator("[name=name]").fill("Проверка");
            await form.locator("[name=contact]").fill("invalid");
            await form.locator("[name=consent]").check();
            await form.locator("button[type=submit].cta").click();
            assert.equal(
              await form.locator("[name=contact]").getAttribute("aria-invalid"),
              "true",
            );
            await snap(page, `${width}-form-error`);
            await form.locator("[name=contact]").fill("@patron_test");
            if (width === 1440)
              await form.locator("[name=company]").fill("Тестовая компания");
            await form.locator("[name=task]").fill("Только локальный тест");
            await form.locator("[name=consent]").uncheck();
            await form.evaluate((el) => el.requestSubmit());
            assert.equal(
              await form.locator(".fhint").textContent(),
              "Отметьте согласие, чтобы отправить заявку.",
            );
            await form.locator("[name=consent]").check();
            await page.locator(".hdr .hcta").click();
            form = page.locator("#brief-dialog form");
            assert.equal(
              await form.locator("[name=name]").inputValue(),
              "Проверка",
            );
            if (width === 1440)
              assert.equal(
                await form.locator("[name=company]").inputValue(),
                "Тестовая компания",
              );
            assert.equal(
              await page
                .locator("[id]")
                .evaluateAll(
                  (es) => es.length - new Set(es.map((e) => e.id)).size,
                ),
              0,
            );
            await form.locator("[name=contact]").focus();
            await page.keyboard.press("Shift+Tab");
            assert.equal(
              await page.evaluate(
                () => !!document.activeElement.closest("[data-overlay-root]"),
              ),
              true,
            );
            let payload;
            await page.route("**/api/lead", async (route) => {
              payload = route.request().postDataJSON();
              await new Promise((r) => setTimeout(r, 1000));
              await route.fulfill({
                status: 503,
                contentType: "application/json",
                body: JSON.stringify({
                  ok: false,
                  error: "delivery_unavailable",
                }),
              });
            });
            await form.locator("button[type=submit].cta").click();
            await snap(page, `${width}-form-sending`);
            await form.locator("[role=alert]").waitFor();
            await snap(page, `${width}-form-network`);
            assert.equal(payload.requireDelivery, true);
            assert.equal(payload.consent, true);
            if (width === 1440)
              assert.equal(payload.company, "Тестовая компания");
            assert.equal(
              await form.locator("[name=name]").inputValue(),
              "Проверка",
            );
            await page.unroute("**/api/lead");
            await page.route("**/api/lead", (route) =>
              route.fulfill({
                json: { ok: true, id: "MOCK-NOT-DELIVERED", delivered: false },
              }),
            );
            await form.locator("button[type=submit].cta").click();
            await page.waitForTimeout(300);
            assert.equal(
              await page.locator("#brief-dialog [role=status]").count(),
              0,
            );
            await page.unroute("**/api/lead");
            await page.route("**/api/lead", (route) =>
              route.fulfill({
                json: { ok: true, id: "MOCK-DELIVERY", delivered: true },
              }),
            );
            await form.locator("button[type=submit].cta").click();
            await page.locator("#brief-dialog [role=status]").waitFor();
            await snap(page, `${width}-form-success-mocked`);
            await close(page);
            assert.equal(await page.locator("#brief [role=status]").count(), 1);
          },
        );
        await check(`${width} reduced motion / assets / metadata`, async () => {
          await page.emulateMedia({ reducedMotion: "reduce" });
          await page.goto("http://localhost:3109");
          assert.equal(
            await page.title(),
            "PATRON — продюсерский центр для технологического бизнеса",
          );
          assert.equal(
            (await page.locator("link[rel=icon]").count()) > 0,
            true,
          );
          assert.equal(
            await page
              .locator('meta[property="og:image"]')
              .getAttribute("content")
              .then((x) => x.endsWith("/patron/cases/tankers-crowd.jpg")),
            true,
          );
          await go(page, "#agency");
          assert.equal(
            await page
              .locator(".man .wd")
              .first()
              .evaluate((e) => getComputedStyle(e).opacity),
            "1",
          );
          await snap(page, `${width}-reduced-motion`);
        });
        await check(`${width} console / hydration`, () =>
          assert.deepEqual(errors, []),
        );
        await context.tracing.stop({
          path: `docs/patron-migration/${width}-interaction-trace.zip`,
        });
        await context.close();
      }
    } finally {
      await browser.close();
    }
  }
  fs.writeFileSync(
    (process.env.PATRON_RESULTS_FILE || "docs/patron-migration/functional-results.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(
    JSON.stringify(
      results.filter((x) => x.status !== "PASS"),
      null,
      2,
    ),
  );
  if (results.some((x) => x.status === "FAIL")) process.exitCode = 1;
})().catch((e) => {
  fs.writeFileSync(
    (process.env.PATRON_RESULTS_FILE || "docs/patron-migration/functional-results.json"),
    JSON.stringify([...results, { status: "FAIL", error: e.message }], null, 2),
  );
  console.error(e);
  process.exitCode = 1;
});
