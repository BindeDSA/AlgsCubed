import { applyMove, getKociembaState, getCenterColor, setSticker } from './cubeEngine.js';
import { getNextSolverChunk } from './solver.js';

const MOVES = ['U', 'D', 'F', 'B', 'R', 'L', "U'", "D'", "F'", "B'", "R'", "L'", 'U2', 'D2', 'F2', 'B2', 'R2', 'L2'];

const generateScramble = (length) => {
  let seq = [];
  let lastFace = '';
  for (let i = 0; i < length; i++) {
    let move;
    do {
      move = MOVES[Math.floor(Math.random() * MOVES.length)];
    } while (move[0] === lastFace);
    lastFace = move[0];
    seq.push(move);
  }
  return seq;
};

const runTest = () => {
  let ints = [0, 0, 0, 0];
  for (let i = 0; i < 48; i++) {
    ints = setSticker(ints, i, Math.floor(i / 8));
  }
  ints[48] = 0; // U
  ints[49] = 1; // R
  ints[50] = 2; // F
  ints[51] = 3; // D
  ints[52] = 4; // L
  ints[53] = 5; // B
  
  const scramble = generateScramble(40);
  console.log('Scramble:', scramble.join(' '));
  for (const m of scramble) {
    ints = applyMove(ints, m);
  }
  
  let steps = 0;
  let solverState = { daisyDone: false };
  while (true) {
    const chunk = getNextSolverChunk(ints, solverState);
    if (chunk.phase === 'Solved') {
      const finalState = getKociembaState(ints);
      console.log('Final CP:', finalState.cp);
      console.log('Final EP:', finalState.ep);
      break;
    }
    console.log(chunk.phase, chunk.moves.join(' '));
    if (chunk.moves.length === 0) {
      console.log('STUCK! No moves returned.');
      break;
    }
    for (const m of chunk.moves) {
      ints = applyMove(ints, m);
    }
    steps++;
    if (steps > 200) {
      console.log('TIMEOUT! Over 200 steps.');
      break;
    }
  }
};

const testYRotation = () => {
  let ints = [0, 0, 0, 0];
  for (let i = 0; i < 48; i++) ints = setSticker(ints, i, Math.floor(i / 8));
  ints[48] = 0; ints[49] = 1; ints[50] = 2; ints[51] = 3; ints[52] = 4; ints[53] = 5;

  let state1 = getKociembaState(ints);
  console.log('Solved CP:', state1.cp);
  
  let steps = 0;
  let solverState = { daisyDone: false };
  while (true) {
    const chunk = getNextSolverChunk(ints, solverState);
    if (chunk.phase === 'Solved') {
      const finalState = getKociembaState(ints);
      console.log('Final CP:', finalState.cp);
      console.log('Final EP:', finalState.ep);
      break;
    }
    console.log(chunk.phase, chunk.moves.join(' '));
    if (chunk.moves.length === 0) {
      console.log('STUCK! No moves returned.');
      break;
    }
    for (const m of chunk.moves) {
      ints = applyMove(ints, m);
    }
    steps++;
    if (steps > 300) {
      console.log('TIMEOUT! Over 300 steps.');
      break;
    }
  }
};

runTest();
// testYRotation();
