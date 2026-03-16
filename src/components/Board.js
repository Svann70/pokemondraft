/**
 * Main draft board renderer & interaction handler.
 * Manages tier sections, card rendering, drag-drop, and claiming.
 */

import { TIER_CONFIG, TYPE_COLORS, SVG_ICONS } from '../data/config.js';
import { getMergedPokemon, getState, claimPokemon, updatePokemonCost } from '../state.js';
import { spriteUrl } from '../utils/helpers.js';
import { showTooltip, hideTooltip } from './Tooltip.js';

let draggedEl = null;

// ====== Filtering helpers ======
function filterPokemon(list) {
  const { currentFilter, currentSearch } = getState();
  return list.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(currentSearch);
    const matchesFilter = currentFilter === 'all' || p.types.includes(currentFilter);
    return matchesSearch && matchesFilter;
  });
}

// ====== Card HTML builder ======
function buildCardHTML(p, sectionIdx, cardIdx, costOverride) {
  const cost = costOverride !== undefined ? costOverride : p.cost;
  const { claimedMap } = getState();
  const isClaimed = !!claimedMap[p.name];
  const claimLabel = isClaimed ? `Taken · ${claimedMap[p.name]}` : 'Claim';
  const claimClass = isClaimed ? 'pokemon-card__claim-btn taken' : 'pokemon-card__claim-btn';
  const claimedClass = isClaimed ? ' claimed' : '';

  return `
    <div class="pokemon-card${claimedClass}" draggable="true"
         data-name="${p.name}" data-cost="${cost || ''}"
         style="animation-delay:${Math.min((sectionIdx * 0.08) + (cardIdx * 0.03), 0.5)}s">
      <div class="pokemon-card__sprite-wrap">
        <img class="pokemon-card__sprite" src="${spriteUrl(p.name)}" alt="${p.name}" loading="lazy">
      </div>
      <div class="pokemon-card__name">${p.name}</div>
      <div class="pokemon-card__cost">${cost ? cost + ' pts' : '— pts'}</div>
      <div class="pokemon-card__type-dots">
        ${p.types.map((t) => `<span class="type-dot" style="background:${TYPE_COLORS[t] || '#888'}" title="${t}"></span>`).join('')}
      </div>
      <button class="${claimClass}" data-pokemon="${p.name}">${claimLabel}</button>
    </div>
  `;
}

// ====== Board render ======
export function renderBoard() {
  const main = document.getElementById('mainContent');
  if (!main) return;

  const { activeTab, currentSearch } = getState();
  if (activeTab !== 'board') {
    main.style.display = 'none';
    return;
  }
  main.style.display = 'block';

  const { tiered, unassigned } = getMergedPokemon();
  const filteredTiered = filterPokemon(tiered);
  const filteredUnassigned = filterPokemon(unassigned);

  // Group tiered by cost
  const grouped = {};
  filteredTiered.forEach((p) => {
    if (!grouped[p.cost]) grouped[p.cost] = [];
    grouped[p.cost].push(p);
  });
  
  // Also make sure active dynamic tiers from config exist (like 18, 15, 12, 9, 6)
  // so people can drag into empty tiers!
  [18, 15, 12, 9, 6].forEach(c => {
    if (!grouped[c]) grouped[c] = [];
  });
  
  const sortedCosts = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  // Empty state
  if (sortedCosts.length === 0 && filteredUnassigned.length === 0) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">${SVG_ICONS.search}</div>
        <p class="empty-state__text">No Pokemon found matching your search.</p>
      </div>`;
    return;
  }

  let html = '';

  // Tier sections
  sortedCosts.forEach((cost, sIdx) => {
    const tier = TIER_CONFIG[cost] || { label: `${cost} pts Tier`, className: 'tier-common', icon: SVG_ICONS.star };
    const pokemons = grouped[cost];

    html += `
      <section class="tier-section ${tier.className}" style="animation-delay:${Math.min(sIdx * 0.08, 0.5)}s">
        <div class="tier-header">
          <div class="tier-header__indicator"></div>
          <span class="tier-header__icon" style="color:inherit">${tier.icon}</span>
          <span class="tier-header__title">${tier.label}</span>
          <span class="tier-header__count">${pokemons.length} Pokémon</span>
          <span class="tier-header__pts">${cost} pts each</span>
        </div>
        <div class="pokemon-grid" data-tier-cost="${cost}">
          ${pokemons.map((p, i) => buildCardHTML(p, sIdx, i)).join('')}
        </div>
      </section>`;
  });

  // Unassigned pool - we add a collapsible wrap to make it nicer!
  if (filteredUnassigned.length > 0 || currentSearch === '') {
    const sIdx = sortedCosts.length;
    html += `
      <section class="tier-section tier-unassigned" style="animation-delay:${Math.min(sIdx * 0.08, 0.5)}s">
        <div class="tier-header">
          <div class="tier-header__indicator"></div>
          <span class="tier-header__icon" style="color:inherit">${SVG_ICONS.inbox}</span>
          <span class="tier-header__title">Unassigned Pool</span>
          <span class="tier-header__count">${filteredUnassigned.length} Pokémon</span>
          <span class="tier-header__pts">Drag to assign</span>
        </div>
        <div class="pokemon-grid" data-tier-cost="pool">
          ${filteredUnassigned.map((p, i) => buildCardHTML(p, sIdx, i, null)).join('')}
        </div>
      </section>`;
  }

  main.innerHTML = html;
  attachCardInteractions();
}

// ====== Interactions ======
function attachCardInteractions() {
  // --- Claim buttons ---
  document.querySelectorAll('.pokemon-card__claim-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.pokemon;
      const { claimedMap } = getState();
      
      if (claimedMap[name]) {
        if (confirm(`Unclaim ${name}? It is currently taken by ${claimedMap[name]}.`)) {
          claimPokemon(name, null); // Unclaim
        }
      } else {
        const player = prompt(`Player claiming ${name}:`);
        if (player && player.trim()) {
          claimPokemon(name, player.trim());
        }
      }
    });
  });

  // --- Drag & Drop on cards ---
  document.querySelectorAll('.pokemon-card[draggable]').forEach((card) => {
    card.addEventListener('dragstart', (e) => {
      draggedEl = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.name);
    });
    card.addEventListener('dragend', () => {
      if (draggedEl) draggedEl.classList.remove('dragging');
      draggedEl = null;
      document.querySelectorAll('.pokemon-grid.drag-over').forEach((g) => g.classList.remove('drag-over'));
    });

    // Tooltip
    card.addEventListener('mouseenter', () => showTooltip(card));
    card.addEventListener('mouseleave', hideTooltip);
  });

  // --- Drag & Drop on grids ---
  document.querySelectorAll('.pokemon-grid').forEach((grid) => {
    grid.addEventListener('dragover', (e) => {
      e.preventDefault();
      grid.classList.add('drag-over');
    });
    grid.addEventListener('dragleave', () => grid.classList.remove('drag-over'));
    grid.addEventListener('drop', (e) => {
      e.preventDefault();
      grid.classList.remove('drag-over');
      if (!draggedEl) return;

      const tierCostStr = grid.dataset.tierCost;
      const pokemonName = draggedEl.dataset.name;
      
      const newCost = (tierCostStr && tierCostStr !== 'pool') ? Number(tierCostStr) : null;
      
      // Tell state to update the override! Re-rendering will automatically happen!
      updatePokemonCost(pokemonName, newCost);
      draggedEl = null;
    });
  });
}
