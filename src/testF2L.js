import { applyMove, getKociembaState, setSticker } from './cubeEngine.js';

const MOVES = ['U', "U'", 'U2', 'R', "R'", 'R2', 'y', "y'", 'y2'];

const testF2L = () => {
  let ints = [0, 0, 0, 0];
  for (let i = 0; i < 48; i++) ints = setSticker(ints, i, Math.floor(i / 8));
  ints[48] = 0; ints[49] = 1; ints[50] = 2; ints[51] = 3; ints[52] = 4; ints[53] = 5;

  let uPerm = ["R", "U'", "R", "U", "R", "U", "R", "U'", "R'", "U'", "R2"];
  let testInts = [...ints];
  for (let m of uPerm) testInts = applyMove(testInts, m);
  let st = getKociembaState(testInts);
  console.log('EP:', st.ep.slice(0, 4));
  console.log('CP:', st.cp.slice(0, 4));
};

testF2L();
