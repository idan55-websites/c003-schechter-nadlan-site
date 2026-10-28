import React, {useRef, useState} from 'react';
import {href, useRouter} from '../lib/router.jsx';
import {strings, contact} from '../data/site.js';
import {projects} from '../data/projects.js';
import {Link, Arrow} from './ui.jsx';

// No server endpoint exists for this static site, so the form prepares an email draft.
// Nothing is stored or transmitted by the website itself.
export function ContactForm({project, compact}) {
  const {route: {lang}} = useRouter();
  const t = strings[lang].form;
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const summary = useRef(null);
  const id = k => `f-${compact ? 'c-' : ''}${k}`;
  const listed = projects.filter(p => p.category !== 'archive');

  function submit(e) {
    e.preventDefault();
    const form = e.currentTarget, d = new FormData(form), next = {};
    const name = String(d.get('name') || '').trim();
    if (name.length < 2) next.name = t.errName;
    if (!/^[+()\d][\d\s().-]{6,24}$/.test(String(d.get('phone') || '').trim())) next.phone = t.errPhone;
    const email = String(d.get('email') || '').trim();
    if (email && !form.elements.email.validity.valid) next.email = t.errEmail;
    if (!d.get('consent')) next.consent = t.errConsent;
    setErrors(next); setDone(false);
    if (Object.keys(next).length) { requestAnimationFrame(() => summary.current?.focus()); return; }
    const lines = [`${t.name}: ${name}`, `${t.phone}: ${d.get('phone')}`, email && `${t.email}: ${email}`, `${t.project}: ${d.get('project') || t.general}`,
      `${t.updates.replace(/ \(.*\)/, '')}: ${d.get('updates') ? '✓' : '—'}`, '', String(d.get('message') || '')].filter(v => v !== false && v !== '');
    location.href = `mailto:${contact.email}?subject=${encodeURIComponent(t.subject(name))}&body=${encodeURIComponent(lines.join('\n'))}`;
    setDone(true);
  }
  const field = (k, label, props, required = true) => <div className={`field ${errors[k] ? 'has-error' : ''}`}>
    <label htmlFor={id(k)}>{label}{required ? <span className="req" aria-hidden="true"> *</span> : <span className="opt"> ({t.optional})</span>}</label>
    <input id={id(k)} name={k} required={required} aria-invalid={errors[k] ? true : undefined} aria-describedby={errors[k] ? `${id(k)}-err` : undefined} {...props}/>
    {errors[k] && <p className="field-error" id={`${id(k)}-err`}>{errors[k]}</p>}
  </div>;

  return <form className={`contact-form ${compact ? 'is-compact' : ''}`} noValidate onSubmit={submit}>
    <fieldset>
      <legend>{t.legend}</legend>
      {Object.keys(errors).length > 0 && <div className="form-errors" role="alert" tabIndex={-1} ref={summary}>
        <p>{t.errorsTitle}</p>
        <ul>{Object.entries(errors).map(([k, msg]) => <li key={k}><a href={`#${id(k)}`} onClick={e => { e.preventDefault(); document.getElementById(id(k)).focus(); }}>{msg}</a></li>)}</ul>
      </div>}
      <div className="form-grid">
        {field('name', t.name, {type: 'text', autoComplete: 'name', maxLength: 80})}
        {field('phone', t.phone, {type: 'tel', autoComplete: 'tel', inputMode: 'tel', maxLength: 26, dir: 'ltr'})}
        {field('email', t.email, {type: 'email', autoComplete: 'email', maxLength: 120, dir: 'ltr'}, false)}
        <div className="field">
          <label htmlFor={id('project')}>{t.project}<span className="opt"> ({t.optional})</span></label>
          <div className="select"><select id={id('project')} name="project" defaultValue={project ? project.name[lang] : ''}>
            <option value="">{t.general}</option>
            {listed.map(p => <option key={p.id} value={p.name[lang]}>{p.name[lang]}</option>)}
          </select></div>
        </div>
        {!compact && <div className="field field-wide">
          <label htmlFor={id('message')}>{t.message}<span className="opt"> ({t.optional})</span></label>
          <textarea id={id('message')} name="message" rows={4} maxLength={1500}/>
        </div>}
      </div>
      <div className={`check ${errors.consent ? 'has-error' : ''}`}>
        <input type="checkbox" id={id('consent')} name="consent" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${id('consent')}-err` : undefined}/>
        <label htmlFor={id('consent')}>{t.consent} <Link to={href(lang, 'privacy')}>{strings[lang].footer.privacy}</Link></label>
        {errors.consent && <p className="field-error" id={`${id('consent')}-err`}>{errors.consent}</p>}
      </div>
      <div className="check"><input type="checkbox" id={id('updates')} name="updates"/><label htmlFor={id('updates')}>{t.updates}</label></div>
      <div className="form-actions">
        <button type="submit" className="btn btn-solid">{t.submit}<Arrow size={20}/></button>
        <p className="form-note">{t.note}</p>
      </div>
      <p className="form-done" role="status">{done ? t.done : ''}</p>
    </fieldset>
  </form>;
}
