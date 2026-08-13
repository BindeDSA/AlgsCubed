import { getNextSolverChunk } from './solver.js';

self.onmessage = (e) => {
    const { ints, state, reqId } = e.data;
    
    try {
        const chunk = getNextSolverChunk(ints, state);
        self.postMessage({ reqId, chunk, state, success: true });
    } catch (error) {
        self.postMessage({ reqId, error: error.message, success: false });
    }
};
