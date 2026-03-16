/**
 * Pokemon data for the Delicious League Draft Board.
 * All tiered & unassigned Pokémon are defined here.
 * To add / remove Pokémon, simply edit these arrays.
 */

export const TIERED_POKEMON = [
  // --- 18 pts (Mythic) ---
  { name: 'Amoonguss',   cost: 18, types: ['Grass', 'Poison']   },
  { name: 'Breloom',     cost: 18, types: ['Grass', 'Fighting']  },
  { name: 'Hydrapple',   cost: 18, types: ['Grass', 'Dragon']    },
  { name: 'Arboliva',    cost: 18, types: ['Grass', 'Normal']    },
  { name: 'Sinistcha',   cost: 18, types: ['Grass', 'Ghost']     },
  { name: 'Scovillain',  cost: 18, types: ['Grass', 'Fire']      },
  { name: 'Polteageist', cost: 18, types: ['Ghost']              },
  { name: 'Garganacl',   cost: 18, types: ['Rock']               },

  // --- 15 pts (Epic) ---
  { name: 'Tsareena',    cost: 15, types: ['Grass']              },
  { name: 'Dachsbun',    cost: 15, types: ['Fairy']              },
  { name: 'Slurpuff',    cost: 15, types: ['Fairy']              },
  { name: 'Exeggutor',   cost: 15, types: ['Grass', 'Psychic']   },
  { name: 'Cherrim',     cost: 15, types: ['Grass']              },
  { name: 'Vanilluxe',   cost: 15, types: ['Ice']                },
  { name: 'Alcremie',    cost: 15, types: ['Fairy']              },
  { name: 'Parasect',    cost: 15, types: ['Bug', 'Grass']       },

  // --- 12 pts (Rare) ---
  { name: 'Appletun',    cost: 12, types: ['Grass', 'Dragon']    },
  { name: 'Flapple',     cost: 12, types: ['Grass', 'Dragon']    },
  { name: 'Dipplin',     cost: 12, types: ['Grass', 'Dragon']    },
  { name: 'Smoliv',      cost: 12, types: ['Grass', 'Normal']    },
  { name: 'Dolliv',      cost: 12, types: ['Grass', 'Normal']    },
  { name: 'Steenee',     cost: 12, types: ['Grass']              },
  { name: 'Foongus',     cost: 12, types: ['Grass', 'Poison']    },
  { name: 'Shroomish',   cost: 12, types: ['Grass']              },

  // --- 9 pts (Uncommon) ---
  { name: 'Cherubi',       cost: 9, types: ['Grass']             },
  { name: 'Bounsweet',     cost: 9, types: ['Grass']             },
  { name: 'Applin',        cost: 9, types: ['Grass', 'Dragon']   },
  { name: 'Capsakid',      cost: 9, types: ['Grass']             },
  { name: 'Nacli',         cost: 9, types: ['Rock']              },
  { name: 'Sinistea',      cost: 9, types: ['Ghost']             },
  { name: 'Poltchageist',  cost: 9, types: ['Grass', 'Ghost']    },
  { name: 'Vanillish',     cost: 9, types: ['Ice']               },

  // --- 6 pts (Common) ---
  { name: 'Vanillite',   cost: 6, types: ['Ice']                 },
  { name: 'Paras',        cost: 6, types: ['Bug', 'Grass']       },
  { name: 'Fidough',      cost: 6, types: ['Fairy']              },
  { name: 'Swirlix',      cost: 6, types: ['Fairy']              },
  { name: 'Exeggcute',    cost: 6, types: ['Grass', 'Psychic']   },
  { name: 'Milcery',      cost: 6, types: ['Fairy']              },
  { name: 'Tropius',      cost: 6, types: ['Grass', 'Flying']    },
];

