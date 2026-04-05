// Auto-generated TypeScript definitions for the robust database

export interface FileMetadata {
  version: string;
  generatedAt: string;
}

export interface Metadata {
  surfers?: FileMetadata;
  skins?: FileMetadata;
  boards?: FileMetadata;
  seasons?: FileMetadata;
  city_tour?: FileMetadata;
  trials?: FileMetadata;
}

export interface Surfer {
  id: number;
  name: string;
  defaultSkinId: number;
  available: boolean;
  unlockType: number;
  skinIds: number[];
}

export interface Skin {
  id: number;
  name: string;
  localizationKey: string;
  available: boolean;
  unlockType: number;
  surferId: number;
}

export interface Board {
  id: number;
  name: string;
  localizationKey: string;
  isDefault: boolean;
  available: boolean;
  unlockType: number;
}

export interface Season {
  name: string;
  start: string;
  end: string;
}

export interface SurfersDB {
  [dataTag: string]: Surfer;
}

export interface SkinsDB {
  [dataTag: string]: Skin;
}

export interface BoardsDB {
  [dataTag: string]: Board;
}

export interface SeasonsDB {
  [id: string]: Season;
}

export interface CityTourChapterSchema {
  id: number;
  totalStages: number;
  goalsPerStage: number;
}

export interface CityTourDistrictSchema {
  id: number;
  modes: string[];
  chapters: CityTourChapterSchema[];
}

export interface CityTourDB {
  districts: CityTourDistrictSchema[];
}

export interface TrialsCampaignSchema {
  id: string;
  modes: string[];
  chapters: CityTourChapterSchema[];
}

export interface TrialsDB {
  campaigns: TrialsCampaignSchema[];
}
