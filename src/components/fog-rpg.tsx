import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TILE, blocked, centerOf, createWorld, tileAt, TILE_FRAME, type World } from "@/game/map";

type Facing = 0 | 1 | 2 | 3;

type Enemy = {
  x: number;
  y: number;
  hp: number;
  hurt: number;
  cool: number;
  facing: Facing;
  anim: number;
};

type FloatText = { x: number; y: number; text: string; life: number };

type Dialogue = { name: string; lines: string[]; index: number };

type Sim = {
  x: number;
  y: number;
  facing: Facing;
  hp: number;
  anim: number;
  moving: boolean;
  keys: Set<string>;
  stick: { x: number; y: number };
  path: { x: number; y: number }[];
  attack: number;
  hurt: number;
  enemies: Enemy[];
  kills: number;
  turnedIn: boolean;
  dialogue: Dialogue | null;
  banner: string;
  dead: number;
  floats: FloatText[];
  started: boolean;
};

const MAX_HP = 28;
const SPEED = 54;
const HERO_ROW: Facing[] = [0, 1, 2, 3];
const FACE_VEC: { x: number; y: number }[] = [
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
];

type Hud = {
  hp: number;
  kills: number;
  turnedIn: boolean;
  banner: string;
  dialogue: Dialogue | null;
  dead: boolean;
};

const world: World = createWorld();

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });
}

function solidBox(map: World, x: number, y: number): boolean {
  const r = 5;
  const points = [
    [x - r, y - r],
    [x + r, y - r],
    [x - r, y + r],
    [x + r, y + r],
  ];
  return points.some(([px, py]) => blocked(map, Math.floor(px / TILE), Math.floor(py / TILE)));
}

function slide(map: World, x: number, y: number, dx: number, dy: number): { x: number; y: number } {
  let nx = x + dx;
  if (solidBox(map, nx, y)) nx = x;
  let ny = y + dy;
  if (solidBox(map, nx, ny)) ny = y;
  return { x: nx, y: ny };
}

function findPath(map: World, fromX: number, fromY: number, goalC: number, goalR: number): { x: number; y: number }[] {
  const sc = Math.floor(fromX / TILE);
  const sr = Math.floor(fromY / TILE);
  if (blocked(map, goalC, goalR)) return [];
  const key = (c: number, r: number) => r * map.cols + c;
  const prev = new Map<number, number>();
  const queue: { c: number; r: number }[] = [{ c: sc, r: sr }];
  prev.set(key(sc, sr), -1);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let found = false;
  while (queue.length) {
    const cur = queue.shift();
    if (!cur) break;
    if (cur.c === goalC && cur.r === goalR) {
      found = true;
      break;
    }
    for (const [dc, dr] of dirs) {
      const nc = cur.c + dc;
      const nr = cur.r + dr;
      const k = key(nc, nr);
      if (prev.has(k) || blocked(map, nc, nr)) continue;
      prev.set(k, key(cur.c, cur.r));
      queue.push({ c: nc, r: nr });
    }
  }
  if (!found) return [];
  const cells: { c: number; r: number }[] = [];
  let cursor = key(goalC, goalR);
  while (cursor !== -1) {
    const c = cursor % map.cols;
    const r = Math.floor(cursor / map.cols);
    cells.push({ c, r });
    cursor = prev.get(cursor) ?? -1;
  }
  cells.reverse();
  return cells.slice(1).map((cell) => ({ x: cell.c * TILE + TILE / 2, y: cell.r * TILE + TILE / 2 }));
}

function nearestNpc<T extends { id: string; x: number; y: number }>(sim: Sim, npcs: T[]): T | null {
  let best: T | null = null;
  let bestD = 22;
  for (const npc of npcs) {
    const d = Math.hypot(npc.x - sim.x, npc.y - sim.y);
    if (d < bestD) {
      best = npc;
      bestD = d;
    }
  }
  return best;
}

function blip(ctx: AudioContext | null, freq: number) {
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.04, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.13);
}

