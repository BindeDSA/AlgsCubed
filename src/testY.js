import { applyMove, getKociembaState, setSticker } from './cubeEngine.js';

const testYRotation = () => {
  let ints = [0, 0, 0, 0];
  for (let i = 0; i < 48; i++) ints = setSticker(ints, i, Math.floor(i / 8));
  ints[48] = 0; ints[49] = 1; ints[50] = 2; ints[51] = 3; ints[52] = 4; ints[53] = 5;

  let trigger = ['R', "U'", "R'", "y'", "R'", "U'", "R"];
  let testInts = [...ints];
  for (let m of trigger) testInts = applyMove(testInts, m);
  
  let st = getKociembaState(testInts);
  console.log('CP after magic:', st.cp);
  console.log('EP after magic:', st.ep);
  console.log('EO after magic:', st.eo);
};

testYRotation();
