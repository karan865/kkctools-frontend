import type { WordPools } from '../types';

export const punkPools: WordPools = {
  adjectives: [
    'Rotten', 'Dead', 'Cheap', 'Rebel', 'Greasy', 'Angry', 'Nervous', 'Feral',
    'Rude', 'Loud', 'Broke', 'Trashy', 'Bitter', 'Dirty', 'Cracked', 'Static',
    'Ripped', 'Useless', 'Snotty', 'Savage', 'Rowdy', 'Ragged', 'Twisted', 'Bleeding',
    'Blunt', 'Raw', 'Crazy', 'Noisy', 'Rusty', 'Nasty', 'Battered', 'Stupid',
    'Scabby', 'Chaotic', 'Drunk', 'Furious', 'Screaming', 'Grungy', 'Frenzied', 'Disorderly',
    'Junkie', 'Sloppy', 'Poison', 'Tainted', 'Outlaw', 'Wrecked', 'Vandal', 'Spastic',
    'Bizarre', 'Fugitive', 'Shabby', 'Gritty', 'Torn', 'Smelly', 'Restless', 'Busted',
    'Wild', 'Reckless', 'Scruffy', 'Muddy', 'Rancid', 'Snarky', 'Snide', 'Cynical',
    'Pissed', 'Raging', 'Lawless', 'Hostile', 'Brazen', 'Stubborn', 'Violent', 'Anarchic',
    'Subversive', 'Defiant', 'Mutant', 'Filthy', 'Vulgar', 'Vile', 'Crude', 'Raucous',
    'Stray', 'Bleak', 'Grimy', 'Scrappy', 'Rabid'
  ].filter((v, i, a) => a.indexOf(v) === i),

  nouns: [
    'Kids', 'Riot', 'Gutter', 'Static', 'Pins', 'Vandals', 'Strays', 'Bruise',
    'Graffiti', 'Brats', 'Zero', 'Bootlegs', 'Scum', 'Alley', 'Trash', 'Wreck',
    'Spike', 'Needle', 'Revolt', 'Basement', 'Curfew', 'Sidewalk', 'Subway', 'Pavement',
    'Chaos', 'Sewer', 'Rats', 'Slag', 'Garbage', 'Clones', 'Outcasts', 'Misfits',
    'Rejects', 'Losers', 'Bums', 'Drunks', 'Freaks', 'Punks', 'Posers', 'Snobs',
    'Cops', 'Fuzz', 'Sirens', 'Ashtray', 'Sticker', 'Leather', 'Studs', 'Chains',
    'Padlock', 'Razor', 'Switchblade', 'Brawlers', 'Scabs', 'Fumbler', 'Noise', 'Static',
    'Distortion', 'Feedback', 'Stench', 'Slime', 'Junkyard', 'Dumpster', 'Rubble', 'Shrapnel',
    'Brick', 'Bottle', 'Canister', 'Fist', 'Clash', 'Strike', 'Protest', 'Anarchy',
    'Chaos', 'Frenzy', 'Uprising', 'Panic', 'Alarm', 'Siren', 'Disorder', 'Mayhem',
    'Havoc', 'Sabotage', 'Blemish', 'Scar', 'Damage'
  ].filter((v, i, a) => a.indexOf(v) === i),

  plurals: [
    'Kids', 'Vandals', 'Strays', 'Brats', 'Bootlegs', 'Outcasts', 'Misfits', 'Rejects',
    'Losers', 'Freaks', 'Punks', 'Posers', 'Scabs', 'Brawlers', 'Rebels', 'Mutants',
    'Rats', 'Clones', 'Snobs', 'Drunks', 'Bums', 'Fugitives', 'Hooligans', 'Rowdies',
    'Delinquents', 'Troublemakers', 'Agitators', 'Slackers', 'Drifters', 'Wrecks', 'Casualties', 'Zombies',
    'Ghouls', 'Monsters', 'Creeps', 'Oddballs', 'Weirdos', 'Strangers', 'Squatters', 'Runaways',
    'Anarchists', 'Rioters', 'Striker-boys', 'Saboteurs', 'Protesters', 'Guerillas', 'Partisans', 'Gangs',
    'Pack-rats', 'Street-rats', 'Dogs', 'Wolves', 'Jackals', 'Hyenas', 'Scavengers', 'Vipers',
    'Spiders', 'Leeches', 'Parasites', 'Wasps', 'Hornets', 'Locusts', 'Roaches', 'Bedbugs',
    'Pins', 'Needles', 'Razors', 'Blades', 'Bottles', 'Bricks', 'Chains', 'Padlocks',
    'Studs', 'Spikes', 'Patches', 'Badges', 'Posters', 'Stickers', 'Fanzines', 'Tape-decks',
    'Radios', 'Sirens', 'Sirens', 'Alarms', 'Megaphones'
  ].filter((v, i, a) => a.indexOf(v) === i),
};

