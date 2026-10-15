import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.SITE_URL||'http://localhost:4173/c003-schechter-nadlan-site/';
const projects=JSON.parse(await fs.readFile(new URL('../src/projects.json',import.meta.url),'utf8'));
const browser=await chromium.launch();const page=await browser.newPage();const errors=[];const failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
try{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const lang of ['','en/'])for(const route of ['','projects','about','urban','media','residents','contact','sitemap','privacy','accessibility',...projects.map(p=>`project/${p.id}`)]){
  await page.goto(`${base}#/${lang}${route}`);await page.locator('main h1').waitFor();
  for(const src of await page.locator('img').evaluateAll(imgs=>imgs.map(img=>img.src))){assert(src.startsWith(base),`Asset escaped base path: ${src}`);const r=await page.request.get(src);assert.equal(r.status(),200,src)}
 }
 await page.goto(`${base}#/en/project/10`);await expect(page.locator('.gallery-open img')).toHaveAttribute('src',new URL('images/dunash-5-site-1.webp',base).pathname);
 await page.locator('.language-switch').click();await expect(page.locator('h1')).toContainText('שכטר בדונש');
 for(const width of [390,1440]){await page.setViewportSize({width,height:900});await page.goto(`${base}#/en/projects`);await page.locator('.project-card').first().waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log(`PASS: 70 production routes in both languages, local images, repository base paths, language switch, mobile and desktop layouts at ${base}`);
}finally{await browser.close()}
