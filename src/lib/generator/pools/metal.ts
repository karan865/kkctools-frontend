import type { WordPools } from '../types';

export const metalPools: WordPools = {
  adjectives: [
    'Crimson', 'Obsidian', 'Funeral', 'Iron', 'Black', 'Wretched', 'Infernal', 'Cursed',
    'Hollow', 'Bleeding', 'Eternal', 'Shattered', 'Frozen', 'Ashen', 'Abyssal', 'Grim',
    'Noxious', 'Malignant', 'Rotting', 'Morbid', 'Unholy', 'Dread', 'Spectral', 'Sepulchral',
    'Cataclysmic', 'Vile', 'Decaying', 'Darkened', 'Blighted', 'Savage', 'Brutal', 'Venomous',
    'Barren', 'Chthonic', 'Occult', 'Wrathful', 'Putrid', 'Rancid', 'Nameless', 'Sulfuric',
    'Gorgon', 'Gothic', 'Macabre', 'Lethal', 'Hateful', 'Corrupted', 'Doomed', 'Tormented',
    'Forsaken', 'Pestilent', 'Nihil', 'Desolate', 'Void', 'Shadowy', 'Festering', 'Necrotic',
    'Cavernous', 'Sinister', 'Ruthless', 'Bloodstained', 'Cadaverous', 'Ancient', 'Nocturnal', 'Ghastly',
    'Vengeful', 'Devouring', 'Blasphemous', 'Scorched', 'Dismal', 'Merciless', 'Perilous', 'Malefic',
    'Eerie', 'Fell', 'Dire', 'Ruined', 'Stygian', 'Ominous', 'Cenotaph', 'Spectral',
    'Grisly', 'Brimstone', 'Pale', 'Mortal', 'Searing'
  ].filter((v, i, a) => a.indexOf(v) === i),

  nouns: [
    'Abyss', 'Throne', 'Blade', 'Ritual', 'Plague', 'Reaper', 'Legion', 'Tomb',
    'Inferno', 'Scourge', 'Wraith', 'Altar', 'Carrion', 'Dominion', 'Crypt', 'Covenant',
    'Sepulcher', 'Chasm', 'Obelisk', 'Gallows', 'Pestilence', 'Blight', 'Cenotaph', 'Scythe',
    'Catacomb', 'Void', 'Vortex', 'Tyrant', 'Leviathan', 'Gargoyle', 'Behemoth', 'Monolith',
    'Chaos', 'Eclipse', 'Grave', 'Coffin', 'Serpent', 'Warlock', 'Daemon', 'Omen',
    'Pyre', 'Doom', 'Wrath', 'Venom', 'Specter', 'Vampire', 'Ghoul', 'Torment',
    'Sanctum', 'Decay', 'Mortality', 'Shadow', 'Sulfur', 'Carnage', 'Ruins', 'Slaughter',
    'Banishment', 'Chains', 'Gore', 'Heresy', 'Barrow', 'Citadel', 'Mausoleum', 'Abomination',
    'Colossus', 'Executioner', 'Necromancer', 'Phantom', 'Relic', 'Shroud', 'Temple', 'Torture',
    'Vengeance', 'Wasteland', 'Cadaver', 'Bones', 'Cinders', 'Curse', 'Despair', 'Gloom',
    'Malice', 'Nightfall', 'Sorrow', 'Terror', 'Winter'
  ].filter((v, i, a) => a.indexOf(v) === i),

  verbsIng: [
    'Bleeding', 'Burning', 'Rotting', 'Decaying', 'Crawling', 'Weeping', 'Devouring', 'Screaming',
    'Chanting', 'Rising', 'Falling', 'Dying', 'Festering', 'Howling', 'Writhing', 'Crushing',
    'Shattering', 'Drowning', 'Perishing', 'Vanishing', 'Slaughtering', 'Stalking', 'Lurking', 'Grasping',
    'Haunting', 'Suffocating', 'Smoldering', 'Summoning', 'Corrupting', 'Ripping', 'Tearing', 'Flaying',
    'Burying', 'Awakening', 'Ascending', 'Descending', 'Reaping', 'Severing', 'Raining', 'Feasting',
    'Gnawing', 'Scorching', 'Freezing', 'Withering', 'Bleaching', 'Cleaving', 'Sundering', 'Breeding',
    'Brooding', 'Conjuring', 'Curse-bearing', 'Darkening', 'Dismembering', 'Echoing', 'Enslaving', 'Fading',
    'Forging', 'Gorging', 'Groveling', 'Impaler-born', 'Invoking', 'Maiming', 'Marching', 'Mourning',
    'Plaguing', 'Prowling', 'Quaking', 'Ravaging', 'Rendering', 'Resurrecting', 'Rusting', 'Scarring',
    'Scattering', 'Sinking', 'Spilling', 'Strangling', 'Swallowing', 'Thirsting', 'Trampling', 'Trembling',
    'Unleashing', 'Vomiting', 'Wailing', 'Wasting', 'Yielding'
  ].filter((v, i, a) => a.indexOf(v) === i),
};
