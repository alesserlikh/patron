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
const {
  typography,
  needsNextWord,
  typographyGroups,
} = require("../app/lib/typography.ts");
const { lead } = require("../content/patron/lead.ts");
const playwright = require(
  process.env.PATRON_PLAYWRIGHT ||
    "C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const engine = process.env.PATRON_TYPOGRAPHY_ENGINE || "chromium";
const base = process.env.PATRON_BASE_URL || "http://localhost:3000";
const out =
  engine === "chromium"
    ? "docs/patron-typography"
    : `docs/patron-typography/${engine}`;
fs.mkdirSync(out, { recursive: true });
const results = [];
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
async function audit(p, scope = "#patron-page") {
  const blocks = await p.locator(scope).evaluate((root) =>
    [...root.querySelectorAll("p,h2,h3,.tick2,.chk>span")]
      .filter((el) => {
        if (el.closest("[inert],[aria-hidden=true]")) return false;
        return (
          getComputedStyle(el).visibility !== "hidden" &&
          el.getBoundingClientRect().width > 0
        );
      })
      .map((el) => {
        const words = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          for (const match of node.textContent.matchAll(/\S+/gu)) {
            const range = document.createRange();
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            const rect = range.getBoundingClientRect();
            if (rect.width && rect.height)
              words.push({
                text: match[0],
                top: rect.top,
                bottom: rect.bottom,
              });
          }
        }
        return {
          text: el.textContent,
          words,
          overflow: el.scrollWidth - el.clientWidth,
        };
      }),
  );
  const violations = [];
  for (const block of blocks) {
    if (block.overflow > 2)
      violations.push(`Overflow ${block.overflow}: ${block.text}`);
    for (let i = 0; i + 1 < block.words.length; i++) {
      const current = block.words[i],
        next = block.words[i + 1];
      if (needsNextWord(current.text) && next.top >= current.bottom - 2)
        violations.push(`Line ends with ${current.text}: ${block.text}`);
    }
  }
  assert.deepEqual(violations, []);
  return { blocks: blocks.length };
}
async function close(p) {
  await p.keyboard.press("Escape");
  await p.locator("[data-overlay-root]").waitFor({ state: "detached" });
}
(async () => {
  await check(
    "Short words, numbers, chains and fragment boundaries",
    async () => {
      assert.equal(
        typography("Мы и вы в 3–6 месяцев"),
        "Мы\u00a0и\u00a0вы\u00a0в\u00a03–6\u00a0месяцев",
      );
      assert.equal(
        typography("90 000+ гостей и 1,5 млн просмотров"),
        "90\u00a0000+\u00a0гостей и\u00a01,5\u00a0млн просмотров",
      );
      assert.equal(
        typography("IT и AI для бизнеса"),
        "IT\u00a0и\u00a0AI\u00a0для бизнеса",
      );
      assert.equal(typography("Слово на"), "Слово на");
      assert.equal(typography("Число 12"), "Число 12");
      assert.equal(typography("Конец и\nНовый абзац"), "Конец и\nНовый абзац");
      assert.equal(typography("по "), "по ");
      assert.equal(typography("по ", true), "по\u00a0");
      const text = "Мы и вы в 3–6 месяцев";
      assert.equal(typography(typography(text)), typography(text));
      assert.deepEqual(
        typographyGroups(["Мы", "и", "бренд", "на"].map((t) => ({ t }))).map(
          (g) => g.map((x) => x.t),
        ),
        [["Мы", "и", "бренд"], ["на"]],
      );
    },
  );
  const b = await playwright[engine].launch();
  try {
    for (const width of engine === "chromium"
      ? [320, 390, 768, 1440]
      : [390, 1440]) {
      const c = await b.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      try {
        await c.addCookies([
          { name: "patron_cookie_choice", value: "essential", url: base },
        ]);
        const p = await c.newPage();
        await p.addInitScript(() =>
          sessionStorage.setItem("patron_geo_decision", "decided"),
        );
        await p.goto(base, { waitUntil: "networkidle" });
        await p.evaluate(() => document.fonts.ready);
        await p.addStyleTag({
          content:
            "html,body,.pt{scroll-behavior:auto!important;scroll-snap-type:none!important}",
        });
        await check(
          `${width}: page paragraphs, headings, lists and coloured manifesto`,
          () => audit(p),
        );
        await p.locator("#services .srow").first().dispatchEvent("click");
        await check(`${width}: all five services`, async () => {
          for (let i = 0; i < 5; i++) {
            await p
              .locator("#services [role=tab]")
              .nth(i)
              .dispatchEvent("click");
            await audit(p, "#services article[aria-hidden=false]");
          }
        });
        await check(`${width}: all case and process dialogs`, async () => {
          for (let i = 0; i < 3; i++) {
            await p.locator("#cases .seg").nth(i).dispatchEvent("click");
            await p.locator("#cases figure.on .cta").dispatchEvent("click");
            await p.locator("#case-dialog").waitFor();
            await audit(p, "#case-dialog");
            await close(p);
          }
          for (let i = 0; i < 6; i++) {
            await p.locator("#process .ph").nth(i).dispatchEvent("click");
            await p.locator("#phase-dialog").waitFor();
            await audit(p, "#phase-dialog");
            await close(p);
          }
        });
        await check(
          `${width}: brief and original form option values`,
          async () => {
            await p.locator(".hero .cta").dispatchEvent("click");
            await p.locator("#brief-dialog").waitFor();
            await audit(p, "#brief-dialog");
            assert.deepEqual(
              await p
                .locator("#brief-dialog select option")
                .evaluateAll((options) => options.map((o) => o.value)),
              lead.scales,
            );
            const name = p.locator("#brief-dialog input[name=name]");
            await name.fill("Я и 12 гостей");
            assert.equal(await name.inputValue(), "Я и 12 гостей");
            await close(p);
          },
        );
        await check(`${width}: cookies and visitor dialog`, async () => {
          await p
            .locator(".visitor-settings button")
            .last()
            .dispatchEvent("click");
          await p.locator(".cookie-banner").waitFor();
          await audit(p, ".cookie-banner");
          await p.locator(".cookie-banner-close").dispatchEvent("click");
          await p.locator("[data-overlay-root]").waitFor({ state: "detached" });
          await p
            .locator(".visitor-settings button")
            .first()
            .dispatchEvent("click");
          await p.locator(".visitor-sheet").waitFor();
          await audit(p, ".visitor-sheet");
          await close(p);
        });
        await p.locator('.hdr nav a[href="#agency"]').dispatchEvent("click");
        await p.locator("#agency .man").scrollIntoViewIfNeeded();
        await p
          .locator("#agency .wrap")
          .screenshot({ path: `${out}/${width}-about.png` });
      } finally {
        await c.close();
      }
    }
  } finally {
    await b.close();
  }
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  if (results.some((r) => r.status === "FAIL")) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
