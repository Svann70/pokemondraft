/**
 * Item Market sidebar renderer.
 */

import { ITEMS } from '../data/pokemon.js';
import { getState, getMergedPokemon } from '../state.js';
import { STARTING_BUDGET } from '../data/config.js';

export function renderSidebar() {
  const itemList = document.getElementById('itemList');
  const playerList = document.getElementById('playerList');
  if (!itemList || !playerList) return;

  // Render Items
  itemList.innerHTML = ITEMS.map(
    (item) => `
    <div class="item-card">
      <div class="item-card__name">${item.name}</div>
      <div class="item-card__desc">${item.desc}</div>
    </div>
  `
  ).join('');

  // Render Players
  const { claimedMap } = getState();
  const { tiered } = getMergedPokemon();
  
  const playerStats = {};
  
  for (const [pk, owner] of Object.entries(claimedMap)) {
    const ownerUpper = owner.toUpperCase();
    if (!playerStats[ownerUpper]) {
      playerStats[ownerUpper] = { name: owner, spent: 0, pokes: 0 };
    }
    const data = tiered.find(p => p.name === pk);
    if (data && data.cost) {
      playerStats[ownerUpper].spent += data.cost;
    }
    playerStats[ownerUpper].pokes += 1;
  }
  
  const players = Object.values(playerStats).sort((a,b) => b.spent - a.spent);
  
  if (players.length === 0) {
    playerList.innerHTML = `<div style="font-size:0.9rem; color:var(--text-muted); text-align:center; padding: 10px;">No players yet</div>`;
    return;
  }
  
  playerList.innerHTML = players.map(p => {
    const rem = STARTING_BUDGET - p.spent;
    const color = rem < 0 ? 'var(--accent-pink)' : 'var(--accent-green)';
    return `
      <div class="item-card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div>
          <div class="item-card__name">${p.name} <span style="font-size:0.8rem; font-weight:normal; color:var(--text-muted)">(${p.pokes} Pkmn)</span></div>
          <div class="item-card__desc">Spent: ${p.spent} pts</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:1.1rem; font-weight:700; color:${color}">${rem}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px">Left</div>
        </div>
      </div>
    `;
  }).join('');
}
