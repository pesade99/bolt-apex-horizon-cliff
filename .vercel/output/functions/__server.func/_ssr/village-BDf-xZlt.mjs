import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/village-BDf-xZlt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BLOCKED = /* @__PURE__ */ new Set([
	"water",
	"wall",
	"roof",
	"tree",
	"well",
	"reed"
]);
var RAW = [
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
	"################################"
];
var GROUND = {
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
	p: "path"
};
var TILE_FRAME = {
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
	reed: 15
};
function need(found, label) {
	if (!found) throw new Error(`map missing ${label}`);
	return found;
}
function createWorld() {
	const rows = RAW.length;
	const cols = RAW[0]?.length ?? 0;
	const tiles = [];
	let player = null;
	let elder = null;
	let inn = null;
	let smith = null;
	let guard = null;
	const enemies = [];
	RAW.forEach((row, r) => {
		if (row.length !== cols) throw new Error(`map row ${r} width ${row.length}`);
		for (let c = 0; c < cols; c++) {
			const ch = row[c] ?? ".";
			const tile = GROUND[ch];
			if (!tile) throw new Error(`bad tile ${ch}`);
			tiles.push(tile);
			const at = {
				c,
				r
			};
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
		guard: guard ?? {
			c: 16,
			r: 14
		},
		enemies
	};
}
function tileAt(world, c, r) {
	if (c < 0 || r < 0 || c >= world.cols || r >= world.rows) return null;
	return world.tiles[r * world.cols + c] ?? null;
}
function blocked(world, c, r) {
	const tile = tileAt(world, c, r);
	if (!tile) return true;
	return BLOCKED.has(tile);
}
function centerOf(spawn) {
	return {
		x: spawn.c * 16 + 8,
		y: spawn.r * 16 + 8
	};
}
var MAX_HP = 28;
var SPEED = 54;
var HERO_ROW = [
	0,
	1,
	2,
	3
];
var FACE_VEC = [
	{
		x: 0,
		y: 1
	},
	{
		x: -1,
		y: 0
	},
	{
		x: 1,
		y: 0
	},
	{
		x: 0,
		y: -1
	}
];
var world = createWorld();
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(src));
		img.src = src;
	});
}
function solidBox(map, x, y) {
	const r = 5;
	return [
		[x - r, y - r],
		[x + r, y - r],
		[x - r, y + r],
		[x + r, y + r]
	].some(([px, py]) => blocked(map, Math.floor(px / 16), Math.floor(py / 16)));
}
function slide(map, x, y, dx, dy) {
	let nx = x + dx;
	if (solidBox(map, nx, y)) nx = x;
	let ny = y + dy;
	if (solidBox(map, nx, ny)) ny = y;
	return {
		x: nx,
		y: ny
	};
}
function findPath(map, fromX, fromY, goalC, goalR) {
	const sc = Math.floor(fromX / 16);
	const sr = Math.floor(fromY / 16);
	if (blocked(map, goalC, goalR)) return [];
	const key = (c, r) => r * map.cols + c;
	const prev = /* @__PURE__ */ new Map();
	const queue = [{
		c: sc,
		r: sr
	}];
	prev.set(key(sc, sr), -1);
	const dirs = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
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
			queue.push({
				c: nc,
				r: nr
			});
		}
	}
	if (!found) return [];
	const cells = [];
	let cursor = key(goalC, goalR);
	while (cursor !== -1) {
		const c = cursor % map.cols;
		const r = Math.floor(cursor / map.cols);
		cells.push({
			c,
			r
		});
		cursor = prev.get(cursor) ?? -1;
	}
	cells.reverse();
	return cells.slice(1).map((cell) => ({
		x: cell.c * 16 + 8,
		y: cell.r * 16 + 8
	}));
}
function nearestNpc(sim, npcs) {
	let best = null;
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
function blip(ctx, freq) {
	if (!ctx) return;
	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "square";
	osc.frequency.setValueAtTime(freq, now);
	gain.gain.setValueAtTime(1e-4, now);
	gain.gain.exponentialRampToValueAtTime(.04, now + .01);
	gain.gain.exponentialRampToValueAtTime(1e-4, now + .12);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(now);
	osc.stop(now + .13);
}
function FogRpg() {
	const canvasRef = (0, import_react.useRef)(null);
	const simRef = (0, import_react.useRef)(null);
	const stickApi = (0, import_react.useRef)(null);
	const [hud, setHud] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [started, setStarted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const view = canvas;
		const ctx2d = view.getContext("2d");
		if (!ctx2d) return;
		const context = ctx2d;
		const spawn = centerOf(world.player);
		const sim = {
			x: spawn.x,
			y: spawn.y,
			facing: 0,
			hp: MAX_HP,
			anim: 0,
			moving: false,
			keys: /* @__PURE__ */ new Set(),
			stick: {
				x: 0,
				y: 0
			},
			path: [],
			attack: 0,
			hurt: 0,
			enemies: world.enemies.map((spot) => {
				const p = centerOf(spot);
				return {
					x: p.x,
					y: p.y,
					hp: 3,
					hurt: 0,
					cool: 0,
					facing: 0,
					anim: 0
				};
			}),
			kills: 0,
			turnedIn: false,
			dialogue: null,
			banner: "장로에게 말을 걸어 보자",
			dead: 0,
			floats: [],
			started: false
		};
		simRef.current = sim;
		const npcs = [
			{
				id: "elder",
				name: "장로 하은",
				sprite: 0,
				...centerOf(world.elder)
			},
			{
				id: "inn",
				name: "달래",
				sprite: 2,
				...centerOf(world.inn)
			},
			{
				id: "smith",
				name: "오로",
				sprite: 1,
				...centerOf(world.smith)
			},
			{
				id: "guard",
				name: "강호",
				sprite: 3,
				...centerOf(world.guard)
			}
		];
		let audio = null;
		let hero = null;
		let npcImg = null;
		let enemyImg = null;
		let tiles = null;
		let raf = 0;
		let last = performance.now();
		let hudKey = "";
		let alive = true;
		const probe = {
			getX: () => sim.x,
			getY: () => sim.y,
			getSpeed: () => sim.moving ? SPEED : 0,
			getYaw: () => [
				Math.PI / 2,
				Math.PI,
				0,
				-Math.PI / 2
			][sim.facing] ?? 0,
			setKeys: (codes) => {
				sim.keys = new Set(codes);
				sim.path = [];
			}
		};
		window.__controlsTest = probe;
		function linesFor(id) {
			if (id === "elder") {
				if (sim.turnedIn) return ["안개가 한결 걷혔다.", "또 오너라, 무린."];
				if (sim.kills >= 3) {
					sim.turnedIn = true;
					sim.banner = "마을이 한숨 돌렸다";
					return ["셋을 베었구나.", "이 안개 마을이 너에게 빚졌다."];
				}
				sim.banner = `도깨비 ${sim.kills}/3`;
				return [
					"북쪽 물가와 남쪽 갈대에 도깨비가 있다.",
					"셋을 베고 내게 오너라.",
					"바짝 붙어 스페이스로 벤다."
				];
			}
			if (id === "inn") return ["자리는 따뜻하다.", "숲에 들기 전에 숨을 고르고."];
			if (id === "smith") return ["짧은 검이로군.", "한 걸음 안에서 베야 닿는다."];
			return ["나는 강호. 마을 밖은 네가 보게.", "WASD로 걷거나, 땅을 눌러 걷는다."];
		}
		function talk(id, name) {
			const lines = linesFor(id);
			sim.dialogue = {
				name,
				lines,
				index: 0
			};
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
			if (sim.dialogue || sim.dead > 0 || sim.attack > .05) return;
			sim.attack = .28;
			blip(audio, 680);
			const vec = FACE_VEC[sim.facing] ?? FACE_VEC[0];
			const hx = sim.x + vec.x * 14;
			const hy = sim.y + vec.y * 12;
			for (const enemy of sim.enemies) {
				if (enemy.hp <= 0) continue;
				if (Math.hypot(enemy.x - hx, enemy.y - hy) < 14) {
					enemy.hp -= 1;
					enemy.hurt = .2;
					enemy.x += vec.x * 6;
					enemy.y += vec.y * 6;
					sim.floats.push({
						x: enemy.x,
						y: enemy.y - 16,
						text: "1",
						life: .6
					});
					if (enemy.hp <= 0) {
						sim.kills += 1;
						sim.floats.push({
							x: enemy.x,
							y: enemy.y - 26,
							text: "베었다",
							life: .8
						});
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
				dead: sim.dead > 0
			});
		}
		function onKeyDown(event) {
			if (!sim.started) return;
			sim.keys.add(event.code);
			if ([
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight"
			].includes(event.code)) event.preventDefault();
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
		function onKeyUp(event) {
			sim.keys.delete(event.code);
		}
		function onBlur() {
			sim.keys.clear();
			sim.stick = {
				x: 0,
				y: 0
			};
		}
		function resize() {
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			view.width = Math.floor(view.clientWidth * dpr);
			view.height = Math.floor(view.clientHeight * dpr);
		}
		function canvasPoint(event) {
			const rect = view.getBoundingClientRect();
			const scaleX = view.width / rect.width;
			const scaleY = view.height / rect.height;
			return {
				x: (event.clientX - rect.left) * scaleX,
				y: (event.clientY - rect.top) * scaleY
			};
		}
		function onPointer(event) {
			if (!sim.started || !tiles) return;
			const point = canvasPoint(event);
			const across = view.clientWidth < 700 ? 14 : 20;
			const scale = view.width / (across * 16);
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
			const c = Math.floor(wx / 16);
			const r = Math.floor(wy / 16);
			sim.path = findPath(world, sim.x, sim.y, c, r);
		}
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("blur", onBlur);
		window.addEventListener("resize", resize);
		view.addEventListener("pointerdown", onPointer);
		resize();
		function frame(now) {
			if (!alive) return;
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			step(dt);
			draw();
			pushHud();
			raf = requestAnimationFrame(frame);
		}
		function step(dt) {
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
			if (mag > .1) {
				sim.path = [];
				const next = slide(world, sim.x, sim.y, mx * SPEED * dt, my * SPEED * dt);
				sim.moving = next.x !== sim.x || next.y !== sim.y;
				sim.x = next.x;
				sim.y = next.y;
				if (Math.abs(mx) > Math.abs(my)) sim.facing = mx < 0 ? 1 : 2;
				else if (Math.abs(my) > .1) sim.facing = my < 0 ? 3 : 0;
			} else if (sim.path.length) {
				const target = sim.path[0];
				if (!target) sim.moving = false;
				else {
					const dx = target.x - sim.x;
					const dy = target.y - sim.y;
					const dist = Math.hypot(dx, dy);
					if (dist < 2) sim.path.shift();
					else {
						const stepX = dx / dist * SPEED * dt;
						const stepY = dy / dist * SPEED * dt;
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
					ex = dx / dist * 32 * dt;
					ey = dy / dist * 32 * dt;
				}
				const next = slide(world, enemy.x, enemy.y, ex, ey);
				enemy.x = next.x;
				enemy.y = next.y;
				if (Math.hypot(ex, ey) > .2) {
					enemy.anim += dt * 8;
					if (Math.abs(ex) > Math.abs(ey)) enemy.facing = ex < 0 ? 1 : 2;
					else enemy.facing = ey < 0 ? 3 : 0;
				}
				if (dist < 12 && enemy.cool <= 0 && sim.hurt <= 0) {
					sim.hp = Math.max(0, sim.hp - 4);
					sim.hurt = .6;
					enemy.cool = .8;
					sim.floats.push({
						x: sim.x,
						y: sim.y - 18,
						text: "-4",
						life: .6
					});
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
			const scale = view.width / (across * 16);
			context.imageSmoothingEnabled = false;
			context.fillStyle = "#12100e";
			context.fillRect(0, 0, view.width, view.height);
			if (!tiles || !hero || !npcImg || !enemyImg) return;
			const camX = sim.x;
			const camY = sim.y;
			const toScreen = (x, y) => ({
				x: (x - camX) * scale + view.width / 2,
				y: (y - camY) * scale + view.height / 2
			});
			const tileW = tiles.width / 4;
			const tileH = tiles.height / 4;
			const startC = Math.max(0, Math.floor((camX - view.width / scale / 2) / 16) - 1);
			const endC = Math.min(world.cols - 1, Math.ceil((camX + view.width / scale / 2) / 16) + 1);
			const startR = Math.max(0, Math.floor((camY - view.height / scale / 2) / 16) - 1);
			const endR = Math.min(world.rows - 1, Math.ceil((camY + view.height / scale / 2) / 16) + 1);
			for (let r = startR; r <= endR; r++) for (let c = startC; c <= endC; c++) {
				const id = tileAt(world, c, r);
				if (!id) continue;
				let frame = TILE_FRAME[id];
				if (id === "grass" && (c + r) % 2 === 0) frame = 1;
				const col = frame % 4;
				const row = Math.floor(frame / 4);
				const screen = toScreen(c * 16, r * 16);
				context.drawImage(tiles, col * tileW, row * tileH, tileW, tileH, screen.x, screen.y, 16 * scale + .5, 16 * scale + .5);
				if (r < 4) {
					context.fillStyle = "rgba(140, 190, 186, 0.18)";
					context.fillRect(screen.x, screen.y, 16 * scale, 16 * scale);
				}
			}
			const sprites = [];
			for (const npc of npcs) sprites.push({
				y: npc.y,
				draw: () => {
					const screen = toScreen(npc.x, npc.y);
					blit(npcImg, 2, 2, npc.sprite % 2, Math.floor(npc.sprite / 2), screen.x, screen.y, 40 * scale);
					label(npc.name, screen.x, screen.y - 42 * scale);
				}
			});
			for (const enemy of sim.enemies) sprites.push({
				y: enemy.y,
				draw: () => {
					const screen = toScreen(enemy.x, enemy.y);
					if (enemy.hurt > 0) context.globalAlpha = .55;
					const frame = Math.floor(enemy.anim) % 4;
					blit(enemyImg, 4, 4, frame, enemy.facing, screen.x, screen.y, 30 * scale);
					context.globalAlpha = 1;
				}
			});
			sprites.push({
				y: sim.y,
				draw: () => {
					const screen = toScreen(sim.x, sim.y);
					if (sim.hurt > 0 && Math.floor(sim.hurt * 20) % 2 === 0) context.globalAlpha = .45;
					const frame = sim.moving ? Math.floor(sim.anim) % 4 : 0;
					blit(hero, 4, 4, frame, HERO_ROW[sim.facing] ?? 0, screen.x, screen.y, 42 * scale);
					context.globalAlpha = 1;
					if (sim.attack > .12) {
						const vec = FACE_VEC[sim.facing] ?? FACE_VEC[0];
						context.fillStyle = "#f6efe4";
						context.fillRect(screen.x + vec.x * 16 * scale - 3, screen.y - 18 * scale + vec.y * 12 * scale, 6, 10);
					}
					label("무린", screen.x, screen.y - 44 * scale);
				}
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
		function blit(img, cols, rows, col, row, x, y, destH) {
			const fw = img.width / cols;
			const fh = img.height / rows;
			const destW = destH * (fw / fh);
			context.drawImage(img, col * fw, row * fh, fw, fh, x - destW / 2, y - destH, destW, destH);
		}
		function label(text, x, y) {
			context.font = "12px Galmuri11, sans-serif";
			context.textAlign = "center";
			context.fillStyle = "#12100e";
			context.fillText(text, x + 1, y + 1);
			context.fillStyle = "#f6efe4";
			context.fillText(text, x, y);
		}
		Promise.all([
			loadImage("/sprites/hero.png"),
			loadImage("/sprites/npcs.png"),
			loadImage("/sprites/enemy.png"),
			loadImage("/sprites/tiles.png")
		]).then(([heroImage, npcImage, enemyImage, tileImage]) => {
			if (!alive) return;
			hero = heroImage;
			npcImg = npcImage;
			enemyImg = enemyImage;
			tiles = tileImage;
			setReady(true);
			raf = requestAnimationFrame(frame);
		}).catch(() => {
			sim.banner = "그림을 불러오지 못했다";
			pushHud();
		});
		stickApi.current = {
			start() {
				sim.started = true;
				const AudioCtx = window.AudioContext;
				if (!audio) audio = new AudioCtx();
				if (audio.state === "suspended") audio.resume();
			},
			talk() {
				if (sim.dialogue) advanceTalk();
				else {
					const npc = nearestNpc(sim, npcs);
					if (npc) talk(npc.id, npc.name);
				}
			},
			attack,
			setStick(x, y) {
				sim.stick = {
					x,
					y
				};
				if (x !== 0 || y !== 0) sim.path = [];
			}
		};
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rpg-root relative min-h-screen overflow-hidden bg-night text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rpg-panel pointer-events-auto min-w-40 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-mist",
							children: "무린"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-2 w-36 bg-bark",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-cinnabar",
								style: { width: `${(hud?.hp ?? MAX_HP) / MAX_HP * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: hud?.turnedIn ? "의뢰 완료" : `도깨비 ${hud?.kills ?? 0}/3`
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rpg-panel pointer-events-auto px-3 py-2 text-sm",
					children: hud?.banner ?? "안개 마을"
				})]
			}),
			hud?.dialogue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "rpg-panel absolute inset-x-3 bottom-24 z-10 px-4 py-3 text-left sm:bottom-6",
				onClick: () => stickApi.current?.talk(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: hud.dialogue.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-base leading-relaxed",
						children: hud.dialogue.lines[hud.dialogue.index]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "눌러서 다음"
					})
				]
			}) : null,
			started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-3 left-3 z-10 grid grid-cols-3 gap-1 sm:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "위",
						onDown: () => stickApi.current?.setStick(0, -1),
						onUp: () => stickApi.current?.setStick(0, 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "왼쪽",
						onDown: () => stickApi.current?.setStick(-1, 0),
						onUp: () => stickApi.current?.setStick(0, 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "오른쪽",
						onDown: () => stickApi.current?.setStick(1, 0),
						onUp: () => stickApi.current?.setStick(0, 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
						label: "아래",
						onDown: () => stickApi.current?.setStick(0, 1),
						onUp: () => stickApi.current?.setStick(0, 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
				]
			}) : null,
			started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 bottom-3 z-10 flex gap-2 sm:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rpg-panel min-h-12 min-w-16 px-3 font-bold",
					onClick: () => stickApi.current?.talk(),
					children: "말"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-12 min-w-16 bg-cinnabar px-3 font-bold text-night",
					onClick: () => stickApi.current?.attack(),
					children: "베기"
				})]
			}) : null,
			!started ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-20 flex items-end justify-center bg-night/80 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rpg-panel w-full max-w-md px-5 py-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-mist",
							children: "탑다운 도트"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl font-bold",
							children: "안개나라"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: "주인공은 안개 마을의 짧은 검객 무린. 땅을 누르거나 WASD로 걷고, 스페이스로 벤다. E로 말을 건다."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-5 min-h-12 w-full bg-paper px-4 py-3 font-bold text-night",
							disabled: !ready,
							onClick: () => {
								stickApi.current?.start();
								setStarted(true);
							},
							children: ready ? "마을로 들어간다" : "그림을 펼치는 중"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/quiz",
								className: "underline",
								children: "문답으로"
							})
						})
					]
				})
			}) : null
		]
	});
}
function Pad({ label, onDown, onUp }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "rpg-panel min-h-12 min-w-12 text-xs",
		onPointerDown: (event) => {
			event.preventDefault();
			onDown();
		},
		onPointerUp: onUp,
		onPointerLeave: onUp,
		children: label
	});
}
var SplitComponent = FogRpg;
//#endregion
export { SplitComponent as component };
