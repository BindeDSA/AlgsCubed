export const getSticker = (ints, index) => {
  const intIdx = Math.floor(index / 12);
  const pow = Math.pow(8, index % 12);
  return Math.floor(ints[intIdx] / pow) % 8;
};

export const setSticker = (ints, index, color) => {
  const intIdx = Math.floor(index / 12);
  const pow = Math.pow(8, index % 12);
  const current = getSticker(ints, index);
  const newInts = [...ints];
  newInts[intIdx] = newInts[intIdx] - current * pow + color * pow;
  return newInts;
};

export const getStickerIndex = (x, y, z, face) => {
  // 0: U (y=-1), 1: R (x=1), 2: F (z=1), 3: D (y=1), 4: L (x=-1), 5: B (z=-1)
  if (face === 0 && y === -1) {
    if (x === 0 && z === 0) return -1;
    const idx = (x + 1) * 3 + (z + 1);
    return idx > 4 ? idx - 1 : idx;
  }
  if (face === 1 && x === 1) {
    if (y === 0 && z === 0) return -1;
    const idx = (y + 1) * 3 + (z + 1);
    return 8 + (idx > 4 ? idx - 1 : idx);
  }
  if (face === 2 && z === 1) {
    if (x === 0 && y === 0) return -1;
    const idx = (x + 1) * 3 + (y + 1);
    return 16 + (idx > 4 ? idx - 1 : idx);
  }
  if (face === 3 && y === 1) {
    if (x === 0 && z === 0) return -1;
    const idx = (x + 1) * 3 + (z + 1);
    return 24 + (idx > 4 ? idx - 1 : idx);
  }
  if (face === 4 && x === -1) {
    if (y === 0 && z === 0) return -1;
    const idx = (y + 1) * 3 + (z + 1);
    return 32 + (idx > 4 ? idx - 1 : idx);
  }
  if (face === 5 && z === -1) {
    if (x === 0 && y === 0) return -1;
    const idx = (x + 1) * 3 + (y + 1);
    return 40 + (idx > 4 ? idx - 1 : idx);
  }
  return -1;
};

export const getCenterColor = (ints, face) => {
  return ints[48 + face] ?? -1;
};

