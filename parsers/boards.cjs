const fs = require('fs');
const path = require('path');
const { boardNames } = require('../utils/names.cjs');

function parseBoards(gamedataDir) {
  const boardsData = JSON.parse(fs.readFileSync(path.join(gamedataDir, 'boards.json'), 'utf8'));
  const boardsDict = {};

  const allBoards = [boardsData.defaultBoard, ...boardsData.boards];
  for (const board of allBoards) {
    const boardId = board.dataTag.toString();
    const boardName = boardNames[boardId] || board.localizationKey || `Unknown_${boardId}`;
    
    boardsDict[board.dataTag] = {
      id: parseInt(board.dataTag),
      name: boardName,
      localizationKey: board.localizationKey,
      isDefault: board.dataTag === boardsData.defaultBoard.dataTag,
      available: board.available !== undefined ? board.available : true,
      unlockType: board.unlockType
    };
  }

  return { boards: boardsDict };
}

module.exports = { parseBoards };
