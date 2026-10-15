import React,{useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import {ArrowUpRight,ArrowUpLeft,Phone,X} from 'lucide-react';
import {asset} from './assets.js';

export function MobileMenu({open,onClose,route,english=false}){
 const panel=useRef(null);const closeAction=useRef(onClose);closeAction.current=onClose;
 useEffect(()=>{
  if(!open)return;
  const trigger=document.querySelector('.site-header .menu-toggle');
  const scrollY=window.scrollY;
  const body=document.body;
  const saved=Object.fromEntries(['position','top','left','right','width','overflow'].map(key=>[key,body.style[key]]));
  Object.assign(body.style,{position:'fixed',top:`-${scrollY}px`,left:'0',right:'0',width:'100%',overflow:'hidden'});
  body.classList.add('mobile-menu-open');
  panel.current?.querySelector('button')?.focus({preventScroll:true});
  function keydown(e){
   if(e.key==='Escape'){e.preventDefault();closeAction.current();return}
   if(e.key!=='Tab')return;
   const nodes=[...panel.current.querySelectorAll('a,button')];const first=nodes[0],last=nodes[nodes.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
  const desktop=matchMedia('(min-width: 761px)');const resized=()=>{if(desktop.matches)closeAction.current()};
  document.addEventListener('keydown',keydown);desktop.addEventListener('change',resized);
  return()=>{
   document.removeEventListener('keydown',keydown);desktop.removeEventListener('change',resized);
   Object.assign(body.style,saved);body.classList.remove('mobile-menu-open');
   // Route navigation starts at the top; dismissing the menu preserves the page position.
   const initialHash=english?`#/en/${route}`:`#/${route}`;
   const samePage=location.hash===initialHash||(!route&&(!location.hash||location.hash==='#/en'));
   window.scrollTo({top:samePage?scrollY:0,behavior:'instant'});
   requestAnimationFrame(()=>{if(trigger?.isConnected&&!trigger.closest('[inert]'))trigger.focus({preventScroll:true})});
  };
 },[open]);
 if(!open)return null;
 const links=english?[['','Home'],['projects','Projects'],['about','About'],['urban','Tama / Urban renewal'],['media','Media'],['residents','Resident services'],['contact','Contact']]:[['','דף הבית'],['projects','פרויקטים'],['about','אודות'],['urban','תמ״א / התחדשות עירונית'],['media','שכטר במדיה'],['residents','שירות לדיירים'],['contact','צור קשר']];
 const href=path=>english?`#/en/${path}`:`#/${path}`;
 const Arrow=english?ArrowUpRight:ArrowUpLeft;
 return createPortal(<div className="mobile-menu" role="dialog" aria-modal="true" aria-label={english?'Site menu':'תפריט האתר'} id="mobile-menu" ref={panel} dir={english?'ltr':'rtl'}>
  <div className="mobile-menu-top"><a className="mobile-menu-brand" href={href('')} onClick={onClose} aria-label={english?'Schechter Real Estate home':'שכטר נדל״ן — דף הבית'}>{english?<span>SCHECHTER<small>REAL ESTATE</small></span>:<img src={asset('images/schechter-brand.svg')} alt="שכטר נדל״ן"/>}</a><button className="mobile-menu-close" onClick={onClose} aria-label={english?'Close menu':'סגירת תפריט'}><X size={25}/></button></div>
  <nav className="mobile-menu-links" aria-label={english?'Mobile navigation':'תפריט ניווט במובייל'}>{links.map(([path,title],i)=><a key={path} href={href(path)} onClick={onClose} aria-current={route===path?'page':undefined} style={{'--menu-index':i}}><span className="mobile-menu-number" aria-hidden="true">0{i+1}</span><span>{title}</span><Arrow size={20}/></a>)}</nav>
  <div className="mobile-menu-bottom"><a href="tel:+972768844262"><Phone size={17}/><span dir="ltr">{english?'+972 76 884 4262':'076-8844262'}</span></a><a href={english?`#/${route}`:`#/en/${route}`} onClick={onClose} lang={english?'he':'en'}>{english?'עברית':'English'}<Arrow size={17}/></a><p>EUROPEAN HERITAGE. ISRAELI VISION.</p></div>
 </div>,document.body);
}
