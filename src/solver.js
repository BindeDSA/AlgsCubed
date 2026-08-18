import { applyMove, getKociembaState, getCenterColor } from './cubeEngine.js';

const applyMoves = (ints, moves) => {
  let curr = ints;
  for (const m of moves) curr = applyMove(curr, m);
  return curr;
};

// Simulation helper
const simulateTriggers = (ints, triggers, goalCheck, maxU = 4) => {
  let uInts = ints;
  let uMoves = [];
  for (let u = 0; u < maxU; u++) {
    for (const trigger of triggers) {
      const testInts = applyMoves(uInts, trigger);
      if (goalCheck(getKociembaState(testInts))) {
        // Optimize U moves
        let finalUMoves = uMoves;
        if (uMoves.length === 3) finalUMoves = ["U'"];
        if (uMoves.length === 2) finalUMoves = ["U2"];
        return [...finalUMoves, ...trigger];
      }
    }
    uInts = applyMove(uInts, 'U');
    uMoves.push('U');
  }
  return null;
};

const simulateAUF = (ints, triggers, goalCheck) => {
  let setupInts = ints;
  let setupMoves = [];
  for (let u1 = 0; u1 < 4; u1++) {
    for (const trigger of triggers) {
      let afterTriggerInts = applyMoves(setupInts, trigger);
      let postInts = afterTriggerInts;
      let postMoves = [];
      for (let u2 = 0; u2 < 4; u2++) {
        if (goalCheck(getKociembaState(postInts))) {
          let fSetup = [...setupMoves];
          if (setupMoves.length === 3) fSetup = ["U'"];
          if (setupMoves.length === 2) fSetup = ["U2"];

          let fPost = [...postMoves];
          if (postMoves.length === 3) fPost = ["U'"];
          if (postMoves.length === 2) fPost = ["U2"];

          return [...fSetup, ...trigger, ...fPost];
        }
        postInts = applyMove(postInts, 'U');
        postMoves.push('U');
      }
    }
    setupInts = applyMove(setupInts, 'U');
    setupMoves.push('U');
  }
  return null;
};

