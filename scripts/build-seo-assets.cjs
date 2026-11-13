/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const ts = require("typescript");
const sharp = require("sharp");
require.extensions[".ts"] = (m, filename) =>
  m._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    filename,
  );
const root = path.resolve(__dirname, "..");
const { seo } = require(path.join(root, "content/patron/seo.ts"));
const { hero } = require(path.join(root, "content/patron/hero.ts"));
const { ui, navigation } = require(path.join(root, "content/patron/ui.ts"));
const { typography } = require(path.join(root, "app/lib/typography.ts"));
const { chromium } = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const docs = path.join(root, "docs/patron-seo");
const publicDir = path.join(root, "public");
const read = (file) => fs.readFileSync(path.join(root, file));
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const display = (s) => escape(typography(s));
const data = (file, mime) =>
  `data:${mime};base64,${read(file).toString("base64")}`;
const fontCss = `@font-face{font-family:Golos;src:url('${data("public/fonts/GolosText-Variable.ttf", "font/ttf")}');font-weight:400 900}@font-face{font-family:Bartle;src:url('${data("public/fonts/BBH-Bartle-Regular.woff", "font/woff")}')}`;
const markPaths = [
  ...read("app/components/patron/PatronMark.tsx")
    .toString()
    .matchAll(/<path\s+d="([^"]+)"/g),
]
  .map((m) => `<path d="${m[1]}"/>`)
  .join("");
assert.ok(markPaths, "Brand mark missing");
const mark = (width, height) =>
  `<svg viewBox="0 0 154.9 90.3" width="${width}" height="${height}" fill="white" aria-hidden="true">${markPaths}</svg>`;
function iconSvg(size) {
  const scale = size <= 32 ? 0.75 : 0.625;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#000"/><svg x="${32 - 32 * scale}" y="${32 - 19 * scale}" width="${64 * scale}" height="${38 * scale}" viewBox="0 0 154.9 90.3" fill="#fff">${markPaths}</svg></svg>`;
}
const heroSource = read("app/components/patron/HeroSection.tsx").toString();
const heroImage = heroSource.match(/src=\{"(\/patron\/new\/[^"}]+)"\}/)?.[1];
assert.ok(heroImage, "Current Hero image missing");
const photo = data("public" + heroImage, "image/jpeg");
const limits = [
  ["title", seo.title, 60],
  ["description", seo.description, 160],
  ["og:title / twitter:title", seo.shareTitle, 60],
  ["og:description / twitter:description", seo.shareDescription, 110],
  ["og:image:alt", seo.imageAlt, 120],
];
for (const [name, text, max] of limits)
  assert.ok(text.length <= max, `${name}: ${text.length} > ${max}`);
