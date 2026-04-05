# 🏄‍♂️ Subway City Database Toolchain

This repository is the "Engine" behind the Subway City ecosystem. It parses raw game data into a structured JSON database that powers the Subway City Save Editor.

## 🔗 The Ecosystem
*   **Database API:** [https://subway-city-database.trackerzero.workers.dev/](https://subway-city-database.trackerzero.workers.dev/)
*   **Save Editor:** [https://subway-city-save-editor.vercel.app/](https://subway-city-save-editor.vercel.app/)

---

## 🚀 How it Works
1.  **Parse:** The `generate_robust_db.cjs` script reads raw game data (e.g., `surfers.json`, `boards.json`) from the `gamedata_2.1.0/` directory.
2.  **Generate:** It processes the data using logic in the `/parsers` and `/utils` folders to produce optimized, alphabetically sorted JSON files and TypeScript definitions.
3.  **Output:** All generated files are stored in the `/output` folder.
4.  **API Hosting:** The generated files are used to update the **Cloudflare Worker API**, which serves the data with full CORS support to the Save Editor.

---

## ⚙️ Development

### Prerequisites
*   [Node.js](https://nodejs.org/) installed locally.

### Generating the Database
To process the latest data and update the `/output` folder:
1.  Ensure your raw files are in the `gamedata_2.1.0/` folder.
2.  Run the generator:
    ```bash
    node generate_robust_db.cjs
    ```
3.  The script will populate the `/output` folder and update `types.d.ts`.

### Data Configuration
You can toggle specific data generation within the `generate_robust_db.cjs` script:
```javascript
const GENERATE = {
  surfers: 1,   // Enable/Disable specific parsers
  skins: 1,
  boards: 1,
  seasons: 1,
  metadata: 1
};
```

---

## 📡 API Endpoints
The live database (hosted via Cloudflare) is accessible at the following endpoints:

| File | Description |
| :--- | :--- |
| [`/surfers.json`](https://subway-city-database.trackerzero.workers.dev/surfers.json) | Characters, unlock types, and associated skins. |
| [`/skins.json`](https://subway-city-database.trackerzero.workers.dev/skins.json) | Detailed skin data and localization keys. |
| [`/boards.json`](https://subway-city-database.trackerzero.workers.dev/boards.json) | Hoverboard properties and availability. |
| [`/seasons.json`](https://subway-city-database.trackerzero.workers.dev/seasons.json) | Start/End dates for game seasons. |
| [`/metadata.json`](https://subway-city-database.trackerzero.workers.dev/metadata.json) | Versioning and "Last Updated" timestamps. |

### 📂 Static Databases
Some databases are not generated from raw game data but are maintained manually using a schema/blueprint structure. These are located in the `Static_DB/` folder.

| File | Description |
| :--- | :--- |
| `city_tour.json` | District, Chapter, and Stage progression schema. |
| `trials.json` | Campaign, Chapter, and Stage progression schema for Trials. |

---

## 📦 TypeScript Support
This tool automatically generates high-level TypeScript interfaces. You can import these directly into your frontend projects for type-safe data handling:

```typescript
// Example: Importing from the generated output
import { Surfer, SurfersDB } from './output/types';

const data: SurfersDB = await response.json();
console.log(data["JACK"].name); // "Jack"
```

---

## 🛠 Tech Stack
*   **Parser:** Node.js (FileSystem & Path modules)
*   **API Hosting:** Cloudflare Workers (Standalone)
*   **Frontend:** Vercel (Subway City Save Editor)
*   **Type System:** TypeScript Definitions (`.d.ts`)

---

## 📂 Project Structure
*   `generate_robust_db.cjs`: Main entry point for the parsing logic.
*   `gamedata_2.1.0/`: Source directory for raw game JSON files.
*   `output/`: The generated modular JSON database and type definitions.
*   `Static_DB/`: Manually maintained schema files for features like City Tour and Trials.
*   `parsers/`: Individual parsing logic for surfers, boards, seasons, etc.
*   `utils/`: Helper scripts (e.g., `names.cjs`) and mapping files (e.g., `custom_names.json`).

---

## ⚖️ License & Disclaimer
This project is for educational and data-archiving purposes. Subway Surfers and all associated game assets are trademarks and copyrights of **SYBO Games**. This tool is not affiliated with or endorsed by SYBO.
