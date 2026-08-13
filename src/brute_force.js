import { applyMove, getKociembaState } from './cubeEngine.js';

const MOVES = ['U', 'D', 'F', 'B', 'R', 'L', "U'", "D'", "F'", "B'", "R'", "L'", 'U2', 'D2', 'F2', 'B2', 'R2', 'L2'];

const bfsEdge = (startInts, t) => {
  let queue = [{ ints: startInts, path: [] }];
  let visited = new Set();
  
  while (queue.length > 0) {
    const node = queue.shift();
    const s = getKociembaState(node.ints);
    if (s.ep[t] === t && s.eo[t] === 0) {
      return node.path;
    }
    
    const hash = `${s.ep[t]}-${s.eo[t]}`;
    if (visited.has(hash)) continue;
    visited.add(hash);
    
    for (const m of MOVES) {
      // Don't use D moves since we are building cross on D, wait, D moves don't break the cross, they just misalign it.
      // We only care about solving this specific edge WITHOUT breaking already solved edges.
      // But this BFS is only for 1 edge! We can just find the shortest path to solve it.
      const nextInts = applyMove(node.ints, m);
      queue.push({ ints: nextInts, path: [...node.path, m] });
    }
  }
};

let ints = [0,0,0,0];
ints[48] = 4; ints[49] = 5; ints[50] = 0; ints[51] = 1; ints[52] = 2; ints[53] = 3;
// Just find shortest path for DF edge (target 5) from UF (target 1) flipped (eo=1)
// Wait, actually I just need generic triggers.
// If it's at UF (1) and flipped (eo=1), we want to insert to DF (5).
let testInts = applyMove(ints, 'F2'); // now at DF, eo=0
testInts = applyMove(testInts, 'F'); // at RF
testInts = applyMove(testInts, 'U'); // at UB
testInts = applyMove(testInts, "R'"); // at UR, eo=1
testInts = applyMove(testInts, "U'"); // at UF, eo=1

console.log('Path for UF flipped to DF:', bfsEdge(testInts, 5));
