import {chromium,webkit,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.SITE_URL||'http://localhost:5173/';
await fs.mkdir('test-results',{recursive:true});
for(const [name,engine]of [['chromium',chromium],['webkit',webkit]]){
 if(process.env.BROWSER&&process.env.BROWSER!==name)continue;
 const browser=await engine.launch();const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  for(const english of [false,true]){
   const route=english?'en/':'';
   await page.goto(`${base}#/${route}`);await page.locator('h1').waitFor();
   await expect(page.locator('html')).toHaveClass(/motion-enabled/);
   await page.locator('.cinematic-active').waitFor();
   const hero=page.locator('.hero-scenes');const before=await hero.evaluate(el=>getComputedStyle(el).transform);
   await page.evaluate(()=>window.scrollTo({top:150,behavior:'instant'}));await page.waitForTimeout(150);assert.notEqual(await hero.evaluate(el=>getComputedStyle(el).transform),before,'Hero should respond to touch scrolling');
   await page.locator('.values-heading').scrollIntoViewIfNeeded();
   const scrollBefore=await page.evaluate(()=>scrollY);assert(scrollBefore>500);
   const toggle=page.getByRole('button',{name:english?'Open menu':'פתיחת תפריט',exact:true});await toggle.click();
   const dialog=page.getByRole('dialog',{name:english?'Site menu':'תפריט האתר'});await expect(dialog).toBeVisible();await expect(page.locator('.site-header')).toHaveAttribute('inert','');await expect(page.locator('body')).toHaveCSS('position','fixed');
   await expect.poll(async()=>Math.round((await dialog.boundingBox()).y)).toBe(0);const bounds=await dialog.boundingBox();assert(bounds.height>=840,'Menu must cover the viewport, not be clipped to the header');
   for(const link of await dialog.locator('.mobile-menu-links a').all()){
    await link.scrollIntoViewIfNeeded();assert(await link.evaluate(el=>{const r=el.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return el.contains(hit)}),'Every menu item must receive taps');
   }
   await page.screenshot({path:`test-results/mobile-menu-${name}-${english?'en':'he'}.png`});
   await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(toggle).toBeFocused();await expect(page.locator('body')).not.toHaveCSS('position','fixed');assert(Math.abs(await page.evaluate(()=>scrollY)-scrollBefore)<3,'Closing must preserve scroll');
   await toggle.click();await page.getByRole('dialog').getByRole('link',{name:english?'Projects':'פרויקטים',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('h1')).toContainText(english?'Our projects':'הפרויקטים שלנו');await expect(toggle).toHaveAttribute('aria-expanded','false');assert.equal(await page.evaluate(()=>scrollY),0);
   await toggle.click();await page.getByRole('dialog').getByRole('link',{name:english?'Projects':'פרויקטים',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
   await page.getByRole('button',{name:english?'Projects under construction':'פרויקטים בבנייה',exact:true}).click();await expect(page.locator('.project-card').first()).toHaveClass(/reveal/);await page.locator('.project-card').first().scrollIntoViewIfNeeded();await expect(page.locator('.project-card').first()).toHaveClass(/revealed/);
   await toggle.click();await page.setViewportSize({width:1024,height:768});await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('body')).not.toHaveCSS('position','fixed');await page.setViewportSize({width:390,height:844});
   await page.goto(`${base}#/${route}`);await page.locator('h1').waitFor();
   for(const size of [{width:360,height:640},{width:844,height:390},{width:390,height:844}]){
    await page.setViewportSize(size);if(size.width<=760){await toggle.click();await page.getByRole('dialog').getByRole('button',{name:english?'Close menu':'סגירת תפריט',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0)}
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   }
  }
  await page.goto(`${base}#/en/`);await page.getByRole('button',{name:'Accessibility options',exact:true}).click();await page.getByRole('checkbox',{name:'Reduce motion',exact:true}).check();await expect(page.locator('html')).not.toHaveClass(/motion-enabled/);await expect(page.locator('.cinematic-home')).not.toHaveClass(/cinematic-active/);await page.getByRole('button',{name:'Reset preferences',exact:true}).click();await expect(page.locator('html')).toHaveClass(/motion-enabled/);await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('html')).not.toHaveClass(/motion-enabled/);await expect(page.locator('.cinematic-home')).not.toHaveClass(/cinematic-active/);
  assert.deepEqual(errors,[]);console.log(`PASS ${name}: touch menu coverage and hit targets, scroll locking/restoration, same-page close, navigation, resize, both languages, hero motion, scroll reveals, filtered cards and reduced-motion preferences.`);
 }finally{await browser.close()}
}