export const getKociembaState = (ints) => {
  const getColor = (x, y, z, face) => {
    const idx = getStickerIndex(x, y, z, face);
    return idx === -1 ? -1 : getSticker(ints, idx);
  };

  const cornerPositions = [
    { x: 1, y: -1, z: 1, faces: [0, 2, 1] }, // UFR
    { x: -1, y: -1, z: 1, faces: [0, 2, 4] }, // UFL
    { x: -1, y: -1, z: -1, faces: [0, 5, 4] }, // UBL
    { x: 1, y: -1, z: -1, faces: [0, 5, 1] }, // UBR
    { x: 1, y: 1, z: 1, faces: [3, 2, 1] }, // DFR
    { x: -1, y: 1, z: 1, faces: [3, 2, 4] }, // DFL
    { x: -1, y: 1, z: -1, faces: [3, 5, 4] }, // DBL
    { x: 1, y: 1, z: -1, faces: [3, 5, 1] }  // DBR
  ];

  const edgePositions = [
    { x: 1, y: -1, z: 0, faces: [0, 1] }, // UR
    { x: 0, y: -1, z: 1, faces: [0, 2] }, // UF
    { x: -1, y: -1, z: 0, faces: [0, 4] }, // UL
    { x: 0, y: -1, z: -1, faces: [0, 5] }, // UB
    { x: 1, y: 1, z: 0, faces: [3, 1] }, // DR
    { x: 0, y: 1, z: 1, faces: [3, 2] }, // DF
    { x: -1, y: 1, z: 0, faces: [3, 4] }, // DL
    { x: 0, y: 1, z: -1, faces: [3, 5] }, // DB
    { x: 1, y: 0, z: 1, faces: [2, 1] }, // FR
    { x: -1, y: 0, z: 1, faces: [2, 4] }, // FL
    { x: -1, y: 0, z: -1, faces: [5, 4] }, // BL
    { x: 1, y: 0, z: -1, faces: [5, 1] }  // BR
  ];

  const U_col = getCenterColor(ints, 0) !== -1 ? getCenterColor(ints, 0) : 0;
  const R_col = getCenterColor(ints, 1) !== -1 ? getCenterColor(ints, 1) : 1;
  const F_col = getCenterColor(ints, 2) !== -1 ? getCenterColor(ints, 2) : 2;
  const D_col = getCenterColor(ints, 3) !== -1 ? getCenterColor(ints, 3) : 3;
  const L_col = getCenterColor(ints, 4) !== -1 ? getCenterColor(ints, 4) : 4;
  const B_col = getCenterColor(ints, 5) !== -1 ? getCenterColor(ints, 5) : 5;

  const cornerMasks = [
    (1 << U_col) | (1 << R_col) | (1 << F_col),
    (1 << U_col) | (1 << F_col) | (1 << L_col),
    (1 << U_col) | (1 << L_col) | (1 << B_col),
    (1 << U_col) | (1 << B_col) | (1 << R_col),
    (1 << D_col) | (1 << F_col) | (1 << R_col),
    (1 << D_col) | (1 << L_col) | (1 << F_col),
    (1 << D_col) | (1 << B_col) | (1 << L_col),
    (1 << D_col) | (1 << R_col) | (1 << B_col)
  ];

  const edgeMasks = [
    (1 << U_col) | (1 << R_col),
    (1 << U_col) | (1 << F_col),
    (1 << U_col) | (1 << L_col),
    (1 << U_col) | (1 << B_col),
    (1 << D_col) | (1 << R_col),
    (1 << D_col) | (1 << F_col),
    (1 << D_col) | (1 << L_col),
    (1 << D_col) | (1 << B_col),
    (1 << F_col) | (1 << R_col),
    (1 << F_col) | (1 << L_col),
    (1 << B_col) | (1 << L_col),
    (1 << B_col) | (1 << R_col)
  ];

  const cp = [], co = [], ep = [], eo = [];

  for (let i = 0; i < 8; i++) {
    const pos = cornerPositions[i];
    const c1 = getColor(pos.x, pos.y, pos.z, pos.faces[0]);
    const c2 = getColor(pos.x, pos.y, pos.z, pos.faces[1]);
    const c3 = getColor(pos.x, pos.y, pos.z, pos.faces[2]);

    if (c1 === -1 || c2 === -1 || c3 === -1) {
      cp.push(-1); co.push(-1); continue;
    }

    const mask = (1 << c1) | (1 << c2) | (1 << c3);
    cp.push(cornerMasks.indexOf(mask));

    if (c1 === U_col || c1 === D_col) co.push(0);
    else if (c2 === U_col || c2 === D_col) co.push(1);
    else if (c3 === U_col || c3 === D_col) co.push(2);
    else co.push(-1);
  }

  for (let i = 0; i < 12; i++) {
    const pos = edgePositions[i];
    const c1 = getColor(pos.x, pos.y, pos.z, pos.faces[0]);
    const c2 = getColor(pos.x, pos.y, pos.z, pos.faces[1]);

    if (c1 === -1 || c2 === -1) {
      ep.push(-1); eo.push(-1); continue;
    }

    const mask = (1 << c1) | (1 << c2);
    const pieceIdx = edgeMasks.indexOf(mask);
    ep.push(pieceIdx);

    if (pieceIdx !== -1) {
      const isUorDEdge = pieceIdx < 8;
      let primaryColorOfPiece;
      if (isUorDEdge) {
         primaryColorOfPiece = (mask & (1 << U_col)) ? U_col : D_col;
      } else {
         primaryColorOfPiece = (mask & (1 << F_col)) ? F_col : B_col;
      }

      if (c1 === primaryColorOfPiece) eo.push(0);
      else if (c2 === primaryColorOfPiece) eo.push(1);
      else eo.push(-1);
    } else {
      eo.push(-1);
    }
  }

  return { cp, co, ep, eo };
};