export const getNextSolverChunk = (ints, state = {}) => {
  const curr = ints;
  const s = getKociembaState(curr);

  // 1. Orientation: Yellow on Top
  const U_col = getCenterColor(curr, 0);
  const D_col = getCenterColor(curr, 3);
  let crossSolved = false;

  if (U_col === 1) { // 1 is Yellow
    crossSolved = [4, 5, 6, 7].every(t => s.ep[t] === t && s.eo[t] === 0);
  } else if (D_col === 1) { // White on Top
    crossSolved = [0, 1, 2, 3].every(t => s.ep[t] === t && s.eo[t] === 0);
  }

  if (!crossSolved) {
    if (U_col !== 1) {
      let move = '';
      const R_col = getCenterColor(curr, 1);
      const F_col = getCenterColor(curr, 2);
      const L_col = getCenterColor(curr, 4);
      const B_col = getCenterColor(curr, 5);

      if (D_col === 1) move = 'x2';
      else if (F_col === 1) move = 'x';
      else if (B_col === 1) move = "x'";
      else if (R_col === 1) move = "z'";
      else if (L_col === 1) move = 'z';
      if (move) return { phase: 'Orientation (Yellow on Top)', moves: [move] };
    }
  }

  // 2. White Cross (via Daisy on Top)
  if (!crossSolved) {
    const isDaisyEdge = (st, e) => {
      const pos = st.ep.indexOf(e);
      return pos >= 0 && pos <= 3 && st.eo[pos] === 0;
    };

    const solvedCrossEdges = [4, 5, 6, 7].filter(e => s.ep[e] === e && s.eo[e] === 0);
    const daisyEdges = [4, 5, 6, 7].filter(e => isDaisyEdge(s, e));

    if (daisyEdges.length === 4) {
      state.daisyDone = true;
    }

    if (!state.daisyDone && daisyEdges.length < 4) {
      const daisyTriggers = (() => {
        const basicMoves = ['R', "R'", 'L', "L'", 'F', "F'", 'B', "B'", 'D', "D'", 'D2', 'R2', 'L2', 'F2', 'B2', 'U', "U'", 'U2'];
        const tr = [];
        for (const m of basicMoves) tr.push([m]);
        for (const m1 of basicMoves) {
          for (const m2 of basicMoves) {
            if (m1[0] !== m2[0]) {
              tr.push([m1, m2]);
              for (const m3 of basicMoves) {
                if (m2[0] !== m3[0]) tr.push([m1, m2, m3]);
              }
            }
          }
        }
        return tr;
      })();

      let uInts = curr;
      let uMoves = [];
      for (let u = 0; u < 4; u++) {
        for (const trigger of daisyTriggers) {
          const testInts = applyMoves(uInts, trigger);
          const st = getKociembaState(testInts);
          const testDaisy = [4, 5, 6, 7].filter(e => isDaisyEdge(st, e)).length;

          if (testDaisy > daisyEdges.length) {
            let finalUMoves = uMoves;
            if (uMoves.length === 3) finalUMoves = ["U'"];
            if (uMoves.length === 2) finalUMoves = ["U2"];
            return { phase: 'Build Daisy', moves: [...finalUMoves, ...trigger] };
          }
        }
        uInts = applyMove(uInts, 'U');
        uMoves.push('U');
      }
    } else {
      if (daisyEdges.length > 0) {
        const atomicMoves = [['R2'], ['L2'], ['F2'], ['B2'], ['U'], ["U'"], ['U2']];
        const isCrossSolved = (st) => [4, 5, 6, 7].every(e => st.ep[e] === e && st.eo[e] === 0);

        let maxDepth = 12;
        let queues = Array.from({ length: maxDepth + 1 }, () => []);
        queues[0].push({ ints: curr, moves: [] });

        let visited = new Set();
        visited.add(curr.join(','));

        let solutionMoves = null;

        for (let cost = 0; cost <= maxDepth; cost++) {
          while (queues[cost].length > 0) {
            const { ints: qInts, moves: qMoves } = queues[cost].shift();

            for (const move of atomicMoves) {
              const nextMoves = [...qMoves, ...move];
              const nextCost = nextMoves.length;
              if (nextCost > maxDepth) continue;

              const nextInts = applyMoves(qInts, move);
              const stateHash = nextInts.join(',');

              if (!visited.has(stateHash)) {
                visited.add(stateHash);

                const nextState = getKociembaState(nextInts);

                if (isCrossSolved(nextState)) {
                  solutionMoves = nextMoves;
                  break;
                }

                queues[nextCost].push({ ints: nextInts, moves: nextMoves });
              }
            }
            if (solutionMoves) break;
          }
          if (solutionMoves) break;
        }

        if (solutionMoves) {
          return { phase: 'Complete Cross (Optimal)', moves: solutionMoves };
        }
      }
    }
  }

  // 3. Orientation: White on Bottom
  const D_col_now = getCenterColor(curr, 3);
  if (D_col_now !== 0) {
    return { phase: 'Orientation (White on Bottom)', moves: ['x2'] };
  }

  // 4. White Corners (Targets: 4, 5, 6, 7)
  const cornerTargets = [4, 7, 6, 5];
  const cornersSolved = (st) => cornerTargets.every(c => st.cp[c] === c && st.co[c] === 0);

  if (!cornersSolved(s)) {
    const getSolvedCornersCount = (st) => cornerTargets.filter(c => st.cp[c] === c && st.co[c] === 0).length;
    const startCount = getSolvedCornersCount(s);

    const atomicMoves = [
      ['R', 'U', "R'"],
      ['U'], ["U'"], ['U2'],
      ['y'], ["y'"], ['y2']
    ];

    let maxDepth = 20; // Max allowed single moves
    let queues = Array.from({ length: maxDepth + 1 }, () => []);
    queues[0].push({ ints: curr, moves: [] });

    let visited = new Set();
    visited.add(curr.join(','));

    let solutionMoves = null;

    for (let cost = 0; cost <= maxDepth; cost++) {
      while (queues[cost].length > 0) {
        const { ints: qInts, moves: qMoves } = queues[cost].shift();

        for (const move of atomicMoves) {
          const nextMoves = [...qMoves, ...move];
          const nextCost = nextMoves.length;
          if (nextCost > maxDepth) continue;

          const nextInts = applyMoves(qInts, move);
          const stateHash = nextInts.join(',');

          if (!visited.has(stateHash)) {
            visited.add(stateHash);

            const nextState = getKociembaState(nextInts);
            const nextCount = getSolvedCornersCount(nextState);

            if (nextCount > startCount) {
              solutionMoves = nextMoves;
              break;
            }

            queues[nextCost].push({ ints: nextInts, moves: nextMoves });
          }
        }
        if (solutionMoves) break;
      }
      if (solutionMoves) break;
    }

    if (solutionMoves) {
      return { phase: 'Insert White Corner (BFS)', moves: solutionMoves };
    } else {
      return { phase: 'Find Solvable Corner (Fallback)', moves: ['y'] };
    }
  }

  // 5. F2L Edges (Targets: 8, 9, 10, 11)
  const f2lSolved = (st) => [8, 9, 10, 11].every(e => st.ep[e] === e && st.eo[e] === 0);
  if (!f2lSolved(s)) {
    const rightInsertRestored = ['U', 'R', "U'", "R'", "U'", "y'", "R'", 'U', 'R', 'y'];
    const frontInsertRestored = ["U'", "y'", "R'", 'U', 'R', 'y', 'U', 'R', "U'", "R'"];
    const rightTriggers = [rightInsertRestored, frontInsertRestored];

    const leftInsertRestored = ["U'", "L'", "U", "L", "U", "y", "L", "U'", "L'", "y'"];
    const frontLeftInsertRestored = ["U", "y", "L", "U'", "L'", "y'", "U'", "L'", "U", "L"];
    const leftTriggers = [leftInsertRestored, frontLeftInsertRestored];

    if (!(s.ep[8] === 8 && s.eo[8] === 0)) {
      const moves = simulateTriggers(curr, rightTriggers, (st) => st.ep[8] === 8 && st.eo[8] === 0);
      if (moves) return { phase: 'Insert F2L Edge (R)', moves };
    }

    if (!(s.ep[9] === 9 && s.eo[9] === 0)) {
      const moves = simulateTriggers(curr, leftTriggers, (st) => st.ep[9] === 9 && st.eo[9] === 0);
      if (moves) return { phase: 'Insert F2L Edge (L)', moves };
    }

    // Check if ANY F2L edge is in the U layer (indices 0, 1, 2, 3)
    const f2lEdgeInU = [8, 9, 10, 11].some(e => s.ep.indexOf(e) < 4);

    if (f2lEdgeInU) {
      return { phase: 'Find Solvable F2L Edge', moves: ['y'] };
    } else {
      if (!(s.ep[8] === 8 && s.eo[8] === 0)) return { phase: 'Kick out F2L Edge', moves: rightInsertRestored };
      if (!(s.ep[9] === 9 && s.eo[9] === 0)) return { phase: 'Kick out F2L Edge', moves: leftInsertRestored };
      return { phase: 'Find Unsolved F2L Edge', moves: ['y'] };
    }
  }

  // 6. OLL Edges
  const ollEdgeGoal = (st) => st.eo[0] === 0 && st.eo[1] === 0 && st.eo[2] === 0 && st.eo[3] === 0;
  if (!ollEdgeGoal(s)) {
    const algLine = ['F', 'R', 'U', "R'", "U'", "F'"];
    const algL = ['F', 'U', 'R', "U'", "R'", "F'"];

    let moves = simulateTriggers(curr, [algLine, algL], ollEdgeGoal);

    // If simulate fails (e.g. dot case requires multiple), just apply algLine once to progress
    if (!moves) moves = algLine;

    return { phase: 'OLL Edges', moves };
  }

  // 7. OLL Corners
  const ollCornerGoal = (st) => st.co[0] === 0 && st.co[1] === 0 && st.co[2] === 0 && st.co[3] === 0;
  if (!ollCornerGoal(s)) {
    const sune = ["R", "U", "R'", "U", "R", "U2", "R'"];
    const oll = ["L'", "U", "R", "U'", "L", "U", "R'"];
    const atomicMoves = [sune, oll, ['U'], ["U'"], ['U2']];

    let maxDepth = 25;
    let queues = Array.from({ length: maxDepth + 1 }, () => []);
    queues[0].push({ ints: curr, moves: [] });

    let visited = new Set();
    visited.add(curr.join(','));

    let solutionMoves = null;

    for (let cost = 0; cost <= maxDepth; cost++) {
      while (queues[cost].length > 0) {
        const { ints: qInts, moves: qMoves } = queues[cost].shift();

        for (const move of atomicMoves) {
          const nextMoves = [...qMoves, ...move];
          const nextCost = nextMoves.length;
          if (nextCost > maxDepth) continue;

          const nextInts = applyMoves(qInts, move);
          const stateHash = nextInts.join(',');

          if (!visited.has(stateHash)) {
            visited.add(stateHash);

            const nextState = getKociembaState(nextInts);

            if (ollCornerGoal(nextState)) {
              solutionMoves = nextMoves;
              break;
            }

            queues[nextCost].push({ ints: nextInts, moves: nextMoves });
          }
        }
        if (solutionMoves) break;
      }
      if (solutionMoves) break;
    }

    if (solutionMoves) {
      return { phase: 'OLL Corners (Optimal)', moves: solutionMoves };
    } else {
      return { phase: 'OLL Corners (Fallback)', moves: sune };
    }
  }

  // 8. PLL Corners
  const pllCornerGoal = (st) => st.cp[0] === 0 && st.cp[1] === 1 && st.cp[2] === 2 && st.cp[3] === 3;
  if (!pllCornerGoal(s)) {
    const aPerm = ["R'", "F", "R'", "B2", "R", "F'", "R'", "B2", "R2"];
    let moves = simulateAUF(curr, [aPerm], pllCornerGoal);
    if (!moves) moves = aPerm;
    return { phase: 'PLL Corners', moves };
  }

  // 9. PLL Edges
  const pllEdgeGoal = (st) => st.ep[0] === 0 && st.ep[1] === 1 && st.ep[2] === 2 && st.ep[3] === 3;
  if (!pllEdgeGoal(s)) {
    const uPermA = ["R", "U'", "R", "U", "R", "U", "R", "U'", "R'", "U'", "R2"];
    const uPermB = ["R2", "U", "R", "U", "R'", "U'", "R'", "U'", "R'", "U", "R'"];
    const hPerm = ["M2", "U", "M2", "U2", "M2", "U", "M2"];
    const zPerm = ["M2", "U", "M2", "U", "M'", "U2", "M2", "U2", "M'", "U2"];

    const triggers = [uPermA, uPermB, hPerm, zPerm];
    let moves = simulateAUF(curr, triggers, pllEdgeGoal);
    if (!moves) moves = uPermA;

    return { phase: 'PLL Edges', moves };
  }

  // 10. AUF (Adjust U Face)
  if (s.ep[0] !== 0) {
    if (s.ep[1] === 0) return { phase: 'AUF', moves: ["U"] };
    if (s.ep[2] === 0) return { phase: 'AUF', moves: ["U2"] };
    if (s.ep[3] === 0) return { phase: 'AUF', moves: ["U'"] };
  }

  return { phase: 'Solved', moves: [] };
};
