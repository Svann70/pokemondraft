/**
 * Admin Dashboard view
 * Displays a table of all pokemon to edit costs quickly.
 */

import { getMergedPokemon, getState, updatePokemonCost, resetAllData, loginAdmin, logoutAdmin } from '../state.js';
import { TYPE_COLORS, SVG_ICONS } from '../data/config.js';

export function renderAdmin() {
  const container = document.getElementById('adminContent');
  if (!container) return;

  const { activeTab, currentSearch, isAdminLoggedIn } = getState();
  if (activeTab !== 'admin') {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';

  if (!isAdminLoggedIn) {
    container.innerHTML = `
      <div class="login-wrapper">
        <div class="login-box">
          <h2>Admin Authentication</h2>
          <p>Please log in to edit the Pokémon Draft Board.</p>
          <div style="margin:20px 0;">
            <input type="password" id="adminPassword" class="search-box__input" style="padding:12px 16px;text-align:center" placeholder="Password">
          </div>
          <button class="filter-btn active" id="adminLoginBtn" style="width:100%;padding:14px;font-size:1rem;">Access Dashboard</button>
          <p id="adminLoginError" style="color:var(--accent-pink);margin-top:12px;font-size:0.85rem;display:none;">Incorrect password.</p>
        </div>
      </div>
    `;

    const handleLogin = () => {
      const pwd = document.getElementById('adminPassword').value;
      if (!loginAdmin(pwd)) {
        document.getElementById('adminLoginError').style.display = 'block';
      }
    };

    document.getElementById('adminLoginBtn').addEventListener('click', handleLogin);
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
    // Focus the input
    setTimeout(() => {
      const pwdInput = document.getElementById('adminPassword');
      if (pwdInput) pwdInput.focus();
    }, 10);
    return;
  }

  // --- Logged in View ---
  const { tiered, unassigned } = getMergedPokemon();
  const allPokemon = [...tiered, ...unassigned];

  // Filter based on search
  const filtered = allPokemon.filter(p => p.name.toLowerCase().includes(currentSearch));

  let html = `
    <div class="admin-header">
      <div class="admin-header__text">
        <h2>Admin Dashboard</h2>
        <p>Edit point costs or manage overrides. Leave cost empty to move to Unassigned Pool.</p>
      </div>
      <div class="admin-header__actions">
        <button class="btn-danger" id="resetDataBtn">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span class="hide-mobile-text">Reset All</span>
        </button>
        <button class="filter-btn" id="logoutDataBtn">
          Logout
        </button>
      </div>
    </div>

    <div class="admin-search">
      <div class="search-box">
        <span class="search-box__icon">${SVG_ICONS.search}</span>
        <input type="text" class="search-box__input" id="adminSearchInput" placeholder="Search Pokemon to edit..." value="${currentSearch}">
      </div>
    </div>
    
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Pokémon</th>
            <th class="hide-mobile-col">Types</th>
            <th width="140">Cost (Pts)</th>
            <th width="120">Status</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(p => {
            const isUnassigned = p.cost === null || p.cost === undefined;
            return `
              <tr>
                <td class="admin-table__name">
                  <div style="display:flex;align-items:center;gap:8px">
                    <img src="https://play.pokemonshowdown.com/sprites/ani/${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.gif" style="width:36px;height:36px;object-fit:contain" alt="">
                    <b>${p.name}</b>
                  </div>
                  <!-- Mobile types summary -->
                  <div class="show-mobile-col" style="margin-top:4px">
                    ${p.types.map(t => `<span style="font-size:10px;color:var(--text-secondary);margin-right:4px">${t}</span>`).join('')}
                  </div>
                </td>
                <td class="hide-mobile-col">
                  <div class="pokemon-card__type-dots style-left">
                    ${p.types.map((t) => `<span class="type-dot" style="background:${TYPE_COLORS[t] || '#888'}" title="${t}"></span> <small style="color:var(--text-muted);font-size:10px">${t}</small>`).join('&nbsp;&nbsp;')}
                  </div>
                </td>
                <td>
                  <input type="number" class="admin-input" data-pokemon="${p.name}" value="${isUnassigned ? '' : p.cost}" placeholder="Pool">
                </td>
                <td>
                  <span class="admin-badge ${isUnassigned ? 'badge-grey' : 'badge-green'}">${isUnassigned ? 'Pool' : 'Tiered'}</span>
                </td>
              </tr>
            `;
          }).join('')}
          ${filtered.length === 0 ? `<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--text-muted)">No pokemon found.</td></tr>` : ''}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;

  // Search
  const searchInput = document.getElementById('adminSearchInput');
  if (searchInput) {
    searchInput.focus();
    const val = searchInput.value;
    searchInput.value = '';
    searchInput.value = val;
    
    searchInput.addEventListener('input', (e) => {
      import('../state.js').then(m => m.setState({ currentSearch: e.target.value.toLowerCase().trim() }));
    });
  }

  // Cost Inputs
  document.querySelectorAll('.admin-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const name = e.target.dataset.pokemon;
      const val = e.target.value.trim();
      const num = val === '' ? null : Number(val);
      updatePokemonCost(name, num);
    });
  });

  // Buttons
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAllData();
      renderAdmin();
    });
  }

  const logoutBtn = document.getElementById('logoutDataBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutAdmin();
    });
  }
}
