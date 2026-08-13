import { applyMove, getKociembaState, setSticker } from './cubeEngine.js';

const MOVES = ['U', "U'", 'U2', 'R', "R'", 'R2', 'y', "y'", 'y2'];

const bfsEdgeInsert = () => {
  let ints = [0, 0, 0, 0];
  for (let i = 0; i < 48; i++) ints = setSticker(ints, i, Math.floor(i / 8));
  ints[48] = 0; ints[49] = 1; ints[50] = 2; ints[51] = 3; ints[52] = 4; ints[53] = 5;

  // We want to insert UF (piece 1) into FR (position 8), OR UR (piece 0) into FR (position 8).
  // Let's swap piece 8 with piece 1 (UF edge).
  let testInts = [...ints];
  // Wait, it's easier to start with solved cube, then apply the INVERSE of the trigger, 
  // and see if it leaves the cube with FR edge in U layer and DFR corner solved!
  // Even easier: do BFS from solved cube to a state where DFR, DBR, DBL, DFL are solved, 
  // and F2L edges 9, 10, 11 are solved, but FR edge is in U layer!
  
  let q = [{ ints: [...ints], path: [] }];
  let visited = new Set();
  visited.add(getKociembaState(ints).cp.join('') + getKociembaState(ints).ep.join(''));
  
  while (q.length > 0) {
    let curr = q.shift();
    if (curr.path.length > 8) continue;
    
    for (let m of MOVES) {
      if (curr.path.length > 0 && curr.path[curr.path.length - 1][0] === m[0]) continue;
      let nextInts = applyMove(curr.ints, m);
      let st = getKociembaState(nextInts);
      let stateStr = st.cp.join('') + st.ep.join('');
      if (!visited.has(stateStr)) {
        visited.add(stateStr);
        
        // We want an inverse trigger, so the current state should have:
        // All corners solved: 4, 5, 6, 7 are at 4, 5, 6, 7.
        // Edges 9, 10, 11 are at 9, 10, 11.
        // Edge 8 is in the U layer (0, 1, 2, 3).
        let cOk = st.cp[4]===4 && st.cp[5]===5 && st.cp[6]===6 && st.cp[7]===7;
        let eOk = st.ep[9]===9 && st.ep[10]===10 && st.ep[11]===11;
        let frInU = st.ep[0]===8 || st.ep[1]===8 || st.ep[2]===8 || st.ep[3]===8;
        let flipped = st.eo[0]===1 || st.eo[1]===1 || st.eo[2]===1 || st.eo[3]===1;
        
        if (cOk && eOk && frInU && flipped) {
          console.log('Found flipped inverse trigger:', [...curr.path, m].join(' '));
          return;
        }
        
        q.push({ ints: nextInts, path: [...curr.path, m] });
      }
    }
  }
};

bfsEdgeInsert();
