/* eslint-disable @typescript-eslint/no-require-imports */
// Local-only browser evidence. Uses an already installed Playwright, no provider writes.
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const ref = path.join(
  process.env.LOCALAPPDATA,
  "Temp/patron-reference-20261109",
);
const out = "docs/patron-migration/screenshots";
fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => {
  const filename = path.resolve(
    ref,
    "." + decodeURIComponent(req.url.split("?")[0]),
  );
  if (
    !filename.startsWith(path.resolve(ref) + path.sep) ||
    !fs.existsSync(filename) ||
    fs.statSync(filename).isDirectory()
  ) {
    res.writeHead(404).end();
    return;
  }
  const ext = path.extname(filename);
  res.setHeader(
    "Content-Type",
    {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript",
      ".jpg": "image/jpeg",
    }[ext] || "application/octet-stream",
  );
  res.end(fs.readFileSync(filename));
});
const metrics = (page) =>
  page.evaluate(() => {
    const selectors = [
      ".hero",
      "#agency",
      ".factsScr",
      "#services",
      "#cases",
      "#process",
      "#brief",
      "#legal",
    ];
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      fonts: [...document.fonts].map((f) => ({
        family: f.family,
        status: f.status,
      })),
      sections: selectors.map((s) => {
        const el = document.querySelector(s);
        if (!el) return { s, missing: true };
        const r = el.getBoundingClientRect();
        return {
          s,
          top: Math.round(r.top + scrollY),
          height: Math.round(r.height),
          width: Math.round(r.width),
        };
      }),
    };
  });
(async () => {
  await new Promise((r) => server.listen(3110, "127.0.0.1", r));
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const [width, height] of [
      [1440, 900],
      [390, 844],
    ]) {
      for (const source of ["reference", "production"]) {
        const page = await browser.newPage({
          viewport: { width, height },
          deviceScaleFactor: 1,
        });
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(
          source === "reference"
            ? `http://127.0.0.1:3110/${width === 1440 ? "desktop" : "mobile"}/Main.dc.html`
            : "http://localhost:3109",
          { waitUntil: "networkidle" },
        );
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(3800);
        await page.screenshot({ path: `${out}/${source}-${width}-hero.png` });
        await page.screenshot({
          path: `${out}/${source}-${width}-full.png`,
          fullPage: true,
        });
        results.push({
          source,
          width,
          height,
          errors,
          ...(await metrics(page)),
        });
        // Capture each section at its actual scroll position, including view-timeline effects.
        for (const selector of [
          "#agency",
          ".factsScr",
          "#services",
          "#cases",
          "#process",
          "#brief",
          "#legal",
        ]) {
          await page.locator(selector).scrollIntoViewIfNeeded();
          await page.waitForTimeout(700);
          await page.screenshot({
            path: `${out}/${source}-${width}-${selector.replace(/[#.]/g, "")}.png`,
          });
        }
        await page.locator(".snapTop").scrollIntoViewIfNeeded();
        await page.locator(".hlens").click();
        await page.waitForTimeout(1400);
        await page.screenshot({
          path: `${out}/${source}-${width}-expanded.png`,
        });
        await page.locator(".hctl button").click();
        await page.locator("#services").scrollIntoViewIfNeeded();
        await page.locator(".srow").first().click();
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: `${out}/${source}-${width}-service-detail.png`,
        });
        await page.locator("#cases").scrollIntoViewIfNeeded();
        await page.locator(".cmedia.on .cta").click();
        await page.waitForTimeout(900);
        await page.screenshot({
          path: `${out}/${source}-${width}-case-dialog.png`,
        });
        await page.close();
      }
    }
    fs.writeFileSync(
      "docs/patron-migration/geometry.json",
      JSON.stringify(results, null, 2),
    );
    console.log(
      JSON.stringify(
        results,
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => {
  console.error(e);
  server.close();
  process.exitCode = 1;
});
