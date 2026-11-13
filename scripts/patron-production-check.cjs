/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PATRON_PLAYWRIGHT || 'C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const results = [];
const check = async (name, fn) => {try {const detail=await fn();results.push({name,status:'PASS',...(detail===undefined?{}:{detail})});console.log('PASS',name);}catch(e){results.push({name,status:'FAIL',error:e.message});console.log('FAIL',name,e.message.slice(0,250));}};
const pause = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
 fs.mkdirSync('docs/patron-migration/videos',{recursive:true});
 const browser=await chromium.launch();
 try{
  for(const [width,height] of [[1440,900],[390,844]]){
   const context=await browser.newContext({viewport:{width,height},hasTouch:width===390,recordVideo:{dir:'docs/patron-migration/videos',size:{width,height}}});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{window.__patronCLS=0;try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__patronCLS+=e.value}).observe({type:'layout-shift',buffered:true})}catch{}});
   await page.goto('http://localhost:3108',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await pause(3800);
   await check(`${width} production head / favicon / OG image`,async()=>{
    assert.equal(await page.title(),'PATRON — продюсерский центр для технологического бизнеса');
    assert.equal(await page.locator('meta[name=description]').getAttribute('content'),'Стратегия, события, продакшн. Продюсируем конференции, фестивали и запуски — от брифа до бизнес-метрик.');
    assert.equal(await page.locator('html').getAttribute('lang'),'ru');
    const icon=await context.request.get('http://localhost:3108/favicon.ico');assert.equal(icon.status(),200);
    assert.equal(crypto.createHash('sha256').update(await icon.body()).digest('hex'),crypto.createHash('sha256').update(fs.readFileSync('app/favicon.ico')).digest('hex'));
    const og=await context.request.get('http://localhost:3108/patron/cases/tankers-crowd.jpg');assert.equal(og.status(),200);
    fs.writeFileSync(`docs/patron-migration/production-head-${width}.html`,await page.locator('head').innerHTML());
    return {initialCLS:await page.evaluate(()=>window.__patronCLS)};
   });
   await page.screenshot({path:`docs/patron-migration/screenshots/production-build-${width}-hero.png`});
   await check(`${width} expanded Hero resets on departure`,async()=>{
    await page.locator('.hlens').click();await pause(1300);await page.evaluate(()=>scrollTo(0,1100));await pause(500);await page.locator('.hdr a[href="#top"]').click();await pause(500);assert.equal(await page.evaluate(()=>scrollY),0);assert.equal(await page.locator('.hero.hx').count(),0);
   });
   await check(`${width} circular dialog exit / focus / lock`,async()=>{
    const button=page.locator('.hero .cta');await button.click();await pause(1300);await page.keyboard.press('Escape');await pause(100);assert.equal(await page.locator('[data-overlay-root]').count(),1);await pause(800);assert.equal(await page.locator('[data-overlay-root]').count(),0);assert.equal(await page.evaluate(()=>document.body.style.overflow),'');assert.equal(await button.evaluate(e=>e===document.activeElement),true);
   });
   await check(`${width} service segment drag and subsequent click`,async()=>{
    await page.locator('#services').scrollIntoViewIfNeeded();await page.locator('.srow').first().click();await pause(1000);const r=await page.locator('.seg5').boundingBox();await page.mouse.move(r.x+10,r.y+15);await page.mouse.down();await page.mouse.move(r.x+r.width-10,r.y+15,{steps:12});await page.mouse.up();await pause(700);assert.equal(await page.locator('.seg5 [aria-selected=true]').textContent().then(x=>x.includes('05')),true);await page.locator('.seg5 [role=tab]').nth(2).click();assert.equal(await page.locator('.seg5 [aria-selected=true]').textContent().then(x=>x.includes('03')),true);
   });
   await check(`${width} scroll progress uses the real fraction`,async()=>{
    await page.evaluate(()=>scrollTo(0,2500));await pause(500);const values=await page.locator('.hdr .prog').evaluate(e=>({actual:new DOMMatrix(getComputedStyle(e).transform).a,expected:scrollY/(document.documentElement.scrollHeight-innerHeight)}));assert.ok(Math.abs(values.actual-values.expected)<.002,JSON.stringify(values));return values;
   });
   if(width===390)await check('touch case swipe / vertical scroll intent',async()=>{
    await page.locator('#cases').scrollIntoViewIfNeeded();const number=()=>page.locator('#cases .fx .num').first().textContent();const before=await number();
    await page.locator('.cmedia.on').evaluate(el=>{const send=(type,x,y)=>{const touch=new Touch({identifier:1,target:el,clientX:x,clientY:y});el.dispatchEvent(new TouchEvent(type,{bubbles:true,touches:type==='touchstart'?[touch]:[],changedTouches:[touch]}))};send('touchstart',300,300);send('touchend',100,310)});await pause(650);assert.notEqual(await number(),before);const after=await number();
    await page.locator('.cmedia.on').evaluate(el=>{const send=(type,x,y)=>{const touch=new Touch({identifier:1,target:el,clientX:x,clientY:y});el.dispatchEvent(new TouchEvent(type,{bubbles:true,touches:type==='touchstart'?[touch]:[],changedTouches:[touch]}))};send('touchstart',300,300);send('touchend',290,550)});assert.equal(await number(),after);
   });
   await check(`${width} footer back to top / native anchor`,async()=>{await page.locator('#legal').scrollIntoViewIfNeeded();await page.locator('#legal a[href="#top"]').click();await pause(600);assert.equal(await page.evaluate(()=>scrollY),0);assert.equal(await page.evaluate(()=>location.hash),'#top')});
   await check(`${width} production runtime`,async()=>{assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)});
   const video=page.video();await context.close();const filename=await video.path();fs.renameSync(filename,`docs/patron-migration/videos/${width}-interactions.webm`);
  }
 }finally{await browser.close()}
 fs.writeFileSync('docs/patron-migration/production-results.json',JSON.stringify(results,null,2));if(results.some(x=>x.status==='FAIL'))process.exitCode=1;
})().catch(e=>{fs.writeFileSync('docs/patron-migration/production-results.json',JSON.stringify([...results,{status:'FAIL',error:e.message}],null,2));console.error(e);process.exitCode=1});
