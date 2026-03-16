/**
 * Tier configuration, type colors, SVG icons, and other UI constants.
 */

export const SVG_ICONS = {
  flame: '<svg viewBox="0 0 24 24" stroke="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  gem: '<svg viewBox="0 0 24 24" stroke="currentColor"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3l1 10"/><path d="M2 9h20"/><path d="m6.5 3 5.5 6 5.5-6"/></svg>',
  star: '<svg viewBox="0 0 24 24" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" stroke="currentColor"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  seedling: '<svg viewBox="0 0 24 24" stroke="currentColor"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>',
  inbox: '<svg viewBox="0 0 24 24" stroke="currentColor"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  search: '<svg viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  box: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  utensils: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
};

export const TIER_CONFIG = {
  18: { label: 'Mythic Tier',   className: 'tier-mythic',   icon: SVG_ICONS.flame },
  15: { label: 'Epic Tier',     className: 'tier-epic',     icon: SVG_ICONS.gem },
  12: { label: 'Rare Tier',     className: 'tier-rare',     icon: SVG_ICONS.star },
  9:  { label: 'Uncommon Tier', className: 'tier-uncommon', icon: SVG_ICONS.leaf },
  6:  { label: 'Common Tier',   className: 'tier-common',   icon: SVG_ICONS.seedling },
};

export const TYPE_COLORS = {
  Normal:   '#a8a878', Fire:     '#f08030', Water:    '#6890f0',
  Grass:    '#78c850', Electric: '#f8d030', Ice:      '#98d8d8',
  Fighting: '#c03028', Poison:   '#a040a0', Ground:   '#e0c068',
  Flying:   '#a890f0', Psychic:  '#f85888', Bug:      '#a8b820',
  Rock:     '#b8a038', Ghost:    '#705898', Dragon:   '#7038f8',
  Dark:     '#705848', Steel:    '#b8b8d0', Fairy:    '#ee99ac',
};

export const SPRITE_BASE_URL = 'https://play.pokemonshowdown.com/sprites/ani/';
export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species/';
