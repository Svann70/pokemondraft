/**
 * Pokédex tooltip handler.
 * Shows flavor text from PokéAPI on card hover.
 */

import { fetchPokedex } from '../utils/helpers.js';

const tooltip = () => document.getElementById('pokedexTooltip');

export function showTooltip(card) {
  const el = tooltip();
  if (!el) return;

  const name = card.dataset.name;
  const rect = card.getBoundingClientRect();

  el.style.display = 'block';
  el.style.left = Math.min(rect.right + 10, window.innerWidth - 280) + 'px';
  el.style.top = Math.max(rect.top, 10) + 'px';
  el.querySelector('.pokedex-tooltip__title').textContent = name;
  el.querySelector('.pokedex-tooltip__body').textContent = 'Loading Pokédex data...';

  fetchPokedex(name).then((text) => {
    // Only update if still showing this pokemon
    if (el.querySelector('.pokedex-tooltip__title').textContent === name) {
      el.querySelector('.pokedex-tooltip__body').textContent = text;
    }
  });
}

export function hideTooltip() {
  const el = tooltip();
  if (el) el.style.display = 'none';
}
