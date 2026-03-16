/**
 * Item Market sidebar renderer.
 */

import { ITEMS } from '../data/pokemon.js';

export function renderSidebar() {
  const el = document.getElementById('itemList');
  if (!el) return;

  el.innerHTML = ITEMS.map(
    (item) => `
    <div class="item-card">
      <div class="item-card__name">${item.name}</div>
      <div class="item-card__desc">${item.desc}</div>
    </div>
  `
  ).join('');
}
