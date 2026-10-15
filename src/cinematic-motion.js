import {useLayoutEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
// Keep native touch scrolling; browser toolbar height changes should not reset a scene.
ScrollTrigger.config({ignoreMobileResize:true});

export function useCinematicHome(rootRef,english=false){
 useLayoutEffect(()=>{
  const root=rootRef.current;if(!root)return;
  const syncHeader=()=>document.querySelector('.site-header')?.classList.toggle('scrolled',window.scrollY>80);
  ScrollTrigger.addEventListener('refresh',syncHeader);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let media,lastEnabled,refreshFrame,disposed=false;
  const enabled=()=>!reduced.matches&&!document.body.classList.contains('reduce-motion');
  function resetAccessibility(){root.querySelectorAll('[data-scene-copy]').forEach(el=>{el.inert=false;el.removeAttribute('aria-hidden')});}
  function setup(){
   const active=enabled();if(active===lastEnabled)return;lastEnabled=active;
   media?.revert();resetAccessibility();root.classList.toggle('cinematic-active',active);
   if(!active)return;
   media=gsap.matchMedia(root);
   media.add({mobile:'(max-width: 760px)',desktop:'(min-width: 761px)'},context=>{
    const mobile=context.conditions.mobile;
    const $=gsap.utils.selector(root);
    const hero=$('.hero')[0];
    if(hero){
     gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true,invalidateOnRefresh:true}})
      .to($('.hero-scenes'),{scale:1.08,yPercent:12,ease:'none',duration:1},0)
      .to($('.hero-inner'),{y:mobile?-45:-90,opacity:.05,ease:'none',duration:.65},.1)
      .to($('.hero-caption'),{y:-60,opacity:0,ease:'none',duration:.5},0);
    }
    const sequence=$('.architecture-sequence')[0];
    const copies=$('[data-scene-copy]');const buttons=$('.architecture-chapters button');let lastStage=-1;
    function setStage(stage){
     if(stage===lastStage)return;lastStage=stage;sequence.dataset.activeStage=stage;
     copies.forEach((el,i)=>{el.inert=i!==stage;el.setAttribute('aria-hidden',String(i!==stage))});
     buttons.forEach((el,i)=>el.setAttribute('aria-pressed',String(i===stage)));
    }
    const initialClip=mobile?'inset(36% 6% 8% 6%)':'inset(36% 9% 7% 9%)';
    const wipe=english?'inset(0% 100% 0% 0%)':'inset(0% 0% 0% 100%)';
    gsap.set($('.architecture-frame--galil'),{clipPath:initialClip});
    gsap.set($('.architecture-frame--family'),{clipPath:wipe});
    gsap.set($('.architecture-caption'),{autoAlpha:0,y:28});
    gsap.set($('.architecture-image'),{scale:1.12});
    if(!mobile)gsap.set($('.architecture-frame--galil .architecture-image'),{yPercent:10});
    const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sequence,start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true,onUpdate:self=>setStage(self.progress<.31?0:self.progress<.76?1:2)}});
    timeline.to($('.architecture-opening'),{autoAlpha:0,y:mobile?-30:-65,duration:.19},.035)
     .to($('.architecture-frame--galil'),{clipPath:'inset(0% 0% 0% 0%)',duration:.39},.055)
     .to($('.architecture-frame--galil .architecture-image'),{scale:1,yPercent:0,duration:.6},0)
     .to($('.architecture-caption--galil'),{autoAlpha:1,y:0,duration:.12},.31)
     .to($('.architecture-caption--galil'),{autoAlpha:0,y:-24,duration:.11},.59)
     .to($('.architecture-frame--family'),{clipPath:'inset(0% 0% 0% 0%)',duration:.3},.59)
     .to($('.architecture-frame--family .architecture-image'),{scale:1,duration:.41},.59)
     .to($('.architecture-caption--family'),{autoAlpha:1,y:0,duration:.12},.78)
     .fromTo($('.architecture-progress span'),{scaleX:0},{scaleX:1,duration:1},0);
    setStage(timeline.scrollTrigger.progress<.31?0:timeline.scrollTrigger.progress<.76?1:2);
    root.querySelectorAll('.selected .project-card').forEach((card,i)=>{
     gsap.fromTo(card.querySelector('.card-image'),{clipPath:'inset(12% 0% 0% 0%)',y:mobile?35:60},{clipPath:'inset(0% 0% 0% 0%)',y:0,ease:'none',scrollTrigger:{trigger:card,start:'top 96%',end:'top 37%',scrub:true}});
     gsap.fromTo(card.querySelector('.card-info'),{y:mobile?12:24},{y:0,ease:'none',scrollTrigger:{trigger:card,start:'top 90%',end:'bottom 65%',scrub:true}});
    });
    const brand=$('.about-home')[0];
    if(brand){
     gsap.fromTo(brand.querySelector('.about-photo img'),{scale:1.12,yPercent:3},{scale:1,yPercent:-3,ease:'none',scrollTrigger:{trigger:brand,start:'top bottom',end:'bottom top',scrub:true}});
     gsap.fromTo($('.cinematic-word'),{opacity:.18},{opacity:1,stagger:.11,ease:'none',scrollTrigger:{trigger:$('.cinematic-reading')[0],start:'top 84%',end:mobile?'bottom 48%':'bottom 45%',scrub:true}});
    }
    root.querySelectorAll('.value-item').forEach(el=>{
     gsap.fromTo(el,{ '--value-rule':0},{'--value-rule':1,ease:'none',scrollTrigger:{trigger:el,start:'top 90%',end:'top 50%',scrub:true}});
    });
    const closing=$('.cinematic-closing')[0];
    if(closing){
     const closeTimeline=gsap.timeline({scrollTrigger:{trigger:closing,start:'top 95%',end:'top 15%',scrub:true}});
     closeTimeline.fromTo($('.closing-image'),{clipPath:mobile?'inset(8% 6% 0% 6%)':'inset(10% 9% 0% 9%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',duration:1},0)
      .fromTo($('.closing-image img'),{scale:1.12},{scale:1,ease:'none',duration:1},0)
      .fromTo($('.closing-line>span'),{yPercent:110},{yPercent:0,stagger:.1,ease:'power2.out',duration:.5},.26);
    }
    return()=>{sequence.removeAttribute('data-active-stage');resetAccessibility()};
   });
   cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());
  }
  setup();reduced.addEventListener('change',setup);
  const preferences=new MutationObserver(setup);preferences.observe(document.body,{attributes:true,attributeFilter:['class']});
  const refresh=()=>{if(!disposed&&enabled())ScrollTrigger.refresh()};
  document.fonts?.ready.then(refresh);
  window.addEventListener('pageshow',refresh);
  return()=>{ScrollTrigger.removeEventListener('refresh',syncHeader);disposed=true;cancelAnimationFrame(refreshFrame);preferences.disconnect();reduced.removeEventListener('change',setup);window.removeEventListener('pageshow',refresh);media?.revert();root.classList.remove('cinematic-active');resetAccessibility()};
 },[english]);
}
