// One bilingual project model: client records (projects.json + English translation)
// enriched with media and text recovered from the original WordPress site.
import records from './projects.json';
import {projects as english, cities as cityNames} from './english-data.js';
import {recovered} from './recovered.js';
import media from './media.json';

const paragraphs = text => (text || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
const pair = (he, en) => ({he, en});

// Unpublished records stay in the archive without creating public pages or links.
export const projects = records.map((p, i) => {
  const r = recovered[p.id] || {};
  const e = english[i];
  const gallery = (r.gallery || []).filter(name => media[name]).map(name => ({name, ...media[name]}));
  const cover = gallery.find(g => g.name === r.cover) || gallery[0];
  const hero = gallery.find(g => g.name === r.hero) || cover;
  return {
    id: p.id,
    published: p.published !== false,
    slug: r.slug || `project-${p.id}`,
    category: p.category,
    stage: r.stage,
    name: pair(p.name, e.name),
    address: pair(p.address, e.address),
    city: pair(p.city === 'מיקום לבירור' ? '' : p.city, p.city === 'מיקום לבירור' ? '' : cityNames[p.city]),
    tagline: r.tagline,
    story: r.story || pair(paragraphs(p.description), paragraphs(e.description)),
    location: pair(p.location_description, p.location_description ? e.location_description : ''),
    facts: r.facts || pair(p.facts || [], e.facts || []),
    highlights: r.highlights,
    specifications: pair(p.specifications || [], e.specifications || []),
    apartments: pair(p.apartments || [], e.apartments || []),
    architect: r.architect,
    // Client-confirmed financing (Oct 2026 update) takes precedence over the original site.
    financing: p.financed_by ? pair(p.financed_by, 'Mercantile Bank') : r.financing,
    // Client confirmation, 28 Oct 2026: all published projects are occupied and sold out.
    soldOut: p.category === 'completed',
    gallery,
    cover,
    hero,
    clip: r.clip,
    emblem: r.emblem,
    aliases: p.search_aliases || []
  };
}).filter(p => p.published);

export const completedProjects = projects.filter(p => p.category === 'completed');
export const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));
export const byId = Object.fromEntries(projects.map(p => [p.id, p]));
export const featured = ['1', '6', '2', '7', '10'].map(id => byId[id]);
export const showcase = projects.filter(p => p.gallery.length > 1);
