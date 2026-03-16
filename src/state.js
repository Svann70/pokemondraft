/**
 * Centralized application state with event-driven updates.
 * Any module can subscribe to state changes via `subscribe()`.
 * Added localStorage persistence for Draft data!
 */

import { TIERED_POKEMON, UNASSIGNED_POKEMON } from './data/pokemon.js';

const STORAGE_KEY = 'delicious_draft_v2';
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

const state = {
  activeTab: 'board',   // 'board' | 'admin'
  isAdminLoggedIn: sessionStorage.getItem('admin_auth') === 'true',
  currentFilter: 'all',
  currentSearch: '',
  claimedMap: saved.claimedMap || {},       // pokemonName -> playerName
  costOverrides: saved.costOverrides || {}, // pokemonName -> newCost (number or null)
  pokedexCache: {},     // pokemonName -> flavor text
};

const listeners = new Set();

export function getState() {
  return { ...state };
}

export function setState(updates) {
  Object.assign(state, updates);
  
  // Save to localStorage if persistent fields changed
  if (updates.claimedMap !== undefined || updates.costOverrides !== undefined) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      claimedMap: state.claimedMap,
      costOverrides: state.costOverrides
    }));
  }
  
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function claimPokemon(name, player) {
  const newMap = { ...state.claimedMap };
  if (player === null) {
    delete newMap[name]; // Unclaim
  } else {
    newMap[name] = player;
  }
  setState({ claimedMap: newMap });
}

export function updatePokemonCost(name, cost) {
  const newOverrides = { ...state.costOverrides, [name]: cost };
  setState({ costOverrides: newOverrides });
}

export function loginAdmin(password) {
  // Simple hardcoded password for the client-side demo
  if (password === 'ipanganteng') {
    sessionStorage.setItem('admin_auth', 'true');
    setState({ isAdminLoggedIn: true });
    return true;
  }
  return false;
}

export function logoutAdmin() {
  sessionStorage.removeItem('admin_auth');
  setState({ isAdminLoggedIn: false, activeTab: 'board' });
}

export function resetAllData() {
  if (confirm("Are you sure you want to reset all claims and point overrides?")) {
    setState({ claimedMap: {}, costOverrides: {} });
  }
}

export function cachePokedex(name, text) {
  state.pokedexCache[name] = text;
}

/**
 * Returns tiered and unassigned arrays with overrides applied
 */
export function getMergedPokemon() {
  const allRaw = [...TIERED_POKEMON, ...UNASSIGNED_POKEMON];
  const tiered = [];
  const unassigned = [];
  
  allRaw.forEach(p => {
    const override = state.costOverrides[p.name];
    const currentCost = override !== undefined ? override : p.cost;
    
    // Valid number > 0 goes to tiered, otherwise back to unassigned pool
    if (typeof currentCost === 'number' && currentCost > 0) {
      tiered.push({ ...p, cost: currentCost });
    } else {
      unassigned.push({ ...p, cost: null });
    }
  });
  
  // Sort tiered by cost descending
  tiered.sort((a, b) => b.cost - a.cost);
  
  return { tiered, unassigned };
}
