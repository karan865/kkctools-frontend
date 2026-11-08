import type { WordPools } from '../types';

export const heavyMetalPools: WordPools = {
  adjectives: [
    'Steel', 'Chrome', 'Savage', 'Raging', 'Iron', 'Mighty', 'Wicked', 'Thunderous',
    'Leather', 'Armored', 'Valiant', 'Furious', 'Blazing', 'Heroic', 'Glorious', 'Electric',
    'Immortal', 'Relentless', 'Lightning', 'Golden', 'Silver', 'Invincible', 'Unbroken', 'Sonic',
    'Noble', 'Reckless', 'Defiant', 'Storming', 'Roaring', 'Brave', 'Wild', 'Heavy',
    'Astral', 'Midnight', 'Crimson', 'Metallic', 'Power', 'Rampant', 'Stallion', 'Highborn',
    'Sacred', 'Victorious', 'Rebel', 'Fast', 'Lethal', 'Radiant', 'Starlight', 'Vengeful',
    'Battle-tested', 'Ironclad', 'Titan', 'Apex', 'Fearless', 'Boundless', 'Fiery', 'Strikeforce',
    'Eternal', 'Thunderstruck', 'Hammering', 'Battleborn', 'Triumphant', 'Overdrive', 'Primal', 'Chained',
    'Unleashed', 'Raw', 'Vigorous', 'True', 'Royal', 'Dominant', 'Steadfast', 'Vanguard',
    'Sovereign', 'Unconquered', 'Sharpened', 'Blunt', 'Spiked', 'Reinforced', 'Majestic', 'Supersonic',
    'Grand', 'Speeding', 'Fierce', 'Heavy-duty', 'Tempered'
  ].filter((v, i, a) => a.indexOf(v) === i),

  nouns: [
    'Hammer', 'Dragon', 'Warrior', 'Dungeon', 'Fury', 'Titan', 'Axe', 'Stallion',
    'Knight', 'Beast', 'Forge', 'Warlord', 'Thunder', 'Sword', 'Shield', 'Crown',
    'Rider', 'Glory', 'Anvil', 'Castles', 'Chariot', 'Lightning', 'Kingdom', 'Fortress',
    'Vanguard', 'Steed', 'Emperor', 'Gauntlet', 'Armor', 'Falcon', 'Griffin', 'Spear',
    'Battlefield', 'Storm', 'Trophy', 'Tempest', 'Valor', 'Legend', 'Conquest', 'Throne',
    'Ransom', 'Bastion', 'Defender', 'Gladiator', 'Ironwork', 'Striker', 'Crusader', 'Paladin',
    'Champion', 'Overlord', 'Sentinel', 'Berserker', 'Executioner', 'Warden', 'Marauder', 'Centurion',
    'Standard', 'Banner', 'Helmet', 'Spur', 'Horseman', 'Archon', 'Highlander', 'Monarch',
    'Valhalla', 'Citadel', 'Rampart', 'Warhorse', 'Steelwork', 'Broadsword', 'Longbow', 'Siege',
    'Catapult', 'Talon', 'Pinnacle', 'Scepter', 'Coronet', 'Javelin', 'Halberd', 'Flail',
    'Crest', 'Talisman', 'Warpath', 'Vanguard', 'Challenger'
  ].filter((v, i, a) => a.indexOf(v) === i),

  plurals: [
    'Warriors', 'Knights', 'Dragons', 'Titans', 'Stallions', 'Warlords', 'Riders', 'Gladiators',
    'Crusaders', 'Paladins', 'Champions', 'Overlords', 'Sentinels', 'Berserkers', 'Wardens', 'Marauders',
    'Centurions', 'Horsemen', 'Archons', 'Highlanders', 'Monarchs', 'Defenders', 'Strikers', 'Gorgons',
    'Griffins', 'Falcons', 'Lions', 'Eagles', 'Hammers', 'Swords', 'Axes', 'Shields',
    'Gauntlets', 'Spears', 'Javelins', 'Chariots', 'Fortresses', 'Castles', 'Crowns', 'Thrones',
    'Legions', 'Battalions', 'Brigades', 'Regiments', 'Squadrons', 'Armadas', 'Conquerors', 'Heroes',
    'Vikings', 'Spartans', 'Romans', 'Invaders', 'Raiders', 'Corsairs', 'Barons', 'Princes',
    'Dukes', 'Counts', 'Emperors', 'Kings', 'Gods', 'Demigods', 'Giants', 'Colossi',
    'Masters', 'Forgers', 'Blacksmiths', 'Wielders', 'Breakers', 'Smashers', 'Crushers', 'Thunderbolts',
    'Firebrands', 'Blades', 'Broadswords', 'Scythes', 'Anvils', 'Standards', 'Banners', 'Warhorses',
    'Tempests', 'Cyclones', 'Monsters', 'Beasts', 'Vipers'
  ].filter((v, i, a) => a.indexOf(v) === i),
};