const host = new URL(seo.origin).host;
const ogHtml = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${escape(seo.shareTitle)}</title><style>
${fontCss}
*{box-sizing:border-box}body{margin:0}.og{position:relative;width:1200px;height:630px;overflow:hidden;background:#000;color:#fff;font-family:Golos,sans-serif;-webkit-font-smoothing:antialiased;isolation:isolate}
.glow{position:absolute;border-radius:50%;pointer-events:none}.left{left:-260px;top:-300px;width:900px;height:760px;background:radial-gradient(closest-side,rgba(0,55,94,.95),rgba(0,25,72,.45) 55%,transparent);filter:blur(40px)}
.right{left:520px;top:40px;width:760px;height:480px;background:radial-gradient(closest-side,rgba(255,255,255,.32),rgba(161,186,228,.34) 32%,rgba(124,118,214,.14) 60%,transparent);filter:blur(50px);mix-blend-mode:screen}
.beam{position:absolute;left:80px;top:470px;width:1400px;height:130px;transform:rotate(-14deg);background:linear-gradient(90deg,transparent,rgba(161,186,228,.1) 25%,rgba(220,232,255,.32) 55%,transparent);filter:blur(40px);mix-blend-mode:screen}
.grain{position:absolute;inset:0;opacity:.12;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:56px 64px 52px}.top,.bottom{display:flex;align-items:center;justify-content:space-between;gap:24px}.logo{display:inline-flex;align-items:center;gap:16px;font-family:Bartle,Golos,sans-serif;font-size:30px;letter-spacing:.01em}.tagline{font-size:16px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.72)}
h1{margin:0;font-size:112px;font-weight:700;line-height:.92;letter-spacing:-.06em}.line1{display:flex;align-items:center;gap:0 .16em}.line2{display:block;padding-left:.6em}.lens{display:flex;gap:.07em;width:1.5em;aspect-ratio:1.715;transform:translateY(.04em)}.half{position:relative;flex:1;overflow:hidden;background:#001948}.half.l{border-radius:100% 0 0 100% / 50% 0 0 50%}.half.r{border-radius:0 100% 100% 0 / 0 50% 50% 0}.half img{position:absolute;top:0;height:100%;width:212%;max-width:none;object-fit:cover}.half.l img{left:0}.half.r img{right:0}
.bottom{align-items:flex-end}.eyebrow{max-width:780px;font-size:26px;font-weight:500;line-height:1.3;color:rgba(255,255,255,.88)}.url{display:inline-flex;flex:none;align-items:center;gap:12px;height:52px;padding:0 24px;border-radius:40px;background:#fff;color:#000;font-size:20px;font-weight:600}
</style></head><body><div class="og"><div class="glow left"></div><div class="glow right"></div><div class="beam"></div><div class="grain"></div><div class="content">
<div class="top"><span class="logo">${mark(52, 30)}<span>${escape(ui.brand)}</span></span><span class="tagline">${display(ui.tagline)}</span></div>
<h1><span class="line1"><span>${display(hero.event)}</span><span class="lens" aria-hidden="true"><span class="half l"><img src="${photo}" alt=""></span><span class="half r"><img src="${photo}" alt=""></span></span><span>—</span></span><span class="line2">${display(hero.part + " " + hero.word)}</span></h1>
<div class="bottom"><span class="eyebrow">${display(hero.eyebrow)}</span><span class="url">${escape(host)} <span>↗</span></span></div>
</div></div></body></html>`;

(async () => {
  fs.mkdirSync(docs, { recursive: true });
  const faviconBackup = path.join(
    require("node:os").tmpdir(),
    "patron-seo-favicon-before.ico",
  );
  if (!fs.existsSync(faviconBackup))
    fs.copyFileSync(path.join(root, "app/favicon.ico"), faviconBackup);
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), iconSvg(32));
  for (const [size, file] of [
    [32, "favicon-32.png"],
    [180, "apple-touch-icon.png"],
    [512, "icon-512.png"],
  ])
    await sharp(Buffer.from(iconSvg(size)))
      .png()
      .toFile(path.join(publicDir, file));
  const frames = await Promise.all(
    [16, 32, 48].map((size) =>
      sharp(Buffer.from(iconSvg(size)))
        .png()
        .toBuffer(),
    ),
  );
  const header = Buffer.alloc(6 + frames.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach((frame, i) => {
    const at = 6 + i * 16,
      size = [16, 32, 48][i];
    header[at] = size;
    header[at + 1] = size;
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(frame.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += frame.length;
  });
  fs.writeFileSync(
    path.join(root, "app/favicon.ico"),
    Buffer.concat([header, ...frames]),
  );
  fs.writeFileSync(path.join(docs, "og-artboard.html"), ogHtml);
  const browser = await chromium.launch();
  try {
    const p = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    await p.setContent(ogHtml);
    await p.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode()));
    });
    assert.equal(
      await p.locator("h1").evaluate((e) => e.scrollWidth > e.clientWidth),
      false,
      "OG headline overflow",
    );
    await p.screenshot({
      path: path.join(publicDir, "og-image.jpg"),
      type: "jpeg",
      quality: 85,
    });
    await p.close();
    const ogBytes = fs.readFileSync(path.join(publicDir, "og-image.jpg"));
    const imageMeta = await sharp(ogBytes).metadata();
    assert.equal(imageMeta.width, 1200);
    assert.equal(imageMeta.height, 630);
    assert.ok(ogBytes.length <= 300000, "OG image exceeds 300 KB");
    const ogData = "data:image/jpeg;base64," + ogBytes.toString("base64");
    const iconData =
      "data:image/svg+xml;base64," +
      Buffer.from(iconSvg(32)).toString("base64");
    const preview = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escape(seo.name)} — проверка поиска и превью</title><style>${fontCss}
*{box-sizing:border-box}body{margin:0;background:#eef0f3;color:#111318;font-family:Golos,system-ui,sans-serif}main{max-width:1280px;margin:auto;padding:56px 64px}h1{font-size:40px;line-height:1.1;letter-spacing:-.035em;margin:10px 0 16px}.note{font-size:14px;line-height:1.5;color:#5b6170}section{display:grid;grid-template-columns:220px minmax(0,1fr);gap:32px;margin-top:32px}.label{font-size:13px;line-height:1.5;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#3a5ba8}.panel{padding:28px 32px;border-radius:20px;background:white;box-shadow:0 1px 2px #0001;min-width:0}.search{font-family:Arial,sans-serif}.search h2,.search p{max-width:640px}.identity{display:flex;gap:12px;align-items:center;font-size:14px}.identity img{width:28px;height:28px}.domain{font-size:12px;color:#4d5156;margin-top:3px}.search h2{font-size:20px;line-height:1.3;font-weight:400;color:#1a0dab;margin:12px 0 4px}.search p{font-size:14px;line-height:1.58;color:#4d5156;margin:0}.links{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.links span{padding:6px 14px;border:1px solid #dadce0;border-radius:16px;color:#1a0dab;font-size:14px}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;min-width:0}.message{background:#dfe7ef;padding:24px;border-radius:20px;min-width:0}.bubble{background:#fff;border-radius:16px 16px 4px 16px;padding:12px}.cardbody{border-left:3px solid #2a6fdb;padding-left:10px}.brand{color:#2a6fdb;font-size:14px;font-weight:600;margin:0}.sharetitle{font-size:15px;font-weight:600;line-height:1.4;margin:4px 0}.sharedesc{font-size:14px;line-height:1.4;margin:4px 0 10px}.og{display:block;width:100%;height:auto;aspect-ratio:1200/630;border-radius:8px}.social{padding:24px;border-radius:20px;background:#fff;min-width:0}.socialcard{border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}.socialcard>.og{border-radius:0}.caption{padding:12px 14px;background:#f5f6f8}.icons{display:flex;gap:24px;align-items:center;flex-wrap:wrap}.icons img{width:32px;height:32px}.icons .apple{width:64px;height:64px}.tab{display:flex;gap:10px;align-items:center;max-width:520px;padding:12px;border:10px solid #dee1e6;border-bottom:0;border-radius:14px 14px 0 0;background:#fff;font-family:Arial,sans-serif;font-size:13px}.tab img{width:16px;height:16px}.tab span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fields{display:grid;gap:1px;background:#dfe1e5;border:1px solid #dfe1e5;border-radius:12px;overflow:hidden}.field{display:grid;grid-template-columns:160px minmax(0,1fr) 60px;gap:16px;padding:16px;background:#fff;font-size:14px;line-height:1.5;overflow-wrap:anywhere}.field b{font-weight:500}p{overflow-wrap:break-word}
@media(max-width:640px){main{padding:24px 12px}h1{font-size:28px}section{grid-template-columns:minmax(0,1fr);gap:12px}.panel,.social,.message{padding:16px}.cards{grid-template-columns:minmax(0,1fr);gap:16px}.message{background:#0e1621}.bubble{background:#182533;color:#fff}.cardbody{border-color:#7ab9e8}.brand{color:#7ab9e8}.field{grid-template-columns:minmax(0,1fr);gap:5px}.search h2{font-size:20px}.sharetitle{font-size:15px}.label{margin:0 8px}}
</style></head><body><main><div class="label">${escape(seo.name)} · поиск и превью ссылок</div><h1>Как выглядит ссылка на сайт</h1><p class="note">Локальная проверка по desktop/mobile-макетам. Используются фактические метаданные сайта и готовый OG-бейдж; интерфейсы сервисов показаны условно.</p>
<section><div class="label">01 · Поисковая выдача</div><article class="panel search"><div class="identity"><img src="${iconData}" alt=""><div>${escape(seo.name)}<div class="domain">${escape(seo.origin)}</div></div></div><h2>${escape(seo.title)}</h2><p>${escape(seo.description)}</p><div class="links">${navigation.map((n) => `<span>${escape(n.label)}</span>`).join("")}<span>${escape(ui.discussProject)}</span></div></article></section>
<section><div class="label">02 · Превью ссылки</div><div class="cards"><div class="message"><div class="bubble"><div class="cardbody"><p class="brand">${escape(seo.name)}</p><p class="sharetitle">${escape(seo.shareTitle)}</p><p class="sharedesc">${escape(seo.shareDescription)}</p><img class="og" src="${ogData}" alt="${escape(seo.imageAlt)}"></div></div></div><div class="social"><div class="socialcard"><img class="og" src="${ogData}" alt="${escape(seo.imageAlt)}"><div class="caption"><div class="domain">${escape(host)}</div><p class="sharetitle">${escape(seo.shareTitle)}</p><p class="sharedesc">${escape(seo.shareDescription)}</p></div></div></div></div></section>
<section><div class="label">03 · Вкладка и иконки</div><div><div class="tab"><img src="${iconData}" alt=""><span>${escape(seo.title)}</span><b>×</b></div><div class="icons" style="margin-top:24px"><img class="apple" src="${iconData}" alt="Знак PATRON"><img src="${iconData}" alt="Знак PATRON"><img style="width:16px;height:16px" src="${iconData}" alt="Знак PATRON"></div></div></section>
<section><div class="label">04 · Метаданные</div><div class="fields">${limits.map(([name, text, max]) => `<div class="field"><b>${escape(name)}</b><span>${escape(text)}</span><span>${text.length}/${max}</span></div>`).join("")}</div></section>
</main></body></html>`;
    fs.writeFileSync(path.join(docs, "preview.html"), preview);
    for (const width of [1280, 390]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        deviceScaleFactor: 1,
      });
      await page.setContent(preview);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "Preview horizontal overflow",
      );
      await page.screenshot({
        path: path.join(docs, `preview-${width}.png`),
        fullPage: true,
      });
      await page.close();
    }
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
    fs.writeFileSync(
      path.join(docs, "assets.json"),
      JSON.stringify(
        {
          inputs,
          sha256: crypto
            .createHash("sha256")
            .update(JSON.stringify(inputs))
            .digest("hex"),
          image: {
            width: imageMeta.width,
            height: imageMeta.height,
            bytes: ogBytes.length,
          },
          fields: limits.map(([name, text, max]) => ({
            name,
            text,
            length: text.length,
            max,
          })),
        },
        null,
        2,
      ),
    );
    console.log(
      `SEO assets generated: 1200x630 JPG, ${ogBytes.length} bytes; SVG/ICO/PNG icons; desktop/mobile previews.`,
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
