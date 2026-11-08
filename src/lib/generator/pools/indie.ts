import type { WordPools } from '../types';

export const indiePools: WordPools = {
  adjectives: [
    'Quiet', 'Paper', 'Faded', 'Gentle', 'Wandering', 'Pale', 'Soft', 'Hushed',
    'Wooden', 'Misty', 'Autumnal', 'Folk', 'Dusty', 'Vintage', 'Fragile', 'Woven',
    'Distant', 'Secret', 'Lonesome', 'Somber', 'Amber', 'Hollow', 'Subtle', 'Sleepy',
    'Careless', 'Velvet', 'Golden', 'Melancholy', 'Simple', 'Rusty', 'Faint', 'Bitter',
    'Tender', 'Loverly', 'Pastoral', 'Wildwood', 'Shady', 'Rainy', 'Cloudy', 'Overcast',
    'Drifting', 'Floating', 'Whispering', 'Echoing', 'Humble', 'Modest', 'Unspoken', 'Rustic',
    'Cozy', 'Warm', 'Chill', 'Brisk', 'Windswept', 'Sunlit', 'Moonlit', 'Starlit',
    'Twilight', 'Nocturnal', 'Solitary', 'Secluded', 'Hidden', 'Obscure', 'Forgotten', 'Lost',
    'Found', 'Cherished', 'Precious', 'Delicate', 'Slender', 'Graceful', 'Mellow', 'Soothing',
    'Peaceful', 'Serene', 'Tranquil', 'Placid', 'Calm', 'Still', 'Silent', 'Restful',
    'Dreamy', 'Ethereal', 'Gossamer', 'Lyrical', 'Poetic'
  ].filter((v, i, a) => a.indexOf(v) === i),

  nouns: [
    'Lighthouse', 'Orchard', 'Postcards', 'Cardigan', 'Tides', 'Meadow', 'Moths', 'Lanterns',
    'Sparrow', 'River', 'Parchment', 'Willow', 'Bicycle', 'Cabin', 'Feather', 'Cottage',
    'Harbor', 'Attic', 'Gramophone', 'Compass', 'Horizon', 'Forest', 'Valley', 'Stream',
    'Brook', 'Pond', 'Lake', 'Ocean', 'Shore', 'Coast', 'Cliff', 'Hill',
    'Mountain', 'Peak', 'Ridge', 'Glade', 'Grove', 'Thicket', 'Woods', 'Wilderness',
    'Field', 'Pasture', 'Garden', 'Greenhouse', 'Conservatory', 'Barn', 'Shed', 'Windmill',
    'Watermill', 'Bridge', 'Pathway', 'Trail', 'Footpath', 'Lane', 'Alleyway', 'Crossroad',
    'Signpost', 'Milestone', 'Boundary', 'Border', 'Fence', 'Gate', 'Stile', 'Hedge',
    'Stone', 'Pebble', 'Boulder', 'Rock', 'Sand', 'Dune', 'Shell', 'Driftwood',
    'Seagull', 'Pelican', 'Heron', 'Crane', 'Swan', 'Duck', 'Owl', 'Robin',
    'Bluebird', 'Thrush', 'Nightingale', 'Finch', 'Wren'
  ].filter((v, i, a) => a.indexOf(v) === i),

  plurals: [
    'Postcards', 'Tides', 'Moths', 'Lanterns', 'Sparrows', 'Bicycles', 'Feathers', 'Cabins',
    'Cardigans', 'Orchards', 'Lighthouses', 'Rivers', 'Willows', 'Harbors', 'Gramophones', 'Compasses',
    'Horizons', 'Forests', 'Valleys', 'Streams', 'Brooks', 'Ponds', 'Lakes', 'Oceans',
    'Shores', 'Coasts', 'Cliffs', 'Hills', 'Mountains', 'Peaks', 'Ridges', 'Glades',
    'Groves', 'Thickets', 'Woods', 'Fields', 'Pastures', 'Gardens', 'Greenhouses', 'Barns',
    'Sheds', 'Windmills', 'Bridges', 'Pathways', 'Trails', 'Footpaths', 'Lanes', 'Crossroads',
    'Signposts', 'Milestones', 'Gates', 'Stiles', 'Hedges', 'Stones', 'Pebbles', 'Boulders',
    'Rocks', 'Sands', 'Dunes', 'Shells', 'Driftwoods', 'Seagulls', 'Pelicans', 'Herons',
    'Cranes', 'Swans', 'Owls', 'Robins', 'Bluebirds', 'Nightengales', 'Finches', 'Wrens',
    'Leaves', 'Branches', 'Twigs', 'Acorns', 'Pinecones', 'Blossoms', 'Petals', 'Roots',
    'Seeds', 'Sprouts', 'Seedlings', 'Saplings', 'Trees'
  ].filter((v, i, a) => a.indexOf(v) === i),
};
