const fs = require("fs");
const path = require("path");
const { parseSurfersAndSkins } = require("./parsers/surfers.cjs");
const { parseBoards } = require("./parsers/boards.cjs");
const { parseSeasons } = require("./parsers/seasons.cjs");

// --- TOGGLES ---
// Change these to 1 (true) or 0 (false) to choose what to generate
const GENERATE = {
  surfers: 1,
  skins: 1,
  boards: 1,
  seasons: 1,
  metadata: 1,
};

const gamedataDir = path.join(__dirname, "gamedata_2.1.2");
const outputDir = path.join(__dirname, "output");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("Parsing game data...");
let surfers, skins, boards, seasons;

if (GENERATE.surfers || GENERATE.skins) {
  const parsed = parseSurfersAndSkins(gamedataDir);
  surfers = parsed.surfers;
  skins = parsed.skins;
}
if (GENERATE.boards) {
  boards = parseBoards(gamedataDir).boards;
}
if (GENERATE.seasons) {
  seasons = parseSeasons(gamedataDir).seasons;
}

console.log("Writing modular JSON files...");

// Custom stringify to sort the dictionary keys by the 'name' property of their values
function stringifySortedByName(dict) {
  const entries = Object.entries(dict).sort((a, b) => {
    const nameA = a[1].name || "";
    const nameB = b[1].name || "";
    return nameA.localeCompare(nameB);
  });

  const lines = entries.map(([k, v]) => {
    const valueStr = JSON.stringify(v, null, 2).split("\n").join("\n  ");
    return `  "${k}": ${valueStr}`;
  });

  return `{\n${lines.join(",\n")}\n}`;
}

if (GENERATE.surfers)
  fs.writeFileSync(
    path.join(outputDir, "surfers.json"),
    stringifySortedByName(surfers),
  );
if (GENERATE.skins)
  fs.writeFileSync(
    path.join(outputDir, "skins.json"),
    stringifySortedByName(skins),
  );
if (GENERATE.boards)
  fs.writeFileSync(
    path.join(outputDir, "boards.json"),
    stringifySortedByName(boards),
  );
if (GENERATE.seasons)
  fs.writeFileSync(
    path.join(outputDir, "seasons.json"),
    stringifySortedByName(seasons),
  );

if (GENERATE.metadata) {
  const version = path.basename(gamedataDir).split("_")[1] || "unknown";
  const generatedAt = new Date().toISOString();
  let metadata = {};

  const metadataPath = path.join(outputDir, "metadata.json");
  if (fs.existsSync(metadataPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    } catch (e) {
      console.error("Failed to parse existing metadata.json, starting fresh.");
    }
  }

  if (GENERATE.surfers) metadata.surfers = { version, generatedAt };
  if (GENERATE.skins) metadata.skins = { version, generatedAt };
  if (GENERATE.boards) metadata.boards = { version, generatedAt };
  if (GENERATE.seasons) metadata.seasons = { version, generatedAt };

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

console.log("Done! Modular database generated in " + outputDir);
