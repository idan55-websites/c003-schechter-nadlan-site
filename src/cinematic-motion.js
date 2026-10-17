import {useLayoutEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
// Keep native touch scrolling; browser toolbar height changes should not reset a scene.
ScrollTrigger.config({ignoreMobileResize:true});

// Wrap each <br>-separated line in a mask; restore() puts the original nodes back for React.
function splitLines(el){
 const original=[...el.childNodes];const groups=[[]];
 original.forEach(node=>node.nodeName==='BR'?groups.push([]):groups.at(-1).push(node));
 const inners=groups.filter(group=>group.length).map(group=>{
  const line=document.createElement('span'),inner=document.createElement('span');
  line.className='split-line';inner.className='split-inner';inner.append(...group);line.append(inner);return inner;
 });
 el.replaceChildren(...inners.map(inner=>inner.parentNode));
 return {inners,restore:()=>el.replaceChildren(...original)};
}

export function useCinematicHome(rootRef,english=false){
 useLayoutEffect(()=>{
  const root=rootRef.current;if(!root)return;
  const syncHeader=()=>document.querySelector('.site-header')?.classList.toggle('scrolled',window.scrollY>80);
  ScrollTrigger.addEventListener('refresh',syncHeader);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const heroVisibility=new IntersectionObserver(([entry])=>root.classList.toggle('hero-visible',entry.isIntersecting),{threshold:.05});
  const openingHero=root.querySelector('.hero');if(openingHero)heroVisibility.observe(openingHero);
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
    const initialClip=mobile?'inset(34% 7% 28% 7%)':'inset(36% 9% 7% 9%)';
    const wipe=english?'inset(0% 100% 0% 0%)':'inset(0% 0% 0% 100%)';
    gsap.set($('.architecture-frame--galil'),{clipPath:initialClip});
    gsap.set($('.architecture-frame--family'),{clipPath:wipe});
    gsap.set($('.architecture-caption'),{autoAlpha:0,y:28});
    gsap.set($('.architecture-image'),{scale:1.12});
    if(!mobile)gsap.set($('.architecture-frame--galil .architecture-image'),{yPercent:10});
    const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sequence,start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true,onUpdate:self=>setStage(self.progress<.31?0:self.progress<.76?1:2)}});
    timeline.to($('.architecture-opening'),{autoAlpha:0,y:mobile?-30:-65,duration:.19},.035)
     .fromTo($('.architecture-frame--galil'),{clipPath:initialClip},{clipPath:'inset(0% 0% 0% 0%)',duration:.39},.055)
     .to($('.architecture-frame--galil .architecture-image'),{scale:1,yPercent:0,duration:.6},0)
     .to($('.architecture-caption--galil'),{autoAlpha:1,y:0,duration:.12},.31)
     .to($('.architecture-caption--galil'),{autoAlpha:0,y:-24,duration:.11},.59)
     .to($('.architecture-frame--family'),{clipPath:'inset(0% 0% 0% 0%)',duration:.3},.59)
     .to($('.architecture-frame--family .architecture-image'),{scale:1,duration:.41},.59)
     .to($('.architecture-caption--family'),{autoAlpha:1,y:0,duration:.12},.78)
     .fromTo($('.architecture-progress span'),{scaleX:0},{scaleX:1,duration:1},0);
    if(!mobile)timeline.fromTo($('.architecture-frame--family .architecture-image'),{yPercent:14},{yPercent:0,duration:.41},.59)
     .fromTo($('.architecture-backdrop'),{scale:1.25},{scale:1.05,duration:.41},.59);
    setStage(timeline.scrollTrigger.progress<.31?0:timeline.scrollTrigger.progress<.76?1:2);
    // Timed (not scrubbed) reveals play fully even on a quick phone flick, and rewind when scrolling back up.
    const onEnter=(trigger,start='top 86%')=>({trigger,start,toggleActions:'play none none reverse'});
    const restores=[];
    root.querySelectorAll('.selected .section-heading h2,.values-heading h2,.urban-home h2,.media-teaser h2').forEach(heading=>{
     const {inners,restore}=splitLines(heading);restores.push(restore);
     gsap.fromTo(inners,{yPercent:118},{yPercent:0,duration:1.2,ease:'power4.out',stagger:.13,scrollTrigger:onEnter(heading,'top 90%')});
    });
    root.querySelectorAll('.selected .eyebrow,.values-heading .eyebrow,.urban-home .eyebrow,.media-teaser .eyebrow,.about-copy .eyebrow,.heading-aside>*,.about-copy>p,.about-copy>.text-link,.urban-home>div:nth-child(2)>*,.media-teaser>div:last-child>*').forEach(el=>{
     gsap.fromTo(el,{y:mobile?40:34,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',delay:el.matches('.eyebrow')?0:.15,scrollTrigger:onEnter(el,'top 92%')});
    });
    gsap.fromTo($('.intro-strip>*'),{y:14,opacity:0},{y:0,opacity:1,duration:.8,stagger:.08,ease:'power3.out',scrollTrigger:onEnter($('.intro-strip')[0],'top 98%')});
    // Phones get compositor-only reveals (transform/opacity): animating clip-path repaints every frame on iOS.
    const touch=mobile||matchMedia('(pointer: coarse)').matches;
    root.querySelectorAll('.selected .project-card').forEach(card=>{
     const frame=card.querySelector('.card-image'),img=frame.querySelector('img');
     const reveal=gsap.timeline({scrollTrigger:onEnter(card,touch?'top 90%':'top 84%')});
     if(touch)reveal.fromTo(frame,{y:90,opacity:0,scale:.92},{y:0,opacity:1,scale:1,duration:1.1,ease:'power3.out'})
      .fromTo(img,{scale:1.35},{scale:1,duration:1.6,ease:'expo.out'},0);
     else reveal.fromTo(frame,{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.35,ease:'expo.inOut'})
      .fromTo(img,{scale:1.4},{scale:1.12,duration:1.7,ease:'expo.out'},.2);
     reveal.fromTo(frame.querySelectorAll('.card-location,.card-image-label'),{opacity:0,y:10},{opacity:1,y:0,duration:.6,stagger:.1,ease:'power2.out'},touch?.6:.95)
      .fromTo(card.querySelector('.card-info').children,{opacity:0,y:26},{opacity:1,y:0,duration:.8,stagger:.08,ease:'power3.out'},touch?.35:.55);
     if(img&&!touch)gsap.fromTo(img,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:frame,start:'top bottom',end:'bottom top',scrub:true}});
    });
    const brand=$('.about-home')[0];
    if(brand){
     const photo=brand.querySelector('.about-photo');
     if(touch){
      gsap.timeline({scrollTrigger:onEnter(photo,'top 88%')})
       .fromTo(photo,{opacity:0,y:70},{opacity:1,y:0,duration:1.1,ease:'power3.out'})
       .fromTo(photo.querySelector('img'),{scale:1.3},{scale:1,duration:1.8,ease:'expo.out'},0)
       .fromTo(photo.querySelectorAll('.photo-label,.photo-outline'),{opacity:0,y:16},{opacity:1,y:0,duration:.8,stagger:.12,ease:'power3.out'},.6);
     }else{
      gsap.fromTo(photo,{clipPath:english?'inset(0% 100% 0% 0%)':'inset(0% 0% 0% 100%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.5,ease:'expo.inOut',scrollTrigger:onEnter(brand,'top 78%')});
      gsap.fromTo(photo.querySelectorAll('.photo-label,.photo-outline'),{opacity:0,y:16},{opacity:1,y:0,duration:.9,delay:.9,stagger:.12,ease:'power3.out',scrollTrigger:onEnter(brand,'top 78%')});
      gsap.fromTo(photo.querySelector('img'),{scale:1.2,yPercent:4},{scale:1.04,yPercent:-4,ease:'none',scrollTrigger:{trigger:brand,start:'top bottom',end:'bottom top',scrub:true}});
     }
     gsap.fromTo($('.cinematic-word'),{opacity:.14,y:'.18em'},{opacity:1,y:0,stagger:.11,ease:'none',scrollTrigger:{trigger:$('.cinematic-reading')[0],start:'top 86%',end:mobile?'bottom 52%':'bottom 45%',scrub:true}});
     const signature=brand.querySelector('.signature');
     if(signature)gsap.fromTo(signature,{xPercent:english?-28:28,opacity:0},touch?{xPercent:0,opacity:.28,duration:1.4,ease:'power3.out',scrollTrigger:onEnter(signature,'top 95%')}:{xPercent:0,opacity:.28,ease:'none',scrollTrigger:{trigger:signature,start:'top bottom',end:'bottom 60%',scrub:true}});
    }
    root.querySelectorAll('.value-item').forEach(el=>{
     const reveal=gsap.timeline({scrollTrigger:onEnter(el,'top 88%')});
     if(touch)reveal.fromTo(el,{'--value-rule':0},{'--value-rule':1,duration:1,ease:'power2.inOut'},0);
     else gsap.fromTo(el,{'--value-rule':0},{'--value-rule':1,ease:'none',scrollTrigger:{trigger:el,start:'top 90%',end:'top 50%',scrub:true}});
     reveal.fromTo(el.querySelector('.value-number'),{yPercent:70,opacity:0},{yPercent:0,opacity:1,duration:1,ease:'power4.out'},0)
      .fromTo(el.querySelectorAll(':scope>small,:scope>h3,:scope>p'),{y:28,opacity:0},{y:0,opacity:1,duration:.85,stagger:.09,ease:'power3.out'},.12)
      .fromTo(el.querySelector(':scope>svg'),{rotate:english?-90:90,opacity:0},{rotate:0,opacity:1,duration:1,ease:'power3.out'},.2);
    });
    if(!touch){
     gsap.fromTo($('.values-word'),{yPercent:-30},{yPercent:30,ease:'none',scrollTrigger:{trigger:$('.values-section')[0],start:'top bottom',end:'bottom top',scrub:true}});
     gsap.fromTo($('.urban-icon'),{yPercent:30,rotate:-8},{yPercent:-25,rotate:4,ease:'none',scrollTrigger:{trigger:$('.urban-home')[0],start:'top bottom',end:'bottom top',scrub:true}});
    }
    const closing=$('.cinematic-closing')[0];
    if(closing){
     const closeTimeline=gsap.timeline({scrollTrigger:{trigger:closing,start:'top 95%',end:'top 15%',scrub:true}});
     closeTimeline.fromTo($('.closing-image'),{clipPath:mobile?'inset(8% 6% 0% 6%)':'inset(10% 9% 0% 9%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',duration:1},0)
      .fromTo($('.closing-image img'),{scale:1.12},{scale:1,ease:'none',duration:1},0)
      .fromTo($('.closing-line>span'),{yPercent:110},{yPercent:0,stagger:.1,ease:'power2.out',duration:.5},.26)
      .fromTo($('.closing-content>p,.closing-actions>*'),{y:24,opacity:0},{y:0,opacity:1,stagger:.06,ease:'power2.out',duration:.35},.5);
    }
    return()=>{sequence.removeAttribute('data-active-stage');resetAccessibility();restores.forEach(restore=>restore())};
   });
   cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());
  }
  setup();reduced.addEventListener('change',setup);
  const preferences=new MutationObserver(setup);preferences.observe(document.body,{attributes:true,attributeFilter:['class']});
  const refresh=()=>{if(!disposed&&enabled())ScrollTrigger.refresh()};
  document.fonts?.ready.then(refresh);
  window.addEventListener('pageshow',refresh);
  return()=>{ScrollTrigger.removeEventListener('refresh',syncHeader);disposed=true;cancelAnimationFrame(refreshFrame);preferences.disconnect();heroVisibility.disconnect();reduced.removeEventListener('change',setup);window.removeEventListener('pageshow',refresh);media?.revert();root.classList.remove('cinematic-active','hero-visible');resetAccessibility()};
 },[english]);
}
