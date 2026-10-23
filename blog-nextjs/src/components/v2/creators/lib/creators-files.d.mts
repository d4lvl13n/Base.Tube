// Type declarations for creators-files.mjs (server-only, build time).

export interface CreatorsIndexEntry {
  slug: string;
  name: string;
  game: string | null;
  live: boolean;
  collectedAt: string | null;
  avatar: string | null;
  subscribersText: string | null;
}

export interface CreatorsIndex {
  note: string;
  creators: CreatorsIndexEntry[];
}

export const CREATORS_DIR: string;
export const CREATORS_INDEX_PATH: string;
export function isCreatorFile(file: string): boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readCreatorFiles(rootDir?: string): Record<string, any>[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isLive(c: Record<string, any>): boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function computeCreatorsIndex(creators: Record<string, any>[]): CreatorsIndex;
export function readCreatorsIndexFile(rootDir?: string): CreatorsIndex | null;
export function assertCreatorsIndexFresh(): void;
