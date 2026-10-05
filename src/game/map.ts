export const TILE = 16;

export type TileId =
  | "grass"
  | "flower"
  | "path"
  | "pebbles"
  | "water"
  | "wood"
  | "wall"
  | "roof"
  | "tree"
  | "door"
  | "well"
  | "reed";

const BLOCKED = new Set<TileId>(["water", "wall", "roof", "tree", "well", "reed"]);

export type Spawn = { c: number; r: number };

export type World = {
  cols: number;
  rows: number;
  tiles: TileId[];
  player: Spawn;
  enemies: Spawn[];
  elder: Spawn;
  inn: Spawn;
  smith: Spawn;
  guard: Spawn;
};

const RAW = [
  "################################",
  "#~~~~~~~~..T....T..x.....T..T..#",
  "#~~~~~~~~.....T......T.......T.#",
  "#~~~~~~~~T.x.....T......T......#",
  "#.TTTTTT.......................#",
  "#...........^^^^...............#",
  "#...........#ee#...............#",
  "#...........#==#...............#",
  "#...........#DD#...............#",
  "#...........g++................#",
  "#.######....+..+......####.....#",
  "#.#iiii#...+....+.....#ss#.....#",
  "#.#====#..+..p...+....#==#.....#",
  "#.##D###...+....+.....#D##.....#",
  "#...........+..+.......++......#",
  "#..T....T...+..+...T...........#",
  "#...........+..+........x..T...#",
  "#.x.........+..+.....RR........#",
  "#TTTT.......+..+.....RR....T...#",
  "#...........++++......T........#",
  "#..T....T..........T......T....#",
  "################################",
];

const GROUND: Record<string, TileId> = {
  ".": "grass",
  ",": "flower",
  "+": "path",
  o: "pebbles",
  "~": "water",
  "=": "wood",
  "#": "wall",
  "^": "roof",
  T: "tree",
  D: "door",
  W: "well",
  R: "reed",
  x: "grass",
  e: "wood",
  i: "wood",
  s: "wood",
  g: "path",
  p: "path",
};

export const TILE_FRAME: Record<TileId, number> = {
  grass: 0,
  flower: 9,
  path: 2,
  pebbles: 3,
  water: 4,
  wood: 5,
  wall: 6,
  roof: 7,
  tree: 8,
  door: 12,
  well: 14,
  reed: 15,
};

function need(found: Spawn | null, label: string): Spawn {
  if (!found) throw new Error(`map missing ${label}`);
  return found;
}

export function createWorld(): World {
  const rows = RAW.length;
  const cols = RAW[0]?.length ?? 0;
  const tiles: TileId[] = [];
  let player: Spawn | null = null;
  let elder: Spawn | null = null;
  let inn: Spawn | null = null;
  let smith: Spawn | null = null;
  let guard: Spawn | null = null;
  const enemies: Spawn[] = [];

  RAW.forEach((row, r) => {
    if (row.length !== cols) throw new Error(`map row ${r} width ${row.length}`);
    for (let c = 0; c < cols; c++) {
      const ch = row[c] ?? ".";
      const tile = GROUND[ch];
      if (!tile) throw new Error(`bad tile ${ch}`);
      tiles.push(tile);
      const at = { c, r };
      if (ch === "p") player = at;
      if (ch === "e") elder = at;
      if (ch === "i") inn = at;
      if (ch === "s") smith = at;
      if (ch === "g") guard = at;
      if (ch === "x") enemies.push(at);
    }
  });

  return {
    cols,
    rows,
    tiles,
    player: need(player, "player"),
    elder: need(elder, "elder"),
    inn: need(inn, "inn"),
    smith: need(smith, "smith"),
    guard: guard ?? { c: 16, r: 14 },
    enemies,
  };
}

export function tileAt(world: World, c: number, r: number): TileId | null {
  if (c < 0 || r < 0 || c >= world.cols || r >= world.rows) return null;
  return world.tiles[r * world.cols + c] ?? null;
}

export function blocked(world: World, c: number, r: number): boolean {
  const tile = tileAt(world, c, r);
  if (!tile) return true;
  return BLOCKED.has(tile);
}

export function centerOf(spawn: Spawn): { x: number; y: number } {
  return { x: spawn.c * TILE + TILE / 2, y: spawn.r * TILE + TILE / 2 };
}