export function FogRpg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<Sim | null>(null);
  const stickApi = useRef<{
    start: () => void;
    talk: () => void;
    attack: () => void;
    setStick: (x: number, y: number) => void;
  } | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const view = canvas;
    const ctx2d = view.getContext("2d");
    if (!ctx2d) return;
    const context = ctx2d;

    const spawn = centerOf(world.player);
    const sim: Sim = {
      x: spawn.x,
      y: spawn.y,
      facing: 0,
      hp: MAX_HP,
      anim: 0,
      moving: false,
      keys: new Set(),
      stick: { x: 0, y: 0 },
      path: [],
      attack: 0,
      hurt: 0,
      enemies: world.enemies.map((spot) => {
        const p = centerOf(spot);
        return { x: p.x, y: p.y, hp: 3, hurt: 0, cool: 0, facing: 0 as Facing, anim: 0 };
      }),
      kills: 0,
      turnedIn: false,
      dialogue: null,
      banner: "장로에게 말을 걸어 보자",
      dead: 0,
      floats: [],
      started: false,
    };
    simRef.current = sim;

    const npcs = [
      { id: "elder", name: "장로 하은", sprite: 0, ...centerOf(world.elder) },
      { id: "inn", name: "달래", sprite: 2, ...centerOf(world.inn) },
      { id: "smith", name: "오로", sprite: 1, ...centerOf(world.smith) },
      { id: "guard", name: "강호", sprite: 3, ...centerOf(world.guard) },
    ];

    let audio: AudioContext | null = null;
    let hero: HTMLImageElement | null = null;
    let npcImg: HTMLImageElement | null = null;
    let enemyImg: HTMLImageElement | null = null;
    let tiles: HTMLImageElement | null = null;
    let raf = 0;
    let last = performance.now();
    let hudKey = "";
    let alive = true;

    const probe = {
      getX: () => sim.x,
      getY: () => sim.y,
      getSpeed: () => (sim.moving ? SPEED : 0),
      getYaw: () => [Math.PI / 2, Math.PI, 0, -Math.PI / 2][sim.facing] ?? 0,
      setKeys: (codes: string[]) => {
        sim.keys = new Set(codes);
        sim.path = [];
      },
    };
    window.__controlsTest = probe;

    function linesFor(id: string): string[] {
      if (id === "elder") {
        if (sim.turnedIn) return ["안개가 한결 걷혔다.", "또 오너라, 무린."];
        if (sim.kills >= 3) {
          sim.turnedIn = true;
          sim.banner = "마을이 한숨 돌렸다";
          return ["셋을 베었구나.", "이 안개 마을이 너에게 빚졌다."];
        }
        sim.banner = `도깨비 ${sim.kills}/3`;
        return ["북쪽 물가와 남쪽 갈대에 도깨비가 있다.", "셋을 베고 내게 오너라.", "바짝 붙어 스페이스로 벤다."];
      }
      if (id === "inn") return ["자리는 따뜻하다.", "숲에 들기 전에 숨을 고르고."];
      if (id === "smith") return ["짧은 검이로군.", "한 걸음 안에서 베야 닿는다."];
      return ["나는 강호. 마을 밖은 네가 보게.", "WASD로 걷거나, 땅을 눌러 걷는다."];
    }

    function talk(id: string, name: string) {
      const lines = linesFor(id);
      sim.dialogue = { name, lines, index: 0 };
      sim.path = [];
      blip(audio, 520);
    }

    function advanceTalk() {
      const box = sim.dialogue;
      if (!box) return;
      if (box.index < box.lines.length - 1) box.index += 1;
      else sim.dialogue = null;
    }

    function attack() {
      if (sim.dialogue || sim.dead > 0 || sim.attack > 0.05) return;
      sim.attack = 0.28;
      blip(audio, 680);
      const vec = FACE_VEC[sim.facing] ?? FACE_VEC[0];
      const hx = sim.x + vec.x * 14;
      const hy = sim.y + vec.y * 12;
      for (const enemy of sim.enemies) {
        if (enemy.hp <= 0) continue;
        if (Math.hypot(enemy.x - hx, enemy.y - hy) < 14) {
          enemy.hp -= 1;
          enemy.hurt = 0.2;
          enemy.x += vec.x * 6;
          enemy.y += vec.y * 6;
          sim.floats.push({ x: enemy.x, y: enemy.y - 16, text: "1", life: 0.6 });
          if (enemy.hp <= 0) {
            sim.kills += 1;
            sim.floats.push({ x: enemy.x, y: enemy.y - 26, text: "베었다", life: 0.8 });
            if (sim.kills >= 3 && !sim.turnedIn) sim.banner = "장로에게 돌아가자";
            else if (!sim.turnedIn) sim.banner = `도깨비 ${sim.kills}/3`;
          }
        }
      }
    }

    function pushHud() {
      const dialogue = sim.dialogue;
      const key = `${sim.hp}|${sim.kills}|${sim.turnedIn}|${sim.dead > 0}|${sim.banner}|${dialogue ? dialogue.name + dialogue.index : ""}`;
      if (key === hudKey) return;
      hudKey = key;
      setHud({
        hp: sim.hp,
        kills: sim.kills,
        turnedIn: sim.turnedIn,
        banner: sim.banner,
        dialogue,
        dead: sim.dead > 0,
      });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!sim.started) return;
      sim.keys.add(event.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
      if (event.code === "KeyE" || event.code === "Enter") {
        event.preventDefault();
        if (sim.dialogue) advanceTalk();
        else {
          const npc = nearestNpc(sim, npcs);
          if (npc) talk(npc.id, npc.name);
        }
      }
      if (event.code === "Space" || event.code === "KeyJ") attack();
    }
    function onKeyUp(event: KeyboardEvent) {
      sim.keys.delete(event.code);
    }
    function onBlur() {
      sim.keys.clear();
      sim.stick = { x: 0, y: 0 };
    }

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      view.width = Math.floor(view.clientWidth * dpr);
      view.height = Math.floor(view.clientHeight * dpr);
    }

    function canvasPoint(event: PointerEvent) {
      const rect = view.getBoundingClientRect();
      const scaleX = view.width / rect.width;
      const scaleY = view.height / rect.height;
      return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
    }

    function onPointer(event: PointerEvent) {
      if (!sim.started || !tiles) return;
      const point = canvasPoint(event);
      const across = view.clientWidth < 700 ? 14 : 20;
      const scale = view.width / (across * TILE);
      const wx = (point.x - view.width / 2) / scale + sim.x;
      const wy = (point.y - view.height / 2) / scale + sim.y;
      const hit = npcs.find((npc) => Math.hypot(npc.x - wx, npc.y - wy) < 16 && Math.hypot(npc.x - sim.x, npc.y - sim.y) < 28);
      if (hit) {
        talk(hit.id, hit.name);
        return;
      }
      if (sim.dialogue) {
        advanceTalk();
        return;
      }
      const c = Math.floor(wx / TILE);
      const r = Math.floor(wy / TILE);
      sim.path = findPath(world, sim.x, sim.y, c, r);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    window.addEventListener("resize", resize);
    view.addEventListener("pointerdown", onPointer);
    resize();

    function frame(now: number) {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      pushHud();
      raf = requestAnimationFrame(frame);
    }

    function step(dt: number) {
      sim.attack = Math.max(0, sim.attack - dt);
      sim.hurt = Math.max(0, sim.hurt - dt);
      sim.floats = sim.floats.filter((item) => {
        item.life -= dt;
        item.y -= dt * 10;
        return item.life > 0;
      });
      if (sim.dead > 0) {
        sim.dead -= dt;
        sim.moving = false;
        if (sim.dead <= 0) {
          const back = centerOf(world.player);
          sim.x = back.x;
          sim.y = back.y;
          sim.hp = MAX_HP;
          sim.banner = sim.turnedIn ? "마을이 한숨 돌렸다" : `도깨비 ${sim.kills}/3`;
        }
        return;
      }
      if (!sim.started || sim.dialogue) {
        sim.moving = false;
        return;
      }

      let mx = sim.stick.x;
      let my = sim.stick.y;
      if (sim.keys.has("KeyA") || sim.keys.has("ArrowLeft")) mx -= 1;
      if (sim.keys.has("KeyD") || sim.keys.has("ArrowRight")) mx += 1;
      if (sim.keys.has("KeyW") || sim.keys.has("ArrowUp")) my -= 1;
      if (sim.keys.has("KeyS") || sim.keys.has("ArrowDown")) my += 1;
      const mag = Math.hypot(mx, my);
      if (mag > 1) {
        mx /= mag;
        my /= mag;
      }

      if (mag > 0.1) {
        sim.path = [];
        const next = slide(world, sim.x, sim.y, mx * SPEED * dt, my * SPEED * dt);
        sim.moving = next.x !== sim.x || next.y !== sim.y;
        sim.x = next.x;
        sim.y = next.y;
        if (Math.abs(mx) > Math.abs(my)) sim.facing = mx < 0 ? 1 : 2;
        else if (Math.abs(my) > 0.1) sim.facing = my < 0 ? 3 : 0;
      } else if (sim.path.length) {
        const target = sim.path[0];
        if (!target) {
          sim.moving = false;
        } else {
          const dx = target.x - sim.x;
          const dy = target.y - sim.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 2) sim.path.shift();
          else {
            const stepX = (dx / dist) * SPEED * dt;
            const stepY = (dy / dist) * SPEED * dt;
            const next = slide(world, sim.x, sim.y, stepX, stepY);
            if (next.x === sim.x && next.y === sim.y) sim.path = [];
            sim.x = next.x;
            sim.y = next.y;
            sim.moving = true;
            if (Math.abs(dx) > Math.abs(dy)) sim.facing = dx < 0 ? 1 : 2;
            else sim.facing = dy < 0 ? 3 : 0;
          }
        }
      } else sim.moving = false;

      if (sim.moving) sim.anim += dt * 8;
      for (const enemy of sim.enemies) {
        enemy.hurt = Math.max(0, enemy.hurt - dt);
        enemy.cool = Math.max(0, enemy.cool - dt);
        if (enemy.hp <= 0) continue;
        const dx = sim.x - enemy.x;
        const dy = sim.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        let ex = 0;
        let ey = 0;
        if (dist < 100 && dist > 1) {
          ex = (dx / dist) * 32 * dt;
          ey = (dy / dist) * 32 * dt;
        }
        const next = slide(world, enemy.x, enemy.y, ex, ey);
        enemy.x = next.x;
        enemy.y = next.y;
        const moved = Math.hypot(ex, ey) > 0.2;
        if (moved) {
          enemy.anim += dt * 8;
          if (Math.abs(ex) > Math.abs(ey)) enemy.facing = ex < 0 ? 1 : 2;
          else enemy.facing = ey < 0 ? 3 : 0;
        }
        if (dist < 12 && enemy.cool <= 0 && sim.hurt <= 0) {
          sim.hp = Math.max(0, sim.hp - 4);
          sim.hurt = 0.6;
          enemy.cool = 0.8;
          sim.floats.push({ x: sim.x, y: sim.y - 18, text: "-4", life: 0.6 });
          blip(audio, 180);
          if (sim.hp <= 0) {
            sim.dead = 1.3;
            sim.dialogue = null;
            sim.banner = "쓰러졌다. 마을에서 다시 일어난다";
          }
        }
      }
      sim.enemies = sim.enemies.filter((enemy) => enemy.hp > 0);
    }

    function draw() {
      const across = view.clientWidth < 700 ? 14 : 20;
      const scale = view.width / (across * TILE);
      context.imageSmoothingEnabled = false;
      context.fillStyle = "#12100e";
      context.fillRect(0, 0, view.width, view.height);
      if (!tiles || !hero || !npcImg || !enemyImg) return;

      const camX = sim.x;
      const camY = sim.y;
      const toScreen = (x: number, y: number) => ({
        x: (x - camX) * scale + view.width / 2,
        y: (y - camY) * scale + view.height / 2,
      });

      const tileW = tiles.width / 4;
      const tileH = tiles.height / 4;
      const startC = Math.max(0, Math.floor((camX - view.width / scale / 2) / TILE) - 1);
      const endC = Math.min(world.cols - 1, Math.ceil((camX + view.width / scale / 2) / TILE) + 1);
      const startR = Math.max(0, Math.floor((camY - view.height / scale / 2) / TILE) - 1);
      const endR = Math.min(world.rows - 1, Math.ceil((camY + view.height / scale / 2) / TILE) + 1);
      for (let r = startR; r <= endR; r++) {
        for (let c = startC; c <= endC; c++) {
          const id = tileAt(world, c, r);
          if (!id) continue;
          let frame = TILE_FRAME[id];
          if (id === "grass" && (c + r) % 2 === 0) frame = 1;
          const col = frame % 4;
          const row = Math.floor(frame / 4);
          const screen = toScreen(c * TILE, r * TILE);
          context.drawImage(
            tiles,
            col * tileW,
            row * tileH,
            tileW,
            tileH,
            screen.x,
            screen.y,
            TILE * scale + 0.5,
            TILE * scale + 0.5,
          );
          if (r < 4) {
            context.fillStyle = "rgba(140, 190, 186, 0.18)";
            context.fillRect(screen.x, screen.y, TILE * scale, TILE * scale);
          }
        }
      }

      const sprites: { y: number; draw: () => void }[] = [];
      for (const npc of npcs) {
        sprites.push({
          y: npc.y,
          draw: () => {
            const screen = toScreen(npc.x, npc.y);
            blit(npcImg!, 2, 2, npc.sprite % 2, Math.floor(npc.sprite / 2), screen.x, screen.y, 40 * scale);
            label(npc.name, screen.x, screen.y - 42 * scale);
          },
        });
      }
      for (const enemy of sim.enemies) {
        sprites.push({
          y: enemy.y,
          draw: () => {
            const screen = toScreen(enemy.x, enemy.y);
            if (enemy.hurt > 0) context.globalAlpha = 0.55;
            const frame = Math.floor(enemy.anim) % 4;
            blit(enemyImg!, 4, 4, frame, enemy.facing, screen.x, screen.y, 30 * scale);
            context.globalAlpha = 1;
          },
        });
      }
      sprites.push({
        y: sim.y,
        draw: () => {
          const screen = toScreen(sim.x, sim.y);
          if (sim.hurt > 0 && Math.floor(sim.hurt * 20) % 2 === 0) context.globalAlpha = 0.45;
          const frame = sim.moving ? Math.floor(sim.anim) % 4 : 0;
          blit(hero!, 4, 4, frame, HERO_ROW[sim.facing] ?? 0, screen.x, screen.y, 42 * scale);
          context.globalAlpha = 1;
          if (sim.attack > 0.12) {
            const vec = FACE_VEC[sim.facing] ?? FACE_VEC[0];
            context.fillStyle = "#f6efe4";
            context.fillRect(screen.x + vec.x * 16 * scale - 3, screen.y - 18 * scale + vec.y * 12 * scale, 6, 10);
          }
          label("무린", screen.x, screen.y - 44 * scale);
        },
      });
      sprites.sort((a, b) => a.y - b.y);
      for (const sprite of sprites) sprite.draw();

      context.fillStyle = "#f6efe4";
      context.font = `${Math.max(11, 4 * scale)}px Galmuri11, sans-serif`;
      context.textAlign = "center";
      for (const item of sim.floats) {
        const screen = toScreen(item.x, item.y);
        context.fillText(item.text, screen.x, screen.y);
      }
    }

    function blit(
      img: HTMLImageElement,
      cols: number,
      rows: number,
      col: number,
      row: number,
      x: number,
      y: number,
      destH: number,
    ) {
      const fw = img.width / cols;
      const fh = img.height / rows;
      const destW = destH * (fw / fh);
      context.drawImage(img, col * fw, row * fh, fw, fh, x - destW / 2, y - destH, destW, destH);
    }

    function label(text: string, x: number, y: number) {
      context.font = "12px Galmuri11, sans-serif";
      context.textAlign = "center";
      context.fillStyle = "#12100e";
      context.fillText(text, x + 1, y + 1);
      context.fillStyle = "#f6efe4";
      context.fillText(text, x, y);
    }

    void Promise.all([
      loadImage("/sprites/hero.png"),
      loadImage("/sprites/npcs.png"),
      loadImage("/sprites/enemy.png"),
      loadImage("/sprites/tiles.png"),
    ])
      .then(([heroImage, npcImage, enemyImage, tileImage]) => {
        if (!alive) return;
        hero = heroImage;
        npcImg = npcImage;
        enemyImg = enemyImage;
        tiles = tileImage;
        setReady(true);
        raf = requestAnimationFrame(frame);
      })
      .catch(() => {
        sim.banner = "그림을 불러오지 못했다";
        pushHud();
      });

    const api = {
      start() {
        sim.started = true;
        const AudioCtx = window.AudioContext;
        if (!audio) audio = new AudioCtx();
        if (audio.state === "suspended") void audio.resume();
      },
      talk() {
        if (sim.dialogue) advanceTalk();
        else {
          const npc = nearestNpc(sim, npcs);
          if (npc) talk(npc.id, npc.name);
        }
      },
      attack,
      setStick(x: number, y: number) {
        sim.stick = { x, y };
        if (x !== 0 || y !== 0) sim.path = [];
      },
    };
    stickApi.current = api;

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", resize);
      view.removeEventListener("pointerdown", onPointer);
      if (window.__controlsTest === probe) delete window.__controlsTest;
    };
  }, []);

  return (
    <div className="rpg-root relative min-h-screen overflow-hidden bg-night text-paper">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
        <div className="rpg-panel pointer-events-auto min-w-40 px-3 py-2">
          <p className="text-sm text-mist">무린</p>
          <div className="mt-1 h-2 w-36 bg-bark">
            <div className="h-full bg-cinnabar" style={{ width: `${((hud?.hp ?? MAX_HP) / MAX_HP) * 100}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">
            {hud?.turnedIn ? "의뢰 완료" : `도깨비 ${hud?.kills ?? 0}/3`}
          </p>
        </div>
        <p className="rpg-panel pointer-events-auto px-3 py-2 text-sm">{hud?.banner ?? "안개 마을"}</p>
      </div>

      {hud?.dialogue ? (
        <button
          type="button"
          className="rpg-panel absolute inset-x-3 bottom-24 z-10 px-4 py-3 text-left sm:bottom-6"
          onClick={() => stickApi.current?.talk()}
        >
          <p className="text-sm text-mist">{hud.dialogue.name}</p>
          <p className="mt-1 text-base leading-relaxed">{hud.dialogue.lines[hud.dialogue.index]}</p>
          <p className="mt-2 text-xs text-muted">눌러서 다음</p>
        </button>
      ) : null}

      {started ? (
        <div className="absolute bottom-3 left-3 z-10 grid grid-cols-3 gap-1 sm:hidden">
          <span />
          <Pad label="위" onDown={() => stickApi.current?.setStick(0, -1)} onUp={() => stickApi.current?.setStick(0, 0)} />
          <span />
          <Pad label="왼쪽" onDown={() => stickApi.current?.setStick(-1, 0)} onUp={() => stickApi.current?.setStick(0, 0)} />
          <span />
          <Pad label="오른쪽" onDown={() => stickApi.current?.setStick(1, 0)} onUp={() => stickApi.current?.setStick(0, 0)} />
          <span />
          <Pad label="아래" onDown={() => stickApi.current?.setStick(0, 1)} onUp={() => stickApi.current?.setStick(0, 0)} />
          <span />
        </div>
      ) : null}
      {started ? (
        <div className="absolute right-3 bottom-3 z-10 flex gap-2 sm:hidden">
          <button type="button" className="rpg-panel min-h-12 min-w-16 px-3 font-bold" onClick={() => stickApi.current?.talk()}>
            말
          </button>
          <button type="button" className="min-h-12 min-w-16 bg-cinnabar px-3 font-bold text-night" onClick={() => stickApi.current?.attack()}>
            베기
          </button>
        </div>
      ) : null}

      {!started ? (
        <div className="absolute inset-0 z-20 flex items-end justify-center bg-night/80 p-4 sm:items-center">
          <div className="rpg-panel w-full max-w-md px-5 py-6">
            <p className="text-sm text-mist">탑다운 도트</p>
            <h1 className="font-display text-4xl font-bold">안개나라</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              주인공은 안개 마을의 짧은 검객 무린. 땅을 누르거나 WASD로 걷고, 스페이스로 벤다. E로 말을 건다.
            </p>
            <button
              type="button"
              className="mt-5 min-h-12 w-full bg-paper px-4 py-3 font-bold text-night"
              disabled={!ready}
              onClick={() => {
                stickApi.current?.start();
                setStarted(true);
              }}
            >
              {ready ? "마을로 들어간다" : "그림을 펼치는 중"}
            </button>
            <p className="mt-3 text-xs text-muted">
              <Link to="/quiz" className="underline">
                문답으로
              </Link>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Pad({ label, onDown, onUp }: { label: string; onDown: () => void; onUp: () => void }) {
  return (
    <button
      type="button"
      className="rpg-panel min-h-12 min-w-12 text-xs"
      onPointerDown={(event) => {
        event.preventDefault();
        onDown();
      }}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      {label}
    </button>
  );
}

declare global {
  interface Window {
    __controlsTest?: {
      getX: () => number;
      getY: () => number;
      getSpeed: () => number;
      getYaw: () => number;
      setKeys: (codes: string[]) => void;
    };
  }
}
