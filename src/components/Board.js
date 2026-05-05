/**
 * Main draft board renderer & interaction handler.
 * Manages tier sections, card rendering, drag-drop, and claiming.
 */

import { TIER_CONFIG, TYPE_COLORS, SVG_ICONS, STARTING_BUDGET } from '../data/config.js';
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

  const { activeTab, currentSearch, tierConfigOverrides } = getState();
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
  
  // Combine all active costs to render tiers even if empty
  const activeCosts = new Set(Object.keys(TIER_CONFIG).map(Number));
  Object.keys(tierConfigOverrides).forEach(c => activeCosts.add(Number(c)));
  
  activeCosts.forEach(c => {
    if (!grouped[c]) grouped[c] = [];
  });
  
  const sortedCosts = Array.from(activeCosts).sort((a, b) => b - a);

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
    const pokemons = grouped[cost];
    // Skip empty dynamic tiers if they are completely custom and empty (optional)
    // but here we just render them anyway so drag & drop works.
    
    const override = tierConfigOverrides[cost];
    const def = TIER_CONFIG[cost];
    
    const tierLabel = override ? override.label : (def ? def.label : `${cost} pts Tier`);
    const tierClass = override ? override.className : (def ? def.className : 'tier-common');
    const tierIcon = override ? override.icon : (def ? def.icon : SVG_ICONS.star);

    html += `
      <section class="tier-section ${tierClass}" style="animation-delay:${Math.min(sIdx * 0.08, 0.5)}s">
        <div class="tier-header">
          <div class="tier-header__indicator"></div>
          <span class="tier-header__icon" style="color:inherit">${tierIcon}</span>
          <span class="tier-header__title">${tierLabel}</span>
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
        const modal = document.getElementById('claimModal');
        const input = document.getElementById('claimModalInput');
        const details = document.getElementById('claimModalDetails');
        const pointsInfo = document.getElementById('claimModalPointsInfo');
        const confirmBtn = document.getElementById('claimModalConfirm');
        const cancelBtn = document.getElementById('claimModalCancel');
        
        if (!modal) {
          // Fallback if modal is missing for some reason
          const player = prompt(`Player claiming ${name}:`);
          if (player && player.trim()) claimPokemon(name, player.trim());
          return;
        }
        
        const { tiered } = getMergedPokemon();
        const pData = tiered.find(p => p.name === name);
        const pkCost = pData && pData.cost ? pData.cost : 0;
        
        // Show details
        details.innerHTML = `
          <img src="${spriteUrl(name)}" style="width:48px;height:48px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
          <div>
            <div style="font-weight:700;font-size:1.1rem;color:var(--text-primary)">${name}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">Cost: <span style="color:var(--accent-gold);font-weight:700">${pkCost} pts</span></div>
          </div>
        `;
        
        input.value = '';
        pointsInfo.innerHTML = '';
        
        const updatePointsInfo = () => {
          const playerName = input.value.trim();
          if (!playerName) {
            pointsInfo.innerHTML = '';
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.pointerEvents = 'none';
            return;
          }
          
          confirmBtn.style.opacity = '1';
          confirmBtn.style.pointerEvents = 'auto';
          
          const updatedState = getState();
          let spent = 0;
          for (const [pk, owner] of Object.entries(updatedState.claimedMap)) {
            if (owner.toLowerCase() === playerName.toLowerCase()) {
              const data = tiered.find(p => p.name === pk);
              if (data && data.cost) spent += data.cost;
            }
          }
          
          const remainingBefore = STARTING_BUDGET - spent;
          const remainingAfter = remainingBefore - pkCost;
          
          const color = remainingAfter < 0 ? 'var(--accent-pink)' : 'var(--accent-green)';
          pointsInfo.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:var(--text-secondary)">
              <span>Sisa Poin Saat Ini:</span> <b>${remainingBefore} pts</b>
            </div>
            <div style="display:flex; justify-content:space-between; padding-top:4px; border-top:1px solid var(--border-subtle)">
              <span>Sisa Poin Setelah Klaim:</span> <b style="color:${color}">${remainingAfter} pts</b>
            </div>
          `;
        };
        
        input.oninput = updatePointsInfo;
        updatePointsInfo(); // initial state
        
        modal.classList.add('active');
        setTimeout(() => input.focus(), 10);
        
        // Cleanup functions
        const cleanup = () => {
          modal.classList.remove('active');
          confirmBtn.onclick = null;
          cancelBtn.onclick = null;
          input.oninput = null;
        };
        
        cancelBtn.onclick = cleanup;
        
        // allow enter key to confirm
        input.onkeydown = (e) => {
          if (e.key === 'Enter' && input.value.trim()) {
            confirmBtn.click();
          }
        };
        
        confirmBtn.onclick = () => {
          const playerName = input.value.trim();
          if (playerName) {
            claimPokemon(name, playerName);
            cleanup();
          }
        };
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
