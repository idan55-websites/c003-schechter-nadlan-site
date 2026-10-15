import {chromium,webkit,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.SITE_URL||'http://localhost:5173/';
const widths=[375,390,430,768,1024,1440];
await fs.mkdir('test-results',{recursive:true});
for(const [engineName,engine]of [['chromium',chromium],['webkit',webkit]]){
 if(process.env.BROWSER&&process.env.BROWSER!==engineName)continue;
 const browser=await engine.launch();const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function stage(progress){await page.locator('.architecture-sequence').evaluate((el,p)=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-el.querySelector('.architecture-stage').offsetHeight)*p,behavior:'instant'}),progress);await page.waitForTimeout(120)}
 try{
  for(const en of [false,true])for(const width of widths){
   await page.setViewportSize({width,height:width<=430?844:1000});await page.goto(`${base}#/${en?'en/':''}`);await page.locator('.cinematic-active').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(120);
   assert.equal(await page.locator('h1').count(),1);
   await stage(.04);const initial=await page.locator('.architecture-frame--galil').evaluate(el=>getComputedStyle(el).clipPath);
   await stage(.48);await expect(page.locator('.architecture-sequence')).toHaveAttribute('data-active-stage','1');
   const expanded=await page.locator('.architecture-frame--galil').evaluate(el=>getComputedStyle(el).clipPath);assert.notEqual(expanded,initial,'The image must expand with scroll');
   await expect(page.locator('.architecture-caption--galil')).toHaveCSS('opacity','1');
   const pinned=await page.locator('.architecture-stage').boundingBox();assert(Math.abs(pinned.y)<2,'Native sticky stage must stay pinned');
   assert.equal(await page.locator('.architecture-caption--galil').evaluate(el=>el.inert),false);
   const detail=page.locator('.architecture-caption--galil a');assert(await detail.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}),'Active project detail link must remain tappable');
   if(width===390||width===1440)await page.screenshot({path:`test-results/cinematic-${engineName}-${en?'en':'he'}-${width}-galil.png`});
   await stage(.94);await expect(page.locator('.architecture-sequence')).toHaveAttribute('data-active-stage','2');await expect(page.locator('.architecture-caption--family')).toHaveCSS('opacity','1');
   const wipe=await page.locator('.architecture-frame--family').evaluate(el=>getComputedStyle(el).clipPath);
   await stage(.48);assert.notEqual(await page.locator('.architecture-frame--family').evaluate(el=>getComputedStyle(el).clipPath),wipe,'The second image wipe must reverse');
   assert.equal(await page.locator('.architecture-frame--galil').evaluate(el=>getComputedStyle(el).clipPath),expanded,'Returning to the same scroll point must restore the composition');
   await stage(.04);assert.equal(await page.locator('.architecture-frame--galil').evaluate(el=>getComputedStyle(el).clipPath),initial);
   await stage(.48);
   if(width<=430){
    const position=await page.evaluate(()=>scrollY);await page.getByRole('button',{name:en?'Open menu':'פתיחת תפריט',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);assert(Math.abs(await page.evaluate(()=>scrollY)-position)<2);await expect(page.locator('.architecture-sequence')).toHaveAttribute('data-active-stage','1');
   }
   const familyControl=page.locator('.architecture-chapters button').nth(2);await familyControl.click();await expect(page.locator('.architecture-sequence')).toHaveAttribute('data-active-stage','2');await expect(familyControl).toHaveAttribute('aria-pressed','true');
   await page.locator('.architecture-controls>a').click();await expect.poll(async()=>Math.round((await page.locator('#selected').boundingBox()).y)).toBeLessThan(150);
   await page.locator('.cinematic-reading').scrollIntoViewIfNeeded();await page.waitForTimeout(100);assert(Number(await page.locator('.cinematic-word').first().evaluate(el=>getComputedStyle(el).opacity))>.9);
   await page.locator('.cinematic-closing').scrollIntoViewIfNeeded();await page.locator('.closing-image img').evaluate(img=>img.decode());await page.screenshot({path:`test-results/closing-${engineName}-${en?'en':'he'}-${width}.png`});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow ${engineName} ${en} ${width}`);
   // The scene must release into the real closing, footer and contact flow.
   await page.locator('.closing-actions .button').click();await page.locator('form').waitFor();assert.equal(await page.locator('.architecture-stage').count(),0);await expect(page.locator('body')).not.toHaveCSS('position','fixed');
  }
  await page.setViewportSize({width:390,height:844});await page.goto(`${base}#/en/`);await page.locator('.cinematic-active').waitFor();await stage(.48);await page.setViewportSize({width:844,height:390});await stage(.94);await expect(page.locator('.architecture-sequence')).toHaveAttribute('data-active-stage','2');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.cinematic-home')).not.toHaveClass(/cinematic-active/);await expect(page.locator('.architecture-controls')).toBeHidden();for(const el of await page.locator('[data-scene-copy]').all()){assert.equal(await el.evaluate(el=>el.inert),false);assert.equal(await el.getAttribute('aria-hidden'),null)}
  await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('.cinematic-home')).toHaveClass(/cinematic-active/);
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.getByRole('button',{name:'Accessibility options',exact:true}).click();await page.getByRole('checkbox',{name:'Reduce motion',exact:true}).check();await expect(page.locator('.cinematic-home')).not.toHaveClass(/cinematic-active/);await page.getByRole('button',{name:'Reset preferences'}).click();await expect(page.locator('.cinematic-home')).toHaveClass(/cinematic-active/);
  assert.deepEqual(errors,[]);console.log(`PASS ${engineName}: reversible expanding and masked scenes, native pin/release, chapter controls, project links, menu mid-scene, closing contact, orientation, motion preference changes; both languages at ${widths.join(', ')}px.`);
 }finally{await browser.close()}
}
