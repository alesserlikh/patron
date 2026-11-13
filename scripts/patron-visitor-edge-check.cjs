/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PATRON_PLAYWRIGHT || 'C:/Users/aless/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const base = process.env.PATRON_BASE_URL || 'http://localhost:3111';
const results = [];
const check = async (name, fn) => { try { await fn(); results.push({name,status:'PASS'}); console.log('PASS',name); } catch(e) { results.push({name,status:'FAIL',error:e.stack});console.log('FAIL',name,e.message); } };
(async()=>{
 const browser = await chromium.launch();
 try {
  await check('Denied permission clears restored city and optional cookie',async()=>{
   const c=await browser.newContext({viewport:{width:1440,height:900}});await c.addCookies([{name:'patron_cookie_choice',value:'functional',url:base},{name:'patron_location',value:encodeURIComponent(JSON.stringify({city:'Novosibirsk',country:'RU',timeZone:'Asia/Novosibirsk'})),url:base}]);
   const p=await c.newPage();let requests=0;p.on('request',r=>{if(r.url().endsWith('/api/location'))requests++});
   await p.addInitScript(()=>{navigator.permissions.query=async()=>({state:'denied',addEventListener(){},removeEventListener(){}})});
   await p.goto(base,{waitUntil:'networkidle'});await p.waitForFunction(()=>!document.cookie.includes('patron_location='));assert.equal(await p.locator('.hdr .visitor-city').textContent(),'Москва');assert.equal(requests,0);await p.locator('.hdr .visitor-clock').click();await p.locator('.visitor-error').waitFor();await c.close();
  });
  await check('Late location response cannot override a cancelled request',async()=>{
   const c=await browser.newContext({permissions:['geolocation'],geolocation:{latitude:55.0084,longitude:82.9357}});await c.addCookies([{name:'patron_cookie_choice',value:'functional',url:base}]);const p=await c.newPage();let release;const pending=new Promise(r=>{release=r});
   await p.route('**/api/location',async r=>{await pending;await r.fulfill({json:{resolved:true,location:{city:'Novosibirsk',country:'RU',timeZone:'Asia/Novosibirsk'}}}).catch(()=>{})});
   await p.goto(base,{waitUntil:'networkidle'});await p.getByRole('heading',{name:'Время вашего города'}).waitFor();await Promise.all([p.waitForRequest(r=>r.url().endsWith('/api/location')),p.getByRole('button',{name:'Определить мой город',exact:true}).click()]);await p.keyboard.press('Escape');await p.locator('[data-overlay-root]').waitFor({state:'detached'});release();await p.waitForTimeout(300);assert.equal(await p.locator('.hdr .visitor-city').textContent(),'Москва');assert.equal((await c.cookies()).some(c=>c.name==='patron_location'),false);await c.close();
  });
  await check('Visitor dialogs preserve the existing brief draft and single overlay',async()=>{
   const c=await browser.newContext({viewport:{width:1440,height:900}});await c.addCookies([{name:'patron_cookie_choice',value:'essential',url:base}]);const p=await c.newPage();await p.addInitScript(()=>sessionStorage.setItem('patron_geo_decision','decided'));await p.goto(base,{waitUntil:'networkidle'});await p.waitForTimeout(3000);await p.locator('.hero .cta').click();await p.locator('#brief-dialog input[name=name]').fill('Draft');assert.equal(await p.locator('[role=dialog]').count(),1);await p.keyboard.press('Escape');await p.locator('[data-overlay-root]').waitFor({state:'detached'});await p.locator('.visitor-settings button').last().click();await p.locator('.cookie-banner[role=region]').waitFor();assert.equal(await p.locator('[role=dialog]').count(),0);assert.equal(await p.locator('.cookie-banner').count(),1);await p.getByRole('button',{name:'Разрешить запоминание',exact:true}).click();await p.locator('[data-overlay-root]').waitFor({state:'detached'});await p.locator('.hdr .hcta').click();assert.equal(await p.locator('#brief-dialog input[name=name]').inputValue(),'Draft');await c.close();
  });
 } finally {await browser.close()}
 fs.writeFileSync('docs/patron-visitor/edge-results.json',JSON.stringify(results,null,2));if(results.some(x=>x.status==='FAIL'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
