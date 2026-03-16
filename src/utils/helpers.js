/**
 * Utility functions shared across the application.
 */

import { SPRITE_BASE_URL, POKEAPI_BASE_URL } from '../data/config.js';
import { getState, cachePokedex } from '../state.js';

/**
 * Build sprite URL from a pokemon name.
 */
export function spriteUrl(name) {
  return `${SPRITE_BASE_URL}${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.gif`;
}

/**
 * Collect all unique types from an array of pokemon objects.
 */
export function getAllTypes(pokemonArrays) {
  const types = new Set();
  pokemonArrays.forEach((arr) => arr.forEach((p) => p.types.forEach((t) => types.add(t))));
  return [...types].sort();
}

/**
 * Fetch a Pokedex flavor-text entry from PokeAPI (with caching).
 */
export async function fetchPokedex(name) {
  const { pokedexCache } = getState();
  if (pokedexCache[name]) return pokedexCache[name];

  try {
    const apiName = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const res = await fetch(`${POKEAPI_BASE_URL}${apiName}`);
    const data = await res.json();
    const entry = data.flavor_text_entries.find((x) => x.language.name === 'en');
    const text = entry ? entry.flavor_text.replace(/[\n\f]/g, ' ') : 'No entry found.';
    cachePokedex(name, text);
    return text;
  } catch {
    return 'Pokédex data unavailable.';
  }
}
