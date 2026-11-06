/* 野獣キングダム — original pixel atlas (bake-once).
 * Provenance: authored for this repository. Summer Shimokitazawa parody palettes
 * (部室・波板・自販機シアン／薔薇／金冠). No third-party sprite packs, no hotlinks.
 * Face photos remain assets/senpai_pixel.png etc. (既存・Wiki顔周辺の縮小ドット).
 */
(function (global) {
  const PAL = {
    N: '#140a10',
    S: '#f0c8a8', D: '#d4a888', d: '#b88868',
    K: '#1c1c22', B: '#2a2a32', b: '#3a3a44',
    G: '#ffd700', g: '#c9a227', U: '#fff3a0',
    R: '#ff6b9d', r: '#d44a78', X: '#ff9ec0',
    A: '#3d6a9a', a: '#2a4e78', L: '#c8a060', l: '#a08040',
    F: '#ff5500', Y: '#ffcc33', y: '#ffe9a0',
    T: '#8b5a2b', t: '#6a4020', C: '#5a3a18',
    H: '#8a8a90', h: '#5a5a62', P: '#3a3a40',
    V: '#4a8a38', v: '#2f6a28', W: '#6b8f3a', w: '#5c4030',
    M: '#6a4068', m: '#4a2848', E: '#2a1030', e: '#180818',
    Z: '#ff3344', z: '#aa1020',
    O: '#f5d0b0', o: '#e8a878', Q: '#ffe066', q: '#f0a020',
    I: '#6aaa44', i: '#3a7028', J: '#c8e878',
    c: '#44ddff', p: '#ff44aa',
    u: '#0a0a12', s: '#1a2030',
    '@': '#33ffee',
    '1': '#f8f8f8', '2': '#c0c0c8',
    n: '#3ad0c8', f: '#c4a070',
    '#': '#6aaa60',
  };

  const CW = 24, CH = 32, SCALE = 2;
  const CELL_W = CW * SCALE, CELL_H = CH * SCALE;
  const COLS = 16;

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
        if ((i * i) / (rx * rx) + (j * j) / (ry * ry) <= 1.08) setp(b, cx + i, cy + j, ch);
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
  function stamp(b, ox, oy, rows) {
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) setp(b, ox + x, oy + y, row[x]);
    }
  }

  const KIND = {
    senpai: { skin: 'S', shade: 'D', shirt: 'B', hi: 'b', pants: 'K', shoe: 'N', hair: 'K', accent: 'G', wide: 8, tall: 10, belly: 2, crown: true },
    grunt: { skin: 'S', shade: 'D', shirt: 'M', hi: 'm', pants: 'K', shoe: 'N', hair: 'E', accent: 'R', wide: 6, tall: 9, belly: 0 },
    runner: { skin: 'S', shade: 'D', shirt: 'c', hi: '1', pants: 'p', shoe: 'N', hair: 'c', accent: 'p', wide: 4, tall: 8, belly: 0, thin: true },
    shield: { skin: 'D', shade: 'd', shirt: 'u', hi: 's', pants: 'H', shoe: 'N', hair: 'u', accent: '@', wide: 9, tall: 10, belly: 1, bulky: true },
    ranged: { skin: 'O', shade: 'o', shirt: 'q', hi: 'Q', pants: 't', shoe: 'N', hair: 'q', accent: 'Q', wide: 7, tall: 9, belly: 1, round: true },
    support: { skin: 'S', shade: 'D', shirt: 'I', hi: 'J', pants: 'i', shoe: 'N', hair: 'i', accent: 'J', wide: 6, tall: 9, belly: 0 },
    taka: { skin: 'D', shade: 'd', shirt: 'X', hi: 'r', pants: 'C', shoe: 'N', hair: 'r', accent: 'g', wide: 5, tall: 8, belly: 0, hunch: true },
    gaze: { skin: 'S', shade: 'D', shirt: 'E', hi: 'M', pants: 'e', shoe: 'N', hair: 'E', accent: 'Z', wide: 5, tall: 11, belly: 0, tallish: true },
    boss: { skin: 'S', shade: 'D', shirt: 'u', hi: 's', pants: 'K', shoe: 'N', hair: 'K', accent: 'G', wide: 10, tall: 12, belly: 2, bulky: true, crown: true },
    kohai: { skin: 'S', shade: 'D', shirt: 'A', hi: 'a', pants: 'K', shoe: 'N', hair: 'K', accent: 'L', wide: 5, tall: 8, belly: 0 },
  };

  function paintHead(b, cx, cy, k, spec, pose) {
    const rx = spec.round ? 5 : spec.thin ? 3 : spec.bulky ? 5 : 4;
    const ry = spec.tallish ? 5 : 4;
    oval(b, cx, cy, rx, ry, k.skin);
    oval(b, cx, cy + 1, rx - 1, ry - 1, k.shade);
    oval(b, cx, cy - 1, rx - 1, 2, k.hair);
    if (pose !== 'die_fold') {
      setp(b, cx - 2, cy, '1');
      setp(b, cx + 2, cy, '1');
      setp(b, cx - 2, cy + 1, 'N');
      setp(b, cx + 2, cy + 1, 'N');
    }
    if (k.crown) {
      rect(b, cx - 4, cy - ry - 2, 9, 2, 'G');
      setp(b, cx - 4, cy - ry - 3, 'G');
      setp(b, cx, cy - ry - 4, 'U');
      setp(b, cx + 4, cy - ry - 3, 'G');
    }
    if (spec.kind === 'runner') {
      setp(b, cx - 5, cy - 3, 'c');
      setp(b, cx + 5, cy - 2, 'p');
    }
    if (spec.kind === 'gaze' || spec.kind === 'boss') {
      setp(b, cx - 2, cy, 'Z');
      setp(b, cx + 2, cy, 'Z');
    }
    if (spec.kind === 'ranged') {
      rect(b, cx - 2, cy + 2, 5, 1, 'q');
    }
  }

  function paintTorso(b, cx, y, k, spec) {
    const w = spec.wide;
    const h = spec.tall;
    rect(b, cx - (w >> 1), y, w, h, k.shirt);
    rect(b, cx - (w >> 1) + 1, y + 1, Math.max(2, w - 2), 2, k.hi);
    if (spec.belly) rect(b, cx - (w >> 1) + 1, y + h - 3, w - 2, 2, k.hi);
    if (spec.hunch) rect(b, cx - (w >> 1) - 1, y + 2, 2, 4, k.shirt);
  }

  function paintArm(b, x, y, k, raised, fwd) {
    const len = raised ? 4 : 6;
    const dy = raised ? -1 : 1;
    const dx = fwd ? 1 : 0;
    for (let i = 0; i < len; i++) setp(b, x + dx * (i > 2 ? 1 : 0), y + i * dy + (raised ? -i : 0), k.skin);
    setp(b, x + (fwd ? 2 : 0), y + (raised ? -len : len - 1), k.shade);
  }

  function paintLeg(b, x, y, k, spec, bent, fwd) {
    const h = spec.thin ? 9 : spec.bulky ? 6 : 7;
    const lift = bent ? 2 : 0;
    const ox = fwd ? 2 : 0;
    for (let i = 0; i < h - lift; i++) {
      setp(b, x + (i > 3 ? ox : 0), y + i, k.pants);
      setp(b, x + 1 + (i > 3 ? ox : 0), y + i, k.pants);
    }
    const fy = y + h - lift;
    rect(b, x + ox - 1, fy, 4, 2, k.shoe);
  }

  function paintProp(b, spec, pose, cx, ty) {
    const kind = spec.kind;
    if (kind === 'shield' || kind === 'boss') {
      const lidX = cx + (spec.wide >> 1) + 1 + (pose === 'die_lid' || pose === 'die_tumble' ? 4 : 0);
      const lidY = ty + (pose.indexOf('die') === 0 ? 6 : 1);
      rect(b, lidX, lidY, 3, 12, 'H');
      rect(b, lidX, lidY + 1, 2, 10, '@');
    }
    if (kind === 'support') {
      const drop = pose === 'die_flag' ? 8 : pose.indexOf('die') === 0 ? 4 : 0;
      const poleX = cx + (spec.wide >> 1) + 2;
      rect(b, poleX, ty - 8 + drop, 1, 14, 'T');
      rect(b, poleX + 1, ty - 10 + drop, 6, 4, 'I');
      rect(b, poleX + 1, ty - 9 + drop, 5, 1, 'G');
    }
    if (kind === 'taka') {
      const spill = pose === 'die_bag';
      const bx = cx - (spec.wide >> 1) - 5;
      const by = ty + 6 + (spill ? 4 : 0);
      rect(b, bx, by, 5, 4, 'C');
      setp(b, bx + 2, by + 2, 'g');
      if (spill) { setp(b, bx + 1, by + 5, 'G'); setp(b, bx + 4, by + 4, 'U'); }
    }
    if (kind === 'runner') {
      const fly = pose === 'die_tumble' ? 4 : pose.indexOf('die') === 0 ? 2 : 0;
      setp(b, cx - 6 - fly, ty - 4, 'c');
      setp(b, cx - 5 - fly, ty - 5, 'c');
      setp(b, cx + 6 + fly, ty - 2, 'p');
      setp(b, cx + 7 + fly, ty - 1, 'p');
    }
    if (kind === 'ranged' && pose === 'die_pop') {
      rect(b, cx - 2, ty - 8, 5, 2, 'q');
    }
    if (kind === 'kohai') {
      const bow = pose === 'attack' || pose === 'windup';
      rect(b, cx + 5, ty + 2, 1, 8, 'L');
      if (bow) rect(b, cx + 6, ty + 3, 4, 1, '1');
    }
  }

  const POSES = {
    idle: { lFwd: 0, rFwd: 0, lBent: 0, rBent: 0, lArm: 0, rArm: 0, lRaise: 0, rRaise: 0, torso: 0, head: 0, lean: 0 },
    idle1: { lFwd: 0, rFwd: 0, lBent: 0, rBent: 0, lArm: 0, rArm: 1, lRaise: 0, rRaise: 1, torso: 0, head: 0, lean: 0 },
    walk0: { lFwd: 2, rFwd: -1, lBent: 0, rBent: 1, lArm: -1, rArm: 1, lRaise: 0, rRaise: 0, torso: -1, head: 0, lean: 1 },
    walk1: { lFwd: 1, rFwd: 0, lBent: 0, rBent: 0, lArm: 0, rArm: 0, lRaise: 0, rRaise: 0, torso: 0, head: 0, lean: 0 },
    walk2: { lFwd: -1, rFwd: 2, lBent: 1, rBent: 0, lArm: 1, rArm: -1, lRaise: 0, rRaise: 0, torso: -1, head: 0, lean: 1 },
    walk3: { lFwd: 0, rFwd: 1, lBent: 0, rBent: 0, lArm: 0, rArm: 0, lRaise: 0, rRaise: 0, torso: 0, head: 0, lean: 0 },
    run0: { lFwd: 3, rFwd: -2, lBent: 0, rBent: 1, lArm: -2, rArm: 2, lRaise: 1, rRaise: 0, torso: -2, head: -1, lean: 2 },
    run1: { lFwd: 2, rFwd: -1, lBent: 1, rBent: 0, lArm: -1, rArm: 1, lRaise: 1, rRaise: 0, torso: -1, head: 0, lean: 2 },
    run2: { lFwd: -2, rFwd: 3, lBent: 1, rBent: 0, lArm: 2, rArm: -2, lRaise: 0, rRaise: 1, torso: -2, head: -1, lean: 2 },
    run3: { lFwd: -1, rFwd: 2, lBent: 0, rBent: 1, lArm: 1, rArm: -1, lRaise: 0, rRaise: 1, torso: -1, head: 0, lean: 2 },
    windup: { lFwd: -1, rFwd: 1, lBent: 1, rBent: 0, lArm: -1, rArm: 0, lRaise: 0, rRaise: 1, torso: 1, head: 0, lean: -1 },
    attack: { lFwd: 2, rFwd: -1, lBent: 0, rBent: 1, lArm: 2, rArm: -1, lRaise: 0, rRaise: 0, torso: -1, head: 0, lean: 2 },
    hit: { lFwd: -1, rFwd: 0, lBent: 1, rBent: 0, lArm: -1, rArm: -1, lRaise: 1, rRaise: 0, torso: 1, head: 1, lean: -1 },
    skill: { lFwd: 0, rFwd: 0, lBent: 0, rBent: 0, lArm: 0, rArm: 0, lRaise: 1, rRaise: 1, torso: -1, head: 0, lean: 0 },
    ride: { lFwd: 1, rFwd: 1, lBent: 1, rBent: 1, lArm: 0, rArm: 0, lRaise: 0, rRaise: 0, torso: 2, head: 1, lean: 1 },
    die_slump: { lFwd: 1, rFwd: -1, lBent: 1, rBent: 1, lArm: 0, rArm: 0, lRaise: 0, rRaise: 0, torso: 6, head: 7, lean: 0, squat: 1 },
    die_sit: { lFwd: 3, rFwd: 2, lBent: 1, rBent: 1, lArm: 0, rArm: 0, lRaise: 0, rRaise: 0, torso: 8, head: 9, lean: 0, squat: 1 },
    die_fold: { lFwd: 1, rFwd: -1, lBent: 1, rBent: 1, lArm: 1, rArm: -1, lRaise: 0, rRaise: 0, torso: 10, head: 12, lean: 1, squat: 1 },
    die_lid: { lFwd: 2, rFwd: 0, lBent: 1, rBent: 1, lArm: 1, rArm: -1, lRaise: 0, rRaise: 0, torso: 7, head: 8, lean: 1, squat: 1 },
    die_flag: { lFwd: 0, rFwd: 1, lBent: 1, rBent: 0, lArm: 1, rArm: 1, lRaise: 0, rRaise: 0, torso: 6, head: 7, lean: 1, squat: 1 },
    die_bag: { lFwd: -1, rFwd: 1, lBent: 1, rBent: 1, lArm: -1, rArm: 0, lRaise: 0, rRaise: 0, torso: 7, head: 8, lean: -1, squat: 1 },
    die_pop: { lFwd: 1, rFwd: -1, lBent: 1, rBent: 1, lArm: 1, rArm: -1, lRaise: 1, rRaise: 1, torso: 5, head: 4, lean: 0, squat: 1 },
  };

  function paintStanding(kindId, poseName) {
    const k = KIND[kindId];
    const spec = Object.assign({ kind: kindId }, k);
    const p = POSES[poseName] || POSES.idle;
    const b = buf(CW, CH);
    const cx = 12 + (p.lean || 0);
    const ground = CH - 2;
    const torsoH = spec.tall;
    let ty = ground - 8 - torsoH + (p.torso || 0) + (p.squat ? 2 : 0);
    if (ty < 6) ty = 6;
    if (ty > ground - 8) ty = ground - 8;
    paintLeg(b, cx - 3, ground - 8 + (p.torso || 0), k, spec, p.lBent, p.lFwd);
    paintLeg(b, cx + 1, ground - 8 + (p.torso || 0), k, spec, p.rBent, p.rFwd);
    paintTorso(b, cx, ty, k, spec);
    paintArm(b, cx - (spec.wide >> 1) - 1 + p.lArm, ty + 1, k, p.lRaise, p.lFwd < 0);
    paintArm(b, cx + (spec.wide >> 1) + p.rArm, ty + 1, k, p.rRaise, p.rFwd > 0);
    let hy = ty - 4 + (p.head || 0);
    if (hy < 4) hy = 4;
    if (hy > ty - 2) hy = ty - 2;
    paintHead(b, cx, hy, k, spec, poseName);
    paintProp(b, spec, poseName, cx, ty);
    return toGrid(b);
  }

  function paintTopple(kindId) {
    const k = KIND[kindId];
    const spec = Object.assign({ kind: kindId }, k);
    const b = buf(CW, CH);
    const y = 20;
    rect(b, 4, y, 14, spec.wide - 2, k.shirt);
    oval(b, 18, y + 2, 4, 3, k.skin);
    setp(b, 19, y + 2, '1');
    setp(b, 17, y + 2, 'N');
    rect(b, 2, y + spec.wide - 2, 4, 2, k.pants);
    rect(b, 8, y + spec.wide - 1, 4, 2, k.pants);
    rect(b, 1, y + spec.wide, 5, 2, k.shoe);
    if (spec.kind === 'shield' || spec.kind === 'boss') rect(b, 10, y - 6, 3, 8, '@');
    if (spec.kind === 'support') { rect(b, 6, y - 8, 1, 10, 'T'); rect(b, 7, y - 10, 6, 4, 'I'); }
    if (spec.kind === 'taka') rect(b, 4, y + 6, 5, 4, 'C');
    if (k.crown) rect(b, 16, y - 3, 6, 2, 'G');
    return toGrid(b);
  }

  function paintTumble(kindId) {
    const k = KIND[kindId];
    const spec = Object.assign({ kind: kindId }, k);
    const b = buf(CW, CH);
    oval(b, 12, 20, 7, 5, k.shirt);
    oval(b, 17, 18, 4, 3, k.skin);
    setp(b, 18, 18, 'N');
    rect(b, 6, 22, 4, 3, k.pants);
    rect(b, 14, 24, 4, 2, k.pants);
    rect(b, 5, 25, 4, 2, k.shoe);
    if (spec.kind === 'runner') { setp(b, 4, 14, 'c'); setp(b, 20, 16, 'p'); }
    if (spec.kind === 'shield' || spec.kind === 'boss') rect(b, 19, 14, 3, 7, '@');
    if (spec.kind === 'taka') { rect(b, 3, 22, 4, 3, 'C'); setp(b, 4, 26, 'G'); }
    if (spec.kind === 'support') { rect(b, 8, 10, 1, 8, 'T'); rect(b, 9, 8, 5, 3, 'I'); }
    return toGrid(b);
  }

  function actorFrame(kindId, pose) {
    if (pose === 'die_topple') return paintTopple(kindId);
    if (pose === 'die_tumble') return paintTumble(kindId);
    return paintStanding(kindId, pose);
  }

  function wheelFrame(phase) {
    const b = buf(12, 12);
    oval(b, 5, 5, 5, 5, 'H');
    oval(b, 5, 5, 4, 4, 'N');
    oval(b, 5, 5, 1, 1, '2');
    const a = phase * Math.PI / 2;
    for (let t = 0; t < 5; t++) {
      const x = 5 + Math.round(Math.cos(a) * t);
      const y = 5 + Math.round(Math.sin(a) * t);
      setp(b, x, y, '2');
      setp(b, 5 - Math.round(Math.cos(a) * t), 5 - Math.round(Math.sin(a) * t), '2');
    }
    return toGrid(b);
  }

  function chariBody() {
    const b = buf(CW, 16);
    rect(b, 3, 6, 18, 3, 'T');
    rect(b, 4, 5, 16, 1, 't');
    rect(b, 16, 1, 2, 6, 'H');
    rect(b, 14, 4, 3, 2, 'C');
    return toGrid(b);
  }
  function scooterBody() {
    const b = buf(CW, 18);
    rect(b, 2, 10, 20, 3, 's');
    rect(b, 4, 7, 12, 4, 'u');
    rect(b, 16, 2, 2, 9, 'H');
    rect(b, 14, 1, 6, 2, 'R');
    rect(b, 5, 6, 8, 1, 'n');
    return toGrid(b);
  }
  function horseFrame(phase) {
    const b = buf(28, 20);
    rect(b, 6, 6, 16, 6, 'C');
    rect(b, 5, 7, 2, 4, 't');
    oval(b, 23, 6, 4, 4, 'C');
    setp(b, 25, 5, 'N');
    rect(b, 22, 4, 3, 1, 'N');
    rect(b, 14, 4, 5, 2, 'G');
    const legs = [
      [[8, 12, 2, 7], [12, 13, 2, 6], [16, 12, 2, 7], [20, 13, 2, 6]],
      [[7, 13, 2, 6], [12, 12, 2, 7], [17, 13, 2, 6], [21, 12, 2, 7]],
      [[8, 12, 2, 7], [13, 14, 2, 5], [16, 12, 2, 7], [20, 14, 2, 5]],
      [[9, 14, 2, 5], [12, 12, 2, 7], [15, 14, 2, 5], [20, 12, 2, 7]],
    ][phase % 4];
    for (const L of legs) rect(b, L[0], L[1], L[2], L[3], 't');
    rect(b, 4, 10, 3, 2, 'C');
    return toGrid(b);
  }

  function hibachi(frame) {
    const b = buf(20, 16);
    rect(b, 2, 10, 16, 5, 'H');
    rect(b, 3, 9, 14, 2, 'h');
    rect(b, 5, 7, 10, 3, 'C');
    if (frame === 0) { setp(b, 9, 4, 'F'); setp(b, 10, 3, 'Y'); setp(b, 8, 5, 'Y'); }
    else { setp(b, 10, 2, 'F'); setp(b, 9, 3, 'y'); setp(b, 11, 4, 'Y'); setp(b, 8, 4, 'F'); }
    return toGrid(b);
  }
  function corkboard() {
    const b = buf(22, 12);
    rect(b, 0, 0, 22, 12, 'f');
    rect(b, 1, 1, 20, 10, 'L');
    rect(b, 2, 2, 5, 4, '1');
    rect(b, 8, 3, 6, 3, 'R');
    rect(b, 15, 2, 4, 5, 'G');
    return toGrid(b);
  }
  function vending() {
    const b = buf(10, 20);
    rect(b, 0, 0, 10, 20, 'i');
    rect(b, 1, 2, 8, 7, 'n');
    rect(b, 2, 11, 2, 2, 'Z');
    rect(b, 6, 11, 2, 2, 'A');
    rect(b, 3, 15, 4, 3, 'H');
    return toGrid(b);
  }
  function nestShut(open) {
    const b = buf(22, 24);
    rect(b, 0, 0, 8, 24, 'h');
    rect(b, 14, 2, 8, 22, 'H');
    for (let r = 0; r < 7; r++) rect(b, 8, 4 + r * 2, 6, 1, r % 2 ? 'N' : 'P');
    if (open) rect(b, 8, 12, 6, 10, 'e');
    else rect(b, 8, 8, 6, 14, 'N');
    rect(b, 15, 16, 6, 6, 's');
    return toGrid(b);
  }
  function wallDesk() {
    const b = buf(20, 14);
    rect(b, 1, 6, 10, 6, 'T');
    rect(b, 12, 7, 7, 5, 't');
    rect(b, 4, 2, 12, 4, 'H');
    rect(b, 5, 3, 10, 1, 'h');
    return toGrid(b);
  }
  function namiita() {
    const b = buf(18, 10);
    for (let i = 0; i < 6; i++) rect(b, i * 3, 0, 2, 10, i % 2 ? 'H' : '2');
    return toGrid(b);
  }
  function concrete() {
    const b = buf(16, 10);
    rect(b, 0, 0, 16, 10, 'h');
    rect(b, 1, 1, 6, 3, 'H');
    rect(b, 8, 4, 6, 3, 'P');
    rect(b, 2, 6, 5, 2, '2');
    return toGrid(b);
  }
  function acUnit() {
    const b = buf(12, 8);
    rect(b, 0, 0, 12, 8, 's');
    rect(b, 1, 2, 10, 2, 'N');
    rect(b, 2, 5, 8, 2, 'H');
    setp(b, 9, 1, 'n');
    return toGrid(b);
  }
  function pole() {
    const b = buf(8, 28);
    rect(b, 3, 0, 2, 28, 'h');
    rect(b, 0, 2, 8, 2, 'H');
    rect(b, 2, 14, 4, 2, 'Y');
    return toGrid(b);
  }
  function manhole() {
    const b = buf(12, 4);
    oval(b, 5, 1, 5, 1, 'N');
    rect(b, 2, 1, 8, 1, 'H');
    return toGrid(b);
  }
  function crate() {
    const b = buf(10, 8);
    rect(b, 0, 0, 10, 8, 'T');
    rect(b, 1, 1, 8, 1, 't');
    rect(b, 1, 4, 8, 1, 'C');
    return toGrid(b);
  }
  function can() {
    const b = buf(4, 6);
    rect(b, 0, 1, 4, 5, 'n');
    rect(b, 1, 0, 2, 1, '1');
    return toGrid(b);
  }

  const DEFS = {};
  function add(name, grid) { DEFS[name] = grid; }

  const ACTORS = ['senpai', 'grunt', 'runner', 'shield', 'ranged', 'support', 'taka', 'gaze', 'boss', 'kohai'];
  const ACTOR_POSES = [
    'idle', 'idle1', 'walk0', 'walk1', 'walk2', 'walk3',
    'windup', 'attack', 'hit',
    'die_slump', 'die_topple', 'die_tumble', 'die_sit', 'die_fold',
    'die_lid', 'die_flag', 'die_bag', 'die_pop',
  ];
  for (const kind of ACTORS) {
    for (const pose of ACTOR_POSES) add(kind + '_' + pose, actorFrame(kind, pose));
    add(kind + '_run0', actorFrame(kind, 'run0'));
    add(kind + '_run1', actorFrame(kind, 'run1'));
    add(kind + '_run2', actorFrame(kind, 'run2'));
    add(kind + '_run3', actorFrame(kind, 'run3'));
    add(kind + '_skill', actorFrame(kind, 'skill'));
    add(kind + '_ride', actorFrame(kind, 'ride'));
  }
  for (let i = 0; i < 4; i++) add('wheel_' + i, wheelFrame(i));
  add('chari_body', chariBody());
  add('scooter_body', scooterBody());
  for (let i = 0; i < 4; i++) add('horse_' + i, horseFrame(i));
  add('hibachi_0', hibachi(0));
  add('hibachi_1', hibachi(1));
  add('corkboard', corkboard());
  add('vending', vending());
  add('nest_shut', nestShut(false));
  add('nest_open', nestShut(true));
  add('wall_desk', wallDesk());
  add('namiita', namiita());
  add('concrete', concrete());
  add('ac_unit', acUnit());
  add('pole', pole());
  add('manhole', manhole());
  add('crate', crate());
  add('can', can());

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

  const Art = {
    PAL, DEFS, SCALE, CELL_W, CELL_H, COLS,
    canvas: null,
    frames: {},
    ready: false,
    names: Object.keys(DEFS),
    has(name) { return !!(Art.frames[name] || DEFS[name]); },
    bake() {
      if (Art.ready && Art.canvas) return Art.canvas;
      const names = Art.names;
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
        Art.frames[p.name] = { x: p.x, y: p.y, w: p.w, h: p.h };
      });
      Art.canvas = c;
      Art.ready = true;
      return c;
    },
    blit(ctx, name, dx, dy, flip) {
      if (!Art.ready) Art.bake();
      const fr = Art.frames[name];
      if (!fr || !Art.canvas) return false;
      ctx.imageSmoothingEnabled = false;
      if (flip) {
        ctx.save();
        ctx.translate(dx + fr.w, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(Art.canvas, fr.x, fr.y, fr.w, fr.h, 0, 0, fr.w, fr.h);
        ctx.restore();
      } else {
        ctx.drawImage(Art.canvas, fr.x, fr.y, fr.w, fr.h, dx, dy, fr.w, fr.h);
      }
      return true;
    },
    stats() {
      const names = Art.names;
      const n = names.length;
      return {
        frames: n,
        actors: ACTORS.length,
        posesPerActor: ACTOR_POSES.length + 6,
        atlasW: Art.canvas ? Art.canvas.width : 0,
        atlasH: Art.canvas ? Art.canvas.height : 0,
        files: 1,
        bytes: Art.canvas ? (Art.canvas.width * Art.canvas.height * 4) : 0,
      };
    },
  };

  global.YKArt = Art;
})(typeof window !== 'undefined' ? window : globalThis);