const FACE_TRANSITIONS = {
  'U': { 2: 4, 4: 5, 5: 1, 1: 2, 0: 0, 3: 3 },
  'D': { 2: 1, 1: 5, 5: 4, 4: 2, 0: 0, 3: 3 },
  'F': { 0: 1, 1: 3, 3: 4, 4: 0, 2: 2, 5: 5 },
  'B': { 0: 4, 4: 3, 3: 1, 1: 0, 2: 2, 5: 5 },
  'R': { 0: 5, 5: 3, 3: 2, 2: 0, 1: 1, 4: 4 },
  'L': { 0: 2, 2: 3, 3: 5, 5: 0, 1: 1, 4: 4 }
};

const rotateCoord = (move, x, y, z, face) => {
  let nx = x, ny = y, nz = z;
  if (move === 'U' || move === 'y') { nx = -z; nz = x; }
  else if (move === 'D') { nx = z; nz = -x; }
  else if (move === 'F' || move === 'z') { nx = -y; ny = x; }
  else if (move === 'B') { nx = y; ny = -x; }
  else if (move === 'R' || move === 'x') { ny = -z; nz = y; }
  else if (move === 'L') { ny = z; nz = -y; }

  const effectiveMove = move === 'x' ? 'R' : move === 'y' ? 'U' : move === 'z' ? 'F' : move;
  const nface = FACE_TRANSITIONS[effectiveMove][face];
  return { nx, ny, nz, nface };
};

export const applyMove = (ints, move) => {
  let newInts = [...ints];
  const isPrime = move.endsWith("'");
  const isDouble = move.endsWith("2");
  const baseMove = move[0];

  const iterations = isDouble ? 2 : (isPrime ? 3 : 1);

  for (let iter = 0; iter < iterations; iter++) {
    const currentInts = [...newInts];

    let cond = () => false;
    if (baseMove === 'U') cond = (_x, y, _z) => y === -1;
    if (baseMove === 'D') cond = (_x, y, _z) => y === 1;
    if (baseMove === 'F') cond = (_x, _y, z) => z === 1;
    if (baseMove === 'B') cond = (_x, _y, z) => z === -1;
    if (baseMove === 'R') cond = (x, _y, _z) => x === 1;
    if (baseMove === 'L') cond = (x, _y, _z) => x === -1;
    if (['x', 'y', 'z'].includes(baseMove)) cond = () => true;

    // Rotate centers for whole-cube rotations
    if (['x', 'y', 'z'].includes(baseMove)) {
      const oldCenters = [
        currentInts[48], currentInts[49], currentInts[50], 
        currentInts[51], currentInts[52], currentInts[53]
      ];
      
      const CENTER_TRANSITIONS = {
        'x': { 0: 5, 5: 3, 3: 2, 2: 0, 1: 1, 4: 4 },
        'y': { 2: 4, 4: 5, 5: 1, 1: 2, 0: 0, 3: 3 },
        'z': { 0: 1, 1: 3, 3: 4, 4: 0, 2: 2, 5: 5 }
      };
      
      for (let f = 0; f < 6; f++) {
        const nf = CENTER_TRANSITIONS[baseMove][f];
        newInts[48 + nf] = oldCenters[f];
      }
    }

    for (let x of [-1, 0, 1]) {
      for (let y of [-1, 0, 1]) {
        for (let z of [-1, 0, 1]) {
          if (x === 0 && y === 0 && z === 0) continue;
          if (!cond(x, y, z)) continue;

          for (let face = 0; face < 6; face++) {
            const oldIdx = getStickerIndex(x, y, z, face);
            if (oldIdx === -1) continue;

            const { nx, ny, nz, nface } = rotateCoord(baseMove, x, y, z, face);
            const newIdx = getStickerIndex(nx, ny, nz, nface);

            if (newIdx !== -1) {
              const color = getSticker(currentInts, oldIdx);
              newInts = setSticker(newInts, newIdx, color);
            }
          }
        }
      }
    }
  }
  return newInts;
};
