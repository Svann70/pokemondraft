/**
 * Filter buttons renderer — type filter pills below the search bar.
 */

import { getMergedPokemon, getState, setState } from '../state.js';
import { getAllTypes } from '../utils/helpers.js';

export function renderFilters() {
  const container = document.getElementById('filterGroup');
  if (!container) return;

  const { activeTab, currentFilter } = getState();
  if (activeTab !== 'board') return;

  container.innerHTML = '';

  const { tiered, unassigned } = getMergedPokemon();
  const allTypes = getAllTypes([tiered, unassigned]);

  const frag = document.createDocumentFragment();

  // "All" button
  const allBtn = createFilterBtn('All', 'all', currentFilter === 'all');
  frag.appendChild(allBtn);

  // Type buttons
  allTypes.forEach((type) => {
    frag.appendChild(createFilterBtn(type, type, currentFilter === type));
  });

  container.appendChild(frag);
}

function createFilterBtn(label, value, active) {
  const btn = document.createElement('button');
  btn.className = `filter-btn${active ? ' active' : ''}`;
  btn.textContent = label;
  btn.addEventListener('click', () => setState({ currentFilter: value }));
  return btn;
}
