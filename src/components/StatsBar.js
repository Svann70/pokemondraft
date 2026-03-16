/**
 * Stats bar renderer — shows total pokémon, types, points, claimed.
 */

import { getMergedPokemon, getState } from '../state.js';
import { getAllTypes } from '../utils/helpers.js';

export function renderStats() {
  const el = document.getElementById('statsBar');
  const controls = document.getElementById('controls');
  if (!el || !controls) return;

  const { activeTab, claimedMap } = getState();
  if (activeTab !== 'board') {
    el.style.display = 'none';
    controls.style.display = 'none';
    return;
  }
  
  el.style.display = 'flex';
  controls.style.display = 'flex';

  const { tiered, unassigned } = getMergedPokemon();
  const allPokemon = [...tiered, ...unassigned];
  
  const total = allPokemon.length;
  const types = getAllTypes([allPokemon]).length;
  const totalPts = tiered.reduce((s, p) => s + (p.cost || 0), 0);
  const claimed = Object.keys(claimedMap).length;

  el.innerHTML = `
    <div class="stat-item"><span class="stat-item__value">${total}</span><span class="stat-item__label">Pokémon</span></div>
    <div class="stat-item"><span class="stat-item__value">${types}</span><span class="stat-item__label">Types</span></div>
    <div class="stat-item"><span class="stat-item__value">${totalPts}</span><span class="stat-item__label">Total Pts</span></div>
    <div class="stat-item"><span class="stat-item__value">${claimed}</span><span class="stat-item__label">Claimed</span></div>
  `;
}
