import {useEffect} from 'react';

export function useMotion(route){
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const touch=matchMedia('(max-width: 760px)');
  const main=document.querySelector('main');
  if(!main)return;
  const selector='.section-heading,.project-card,.about-copy,.about-photo,.urban-home>div,.contact-banner>div,.values-heading,.value-item,.journey-step,.about-page>div,.detail-title,.contact-details,.contact-form,.company-disciplines article,.press-list>li,.residents-layout>div,.media-teaser>div';
  const registered=new Set();let revealObserver,heroObserver,frame;
  const enabled=()=>!reduced.matches&&!document.body.classList.contains('reduce-motion');
  function register(){
   if(!enabled())return;
   const nodes=[...main.querySelectorAll(selector)].filter(el=>!el.closest('.cinematic-home'));
   nodes.forEach((el,i)=>{
    if(registered.has(el))return;
    registered.add(el);el.classList.add('reveal');
    el.style.setProperty('--reveal-delay',`${el.matches('.project-card,.value-item,.company-disciplines article,.press-list>li')?(i%3)*(touch.matches?85:75):0}ms`);
    revealObserver?.observe(el);
   });
  }
  function setup(){
   revealObserver?.disconnect();heroObserver?.disconnect();
   const active=enabled();document.documentElement.classList.toggle('motion-enabled',active);
   if(!active){registered.forEach(el=>el.classList.add('revealed'));return}
   revealObserver=new IntersectionObserver(entries=>{for(const {target,isIntersecting} of entries)if(isIntersecting){target.classList.add('revealed');revealObserver.unobserve(target)}},{threshold:touch.matches ? .01 : .08,rootMargin:touch.matches?'0px 0px -36px 0px':'0px'});
   registered.forEach(el=>{if(!el.classList.contains('revealed'))revealObserver.observe(el)});
   register();
   const hero=main.querySelector('.hero:not(.cinematic-home .hero)');
   if(hero){heroObserver=new IntersectionObserver(([entry])=>hero.classList.toggle('hero-in-view',entry.isIntersecting));heroObserver.observe(hero)}
  }
  function update(){
   cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
    const y=window.scrollY;
    document.documentElement.style.setProperty('--scroll-progress',`${y/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100}%`);
    document.querySelector('.site-header')?.classList.toggle('scrolled',y>80);
    if(enabled())main.querySelector('.hero:not(.cinematic-home .hero)')?.style.setProperty('--parallax',`${Math.min(y*(touch.matches ? .09 : .2),touch.matches?60:160)}px`);
   });
  }
  setup();update();
  const contentObserver=new MutationObserver(register);contentObserver.observe(main,{childList:true,subtree:true});
  const preferences=new MutationObserver(()=>{setup();update()});preferences.observe(document.body,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',setup);touch.addEventListener('change',setup);window.addEventListener('scroll',update,{passive:true});
  return()=>{revealObserver?.disconnect();heroObserver?.disconnect();contentObserver.disconnect();preferences.disconnect();reduced.removeEventListener('change',setup);touch.removeEventListener('change',setup);window.removeEventListener('scroll',update);cancelAnimationFrame(frame)};
 },[route]);
}
