/* 野獣キングダム — environment atlas (bake-once).
 * Provenance: authored for this repository. Summer Shimokitazawa parody scenery
 * (瓦屋根・波板・室外機・部室屋上・路地・井の頭のヨシ・ネオン窓・外縁測定塔).
 * No third-party tilesets, no per-frame textures, no network, no real addresses.
 */
(function (global) {
  const PAL = {
    N: '#140a10',
    '1': '#f4f0e4', '2': '#c8c0b4',
    O: '#d8c4a0', o: '#b89a78', f: '#c4a878',
    T: '#6a4030', t: '#4a2c20', C: '#3a2418',
    q: '#c45a38', Q: '#a84828', F: '#8a3020',
    H: '#8a8a88', h: '#5a5a58', P: '#3a3a3c',
    K: '#2a2a30', B: '#3a3a44', b: '#4a4a54',
    s: '#1a2838', u: '#0c141c',
    Y: '#ffe080', y: '#ffb040',
    c: '#7ec8e8', n: '#3ad0c8',
    V: '#4a7a38', v: '#2e5a28', W: '#6a8a40',
    R: '#ff6b9d', r: '#d44a78', X: '#ff9ec0', p: '#ff44aa',
    Z: '#c4282a', z: '#8a1818',
    G: '#e8c040', g: '#a08030',
    A: '#3d6a9a', a: '#2a4e78',
    L: '#c8a060', l: '#8a7040',
    M: '#4a2848', m: '#2a1830',
    E: '#201818', e: '#4a3020',
    '@': '#33ffee',
    I: '#6aaa44', i: '#3a7028',
  };

  const SCALE = 2;

  function buf(w, h) { return { w, h, p: new Array(w * h).fill('.') }; }
  function setp(b, x, y, ch) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= b.w || y >= b.h) return;
    if (!ch || ch === '.' || ch === ' ') return;
    b.p[y * b.w + x] = ch;
  }
  function rect(b, x, y, w, h, ch) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) setp(b, x + i, y + j, ch);
  }
  function oval(b, cx, cy, rx, ry, ch) {
    rx = Math.max(1, rx); ry = Math.max(1, ry);
    for (let j = -ry; j <= ry; j++) {
      for (let i = -rx; i <= rx; i++) {
        if ((i * i) / (rx * rx) + (j * j) / (ry * ry) <= 1.1) setp(b, cx + i, cy + j, ch);
      }
    }
  }
  function toGrid(b) {
    const rows = [];
    for (let y = 0; y < b.h; y++) {
      let s = '';
      for (let x = 0; x < b.w; x++) s += b.p[y * b.w + x];
      rows.push(s);
    }
    return rows;
  }

  function kawara(b, x, y, w, h, a, c) {
    for (let j = 0; j < h; j++) {
      const inset = Math.floor((h - 1 - j) * (w * 0.22) / Math.max(1, h));
      rect(b, x + inset, y + j, Math.max(2, w - inset * 2), 1, j % 2 ? a : c);
      if (j % 3 === 1) {
        for (let i = inset + 2; i < w - inset - 1; i += 4) setp(b, x + i, y + j, c);
      }
    }
    rect(b, x + 1, y + h - 1, w - 2, 1, 'C');
  }
  function namiita(b, x, y, w, h) {
    rect(b, x, y, w, h, 'h');
    for (let i = 0; i < w; i += 2) rect(b, x + i, y, 1, h, (i % 4 === 0) ? 'H' : '2');
    rect(b, x, y + h - 1, w, 1, 'P');
  }
  function windowPane(b, wins, x, y, w, h) {
    rect(b, x, y, w, h, 'N');
    rect(b, x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2), 's');
    setp(b, x + 1, y + 1, 'c');
    rect(b, x + (w >> 1), y, 1, h, 'N');
    if (h > 4) rect(b, x, y + (h >> 1), w, 1, 'N');
    wins.push({ x, y, w, h });
  }
  function acUnit(b, x, y) {
    rect(b, x, y, 7, 5, 'H');
    rect(b, x + 1, y + 1, 5, 1, '2');
    rect(b, x + 1, y + 3, 5, 1, 'P');
    setp(b, x + 6, y + 2, 'n');
  }
  function balcony(b, x, y, w) {
    rect(b, x, y, w, 2, 'H');
    for (let i = 0; i < w; i += 3) setp(b, x + i, y - 2, '2');
    rect(b, x, y - 1, 1, 2, 'P');
    rect(b, x + w - 1, y - 1, 1, 2, 'P');
  }
  function door(b, x, y, h) {
    rect(b, x, y, 6, h, 'C');
    rect(b, x + 1, y + 1, 4, h - 3, 'T');
    setp(b, x + 4, y + (h >> 1), 'G');
  }
  function weeds(b, y) {
    setp(b, 2, y, 'V'); setp(b, 3, y - 1, 'W');
    setp(b, b.w - 3, y, 'v'); setp(b, b.w - 4, y - 1, 'V');
  }

  function house(spec) {
    const W = spec.w, H = spec.h;
    const b = buf(W, H);
    const wins = [];
    const roofH = spec.roofH || 11;
    kawara(b, 0, 0, W, roofH, spec.roofA || 'q', spec.roofB || 'Q');
    const wall = spec.wall || 'O';
    rect(b, 2, roofH - 1, W - 4, H - roofH, wall);
    rect(b, W - 5, roofH + 1, 2, H - roofH - 3, spec.shade || 'o');
    if (spec.nami) namiita(b, W - 9, roofH + 5, 7, H - roofH - 12);
    const wy2 = roofH + 3;
    windowPane(b, wins, 5, wy2, 6, 6);
    windowPane(b, wins, W - 13, wy2, 6, 6);
    if (spec.midWin) windowPane(b, wins, (W >> 1) - 3, wy2, 6, 6);
    balcony(b, 3, wy2 + 8, W - 6);
    const wy1 = wy2 + 13;
    windowPane(b, wins, 5, wy1, 6, 7);
    if (!spec.shop) windowPane(b, wins, W - 13, wy1, 6, 7);
    if (spec.shop) {
      rect(b, 4, roofH + 1, W - 8, 3, 'Z');
      rect(b, 5, roofH + 4, 6, 9, 'z');
      rect(b, 12, roofH + 4, 6, 9, 'z');
      if (W > 28) rect(b, 19, roofH + 4, 6, 9, 'z');
      rect(b, 4, H - 14, W - 10, 3, 'L');
    }
    door(b, spec.shop ? 8 : (W >> 1) - 3, H - 13, 12);
    acUnit(b, W - 10, H - 17);
    rect(b, 1, H - 2, W - 2, 2, 'C');
    weeds(b, H - 3);
    if (spec.board) {
      rect(b, 14, H - 22, 8, 7, 'l');
      rect(b, 15, H - 21, 6, 2, 'z');
    }
    if (spec.club) {
      rect(b, W - 13, 1, 9, 9, 'H');
      rect(b, W - 12, 2, 7, 3, 'c');
      rect(b, W - 11, 6, 5, 3, 'P');
      for (let i = 3; i < W - 3; i += 3) setp(b, i, roofH - 2, '2');
      rect(b, 4, 2, 10, 6, 'A');
      rect(b, 5, 3, 8, 4, 's');
    }
    return { grid: toGrid(b), windows: wins };
  }

  function neonTower(spec) {
    const W = spec.w, H = spec.h;
    const b = buf(W, H);
    const wins = [];
    rect(b, 2, 4, W - 4, H - 4, spec.wall || 'K');
    rect(b, W - 4, 6, 2, H - 8, 'B');
    rect(b, 1, 3, W - 2, 4, spec.sign || 'R');
    rect(b, 2, 4, W - 4, 2, spec.sign2 || 'X');
    for (let row = 0; row < spec.floors; row++) {
      const y = 10 + row * 7;
      for (let col = 0; col < spec.cols; col++) {
        const x = 4 + col * 5;
        windowPane(b, wins, x, y, 4, 5);
      }
    }
    if (spec.billboard) {
      rect(b, -0, 0, 12, 5, 'p');
      rect(b, 1, 1, 10, 3, 'Y');
    }
    rect(b, 2, H - 2, W - 4, 2, 'P');
    return { grid: toGrid(b), windows: wins };
  }

  function voidBuild(spec) {
    const W = spec.w, H = spec.h;
    const b = buf(W, H);
    const wins = [];
    rect(b, 3, 8, W - 6, H - 8, spec.wall || 'e');
    namiita(b, 3, 12, 4, H - 16);
    kawara(b, 1, 4, W - 2, 7, 't', 'C');
    windowPane(b, wins, 8, 16, 5, 6);
    windowPane(b, wins, 8, 28, 5, 7);
    rect(b, (W >> 1) - 1, 0, 2, 8, 'H');
    rect(b, (W >> 1) - 3, 0, 6, 2, 'h');
    setp(b, (W >> 1) + 2, 3, 'y');
    rect(b, 2, H - 2, W - 4, 2, 'C');
    weeds(b, H - 3);
    return { grid: toGrid(b), windows: wins };
  }

  function measureTower() {
    const W = 18, H = 72;
    const b = buf(W, H);
    const wins = [];
    rect(b, 6, 8, 6, H - 8, 'P');
    rect(b, 5, 8, 1, H - 8, 'h');
    rect(b, 12, 8, 1, H - 8, 'H');
    for (let y = 12; y < H - 6; y += 8) {
      rect(b, 4, y, 10, 2, 'h');
      windowPane(b, wins, 7, y + 3, 4, 4);
    }
    rect(b, 3, 4, 12, 6, 'e');
    rect(b, 8, 0, 2, 8, 'H');
    setp(b, 10, 1, 'y');
    rect(b, 2, H - 3, 14, 3, 'C');
    return { grid: toGrid(b), windows: wins };
  }

  function tree(kind) {
    const W = 24, H = 42;
    const b = buf(W, H);
    rect(b, 10, 22, 4, 20, 'T');
    rect(b, 11, 24, 2, 16, 't');
    if (kind === 'willow') {
      oval(b, 12, 16, 10, 10, 'v');
      oval(b, 12, 14, 8, 8, 'V');
      for (let i = 0; i < 7; i++) rect(b, 4 + i * 2, 18, 1, 10 + (i % 3), 'W');
    } else if (kind === 'b') {
      oval(b, 12, 14, 9, 11, 'V');
      oval(b, 8, 18, 6, 6, 'W');
      oval(b, 16, 17, 6, 7, 'v');
    } else {
      oval(b, 12, 15, 10, 12, 'V');
      oval(b, 12, 12, 7, 8, 'W');
      oval(b, 7, 18, 5, 5, 'v');
    }
    weeds(b, H - 2);
    return { grid: toGrid(b), windows: [] };
  }

  function skyline(kind) {
    const W = 96, H = 36;
    const b = buf(W, H);
    const wins = [];
    const blocks = kind === 'neon'
      ? [[0, 18, 32], [16, 14, 28], [28, 22, 34], [48, 12, 24], [58, 20, 30], [76, 16, 28]]
      : kind === 'void'
        ? [[4, 8, 30], [18, 6, 34], [32, 10, 22], [50, 7, 32], [68, 9, 26], [84, 6, 20]]
        : kind === 'pond'
          ? [[2, 16, 18], [14, 20, 16], [30, 14, 20], [48, 22, 14], [64, 16, 18], [80, 20, 16]]
          : [[0, 20, 22], [16, 16, 18], [28, 24, 26], [48, 18, 20], [62, 22, 24], [80, 16, 18]];
    for (const [x, w, h] of blocks) {
      const top = H - h;
      if (kind === 'pond') {
        oval(b, x + (w >> 1), top + 8, w >> 1, 8, 'v');
        rect(b, x + (w >> 1) - 1, top + 10, 2, h - 10, 'T');
      } else if (kind === 'void') {
        rect(b, x + (w >> 1) - 1, top, 3, h, 'E');
        rect(b, x, top + 6, w, 2, 'e');
      } else if (kind === 'neon') {
        rect(b, x, top, w, h, 'K');
        rect(b, x, top, w, 3, (x % 3 === 0) ? 'R' : 'n');
        for (let yy = top + 6; yy < H - 2; yy += 5) {
          for (let xx = x + 2; xx < x + w - 2; xx += 4) setp(b, xx, yy, 's');
        }
      } else {
        kawara(b, x, top, w, 6, 'q', 'Q');
        rect(b, x + 1, top + 5, w - 2, h - 5, 'o');
        setp(b, x + 4, top + 10, 's');
        setp(b, x + w - 5, top + 10, 's');
      }
    }
    rect(b, 0, H - 2, W, 2, kind === 'pond' ? 'v' : 'C');
    return { grid: toGrid(b), windows: wins };
  }

  function laundry(frame) {
    const W = 22, H = 16;
    const b = buf(W, H);
    rect(b, 0, 2, W, 1, 'H');
    const sway = frame ? 1 : 0;
    rect(b, 3 + sway, 3, 5, 8, 'A');
    rect(b, 4 + sway, 4, 3, 2, '1');
    rect(b, 10, 3 + sway, 4, 9, '1');
    rect(b, 16 - sway, 3, 5, 7, 'R');
    return { grid: toGrid(b), windows: [] };
  }

  function reeds(frame) {
    const W = 18, H = 22;
    const b = buf(W, H);
    const d = frame ? 1 : 0;
    for (let i = 0; i < 6; i++) {
      const x = 2 + i * 3;
      rect(b, x + (i % 2 ? d : 0), 4 + (i % 3), 1, 16, i % 2 ? 'V' : 'W');
      setp(b, x + (i % 2 ? d : 0), 3 + (i % 3), 'I');
    }
    return { grid: toGrid(b), windows: [] };
  }

  function busStop() {
    const W = 40, H = 42;
    const b = buf(W, H);
    rect(b, 4, 6, 3, 36, 'H');
    rect(b, 4, 4, 32, 5, 'A');
    rect(b, 5, 6, 30, 2, 'G');
    rect(b, 8, 28, 18, 3, 'T');
    rect(b, 9, 24, 2, 5, 't');
    rect(b, 23, 24, 2, 5, 't');
    rect(b, 30, 12, 8, 14, 'K');
    rect(b, 31, 13, 6, 12, 's');
    for (let y = 15; y < 24; y += 3) rect(b, 32, y, 4, 1, '2');
    setp(b, 5, 8, 'Y');
    weeds(b, H - 2);
    return { grid: toGrid(b), windows: [] };
  }

  function busPole() {
    const W = 14, H = 34;
    const b = buf(W, H);
    rect(b, 6, 8, 2, 26, 'H');
    rect(b, 2, 4, 10, 8, 'A');
    rect(b, 3, 5, 8, 6, 'G');
    rect(b, 4, 6, 6, 4, 's');
    return { grid: toGrid(b), windows: [] };
  }

  function hitch() {
    const W = 16, H = 14;
    const b = buf(W, H);
    rect(b, 2, 2, 3, 12, 'T');
    rect(b, 11, 4, 3, 10, 't');
    rect(b, 2, 3, 12, 2, 'C');
    return { grid: toGrid(b), windows: [] };
  }

  function fence() {
    const W = 28, H = 16;
    const b = buf(W, H);
    rect(b, 0, 4, W, 2, 'l');
    for (let i = 0; i < W; i += 4) rect(b, i, 2, 2, 14, 'T');
    return { grid: toGrid(b), windows: [] };
  }

  function board() {
    const W = 16, H = 10;
    const b = buf(W, H);
    rect(b, 0, 1, 16, 8, 'l');
    rect(b, 1, 2, 14, 2, 'e');
    rect(b, 2, 5, 5, 3, 'z');
    return { grid: toGrid(b), windows: [] };
  }

  function weedClump() {
    const W = 12, H = 10;
    const b = buf(W, H);
    for (let i = 0; i < 6; i++) rect(b, 1 + i * 2, 3 + (i % 3), 1, 6, i % 2 ? 'V' : 'W');
    return { grid: toGrid(b), windows: [] };
  }

  function waterTank() {
    const W = 12, H = 16;
    const b = buf(W, H);
    rect(b, 1, 2, 10, 12, 'H');
    rect(b, 2, 3, 8, 3, 'c');
    rect(b, 2, 8, 8, 5, 'h');
    rect(b, 5, 0, 2, 3, 'P');
    return { grid: toGrid(b), windows: [] };
  }

  function exAlley() {
    const W = 36, H = 52;
    const b = buf(W, H);
    const wins = [];
    rect(b, 0, 8, 12, 44, 'o');
    kawara(b, 0, 2, 14, 8, 'q', 'Q');
    namiita(b, 24, 14, 12, 38);
    rect(b, 11, 18, 14, 34, 'C');
    windowPane(b, wins, 3, 16, 5, 6);
    acUnit(b, 2, 36);
    acUnit(b, 26, 30);
    rect(b, 16, 8, 2, 20, 'H');
    setp(b, 16, 6, 'Y');
    weeds(b, H - 2);
    return { grid: toGrid(b), windows: wins };
  }

  function exRoof() {
    const W = 40, H = 56;
    const b = buf(W, H);
    const wins = [];
    rect(b, 4, 18, 32, 38, 'o');
    kawara(b, 2, 12, 36, 8, 'q', 'Q');
    for (let i = 0; i < 4; i++) windowPane(b, wins, 8 + i * 7, 22, 5, 6);
    balcony(b, 6, 30, 28);
    rect(b, 3, 10, 34, 2, 'H');
    for (let i = 4; i < 36; i += 3) setp(b, i, 8, '2');
    rect(b, 26, 2, 10, 10, 'H');
    rect(b, 27, 3, 8, 3, 'c');
    door(b, 16, H - 14, 13);
    return { grid: toGrid(b), windows: wins };
  }

  function exCave() {
    const W = 36, H = 40;
    const b = buf(W, H);
    oval(b, 18, 28, 16, 18, 'e');
    oval(b, 18, 30, 8, 12, 'N');
    rect(b, 2, 34, 8, 6, 'l');
    rect(b, 26, 32, 8, 8, 'l');
    return { grid: toGrid(b), windows: [] };
  }

  function exForest() {
    const W = 40, H = 44;
    const t = tree('a');
    const b = buf(W, H);
    const g = t.grid;
    for (let y = 0; y < g.length; y++) {
      for (let x = 0; x < g[y].length; x++) {
        setp(b, x, y + 2, g[y][x]);
        if (x + 14 < W) setp(b, x + 14, y, g[y][x]);
      }
    }
    return { grid: toGrid(b), windows: [] };
  }

  function exStone() {
    const W = 22, H = 48;
    const b = buf(W, H);
    rect(b, 5, 6, 12, 40, 'h');
    rect(b, 4, 8, 2, 36, 'P');
    rect(b, 16, 10, 2, 34, '2');
    rect(b, 3, 44, 16, 4, 'e');
    rect(b, 7, 14, 8, 3, 'G');
    rect(b, 8, 20, 6, 3, 'g');
    return { grid: toGrid(b), windows: [] };
  }

  function exWreck() {
    const W = 44, H = 28;
    const b = buf(W, H);
    rect(b, 4, 8, 36, 14, 'L');
    rect(b, 4, 6, 36, 4, 'g');
    rect(b, 6, 10, 10, 6, 's');
    rect(b, 18, 10, 10, 6, 's');
    rect(b, 30, 10, 8, 6, 'u');
    oval(b, 12, 24, 5, 4, 'N');
    oval(b, 32, 24, 5, 4, 'N');
    rect(b, 2, 16, 4, 4, 'P');
    return { grid: toGrid(b), windows: [] };
  }

  function exVend() {
    const W = 20, H = 36;
    const b = buf(W, H);
    const wins = [];
    rect(b, 4, 4, 12, 32, 'i');
    rect(b, 5, 6, 10, 12, 's');
    wins.push({ x: 5, y: 6, w: 10, h: 12 });
    setp(b, 6, 7, 'n');
    rect(b, 6, 20, 3, 3, 'Z');
    rect(b, 11, 20, 3, 3, 'A');
    rect(b, 4, 32, 12, 2, 'e');
    return { grid: toGrid(b), windows: wins };
  }

  function exRuin() {
    const W = 24, H = 56;
    const b = buf(W, H);
    const wins = [];
    rect(b, 9, 8, 6, 48, 'h');
    rect(b, 4, 28, 4, 28, 'P');
    rect(b, 16, 34, 4, 22, 'P');
    rect(b, 6, 4, 12, 6, 'e');
    windowPane(b, wins, 10, 16, 4, 4);
    rect(b, 11, 0, 2, 6, 'H');
    setp(b, 13, 2, 'y');
    return { grid: toGrid(b), windows: wins };
  }

  function exSento() {
    const W = 36, H = 56;
    const b = buf(W, H);
    const wins = [];
    rect(b, 2, 24, 24, 32, 'O');
    kawara(b, 0, 18, 28, 8, 'F', 'Q');
    door(b, 10, 42, 14);
    windowPane(b, wins, 5, 30, 5, 6);
    rect(b, 26, 4, 8, 52, 'h');
    rect(b, 25, 4, 10, 3, 'H');
    rect(b, 4, 22, 16, 3, 'Z');
    return { grid: toGrid(b), windows: wins };
  }

  function exPool() {
    const W = 44, H = 24;
    const b = buf(W, H);
    rect(b, 2, 14, 40, 8, '2');
    rect(b, 4, 16, 36, 5, 's');
    rect(b, 2, 12, 40, 2, 'H');
    rect(b, 34, 4, 3, 12, 'h');
    rect(b, 34, 3, 8, 3, 'A');
    for (let i = 0; i < 4; i++) rect(b, 6 + i * 4, 6 + i, 2, 8 - i, '2');
    return { grid: toGrid(b), windows: [] };
  }

  function exEdge() {
    const W = 28, H = 36;
    const b = buf(W, H);
    rect(b, 12, 8, 3, 28, 'T');
    rect(b, 4, 6, 20, 10, 'L');
    rect(b, 5, 7, 18, 8, '1');
    rect(b, 8, 9, 12, 4, 'Z');
    return { grid: toGrid(b), windows: [] };
  }

  function lmPark() {
    const W = 40, H = 44;
    const t = tree('a');
    const b = buf(W, H);
    const g = t.grid;
    for (let y = 0; y < g.length; y++) for (let x = 0; x < g[y].length; x++) setp(b, x + 4, y, g[y][x]);
    rect(b, 24, 34, 14, 2, 'T');
    rect(b, 25, 30, 2, 5, 't');
    rect(b, 35, 30, 2, 5, 't');
    rect(b, 0, 30, 2, 14, 'l');
    rect(b, 0, 30, 10, 2, 'l');
    return { grid: toGrid(b), windows: [] };
  }

  function lmSushi() {
    const W = 36, H = 36;
    const b = buf(W, H);
    const wins = [];
    rect(b, 4, 12, 28, 24, 'e');
    rect(b, 2, 8, 32, 6, 'Z');
    rect(b, 4, 10, 6, 10, 'z');
    rect(b, 12, 10, 6, 10, 'z');
    rect(b, 20, 10, 6, 10, 'z');
    rect(b, 8, 22, 8, 8, 'N');
    rect(b, 18, 24, 10, 5, '1');
    setp(b, 20, 25, 'Z');
    setp(b, 24, 25, 'q');
    oval(b, 32, 10, 4, 5, 'y');
    windowPane(b, wins, 6, 22, 5, 5);
    return { grid: toGrid(b), windows: wins };
  }

  function lmLaundry() {
    const W = 32, H = 36;
    const b = buf(W, H);
    const wins = [];
    rect(b, 4, 8, 24, 28, '2');
    rect(b, 4, 6, 24, 4, 'A');
    windowPane(b, wins, 7, 14, 8, 8);
    windowPane(b, wins, 17, 14, 8, 8);
    rect(b, 12, 28, 8, 4, 'H');
    return { grid: toGrid(b), windows: wins };
  }

  function lmNeon() {
    const W = 32, H = 44;
    const n = neonTower({ w: 22, h: 44, floors: 4, cols: 3, sign: 'p', sign2: 'R', wall: 'm' });
    return n;
  }

  const DEFS = {};
  const META = {};
  function add(name, pack) {
    DEFS[name] = pack.grid;
    META[name] = { windows: pack.windows || [] };
  }

  add('house_a', house({ w: 32, h: 50, wall: 'O' }));
  add('house_b', house({ w: 28, h: 46, wall: 'f', nami: true, roofA: 't', roofB: 'C' }));
  add('house_c', house({ w: 34, h: 48, wall: 'O', shop: true, board: true }));
  add('house_d', house({ w: 30, h: 52, wall: 'f', midWin: true, roofA: 'Q', roofB: 'F' }));
  add('house_club', house({ w: 40, h: 56, wall: 'O', club: true, midWin: true, roofA: 'q', roofB: 'Q' }));
  add('neon_a', neonTower({ w: 22, h: 64, floors: 7, cols: 3, sign: 'R', sign2: 'X', billboard: true }));
  add('neon_b', neonTower({ w: 26, h: 58, floors: 6, cols: 4, sign: 'n', sign2: '@', wall: 'B' }));
  add('void_a', voidBuild({ w: 22, h: 52 }));
  add('void_b', voidBuild({ w: 26, h: 48, wall: 'C' }));
  add('tower', measureTower());
  add('tree_a', tree('a'));
  add('tree_b', tree('b'));
  add('willow', tree('willow'));
  add('sky_shimo', skyline('shimo'));
  add('sky_pond', skyline('pond'));
  add('sky_neon', skyline('neon'));
  add('sky_void', skyline('void'));
  add('laundry_0', laundry(0));
  add('laundry_1', laundry(1));
  add('reeds_0', reeds(0));
  add('reeds_1', reeds(1));
  add('bus_stop', busStop());
  add('bus_pole', busPole());
  add('hitch', hitch());
  add('fence', fence());
  add('board', board());
  add('weeds', weedClump());
  add('tank', waterTank());
  add('ex_alley', exAlley());
  add('ex_roof', exRoof());
  add('ex_cave', exCave());
  add('ex_forest', exForest());
  add('ex_stone', exStone());
  add('ex_wreck', exWreck());
  add('ex_vend', exVend());
  add('ex_ruin', exRuin());
  add('ex_sento', exSento());
  add('ex_pool', exPool());
  add('ex_edge', exEdge());
  add('lm_park', lmPark());
  add('lm_sushi', lmSushi());
  add('lm_laundry', lmLaundry());
  add('lm_neon', lmNeon());

  function blitGrid(ctx, ox, oy, grid, scale, flip) {
    const s = scale || SCALE;
    const h = grid.length, w = grid[0].length;
    const oc = '#140a10';
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const ch = grid[y][x];
        if (ch === '.' || ch === ' ') continue;
        if (!PAL[ch]) continue;
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nx = x + dx, ny = y + dy;
          let empty = nx < 0 || ny < 0 || nx >= w || ny >= h;
          if (!empty) {
            const nch = grid[ny][nx];
            empty = nch === '.' || nch === ' ';
          }
          if (empty) {
            const sx = flip ? (w - 1 - nx) : nx;
            ctx.fillStyle = oc;
            ctx.fillRect(ox + sx * s, oy + ny * s, s, s);
          }
        }
      }
    }
    for (let y = 0; y < h; y++) {
      const row = grid[y];
      for (let x = 0; x < row.length; x++) {
        const col = PAL[row[x]];
        if (!col) continue;
        const dx = flip ? (w - 1 - x) : x;
        ctx.fillStyle = col;
        ctx.fillRect(ox + dx * s, oy + y * s, s, s);
      }
    }
  }

  const World = {
    PAL, DEFS, META, SCALE,
    canvas: null,
    frames: {},
    ready: false,
    names: Object.keys(DEFS),
    has(name) { return !!(World.frames[name] || DEFS[name]); },
    bake() {
      if (World.ready && World.canvas) return World.canvas;
      const names = World.names;
      const pad = 2;
      const maxW = 1024;
      let x = pad, y = pad, rowH = 0, needW = 64, needH = 64;
      const placed = [];
      names.forEach((name) => {
        const grid = DEFS[name];
        const w = grid[0].length * SCALE;
        const h = grid.length * SCALE;
        if (x + w + pad > maxW) { x = pad; y += rowH + pad; rowH = 0; }
        placed.push({ name, x, y, w, h, grid });
        x += w + pad;
        if (h > rowH) rowH = h;
        if (x > needW) needW = x;
        if (y + h + pad > needH) needH = y + h + pad;
      });
      const c = document.createElement('canvas');
      c.width = Math.min(maxW, Math.max(64, needW));
      c.height = Math.max(64, needH);
      const g = c.getContext('2d');
      g.imageSmoothingEnabled = false;
      placed.forEach((p) => {
        blitGrid(g, p.x, p.y, p.grid, SCALE, false);
        World.frames[p.name] = { x: p.x, y: p.y, w: p.w, h: p.h };
      });
      World.canvas = c;
      World.ready = true;
      return c;
    },
    blit(ctx, name, dx, dy, flip, scale) {
      if (!World.ready) World.bake();
      const fr = World.frames[name];
      if (!fr || !World.canvas) return false;
      ctx.imageSmoothingEnabled = false;
      const dw = fr.w * (scale || 1);
      const dh = fr.h * (scale || 1);
      if (flip) {
        ctx.save();
        ctx.translate(dx + dw, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(World.canvas, fr.x, fr.y, fr.w, fr.h, 0, 0, dw, dh);
        ctx.restore();
      } else {
        ctx.drawImage(World.canvas, fr.x, fr.y, fr.w, fr.h, dx, dy, dw, dh);
      }
      return true;
    },
    blitGround(ctx, name, dx, gy, opts) {
      opts = opts || {};
      if (!World.ready) World.bake();
      const fr = World.frames[name];
      if (!fr) return false;
      const sc = opts.scale || 1;
      const dy = gy - fr.h * sc;
      return World.blit(ctx, name, dx, dy, !!opts.flip, sc);
    },
    paintLights(ctx, name, dx, gy, phase, opts) {
      if (phase < 0.5) return;
      opts = opts || {};
      const fr = World.frames[name];
      const meta = META[name];
      if (!fr || !meta || !meta.windows.length) return;
      const sc = (opts.scale || 1) * SCALE;
      const dy = gy - fr.h * (opts.scale || 1);
      const gh = (DEFS[name] && DEFS[name].length) || 48;
      const dusk = phase >= 0.5 && phase < 0.72;
      const a = dusk ? Math.min(0.85, (phase - 0.5) / 0.18 * 0.7 + 0.2) : 0.9;
      ctx.save();
      ctx.globalAlpha = a;
      meta.windows.forEach((win, i) => {
        if (win.y + win.h > gh * 0.62) return;
        if (((i * 17 + (name.length * 3)) % 10) < 2) return;
        const col = dusk ? '#ff9040' : (((i + name.length) % 5 === 0) ? '#3ad0c8' : '#ffe080');
        ctx.fillStyle = col;
        const wx0 = dx + win.x * sc;
        const wy0 = dy + win.y * sc;
        ctx.fillRect(wx0, wy0, win.w * sc, win.h * sc);
      });
      ctx.restore();
    },
    stats() {
      return {
        frames: World.names.length,
        atlasW: World.canvas ? World.canvas.width : 0,
        atlasH: World.canvas ? World.canvas.height : 0,
        files: 1,
        bytes: World.canvas ? (World.canvas.width * World.canvas.height * 4) : 0,
      };
    },
  };

  global.YKWorld = World;
})(typeof window !== 'undefined' ? window : globalThis);
