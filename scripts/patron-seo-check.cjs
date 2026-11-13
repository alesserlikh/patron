/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const ts = require("typescript");
const sharp = require("sharp");
require.extensions[".ts"] = (m, filename) =>
  m._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    filename,
  );
const { seo, structuredData } = require("../content/patron/seo.ts");
const { hero } = require("../content/patron/hero.ts");
const { ui, contacts } = require("../content/patron/ui.ts");
const { chromium } = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const base = process.env.PATRON_BASE_URL || "http://localhost:3000";
const out = "docs/patron-seo";
fs.mkdirSync(out, { recursive: true });
const results = [];
const read = (file) => fs.readFileSync(path.resolve(file));
async function check(name, run) {
  try {
    const detail = await run();
    results.push({ name, status: "PASS", ...detail });
    console.log("PASS", name);
  } catch (error) {
    results.push({ name, status: "FAIL", error: error.stack });
    console.log("FAIL", name, error.message);
  }
}
async function tag(p, name, value, property = false) {
  const el = p.locator(
    `head meta[${property ? "property" : "name"}="${name}"]`,
  );
  assert.equal(await el.count(), 1, name + " count");
  assert.equal(await el.getAttribute("content"), String(value), name);
}
(async () => {
  await check(
    "SEO strings follow current copy and fit reference limits",
    async () => {
      assert.equal(seo.description, hero.description);
      assert.equal(
        seo.title,
        `${ui.brand} — ${hero.eyebrow.toLocaleLowerCase("ru-RU")}`,
      );
      assert.equal(
        seo.shareTitle,
        `${ui.brand}: ${hero.event} — ${hero.part} ${hero.word}`,
      );
      for (const [key, max] of [
        ["title", 60],
        ["description", 160],
        ["shareTitle", 60],
        ["shareDescription", 110],
        ["imageAlt", 120],
      ])
        assert.ok(seo[key].length <= max, key);
      assert.equal(new URL(seo.origin).protocol, "https:");
      return {
        title: seo.title,
        description: seo.description,
        shareTitle: seo.shareTitle,
        shareDescription: seo.shareDescription,
      };
    },
  );
  await check(
    "Generated badge matches current copy, photo and brand mark",
    async () => {
      const saved = JSON.parse(read(`${out}/assets.json`));
      const heroImage = read("app/components/patron/HeroSection.tsx")
        .toString()
        .match(/src=\{"(\/patron\/new\/[^"}]+)"\}/)?.[1];
      const markPaths = [
        ...read("app/components/patron/PatronMark.tsx")
          .toString()
          .matchAll(/<path\s+d="([^"]+)"/g),
      ]
        .map((m) => `<path d="${m[1]}"/>`)
        .join("");
      const inputs = {
        seo,
        tagline: ui.tagline,
        hero: {
          event: hero.event,
          part: hero.part,
          word: hero.word,
          eyebrow: hero.eyebrow,
        },
        heroImage,
        photoHash: crypto
          .createHash("sha256")
          .update(read("public" + heroImage))
          .digest("hex"),
        markPaths,
      };
      assert.equal(
        crypto
          .createHash("sha256")
          .update(JSON.stringify(inputs))
          .digest("hex"),
        saved.sha256,
        "Run npm run seo:assets after copy changes",
      );
      const bytes = read("public/og-image.jpg");
      const metadata = await sharp(bytes).metadata();
      assert.equal(metadata.width, 1200);
      assert.equal(metadata.height, 630);
      assert.equal(metadata.format, "jpeg");
      assert.ok(bytes.length <= 300000);
      return {
        width: metadata.width,
        height: metadata.height,
        bytes: bytes.length,
      };
    },
  );
  const b = await chromium.launch();
  try {
    const request = await b.newContext();
    await check(
      "Icons are the PATRON mark at required dimensions",
      async () => {
        const svg = read("public/favicon.svg").toString();
        assert.equal((svg.match(/<path /g) || []).length, 2);
        assert.ok(svg.includes('fill="#000"'));
        for (const [size, file] of [
          [32, "favicon-32.png"],
          [180, "apple-touch-icon.png"],
          [512, "icon-512.png"],
        ]) {
          const result = await request.request.get(base + "/" + file);
          assert.equal(result.status(), 200, file);
          const meta = await sharp(await result.body()).metadata();
          assert.equal(meta.width, size);
          assert.equal(meta.height, size);
        }
        const ico = await request.request.get(base + "/favicon.ico");
        assert.equal(ico.status(), 200);
        const bytes = await ico.body();
        assert.equal(bytes.readUInt16LE(2), 1);
        assert.equal(bytes.readUInt16LE(4), 3);
        for (let i = 0; i < 3; i++) {
          const at = 6 + i * 16;
          const image = bytes.subarray(
            bytes.readUInt32LE(at + 12),
            bytes.readUInt32LE(at + 12) + bytes.readUInt32LE(at + 8),
          );
          const meta = await sharp(image).metadata();
          assert.equal(meta.width, [16, 32, 48][i]);
        }
        const svgResponse = await request.request.get(base + "/favicon.svg");
        assert.equal(svgResponse.status(), 200);
        assert.ok(
          svgResponse.headers()["content-type"].includes("image/svg+xml"),
        );
      },
    );
    await check(
      "Image, manifest, robots and single-page sitemap are served",
      async () => {
        const image = await request.request.get(base + seo.image);
        assert.equal(image.status(), 200);
        assert.ok(image.headers()["content-type"].includes("image/jpeg"));
        const manifestResponse = await request.request.get(
          base + "/manifest.webmanifest",
        );
        assert.equal(manifestResponse.status(), 200);
        const manifest = await manifestResponse.json();
        assert.equal(manifest.name, ui.brand);
        assert.equal(manifest.description, hero.description);
        assert.equal(manifest.theme_color, seo.themeColor);
        assert.equal(manifest.icons[0].src, "/icon-512.png");
        const robots = await request.request.get(base + "/robots.txt");
        assert.equal(robots.status(), 200);
        const robotsText = await robots.text();
        assert.ok(robotsText.includes("Allow: /"));
        assert.ok(robotsText.includes("Disallow: /api/"));
        assert.ok(robotsText.includes(`${seo.origin}/sitemap.xml`));
        const sitemap = await request.request.get(base + "/sitemap.xml");
        assert.equal(sitemap.status(), 200);
        const xml = await sitemap.text();
        assert.deepEqual(
          [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]),
          [seo.origin + "/"],
        );
        assert.ok(!xml.includes("#"));
      },
    );
    await request.close();
    for (const [label, userAgent, width] of [
      ["desktop", undefined, 1440],
      ["mobile", undefined, 390],
      ["Googlebot", "Googlebot/2.1 (+http://www.google.com/bot.html)", 1440],
      ["TelegramBot", "TelegramBot (like TwitterBot)", 390],
      ["Twitterbot", "Twitterbot/1.0", 1440],
    ]) {
      await check(
        `${label}: metadata is present without JavaScript`,
        async () => {
          const c = await b.newContext({
            viewport: { width, height: 900 },
            javaScriptEnabled: false,
            ...(userAgent ? { userAgent } : {}),
          });
          try {
            const p = await c.newPage();
            const response = await p.goto(base, { waitUntil: "load" });
            assert.equal(response.status(), 200);
            assert.equal(await p.locator("html").getAttribute("lang"), "ru");
            assert.equal(await p.locator("head title").count(), 1);
            assert.equal(await p.title(), seo.title);
            await tag(p, "description", seo.description);
            await tag(p, "theme-color", seo.themeColor);
            await tag(p, "robots", "index, follow");
            assert.equal(
              new URL(
                await p
                  .locator("head link[rel=canonical]")
                  .getAttribute("href"),
              ).href,
              seo.origin + "/",
            );
            for (const [name, value] of [
              ["og:type", "website"],
              ["og:locale", "ru_RU"],
              ["og:site_name", seo.name],
              ["og:title", seo.shareTitle],
              ["og:description", seo.shareDescription],
              ["og:image", seo.origin + seo.image],
              ["og:image:width", 1200],
              ["og:image:height", 630],
              ["og:image:alt", seo.imageAlt],
            ])
              await tag(p, name, value, true);
            const url = await p
              .locator('head meta[property="og:url"]')
              .getAttribute("content");
            assert.equal(new URL(url).href, seo.origin + "/");
            for (const [name, value] of [
              ["twitter:card", "summary_large_image"],
              ["twitter:title", seo.shareTitle],
              ["twitter:description", seo.shareDescription],
              ["twitter:image", seo.origin + seo.image],
              ["twitter:image:alt", seo.imageAlt],
            ])
              await tag(p, name, value);
            for (const file of ["/favicon.svg", "/favicon-32.png"])
              assert.equal(
                await p.locator(`head link[rel=icon][href="${file}"]`).count(),
                1,
              );
            assert.equal(
              await p
                .locator(
                  'head link[rel=apple-touch-icon][href="/apple-touch-icon.png"]',
                )
                .count(),
              1,
            );
            assert.equal(await p.locator("head link[rel=manifest]").count(), 1);
            const ld = JSON.parse(
              await p.locator("#patron-structured-data").textContent(),
            );
            assert.deepEqual(ld, structuredData);
            const org = ld["@graph"].find(
              (node) => node["@type"] === "Organization",
            );
            assert.equal(org.email, contacts.email);
            assert.equal(org.url, seo.origin + "/");
            assert.equal(org.logo.url, seo.origin + "/icon-512.png");
            assert.deepEqual(org.sameAs, [contacts.telegramUrl]);
            if (!contacts.phone) assert.equal("telephone" in org, false);
            assert.equal(await p.locator("h1").count(), 1);
            assert.ok(
              (await p.locator(".hero").textContent())
                .replace(/\s+/g, " ")
                .includes(hero.description),
            );
            assert.ok(
              !(await p.locator("head").innerHTML()).includes("localhost:3000"),
            );
            assert.ok(
              !(await p.locator("head").innerHTML()).includes("танкиста"),
            );
            return {
              title: await p.title(),
              canonical: seo.origin + "/",
              image: seo.origin + seo.image,
            };
          } finally {
            await c.close();
          }
        },
      );
    }
  } finally {
    await b.close();
  }
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  if (results.some((r) => r.status === "FAIL")) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
