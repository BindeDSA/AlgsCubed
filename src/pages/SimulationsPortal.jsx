import React, { useState, useRef, useEffect } from 'react';
import { getSticker, setSticker, getStickerIndex, getKociembaState, applyMove, getCenterColor } from '../cubeEngine';
import { randomScrambleForEvent } from 'cubing/scramble';

import { getNextSolverChunk } from '../solver';

let solverWorker = null;
let reqIdCounter = 0;
const resolvers = {};

if (typeof window !== 'undefined') {
  try {
    solverWorker = new Worker(new URL('../solver.worker.js', import.meta.url), { type: 'module' });
    solverWorker.onmessage = (e) => {
      const { reqId, chunk, state, success, error } = e.data;
      if (resolvers[reqId]) {
        if (success) {
          resolvers[reqId].resolve({ chunk, state });
        } else {
          resolvers[reqId].reject(new Error(error));
        }
        delete resolvers[reqId];
      }
    };
    solverWorker.onerror = (e) => {
      console.warn("WebWorker encountered an error. Falling back to main thread execution for future chunks.");
      solverWorker = null;
    };
  } catch (err) {
    console.warn("Failed to initialize WebWorker. Falling back to main thread execution.");
    solverWorker = null;
  }
}

const calculateChunkAsync = (ints, state) => {
  return new Promise((resolve, reject) => {
    if (!solverWorker) {
      // Fallback: Execute on main thread
      try {
        const chunk = getNextSolverChunk(ints, state);
        resolve({ chunk, state });
      } catch (err) {
        reject(err);
      }
      return;
    }

    const reqId = reqIdCounter++;
    resolvers[reqId] = { resolve, reject };
    
    try {
      solverWorker.postMessage({ reqId, ints, state });
    } catch (err) {
      console.warn("Worker postMessage failed. Falling back to main thread.", err);
      solverWorker = null;
      try {
        const chunk = getNextSolverChunk(ints, state);
        resolve({ chunk, state });
      } catch (e) {
        reject(e);
      }
    }
  });
};

const COLORS = ['#ffffff', '#ffd500', '#009e60', '#0051ba', '#c41e3a', '#ff5900'];

const MOVE_ANIMATIONS = {
  "U": { axis: 'y', angle: -90, condition: (x, y, z) => y === -1 },
  "U'": { axis: 'y', angle: 90, condition: (x, y, z) => y === -1 },
  "U2": { axis: 'y', angle: -180, condition: (x, y, z) => y === -1 },
  "D": { axis: 'y', angle: 90, condition: (x, y, z) => y === 1 },
  "D'": { axis: 'y', angle: -90, condition: (x, y, z) => y === 1 },
  "D2": { axis: 'y', angle: 180, condition: (x, y, z) => y === 1 },
  "F": { axis: 'z', angle: 90, condition: (x, y, z) => z === 1 },
  "F'": { axis: 'z', angle: -90, condition: (x, y, z) => z === 1 },
  "F2": { axis: 'z', angle: 180, condition: (x, y, z) => z === 1 },
  "B": { axis: 'z', angle: -90, condition: (x, y, z) => z === -1 },
  "B'": { axis: 'z', angle: 90, condition: (x, y, z) => z === -1 },
  "B2": { axis: 'z', angle: -180, condition: (x, y, z) => z === -1 },
  "R": { axis: 'x', angle: 90, condition: (x, y, z) => x === 1 },
  "R'": { axis: 'x', angle: -90, condition: (x, y, z) => x === 1 },
  "R2": { axis: 'x', angle: 180, condition: (x, y, z) => x === 1 },
  "L": { axis: 'x', angle: -90, condition: (x, y, z) => x === -1 },
  "L'": { axis: 'x', angle: 90, condition: (x, y, z) => x === -1 },
  "L2": { axis: 'x', angle: -180, condition: (x, y, z) => x === -1 },
  "x": { axis: 'x', angle: 90, condition: (x, y, z) => true },
  "x'": { axis: 'x', angle: -90, condition: (x, y, z) => true },
  "x2": { axis: 'x', angle: 180, condition: (x, y, z) => true },
  "y": { axis: 'y', angle: -90, condition: (x, y, z) => true },
  "y'": { axis: 'y', angle: 90, condition: (x, y, z) => true },
  "y2": { axis: 'y', angle: -180, condition: (x, y, z) => true },
  "z": { axis: 'z', angle: 90, condition: (x, y, z) => true },
  "z'": { axis: 'z', angle: -90, condition: (x, y, z) => true },
  "z2": { axis: 'z', angle: 180, condition: (x, y, z) => true },
  "M": { axis: 'x', angle: -90, condition: (x, y, z) => x === 0 },
  "M'": { axis: 'x', angle: 90, condition: (x, y, z) => x === 0 },
  "M2": { axis: 'x', angle: -180, condition: (x, y, z) => x === 0 },
  "E": { axis: 'y', angle: 90, condition: (x, y, z) => y === 0 },
  "E'": { axis: 'y', angle: -90, condition: (x, y, z) => y === 0 },
  "E2": { axis: 'y', angle: 180, condition: (x, y, z) => y === 0 },
  "S": { axis: 'z', angle: 90, condition: (x, y, z) => z === 0 },
  "S'": { axis: 'z', angle: -90, condition: (x, y, z) => z === 0 },
  "S2": { axis: 'z', angle: 180, condition: (x, y, z) => z === 0 }
};

