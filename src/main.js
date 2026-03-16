/**
 * Application entry point.
 * Imports all components, wires state subscriptions, and initializes.
 */

import './styles/index.css';

import { getState, setState, subscribe } from './state.js';
import { renderStats } from './components/StatsBar.js';
import { renderFilters } from './components/Filters.js';
import { renderBoard } from './components/Board.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderAdmin } from './components/Admin.js';

// Re-render components on state change
subscribe(() => {
  const state = getState();
  
  // Toggle layout changes via body class
  if (state.activeTab === 'admin') {
    document.body.classList.add('admin-mode');
    document.getElementById('mainHeader').style.display = 'none';
  } else {
    document.body.classList.remove('admin-mode');
    document.getElementById('mainHeader').style.display = 'block';
  }

  // Render components
  renderStats();
  renderFilters();
  renderBoard();
  renderAdmin();
});

// Search input binding (Draft Board)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    setState({ currentSearch: e.target.value.toLowerCase().trim() });
  });
}

// Navbar Tabs
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    // UI selection class
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');

    const tabName = e.target.dataset.tab;
    // Clearing search on tab switch is usually a good idea
    setState({ activeTab: tabName, currentSearch: '' });
    
    // Clear search input box since state is clear
    if (tabName === 'board' && searchInput) searchInput.value = '';
  });
});


// Initial render
renderStats();
renderFilters();
renderBoard();
renderSidebar();
renderAdmin();
