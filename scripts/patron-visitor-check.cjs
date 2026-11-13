/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const playwright = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const base = process.env.PATRON_BASE_URL || "http://localhost:3000";
const results = [];
const out = process.env.PATRON_REPORT_DIR || "docs/patron-visitor";
fs.mkdirSync(out, { recursive: true });
const check = async (name, run) => {
  try {
    await run();
    results.push({ name, status: "PASS" });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.log("FAIL", name, e.message.slice(0, 400));
  }
};
const waitClosed = async (p) => {
  await p.locator("[data-overlay-root]").waitFor({ state: "detached" });
  await p.waitForFunction(
    () =>
      document.body.style.overflow === "" &&
      !document.getElementById("patron-page").inert,
  );
  assert.equal(await p.locator("[data-overlay-root]").count(), 0);
};
async function prepare(browser, width = 1440, options = {}) {
  const c = await browser.newContext({
    viewport: { width, height: width === 390 ? 844 : 900 },
    ...options,
  });
  const p = await c.newPage();
  await p.clock.setFixedTime(new Date("2026-11-13T12:00:00Z"));
  return { c, p };
}
async function init(p) {
  await p.goto(base, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
}
(async () => {
  const engine = process.env.PATRON_VISITOR_ENGINE || "chromium";
  const driver =
    engine === "firefox"
      ? require(
          process.env.PATRON_FIREFOX_PLAYWRIGHT ||
            "C:/Users/aless/AppData/Local/npm-cache/_npx/d537ee5ee2a13f03/node_modules/playwright",
        ).firefox
      : playwright[engine];
  const browser = await driver.launch();
  try {
    const api = await browser.newContext();
    await check(
      "API: consent, validation, origin and no coverage",
      async () => {
        const call = (body) =>
          api.request.post(base + "/api/location", { data: body });
        assert.equal(
          (await call({ latitude: 55.75, longitude: 37.61 })).status(),
          403,
        );
        assert.equal(
          (await call({ latitude: 91, longitude: 0, consent: true })).status(),
          422,
        );
        assert.equal(
          (
            await call({ latitude: "55", longitude: 0, consent: true })
          ).status(),
          422,
        );
        assert.equal(
          (
            await api.request.post(base + "/api/location", {
              data: { latitude: 0, longitude: 0, consent: true },
              headers: { origin: "https://other.invalid" },
            })
          ).status(),
          403,
        );
        const fallback = await call({
          latitude: 0,
          longitude: 0,
          consent: true,
        });
        assert.equal(fallback.headers()["cache-control"], "no-store");
        const data = await fallback.json();
        assert.equal(data.resolved, false);
        assert.equal(data.location.timeZone, "Europe/Moscow");
        assert.equal(
          (
            await api.request.post(base + "/api/location", {
              data: Buffer.from("{"),
              headers: { "content-type": "application/json" },
            })
          ).status(),
          400,
        );
      },
    );
    await check("API: Moscow, Novosibirsk, New York, Tokyo", async () => {
      for (const [latitude, longitude, zone] of [
        [55.7558, 37.6173, "Europe/Moscow"],
        [55.0084, 82.9357, "Asia/Novosibirsk"],
        [40.7128, -74.006, "America/New_York"],
        [35.6762, 139.6503, "Asia/Tokyo"],
      ]) {
        const r = await api.request.post(base + "/api/location", {
          data: { latitude, longitude, consent: true },
        });
        assert.equal(r.status(), 200);
        const d = await r.json();
        assert.equal(d.resolved, true);
        assert.equal(d.location.timeZone, zone);
        assert.deepEqual(Object.keys(d.location).sort(), [
          "city",
          "country",
          "timeZone",
        ]);
      }
    });
    await api.close();
    for (const width of [1440, 390]) {
      const { c, p } = await prepare(browser, width, {
        permissions: ["geolocation"],
        geolocation: { latitude: 55.0084, longitude: 82.9357 },
      });
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      let requests = 0;
      p.on("request", (r) => {
        if (r.url().endsWith("/api/location")) requests++;
      });
      await check(
        `${width}: no implicit geolocation, cookies and Moscow default`,
        async () => {
          await init(p);
          await p.getByRole("region", { name: "Cookies" }).waitFor();
          assert.equal(requests, 0);
          assert.equal(
            await p.locator(".hdr .visitor-city").textContent(),
            "Москва",
          );
          assert.equal(
            await p.locator(".hdr .visitor-time").textContent(),
            "15:00",
          );
          assert.equal(
            await p.locator("#patron-page").evaluate((e) => e.inert),
            false,
          );
          await p.waitForTimeout(850);
          await p.screenshot({ path: `${out}/${width}-cookies.png` });
          if (width === 1440) {
            const gap = await p
              .locator(".visitor-clock")
              .evaluate(
                (e) =>
                  e.querySelector("time").getBoundingClientRect().left -
                  e.querySelector(".visitor-city").getBoundingClientRect()
                    .right,
              );
            assert.ok(gap >= 20);
          }
          await p
            .getByRole("button", { name: "Разрешить запоминание", exact: true })
            .click();
          await p
            .getByRole("heading", { name: "Время вашего города" })
            .waitFor();
          assert.equal(requests, 0);
        },
      );
      await check(
        `${width}: approved location, correct timezone and optional cookie`,
        async () => {
          await p
            .getByRole("button", { name: "Определить мой город", exact: true })
            .click();
          await p
            .getByText("Город определён. Показываем местное время.", {
              exact: true,
            })
            .waitFor();
          assert.equal(requests, 1);
          assert.equal(
            await p.locator(".visitor-current strong").textContent(),
            "Новосибирск",
          );
          assert.equal(
            await p.locator(".hdr .visitor-time").textContent(),
            "19:00",
          );
          await p.waitForTimeout(850);
          await p.screenshot({ path: `${out}/${width}-location.png` });
          await p.locator(".visitor-dialog-top button").click();
          await waitClosed(p);
          assert.equal(
            await p.locator(".hdr .visitor-city").textContent(),
            "Новосибирск",
          );
          const cookies = await c.cookies();
          const locationCookie = cookies.find(
            (c) => c.name === "patron_location",
          );
          assert.ok(locationCookie);
          assert.ok(
            !decodeURIComponent(locationCookie.value).includes("latitude"),
          );
          await p.reload({ waitUntil: "networkidle" });
          await p.waitForFunction(
            () =>
              document.querySelector(".hdr .visitor-city")?.textContent ===
              "Новосибирск",
          );
          await p.waitForTimeout(1500);
          assert.equal(
            await p.locator(".hdr .visitor-city").textContent(),
            "Новосибирск",
          );
          assert.equal(await p.locator("[data-overlay-root]").count(), 0);
          assert.equal(
            await p.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
            false,
          );
        },
      );
      await check(
        `${width}: change cookie choice and explicit Moscow`,
        async () => {
          await p.locator(".visitor-settings button").last().click();
          await p
            .getByRole("button", { name: "Только необходимые", exact: true })
            .click();
          await waitClosed(p);
          assert.equal(
            (await c.cookies()).some((c) => c.name === "patron_location"),
            false,
          );
          await p.locator(".visitor-settings button").first().click();
          await p
            .getByRole("button", { name: "Показывать Москву", exact: true })
            .click();
          await waitClosed(p);
          assert.equal(
            await p.locator(".hdr .visitor-city").textContent(),
            "Москва",
          );
          assert.equal(
            await p.locator(".hdr .visitor-time").textContent(),
            "15:00",
          );
          assert.equal(
            await p.evaluate(() => document.body.style.overflow),
            "",
          );
          assert.deepEqual(errors, []);
        },
      );
      await c.close();
    }
    await check(
      "Browser denial: Moscow fallback and no coordinate request",
      async () => {
        const { c, p } = await prepare(browser);
        let requests = 0;
        p.on("request", (r) => {
          if (r.url().endsWith("/api/location")) requests++;
        });
        await p.addInitScript(() => {
          navigator.geolocation.getCurrentPosition = (_, fail) =>
            fail({ code: 1, message: "denied" });
        });
        await init(p);
        await p.getByRole("region", { name: "Cookies" }).waitFor();
        await p
          .getByRole("button", { name: "Только необходимые", exact: true })
          .click();
        await p
          .getByRole("button", { name: "Определить мой город", exact: true })
          .click();
        await p.locator(".visitor-sheet").getByRole("alert").waitFor();
        assert.equal(requests, 0);
        assert.equal(
          await p.locator(".hdr .visitor-city").textContent(),
          "Москва",
        );
        assert.equal(
          await p.locator(".hdr .visitor-time").textContent(),
          "15:00",
        );
        await p.waitForTimeout(850);
        await p.screenshot({ path: `${out}/denied.png` });
        if (await p.locator(".cookie-banner").count())
          await p.locator(".cookie-banner-close").click();
        else await p.keyboard.press("Escape");
        await waitClosed(p);
        await p.reload({ waitUntil: "networkidle" });
        await p.waitForTimeout(2300);
        assert.equal(await p.locator("[data-overlay-root]").count(), 0);
        await c.close();
      },
    );
    await check(
      "Server failure preserves Moscow; focus trap and keyboard close",
      async () => {
        const { c, p } = await prepare(browser, 390, {
          permissions: ["geolocation"],
          geolocation: { latitude: 40.7128, longitude: -74.006 },
        });
        await p.route("**/api/location", (r) =>
          r.fulfill({ status: 503, json: { error: "unavailable" } }),
        );
        await init(p);
        await p.getByRole("region", { name: "Cookies" }).waitFor();
        if (await p.locator(".cookie-banner").count())
          await p.locator(".cookie-banner-close").click();
        else await p.keyboard.press("Escape");
        await p
          .getByRole("button", { name: "Определить мой город", exact: true })
          .click();
        await p.locator(".visitor-sheet").getByRole("alert").waitFor();
        assert.equal(
          await p.locator(".hdr .visitor-city").textContent(),
          "Москва",
        );
        const buttons = p.locator(".visitor-sheet button");
        await p.locator(".visitor-footnote a").focus();
        await p.keyboard.press("Tab");
        assert.equal(
          await buttons.first().evaluate((e) => e === document.activeElement),
          true,
        );
        if (await p.locator(".cookie-banner").count())
          await p.locator(".cookie-banner-close").click();
        else await p.keyboard.press("Escape");
        await waitClosed(p);
        await c.close();
      },
    );
  } finally {
    await browser.close();
  }
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  if (results.some((r) => r.status === "FAIL")) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  fs.writeFileSync(
    `${out}/results.json`,
    JSON.stringify([...results, { status: "FAIL", error: e.message }], null, 2),
  );
  process.exitCode = 1;
});
