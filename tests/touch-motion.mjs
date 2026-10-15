import {chromium,webkit,devices,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.SITE_URL||'http://localhost:5173/';
await fs.mkdir('test-results',{recursive:true});
for(const [name,engine] of [['webkit',webkit],['chromium',chromium]]){
 if(process.env.BROWSER&&process.env.BROWSER!==name)continue;
 const browser=await engine.launch();
 for(const device of ['iPhone SE','iPhone 13','iPhone 14 Pro Max','iPad (gen 7)','iPad Pro 11']){
  const page=await browser.newPage({...devices[device],deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{for(const en of [false,true]){
   await page.goto(`${base}#/${en?'en/':''}`);await page.locator('.cinematic-active.hero-visible').waitFor();await page.evaluate(()=>document.fonts.ready);
   const image=page.locator('.hero-image.scene-active');await expect(image).toHaveCSS('animation-play-state','running');
   const first=await image.evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(900);assert.notEqual(await image.evaluate(el=>getComputedStyle(el).transform),first,`${device}: opening must actually move without scrolling`);
   // Floating actions must not cover the scene controls or the story link.
   for(const control of await page.locator('.hero-bottom a,.hero-bottom button').all())assert(await control.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}),`${device}: hero controls must receive taps`);
   const clips=[];let stageY;
   for(const progress of [.08,.2,.35,.48,.65,.82,.94]){
    await page.locator('.architecture-sequence').evaluate((el,p)=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-el.querySelector('.architecture-stage').offsetHeight)*p,behavior:'instant'}),progress);await page.waitForTimeout(80);
    const info=await page.locator('.architecture-frame--galil').evaluate(el=>({clip:getComputedStyle(el).clipPath,y:el.parentElement.getBoundingClientRect().y}));clips.push(info.clip);stageY=info.y;
    if(progress===.48||progress===.94){const copy=page.locator(progress===.48?'.architecture-caption--galil':'.architecture-caption--family');await expect(copy).toHaveCSS('opacity','1');const r=await copy.boundingBox();assert(r.y>80&&r.y+r.height<page.viewportSize().height-80,`${device}: complete caption must fit`);assert(await copy.locator('a').evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}));}
   }
   assert(new Set(clips).size>=3,`${device}: several intermediate frames must render`);assert(Math.abs(stageY)<2);
   await image.evaluate(el=>el.decode());await page.screenshot({path:`test-results/touch-${name}-${device.replaceAll(' ','-')}-${en?'en':'he'}.png`});
   await page.locator('.architecture-sequence').evaluate(el=>window.scrollTo({top:el.offsetTop+(el.offsetHeight-el.querySelector('.architecture-stage').offsetHeight)*.2,behavior:'instant'}));await page.waitForTimeout(80);await expect(page.locator('.architecture-sequence')).toHaveAttribute('data-active-stage','0');
   if(page.viewportSize().width<=760){assert.equal(await page.locator('.featured-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1);}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.cinematic-home')).not.toHaveClass(/cinematic-active/);await expect(image).toHaveCSS('animation-name','none');await page.emulateMedia({reducedMotion:'no-preference'});
  }assert.deepEqual(errors,[]);console.log(`PASS ${name} ${device}: HE/EN actual idle motion, continuous scroll frames, readable captions, tap targets, reduced motion.`);
  }finally{await page.close()}
 }
 await browser.close();
}
