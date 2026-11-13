/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs"),
  assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const base = process.env.PATRON_BASE_URL || "http://localhost:3000";
const out = "docs/patron-city";
fs.mkdirSync(out, { recursive: true });
const results = [];
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
(async () => {
  const b = await chromium.launch();
  try {
    const c = await b.newContext();
    const call = async (data) => {
      const r = await c.request.post(base + "/api/location", { data });
      assert.equal(r.status(), 200);
      return r.json();
    };
    const cities = require("../data/geonames/cities.json"),
      districts = require("../data/geonames/districts.json");
    await check(
      "City-only classification and all parent references",
      async () => {
        const codes = require("../data/geonames/classification.json");
        assert.equal(codes.cityCodes.includes("PPLX"), false);
        assert.equal(districts.length, 2394);
        for (const d of districts)
          assert.ok(
            Number.isInteger(d[5]) && d[5] >= 0 && d[5] < cities.length,
          );
      },
    );
    await check("Saint Petersburg districts resolve to the city", async () => {
      const local = districts.filter(
        (r) =>
          r[4] === "RU" &&
          Math.abs(r[1] - 59.93) < 0.12 &&
          Math.abs(r[2] - 30.33) < 0.15,
      );
      assert.ok(local.length >= 20);
      for (const row of local) {
        const r = await call({
          latitude: row[1],
          longitude: row[2],
          consent: true,
        });
        assert.equal(r.resolved, true);
        assert.equal(r.location.city, "Санкт-Петербург", row[0]);
        assert.equal(r.location.timeZone, "Europe/Moscow");
      }
    });
    await check(
      "Moscow and independent cities remain independent",
      async () => {
        for (const name of [
          "Москва",
          "Новосибирск",
          "Гатчина",
          "Выборг",
          "Кудрово",
        ]) {
          const row = cities.find((r) => r[0] === name && r[4] === "RU");
          assert.ok(row, name);
          const r = await call({
            latitude: row[1],
            longitude: row[2],
            consent: true,
          });
          assert.equal(r.location.city, name);
        }
        for (const [latitude, longitude, zone] of [
          [40.7128, -74.006, "America/New_York"],
          [35.6762, 139.6503, "Asia/Tokyo"],
        ]) {
          const r = await call({ latitude, longitude, consent: true });
          assert.equal(r.resolved, true);
          assert.equal(r.location.timeZone, zone);
        }
      },
    );
    await check(
      "Legacy district normalization needs no coordinates",
      async () => {
        const r = await call({
          action: "normalize",
          consent: true,
          location: {
            city: "Адмиралтейский",
            country: "RU",
            timeZone: "Europe/Moscow",
          },
        });
        assert.equal(r.resolved, true);
        assert.deepEqual(r.location, {
          city: "Санкт-Петербург",
          country: "RU",
          timeZone: "Europe/Moscow",
        });
        const unknown = await call({
          action: "normalize",
          consent: true,
          location: {
            city: "NOT A CITY",
            country: "RU",
            timeZone: "Europe/Moscow",
          },
        });
        assert.equal(unknown.resolved, false);
        assert.equal(unknown.location.city, "Москва");
        const denied = await c.request.post(base + "/api/location", {
          data: {
            action: "normalize",
            location: {
              city: "Адмиралтейский",
              country: "RU",
              timeZone: "Europe/Moscow",
            },
          },
        });
        assert.equal(denied.status(), 403);
      },
    );
    await c.close();
    for (const width of [1440, 390])
      await check(
        `${width}: migrate saved district, persist city, reload without GPS`,
        async () => {
          const c = await b.newContext({
            viewport: { width, height: width === 390 ? 844 : 900 },
            permissions: ["geolocation"],
          });
          await c.addCookies([
            { name: "patron_cookie_choice", value: "functional", url: base },
            {
              name: "patron_location",
              value: encodeURIComponent(
                JSON.stringify({
                  city: "Адмиралтейский",
                  country: "RU",
                  timeZone: "Europe/Moscow",
                }),
              ),
              url: base,
            },
          ]);
          const p = await c.newPage();
          let migrations = 0,
            coordinateRequests = 0;
          const errors = [];
          p.on("pageerror", (e) => errors.push(e.message));
          p.on("request", (r) => {
            if (r.url().endsWith("/api/location")) {
              const d = r.postDataJSON();
              if (d.action === "normalize") migrations++;
              if ("latitude" in d) coordinateRequests++;
            }
          });
          await p.addInitScript(() => {
            window.gpsCalls = 0;
            navigator.geolocation.getCurrentPosition = () => {
              window.gpsCalls++;
            };
          });
          await p.goto(base, { waitUntil: "networkidle" });
          await p.waitForFunction(
            () =>
              document.querySelector(".hdr .visitor-city")?.textContent ===
              "Санкт-Петербург",
          );
          assert.equal(migrations, 1);
          assert.equal(coordinateRequests, 0);
          assert.equal(await p.evaluate(() => window.gpsCalls), 0);
          const cookie = (await c.cookies()).find(
            (c) => c.name === "patron_location",
          );
          const value = JSON.parse(decodeURIComponent(cookie.value));
          assert.equal(value.city, "Санкт-Петербург");
          assert.equal(value.cityVersion, 2);
          assert.equal("latitude" in value, false);
          await p.reload({ waitUntil: "networkidle" });
          await p.waitForFunction(
            () =>
              document.querySelector(".hdr .visitor-city")?.textContent ===
              "Санкт-Петербург",
          );
          assert.equal(migrations, 1);
          await p.locator(".visitor-settings button").first().click();
          await p
            .getByRole("heading", { name: "Время вашего города" })
            .waitFor();
          assert.equal(
            await p.locator(".visitor-current strong").textContent(),
            "Санкт-Петербург",
          );
          await p.waitForTimeout(1400);
          await p.screenshot({ path: `${out}/${width}-city.png` });
          assert.deepEqual(errors, []);
          await c.close();
        },
      );
    await check(
      "Fresh approved coordinates show the city in the UI",
      async () => {
        const c = await b.newContext({
          viewport: { width: 1440, height: 900 },
          permissions: ["geolocation"],
          geolocation: { latitude: 59.923, longitude: 30.3 },
        });
        await c.addCookies([
          { name: "patron_cookie_choice", value: "essential", url: base },
        ]);
        const p = await c.newPage();
        await p.goto(base, { waitUntil: "networkidle" });
        await p
          .getByRole("button", { name: "Определить мой город", exact: true })
          .click();
        await p
          .getByText("Город определён. Показываем местное время.", {
            exact: true,
          })
          .waitFor();
        assert.equal(
          await p.locator(".visitor-current strong").textContent(),
          "Санкт-Петербург",
        );
        assert.equal(
          await p.locator(".hdr .visitor-city").textContent(),
          "Санкт-Петербург",
        );
        assert.equal(
          (await c.cookies()).some((c) => c.name === "patron_location"),
          false,
        );
        await c.close();
      },
    );
  } finally {
    await b.close();
  }
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  if (results.some((r) => r.status === "FAIL")) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
