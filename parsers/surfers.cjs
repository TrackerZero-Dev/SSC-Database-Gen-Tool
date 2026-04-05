const fs = require('fs');
const path = require('path');
const { surferNames, skinNames, skinNameToId } = require('../utils/names.cjs');

function parseSurfersAndSkins(gamedataDir) {
  const surfersData = JSON.parse(fs.readFileSync(path.join(gamedataDir, 'surfers.json'), 'utf8')).surfers;
  const skinsData = JSON.parse(fs.readFileSync(path.join(gamedataDir, 'surferskins.json'), 'utf8')).skins;
  
  let laddersData = { tieredLadderCollection: [] };
  try {
    laddersData = JSON.parse(fs.readFileSync(path.join(gamedataDir, 'ladders.json'), 'utf8'));
  } catch (e) {
    console.warn('Could not read ladders.json for fallback names');
  }

  const ladderFallbackNames = {};
  if (laddersData && laddersData.tieredLadderCollection) {
    for (const collection of laddersData.tieredLadderCollection) {
      if (collection.surferTag && collection.surferLadder && collection.surferLadder.pairs) {
        const firstPair = collection.surferLadder.pairs[0];
        if (firstPair && firstPair.metadata && firstPair.metadata.ladder && firstPair.metadata.ladder.id) {
          const ladderId = firstPair.metadata.ladder.id; // e.g., "jake-bronze"
          const namePart = ladderId.split('-')[0];
          // Capitalize first letter
          const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          ladderFallbackNames[collection.surferTag.toString()] = capitalized;
        }
      }
    }
  }

  const skinsBySurferIdentifier = {};
  for (const skin of skinsData) {
    const parts = skin.localizationKey.split('.');
    if (parts.length >= 3) {
      const identifier = parts[1];
      if (!skinsBySurferIdentifier[identifier]) {
        skinsBySurferIdentifier[identifier] = [];
      }
      const skinName = skinNames[skin.dataTag] || parts[2];
      skinsBySurferIdentifier[identifier].push({
        ...skin,
        name: skinName
      });
    }
  }

  const surfersDict = {};
  const skinsDict = {};

  for (const surfer of surfersData) {
    const surferId = surfer.dataTag.toString();
    const surferName = surferNames[surferId] || ladderFallbackNames[surferId] || `Unknown_${surferId}`;
    
    const nameNoSpaces = surferName.toLowerCase().replace(/ /g, '');
    const nameUnderscores = surferName.toLowerCase().replace(/ /g, '_');
    
    let surferSkins = [...(skinsBySurferIdentifier[nameNoSpaces] || skinsBySurferIdentifier[nameUnderscores] || [])];
    
    let defaultSkin = surferSkins.find(s => s.unlockType === 0 || s.name.toUpperCase().includes('STANDARD') || s.name.toUpperCase().includes('DEFAULT'));
    let defaultSkinId = defaultSkin ? Number(defaultSkin.dataTag) : 0;
    let defaultSkinName = defaultSkin ? defaultSkin.name : `${surferName.toUpperCase()} STANDARD`;
    
    if (!surferSkins.some(s => Number(s.dataTag) === defaultSkinId)) {
      surferSkins.push({
        dataTag: defaultSkinId,
        localizationKey: `skins.${nameNoSpaces}.${defaultSkinName.toLowerCase().replace(/ /g, '_')}`,
        name: defaultSkinName,
        available: true,
        unlockType: 0
      });
    }
    
    surferSkins.sort((a, b) => a.name.localeCompare(b.name));
    
    for (const skin of surferSkins) {
      skinsDict[skin.dataTag] = {
        id: parseInt(skin.dataTag),
        name: skin.name,
        localizationKey: skin.localizationKey,
        available: skin.available !== undefined ? skin.available : true,
        unlockType: skin.unlockType,
        surferId: surfer.dataTag
      };
    }
    
    surfersDict[surfer.dataTag] = {
      id: parseInt(surfer.dataTag),
      name: surferName,
      defaultSkinId: defaultSkinId,
      available: surfer.available !== undefined ? surfer.available : true,
      unlockType: surfer.unlockType,
      skinIds: surferSkins.map(s => s.dataTag)
    };
  }

  return { surfers: surfersDict, skins: skinsDict };
}

module.exports = { parseSurfersAndSkins };
