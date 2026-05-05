/**
 * Centralized application state with event-driven updates.
 * Any module can subscribe to state changes via `subscribe()`.
 * Added localStorage persistence for Draft data!
 */

import { TIERED_POKEMON, UNASSIGNED_POKEMON } from './data/pokemon.js';
import { supabase, isSupabaseEnabled } from './supabase.js';

const STORAGE_KEY = 'delicious_draft_v2';
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

const state = {
  activeTab: 'board',   // 'board' | 'admin'
  isAdminLoggedIn: sessionStorage.getItem('admin_auth') === 'true',
  currentFilter: 'all',
  currentSearch: '',
  claimedMap: saved.claimedMap || {},       // pokemonName -> playerName
  costOverrides: saved.costOverrides || {}, // pokemonName -> newCost (number or null)
  tierConfigOverrides: saved.tierConfigOverrides || {}, // tierCost -> { label, className, icon }
  pokedexCache: {},     // pokemonName -> flavor text
};

const listeners = new Set();

export function getState() {
  return { ...state };
}

export function setState(updates, fromDatabase = false) {
  Object.assign(state, updates);
  
  // Save to localStorage if persistent fields changed
  if (updates.claimedMap !== undefined || updates.costOverrides !== undefined || updates.tierConfigOverrides !== undefined) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      claimedMap: state.claimedMap,
      costOverrides: state.costOverrides,
      tierConfigOverrides: state.tierConfigOverrides
    }));
    
    // Sync to Supabase if enabled and update is local
    if (isSupabaseEnabled && !fromDatabase) {
      const payload = {
        id: 1, 
        state_data: {
          claimedMap: state.claimedMap,
          costOverrides: state.costOverrides,
          tierConfigOverrides: state.tierConfigOverrides
        }
      };
      
      supabase
        .from('draft_state')
        .upsert(payload)
        .then(({ error }) => {
          if (error) console.error("Supabase sync error:", error);
        });
    }
  }
  
  listeners.forEach((fn) => fn(state));
}

// Subscribe to Supabase real-time updates and fetch initial state
if (isSupabaseEnabled) {
  // 1. Fetch initial state
  supabase
    .from('draft_state')
    .select('state_data')
    .eq('id', 1)
    .single()
    .then(({ data, error }) => {
      if (data && data.state_data) {
        setState({
          claimedMap: data.state_data.claimedMap || {},
          costOverrides: data.state_data.costOverrides || {},
          tierConfigOverrides: data.state_data.tierConfigOverrides || {}
        }, true);
      }
    });

  // 2. Listen for realtime changes
  supabase
    .channel('draft_state_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'draft_state', filter: 'id=eq.1' }, 
      (payload) => {
        console.log("Supabase Realtime Payload Received:", payload);
        if (payload.new && payload.new.state_data) {
          setState({
            claimedMap: payload.new.state_data.claimedMap || {},
            costOverrides: payload.new.state_data.costOverrides || {},
            tierConfigOverrides: payload.new.state_data.tierConfigOverrides || {}
          }, true);
        }
      }
    )
    .subscribe();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Sync state across multiple tabs on the same device
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    try {
      const newData = JSON.parse(e.newValue || '{}');
      state.claimedMap = newData.claimedMap || {};
      state.costOverrides = newData.costOverrides || {};
      state.tierConfigOverrides = newData.tierConfigOverrides || {};
      
      // Notify all components to re-render
      listeners.forEach((fn) => fn(state));
    } catch (err) {
      console.error("Error syncing state from storage:", err);
    }
  }
});

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

export function updateTierConfig(cost, label, iconHtml = null) {
  const newOverrides = { ...state.tierConfigOverrides };
  if (label === null) {
    // Delete tier override
    delete newOverrides[cost];
  } else {
    const existing = newOverrides[cost] || {};
    newOverrides[cost] = {
      label,
      className: existing.className || 'tier-common',
      icon: iconHtml || existing.icon || '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
    };
  }
  setState({ tierConfigOverrides: newOverrides });
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