function CSSCube({ ints, activeColor, onStickerClick, activeMove, onAnimationComplete, animationSpeedMs = 200 }) {
  const [rotX, setRotX] = useState(-30);
  const [rotY, setRotY] = useState(-45);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    setRotY((prev) => prev + deltaX * 0.5);
    setRotX((prev) => prev - deltaY * 0.5);

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const CUBIE_SIZE = 60;
  const GAP = 2;
  const TOTAL_SIZE = CUBIE_SIZE + GAP;

  const animationFired = useRef(false);

  useEffect(() => {
    if (activeMove) {
      animationFired.current = false;
    }
  }, [activeMove]);

  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const faces = [];
        for (let face = 0; face < 6; face++) {
          let colorIdx = -1;
          const stickerIdx = getStickerIndex(x, y, z, face);
          if (stickerIdx !== -1) {
            colorIdx = getSticker(ints, stickerIdx);
          } else {
            colorIdx = getCenterColor(ints, face);
            if (face === 0 && y !== -1) colorIdx = -1; // U
            if (face === 1 && x !== 1) colorIdx = -1;  // R
            if (face === 2 && z !== 1) colorIdx = -1;  // F
            if (face === 3 && y !== 1) colorIdx = -1;  // D
            if (face === 4 && x !== -1) colorIdx = -1; // L
            if (face === 5 && z !== -1) colorIdx = -1; // B
          }

          let bgColor = colorIdx === -1 ? '#111111' : COLORS[colorIdx];
          if (x === 0 && y === -1 && z === 0 && face === 0) bgColor = COLORS[ints[48 + 0] ?? 0];
          else if (x === 1 && y === 0 && z === 0 && face === 1) bgColor = COLORS[ints[48 + 1] ?? 1];
          else if (x === 0 && y === 0 && z === 1 && face === 2) bgColor = COLORS[ints[48 + 2] ?? 2];
          else if (x === 0 && y === 1 && z === 0 && face === 3) bgColor = COLORS[ints[48 + 3] ?? 3];
          else if (x === -1 && y === 0 && z === 0 && face === 4) bgColor = COLORS[ints[48 + 4] ?? 4];
          else if (x === 0 && y === 0 && z === -1 && face === 5) bgColor = COLORS[ints[48 + 5] ?? 5];

          let transform = '';
          if (face === 0) transform = `rotateX(90deg) translateZ(${CUBIE_SIZE / 2}px)`; // Top (U)
          if (face === 1) transform = `rotateY(90deg) translateZ(${CUBIE_SIZE / 2}px)`; // Right (R)
          if (face === 2) transform = `translateZ(${CUBIE_SIZE / 2}px)`; // Front (F)
          if (face === 3) transform = `rotateX(-90deg) translateZ(${CUBIE_SIZE / 2}px)`; // Bottom (D)
          if (face === 4) transform = `rotateY(-90deg) translateZ(${CUBIE_SIZE / 2}px)`; // Left (L)
          if (face === 5) transform = `rotateY(180deg) translateZ(${CUBIE_SIZE / 2}px)`; // Back (B)

          faces.push(
            <div key={face}
              onPointerUp={(e) => {
                const dist = Math.hypot(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y);
                if (dist < 5 && stickerIdx !== -1 && onStickerClick) {
                  onStickerClick(stickerIdx, activeColor);
                }
              }}
              style={{
                position: 'absolute',
                width: `${CUBIE_SIZE}px`,
                height: `${CUBIE_SIZE}px`,
                backgroundColor: bgColor,
                border: '2px solid #222',
                boxSizing: 'border-box',
                transform,
                backfaceVisibility: 'hidden',
                borderRadius: '4px',
                cursor: stickerIdx !== -1 ? 'crosshair' : 'default'
              }} />
          );
        }

        const translateX = x * TOTAL_SIZE;
        const translateY = y * TOTAL_SIZE;
        const translateZ = z * TOTAL_SIZE;

        const anim = activeMove ? MOVE_ANIMATIONS[activeMove] : null;
        let extraTransform = '';
        let transition = 'none';
        let onEnd = undefined;

        if (anim && anim.condition(x, y, z)) {
          if (anim.axis === 'x') extraTransform = `rotateX(${anim.angle}deg) `;
          if (anim.axis === 'y') extraTransform = `rotateY(${anim.angle}deg) `;
          if (anim.axis === 'z') extraTransform = `rotateZ(${anim.angle}deg) `;
          transition = `transform ${animationSpeedMs}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

          onEnd = (e) => {
            if (e.target !== e.currentTarget) return;
            if (!animationFired.current) {
              animationFired.current = true;
              if (onAnimationComplete) onAnimationComplete();
            }
          };
        }

        cubies.push(
          <div key={`${x}-${y}-${z}`} onTransitionEnd={onEnd} style={{
            position: 'absolute',
            width: `${CUBIE_SIZE}px`,
            height: `${CUBIE_SIZE}px`,
            transformStyle: 'preserve-3d',
            transition,
            transform: `${extraTransform}translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`
          }}>
            {faces}
          </div>
        );
      }
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        perspective: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onMouseUp={() => { isDragging.current = false; }}
    >
      <div style={{
        position: 'relative',
        width: '0',
        height: '0',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`
      }}>
        <div style={{
          position: 'absolute',
          top: `-${CUBIE_SIZE / 2}px`,
          left: `-${CUBIE_SIZE / 2}px`,
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}>
          {cubies}
        </div>
      </div>
    </div>
  );
}

