/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium, webkit } = require(process.env.PATRON_PLAYWRIGHT || 'C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const { firefox } = require(process.env.PATRON_FIREFOX_PLAYWRIGHT || 'C:/Users/aless/AppData/Local/npm-cache/_npx/d537ee5ee2a13f03/node_modules/playwright');
const base = process.env.PATRON_BASE_URL || 'http://localhost:3000';
const out = 'docs/patron-services-layout';
fs.mkdirSync(out, { recursive: true });
const results = [];
(async () => {
  for (const [name, engine] of [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]) {
    const browser = await engine.launch();
    try {
      const widths = name === 'chromium' ? [320, 390, 768, 1024, 1100, 1101, 1440, 1920] : [390, 1440];
      for (const width of widths) {
        const c = await browser.newContext({ viewport: { width, height: 900 } });
        try {
          await c.addCookies([{ name: 'patron_cookie_choice', value: 'essential', url: base }]);
          const p = await c.newPage();
          await p.addInitScript(() => sessionStorage.setItem('patron_geo_decision', 'decided'));
          await p.goto(base, { waitUntil: 'networkidle' });
          await p.addStyleTag({ content: '#services *,#services *::before,#services *::after{transition:none!important} html,body,.pt{scroll-behavior:auto!important;scroll-snap-type:none!important}' });
          await p.locator('#services .srow').first().dispatchEvent('click');
          for (let index = 0; index < 5; index++) {
            await p.locator('#services [role=tab]').nth(index).dispatchEvent('click');
            const article = p.locator('#services article[aria-hidden=false]');
            await article.waitFor({ state: 'visible' });
            const geometry = await article.evaluate(el => {
              const column = el.firstElementChild;
              const paragraph = column.querySelector('p');
              const image = el.lastElementChild;
              const box = paragraph.getBoundingClientRect();
              const col = column.getBoundingClientRect();
              const img = image.getBoundingClientRect();
              const lineHeight = parseFloat(getComputedStyle(paragraph).lineHeight);
              return { title: column.querySelector('h3').textContent, width: box.width, columnWidth: col.width, height: box.height, lines: Math.round(box.height / lineHeight), left: box.left, right: box.right, paragraphOverflow: paragraph.scrollWidth - paragraph.clientWidth, columnOverflow: column.scrollWidth - column.clientWidth, imageVisible: getComputedStyle(image).display !== 'none', imageLeft: img.left };
            });
            try {
              assert.ok(Math.abs(geometry.width - geometry.columnWidth) <= 1, 'Description must fill its text column');
              assert.ok(geometry.left >= -1 && geometry.right <= width + 1, 'Description must fit the viewport');
              assert.ok(geometry.paragraphOverflow <= 1 && geometry.columnOverflow <= 1, 'Text column must not clip content');
              if (geometry.imageVisible) assert.ok(geometry.right < geometry.imageLeft, 'Text must stay clear of the image');
              const cta = article.locator('button');
              await cta.scrollIntoViewIfNeeded();
              const button = await cta.boundingBox();
              assert.ok(button && button.x >= 0 && button.x + button.width <= width + 1 && button.y >= 0 && button.y + button.height <= 901, 'CTA must remain reachable');
              results.push({ browser: name, viewport: width, ...geometry, status: 'PASS' });
            } catch (error) {
              results.push({ browser: name, viewport: width, ...geometry, status: 'FAIL', error: error.message });
            }
            if (name === 'chromium' && index === 2 && [390, 1440, 1920].includes(width)) await article.screenshot({ path: `${out}/${width}-events.png` });
          }
          console.log(name, width, results.filter(r => r.browser === name && r.viewport === width).map(r => r.status).join(' '));
        } finally { await c.close(); }
      }
    } finally { await browser.close(); }
  }
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  if (results.some(r => r.status === 'FAIL')) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
