/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const playwright = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const base = process.env.PATRON_BASE_URL || "http://localhost:3000";
const engine = process.env.PATRON_VISITOR_ENGINE || "chromium";
const driver =
  engine === "firefox"
    ? require("C:/Users/aless/AppData/Local/npm-cache/_npx/d537ee5ee2a13f03/node_modules/playwright")
        .firefox
    : playwright[engine];
const out = `docs/patron-cookie-banner/${engine}`;
fs.mkdirSync(out, { recursive: true });
const results = [];
(async () => {
  const browser = await driver.launch();
  try {
    for (const [width, height] of engine === "chromium"
      ? [
          [1440, 900],
          [1920, 1080],
          [1194, 834],
          [834, 1194],
          [768, 1024],
          [390, 844],
          [360, 800],
          [320, 667],
          [844, 390],
        ]
      : [
          [1440, 900],
          [390, 844],
        ]) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      try {
        await page.addInitScript(() =>
          sessionStorage.setItem("patron_geo_decision", "decided"),
        );
        await page.goto(base, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const banner = page.getByRole("region", {
          name: "Cookies",
          exact: true,
        });
        await banner.waitFor();
        await page.waitForTimeout(500);
        const geometry = await banner.evaluate((e) => {
          const r = e.getBoundingClientRect();
          return {
            x: r.x,
            y: r.y,
            right: r.right,
            bottom: r.bottom,
            height: r.height,
            overflow: e.scrollWidth > e.clientWidth,
            viewport: innerHeight,
          };
        });
        assert.ok(
          geometry.x >= 11 && geometry.right <= width - 11,
          JSON.stringify(geometry),
        );
        assert.ok(
          Math.abs(height - geometry.bottom - 12) <= 2,
          JSON.stringify(geometry),
        );
        assert.equal(geometry.overflow, false);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        assert.equal(await page.locator(".veil").count(), 0);
        assert.equal(await page.locator("[aria-modal=true]").count(), 0);
        assert.equal(
          await page.locator("#patron-page").evaluate((e) => e.inert),
          false,
        );
        assert.equal(
          await page.evaluate(() => document.body.style.overflow),
          "",
        );
        assert.equal(await banner.locator("h2").count(), 0);
        assert.equal(
          await banner
            .getByText("Необходимые cookies сохраняют ваш выбор настроек.", {
              exact: true,
            })
            .count(),
          1,
        );
        assert.equal(
          await banner
            .textContent()
            .then(
              (t) =>
                t.includes("Дополнительно можно") ||
                t.includes("Настройки можно изменить"),
            ),
          false,
        );
        for (const button of await banner.locator("button").all()) {
          const r = await button.boundingBox();
          assert.ok(
            r.x >= 0 &&
              r.x + r.width <= width &&
              r.y >= 0 &&
              r.y + r.height <= height,
            JSON.stringify(r),
          );
        }
        await banner.locator(".cta").focus();
        await page.keyboard.press("Shift+Tab");
        assert.equal(
          await page.evaluate(
            () => !!document.activeElement.closest(".cookie-banner"),
          ),
          false,
        );
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `${out}/${width}x${height}.png` });
        // Main UI is genuinely clickable while the banner is still present.
        await page.locator(".hero .cta").click();
        await page.locator("#brief-dialog").waitFor();
        assert.equal(await page.locator(".cookie-banner").count(), 0);
        assert.equal(await page.locator("[role=dialog]").count(), 1);
        await page.keyboard.press("Escape");
        await banner.waitFor();
        await page.waitForTimeout(500);
        await banner
          .getByRole("button", { name: "Только необходимые", exact: true })
          .click();
        await banner.waitFor({ state: "detached" });
        await page.waitForFunction(
          () =>
            !document.documentElement.classList.contains(
              "patron-cookies-visible",
            ) && document.body.style.overflow === "",
        );
        assert.equal(
          (await context.cookies()).find(
            (c) => c.name === "patron_cookie_choice",
          ).value,
          "essential",
        );
        assert.deepEqual(errors, []);
        results.push({ width, height, status: "PASS", geometry });
        console.log("PASS", engine, width, height);
      } catch (e) {
        results.push({ width, height, status: "FAIL", error: e.stack });
        console.log("FAIL", engine, width, height, e.message.slice(0, 400));
        await page
          .screenshot({ path: `${out}/${width}-failure.png` })
          .catch(() => {});
      } finally {
        await context.close();
      }
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