function SimulationsPortal() {
  const [ints, setInts] = useState(() => {
    let initial = [0, 0, 0, 0];
    const faceColors = [0, 4, 2, 1, 5, 3];
    for (let i = 0; i < 48; i++) {
      initial = setSticker(initial, i, faceColors[Math.floor(i / 8)]);
    }
    initial[48] = faceColors[0];
    initial[49] = faceColors[1];
    initial[50] = faceColors[2];
    initial[51] = faceColors[3];
    initial[52] = faceColors[4];
    initial[53] = faceColors[5];
    return initial;
  });

  const handleReset = () => {
    if (isAnimating) return;
    let reset = [0, 0, 0, 0];
    const faceColors = [0, 4, 2, 1, 5, 3];
    for (let i = 0; i < 48; i++) {
      reset = setSticker(reset, i, faceColors[Math.floor(i / 8)]);
    }
    reset[48] = faceColors[0];
    reset[49] = faceColors[1];
    reset[50] = faceColors[2];
    reset[51] = faceColors[3];
    reset[52] = faceColors[4];
    reset[53] = faceColors[5];
    setInts(reset);
    setValidationResult(null);
    solverStateRef.current = { daisyDone: false };
    nextChunkRef.current = null;
  };

  const [activeColor, setActiveColor] = useState(0);
  const [validationResult, setValidationResult] = useState(null);
  const [activeMove, setActiveMove] = useState(null);
  const [isCubeMoving, setIsCubeMoving] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [history, setHistory] = useState([]);
  const solverStateRef = useRef({ daisyDone: false });
  const nextChunkRef = useRef(null);
  const moveResolveRef = useRef(null);

  const handleAnimationComplete = () => {
    setIsCubeMoving(false);
    if (moveResolveRef.current) {
      moveResolveRef.current();
      moveResolveRef.current = null;
    }
  };

  const MOVES = ['U', 'U\'', 'U2', 'D', 'D\'', 'D2', 'F', 'F\'', 'F2', 'B', 'B\'', 'B2', 'R', 'R\'', 'R2', 'L', 'L\'', 'L2'];

  const flattenMoves = (moves) => {
    const flat = [];
    for (let m of moves) {
      if (m.endsWith('2')) {
        const base = m[0];
        flat.push(base, base);
      } else {
        flat.push(m);
      }
    }
    return flat;
  };

  const [isAnimating, setIsAnimating] = useState(false);

  const handleScramble = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsScrambling(true);
    setHistory([]);
    setValidationResult({ valid: true, message: 'Scrambling...' });
    solverStateRef.current = { daisyDone: false };
    nextChunkRef.current = null;

    let currentInts = ints;
    const scramble = await randomScrambleForEvent('333');
    const rawScrambleString = scramble.toString();
    const rawScrambleMoves = rawScrambleString.split(' ').filter(m => m.trim().length > 0);
    const scrambleMoves = flattenMoves(rawScrambleMoves);

    for (let i = 0; i < scrambleMoves.length; i++) {
        const move = scrambleMoves[i];
        setIsCubeMoving(true);
        setActiveMove(move);

        await new Promise(resolve => {
            moveResolveRef.current = resolve;
            setTimeout(() => {
                if (moveResolveRef.current === resolve) {
                    handleAnimationComplete();
                }
            }, 150);
        });

        currentInts = applyMove(currentInts, move);
        setInts(currentInts);
        setActiveMove(null);
        await new Promise(r => setTimeout(r, 10));
    }

    setIsScrambling(false);
    setIsAnimating(false);
    setValidationResult(null);
  };

  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const autoSolveRef = useRef(false);

  const toggleAutoSolve = () => {
    if (autoSolveRef.current) {
      autoSolveRef.current = false;
      setIsAutoSolving(false);
    } else {
      autoSolveRef.current = true;
      setIsAutoSolving(true);
      if (!isAnimating) {
        handleSolveStep(ints);
      }
    }
  };

  const handleSolveStep = async (startingInts = ints) => {
    if (isAnimating) return;
    
    let chunk = nextChunkRef.current;
    if (!chunk) {
      setIsAnimating(true);
      setValidationResult({ valid: true, message: 'Calculating...' });
      try {
        const res = await calculateChunkAsync(startingInts, solverStateRef.current);
        chunk = res.chunk;
        solverStateRef.current = res.state;
      } catch (err) {
        console.error("Worker error:", err);
        setIsAnimating(false);
        return;
      }
    }

    nextChunkRef.current = null;

    if (chunk.moves.length === 0 || chunk.phase === 'Solved') {
      setValidationResult({ valid: true, message: 'Cube is completely solved!' });
      setIsAnimating(false);
      autoSolveRef.current = false;
      setIsAutoSolving(false);
      return;
    }

    setIsAnimating(true);
    setValidationResult({ valid: true, message: `Animating Phase: ${chunk.phase} (${chunk.moves.join(' ')})` });

    const flatMoves = flattenMoves(chunk.moves);

    setHistory(prev => [...prev, { ints: startingInts, solverState: { ...solverStateRef.current }, moves: flatMoves }]);

    let finalIntsForChunk = startingInts;
    for (const m of flatMoves) {
      finalIntsForChunk = applyMove(finalIntsForChunk, m);
    }

    calculateChunkAsync(finalIntsForChunk, solverStateRef.current)
      .then(res => {
        nextChunkRef.current = res.chunk;
        solverStateRef.current = res.state;
      })
      .catch(err => console.error("Worker pre-calc error:", err));

    const executeChunk = async () => {
      let currentInts = startingInts;

      for (let i = 0; i < flatMoves.length; i++) {
        const move = flatMoves[i];
        setIsCubeMoving(true);
        setActiveMove(move);

        await new Promise(resolve => {
          moveResolveRef.current = resolve;
          setTimeout(() => {
            if (moveResolveRef.current === resolve) {
              handleAnimationComplete();
            }
          }, 250);
        });

        currentInts = applyMove(currentInts, move);
        setInts(currentInts);
        setActiveMove(null);

        await new Promise(r => setTimeout(r, 20));
      }

      setIsAnimating(false);
      setValidationResult({ valid: true, message: `Completed Phase: ${chunk.phase}` });

      if (autoSolveRef.current) {
        setTimeout(() => {
          if (autoSolveRef.current) {
            handleSolveStep(currentInts);
          }
        }, 300);
      }
    };

    executeChunk();
  };

  const handleStickerClick = (stickerIdx, color) => {
    setInts((prev) => {
      const newInts = setSticker(prev, stickerIdx, color);
      handleValidate(newInts);
      return newInts;
    });
  };

  const getParity = (arr) => {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j]) inversions++;
      }
    }
    return inversions % 2;
  };

  const handleValidate = (currentInts) => {
    const state = getKociembaState(currentInts);

    if (state.cp.includes(-1) || state.ep.includes(-1)) {
      setValidationResult({ valid: false, message: 'Invalid State: Some pieces have invalid or duplicate colors that do not exist on a real Rubik\'s cube.' });
      return;
    }

    const uniqueCorners = new Set(state.cp).size;
    const uniqueEdges = new Set(state.ep).size;
    if (uniqueCorners !== 8) {
      setValidationResult({ valid: false, message: 'Invalid State: The cube must have exactly 8 unique corners. You have duplicate or missing corners.' });
      return;
    }
    if (uniqueEdges !== 12) {
      setValidationResult({ valid: false, message: 'Invalid State: The cube must have exactly 12 unique edges. You have duplicate or missing edges.' });
      return;
    }

    if (state.eo.includes(-1)) {
      setValidationResult({ valid: false, message: 'Invalid State: Some edges have invalid coloring for orientation.' });
      return;
    }
    const eoSum = state.eo.reduce((sum, val) => sum + val, 0);
    if (eoSum % 2 !== 0) {
      setValidationResult({ valid: false, message: 'Invalid State: Edge Orientation Parity Error. A single edge cannot be flipped on a solvable cube.' });
      return;
    }

    if (state.co.includes(-1)) {
      setValidationResult({ valid: false, message: 'Invalid State: Some corners have invalid coloring for orientation.' });
      return;
    }
    const coSum = state.co.reduce((sum, val) => sum + val, 0);
    if (coSum % 3 !== 0) {
      setValidationResult({ valid: false, message: 'Invalid State: Corner Orientation Parity Error. A single corner cannot be twisted on a solvable cube.' });
      return;
    }

    const cpParity = getParity(state.cp);
    const epParity = getParity(state.ep);
    if (cpParity !== epParity) {
      setValidationResult({ valid: false, message: 'Invalid State: Permutation Parity Error. You cannot swap exactly two corners without also swapping two edges.' });
      return;
    }

    setValidationResult({ valid: true, message: 'Valid State: The painted cube is mathematically solvable and can be reached from a solved cube!' });
  };

  const handleStickerClickWithHistoryClear = (stickerIdx, color) => {
    handleStickerClick(stickerIdx, color);
    setHistory([]);
    solverStateRef.current = { daisyDone: false };
    nextChunkRef.current = null;
  };

  const handleUndo = async () => {
    if (isAnimating || history.length === 0) return;
    
    if (autoSolveRef.current) {
        autoSolveRef.current = false;
        setIsAutoSolving(false);
    }
    
    setIsAnimating(true);
    setValidationResult({ valid: true, message: 'Undoing last step...' });

    const newHistory = [...history];
    const lastState = newHistory.pop();
    setHistory(newHistory);

    const inverseMoves = (lastState.moves || []).map(m => {
        if (m.endsWith('2')) return m;
        if (m.endsWith("'")) return m[0];
        return m + "'";
    }).reverse();

    let currentInts = ints;
    for (let i = 0; i < inverseMoves.length; i++) {
        const move = inverseMoves[i];
        setIsCubeMoving(true);
        setActiveMove(move);

        await new Promise(resolve => {
            moveResolveRef.current = resolve;
            setTimeout(() => {
                if (moveResolveRef.current === resolve) {
                    handleAnimationComplete();
                }
            }, 250);
        });

        currentInts = applyMove(currentInts, move);
        setInts(currentInts);
        setActiveMove(null);

        await new Promise(r => setTimeout(r, 20));
    }

    setInts(lastState.ints);
    solverStateRef.current = { ...lastState.solverState };
    nextChunkRef.current = null;
    
    setIsAnimating(false);
    setValidationResult({ valid: true, message: 'Undid last step.' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
      <div className="container" style={{ flex: 1 }}>
        <div style={{ width: '100%', paddingBottom: '1rem' }}>
          <div className="simulation-layout">

            <div className="glass-panel sim-main-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  {COLORS.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveColor(i)}
                      style={{
                        width: '32px', height: '32px', background: c, borderRadius: '50%', cursor: 'pointer',
                        border: activeColor === i ? '3px solid #000' : '1px solid #ccc',
                        boxShadow: activeColor === i ? '0 0 10px rgba(0,0,0,0.5)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', height: '400px', padding: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                <CSSCube
                  ints={ints}
                  activeColor={activeColor}
                  onStickerClick={handleStickerClickWithHistoryClear}
                  activeMove={activeMove}
                  onAnimationComplete={handleAnimationComplete}
                  animationSpeedMs={isScrambling ? 100 : 200}
                />
              </div>

              <div style={{ width: '100%', minHeight: '80px', marginTop: '1.5rem' }}>
                {validationResult && (
                  <div style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    background: validationResult.valid ? 'rgba(0, 200, 100, 0.1)' : 'rgba(255, 50, 50, 0.1)',
                    border: `1px solid ${validationResult.valid ? '#00c864' : '#ff3232'}`,
                    color: validationResult.valid ? '#008a45' : '#d00000',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    textAlign: 'center'
                  }}>
                    {validationResult.message}
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel sim-side-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>Controls</h3>

              <button className="btn btn-primary" onClick={handleScramble} disabled={isAnimating} style={{ width: '100%', opacity: isAnimating ? 0.5 : 1, cursor: isAnimating ? 'not-allowed' : 'pointer' }}>
                Scramble (WCA)
              </button>

              <button
                className="btn btn-outline"
                onClick={() => handleSolveStep(ints)}
                disabled={isAnimating || isAutoSolving}
                style={{ width: '100%', opacity: (isAnimating || isAutoSolving) ? 0.5 : 1, cursor: (isAnimating || isAutoSolving) ? 'not-allowed' : 'pointer' }}
              >
                {isAnimating && !isAutoSolving ? 'Animating...' : 'Solve Step-by-Step'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={toggleAutoSolve}
                style={{ width: '100%', cursor: 'pointer', background: isAutoSolving ? 'var(--danger-color)' : 'var(--secondary-color)' }}
              >
                {isAutoSolving ? 'Stop Auto Solve' : 'Auto Solve'}
              </button>

              <button
                className="btn btn-outline"
                onClick={handleUndo}
                disabled={isAnimating || history.length === 0}
                style={{ width: '100%', marginTop: '1rem', opacity: (isAnimating || history.length === 0) ? 0.5 : 1, cursor: (isAnimating || history.length === 0) ? 'not-allowed' : 'pointer' }}
              >
                Undo Last Step
              </button>

              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)', height: '120px', overflowY: 'auto' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Solver Status</h4>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, wordWrap: 'break-word' }}>
                  {validationResult ? validationResult.message : 'Click Solve to see the next calculated phase.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimulationsPortal;
