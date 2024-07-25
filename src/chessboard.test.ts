import { describe, expect, test } from 'vitest';
import { ChessBoard } from './chessboard';

describe.skip("Test Chessboard functions", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '5r1k/rp5p/p2p1p2/4pB1Q/4P3/P2nP1qP/1P6/5R1K b - - 1 24', expectedMoveNumber: 24 },
        { fen: '1rbk1b1r/1p2q1pp/p1n1pn2/3p2N1/3P2B1/2N5/PPP2PPP/R1BQ1RK1 b - - 5 14', expectedMoveNumber: 14 },
    ];

    testCases.forEach(({ fen, expectedMoveNumber }) => {
        test(`getMoveNumber(${fen}) should return ${expectedMoveNumber}`, () => {
            chessboard.parseFen(fen);
            expect(chessboard.getMoveNumber()).toEqual(expectedMoveNumber);
        });
    });
});