export const UNASSIGNED_POKEMON = [
  { name: 'Zubat',       types: ['Poison', 'Flying']  },
  { name: 'Golbat',      types: ['Poison', 'Flying']  },
  { name: 'Psyduck',     types: ['Water']             },
  { name: 'Slowpoke',    types: ['Water', 'Psychic']  },
  { name: 'Farfetchd',   types: ['Normal', 'Flying']  },
  { name: 'Shellder',    types: ['Water']             },
  { name: 'Krabby',      types: ['Water']             },
  { name: 'Magikarp',    types: ['Water']             },
  { name: 'Eevee',       types: ['Normal']            },
  { name: 'Chikorita',   types: ['Grass']             },
  { name: 'Bayleef',     types: ['Grass']             },
  { name: 'Meganium',    types: ['Grass']             },
  { name: 'Mareep',      types: ['Electric']          },
  { name: 'Flaaffy',     types: ['Electric']          },
  { name: 'Politoed',    types: ['Water']             },
  { name: 'Octillery',   types: ['Water']             },
  { name: 'Houndour',    types: ['Dark', 'Fire']      },
  { name: 'Phanpy',      types: ['Ground']            },
  { name: 'Miltank',     types: ['Normal']            },
  { name: 'Torchic',     types: ['Fire']              },
  { name: 'Skitty',      types: ['Normal']            },
  { name: 'Delcatty',    types: ['Normal']            },
  { name: 'Torkoal',     types: ['Fire']              },
  { name: 'Spoink',      types: ['Psychic']           },
  { name: 'Grumpig',     types: ['Psychic']           },
  { name: 'Whiscash',    types: ['Water', 'Ground']   },
  { name: 'Corphish',    types: ['Water']             },
  { name: 'Spheal',      types: ['Ice', 'Water']      },
  { name: 'Sealeo',      types: ['Ice', 'Water']      },
  { name: 'Combee',      types: ['Bug', 'Flying']     },
  { name: 'Vespiquen',   types: ['Bug', 'Flying']     },
  { name: 'Hippopotas',  types: ['Ground']            },
  { name: 'Pidove',      types: ['Normal', 'Flying']  },
  { name: 'Cottonee',    types: ['Grass', 'Fairy']    },
  { name: 'Whimsicott',  types: ['Grass', 'Fairy']    },
  { name: 'Scorbunny',   types: ['Fire']              },
  { name: 'Cramorant',   types: ['Flying', 'Water']   },
  { name: 'Arrokuda',    types: ['Water']             },
  { name: 'Barraskewda', types: ['Water']             },
  { name: 'Pincurchin',  types: ['Electric']          },
  { name: 'Quaxly',      types: ['Water']             },
  { name: 'Quaxwell',    types: ['Water']             },
  { name: 'Lechonk',     types: ['Normal']            },
  { name: 'Toedscool',   types: ['Ground', 'Grass']   },
  { name: 'Toedscruel',  types: ['Ground', 'Grass']   },
  { name: 'Naclstack',   types: ['Rock']              },
  { name: 'Dondozo',     types: ['Water']             },
  { name: 'Tatsugiri',   types: ['Dragon', 'Water']   },
];

export const ITEMS = [
  { name: 'Leftovers',          desc: 'Heals a small amount of HP every turn.' },
  { name: 'Choice Band',       desc: 'Boosts Attack by 50% but locks the user into one move.' },
  { name: 'Choice Specs',      desc: 'Boosts Sp. Atk by 50% but locks the user into one move.' },
  { name: 'Life Orb',          desc: 'Boosts damage by 30% but costs 10% HP each attack.' },
  { name: 'Focus Sash',        desc: 'Survive a KO hit from full HP with 1 HP remaining.' },
  { name: 'Sitrus Berry',      desc: 'Restores 25% HP when health falls below 50%.' },
  { name: 'Rocky Helmet',      desc: 'Damages attackers by 1/6 HP on contact moves.' },
  { name: 'Assault Vest',      desc: 'Boosts Sp. Def by 50% but prevents use of status moves.' },
  { name: 'Heavy-Duty Boots',  desc: 'Protects from entry hazard damage on switch-in.' },
];
