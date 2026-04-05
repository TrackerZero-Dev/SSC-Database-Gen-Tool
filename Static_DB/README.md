# Static Databases

This folder contains static database files that are not generated from the raw game data. These files use a schema/blueprint structure to define the layout of features like City Tour and Trials, rather than hardcoding every single goal.

## How they are handled in the app
The app fetches these files from the `public` directory (or the API) and uses the schema to dynamically generate the required goal IDs. This approach significantly reduces the file size and makes it much easier to maintain.

For example, instead of listing every stage and goal for a chapter, the schema defines `totalStages` and `goalsPerStage`. The app then uses loops to generate IDs like `district1_modeNormal_chapter1_stage1_goal1`.

## How to update them
When a new game update introduces new districts, campaigns, chapters, or stages, simply edit the corresponding JSON file in this folder and copy it to the `public` directory of the app (and the API hosting if applicable).

### Example Update
If a new district (District 5) is added to City Tour with 1 chapter containing 15 stages, you would add the following block to the `districts` array in `city_tour.json`:

```json
{
  "id": 5,
  "modes": ["Normal", "Hard"],
  "chapters": [
    {
      "id": 1,
      "totalStages": 15,
      "goalsPerStage": 3
    }
  ]
}
```
