/**
 * Sidebar renderer — Player Standings + Item Market (with claiming).
 */

import { ITEMS } from '../data/pokemon.js';
import { getState, getMergedPokemon, claimItem } from '../state.js';
import { STARTING_BUDGET } from '../data/config.js';

export function renderSidebar() {
  const itemList = document.getElementById('itemList');
  const playerList = document.getElementById('playerList');
  if (!itemList || !playerList) return;

  const { claimedMap, itemClaimedMap } = getState();
  const { tiered } = getMergedPokemon();

  // ========== Render Items with Claim ==========
  itemList.innerHTML = ITEMS.map((item) => {
    const owner = itemClaimedMap[item.name];
    const isClaimed = !!owner;
    return `
    <div class="item-card ${isClaimed ? 'item-claimed' : ''}">
      <div class="item-card__top">
        <div class="item-card__name">${item.name}</div>
        <button class="item-claim-btn ${isClaimed ? 'taken' : ''}" data-item="${item.name}">
          ${isClaimed ? `<span class="item-owner-name">${owner}</span>` : 'Claim'}
        </button>
      </div>
      <div class="item-card__desc">${item.desc}</div>
    </div>
  `;
  }).join('');

  // Attach item claim events
  itemList.querySelectorAll('.item-claim-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.item;
      const current = itemClaimedMap[name];

      if (current) {
        if (confirm(`Unclaim "${name}" from ${current}?`)) {
          claimItem(name, null);
        }
      } else {
        const player = prompt(`Player claiming ${name}:`);
        if (player && player.trim()) {
          claimItem(name, player.trim());
        }
      }
    });
  });

  // ========== Render Player Standings ==========
  const playerStats = {};
  
  for (const [pk, owner] of Object.entries(claimedMap)) {
    const ownerKey = owner.toUpperCase();
    if (!playerStats[ownerKey]) {
      playerStats[ownerKey] = { name: owner, spent: 0, pokes: 0, items: 0 };
    }
    const data = tiered.find(p => p.name === pk);
    if (data && data.cost) {
      playerStats[ownerKey].spent += data.cost;
    }
    playerStats[ownerKey].pokes += 1;
  }

  // Count items per player
  for (const [, owner] of Object.entries(itemClaimedMap)) {
    const ownerKey = owner.toUpperCase();
    if (!playerStats[ownerKey]) {
      playerStats[ownerKey] = { name: owner, spent: 0, pokes: 0, items: 0 };
    }
    playerStats[ownerKey].items += 1;
  }
  
  const players = Object.values(playerStats).sort((a,b) => b.spent - a.spent);
  
  if (players.length === 0) {
    playerList.innerHTML = `<div class="player-empty">No players yet</div>`;
    return;
  }
  
  playerList.innerHTML = players.map((p, i) => {
    const rem = STARTING_BUDGET - p.spent;
    const color = rem < 0 ? 'var(--accent-pink)' : 'var(--accent-green)';
    const rank = i + 1;
    return `
      <div class="player-card">
        <div class="player-card__rank">#${rank}</div>
        <div class="player-card__info">
          <div class="player-card__name">${p.name}</div>
          <div class="player-card__meta">${p.pokes} Pkmn${p.items > 0 ? ` · ${p.items} Item${p.items > 1 ? 's' : ''}` : ''} · Spent ${p.spent} pts</div>
        </div>
        <div class="player-card__budget">
          <div class="player-card__budget-val" style="color:${color}">${rem}</div>
          <div class="player-card__budget-label">Left</div>
        </div>
      </div>
    `;
  }).join('');
}
