import { describe, expect, test } from 'vitest';
import { ChessBoard, Squares } from './chessboard';

describe.todo("Test Chessboard functions", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '5r1k/rp5p/p2p1p2/4pB1Q/4P3/P2nP1qP/1P6/5R1K b - - 1 24', expectedMoveNumber: 24 },
        { fen: '1rbk1b1r/1p2q1pp/p1n1pn2/3p2N1/3P2B1/2N5/PPP2PPP/R1BQ1RK1 b - - 5 14', expectedMoveNumber: 14 },
    ];

    testCases.forEach(({ fen, expectedMoveNumber }) => {
        test(`getMoveNumber(${fen}) should return ${expectedMoveNumber}`, () => {
            chessboard.parseFen(fen);
            expect(chessboard.getFullMoveNumber()).toEqual(expectedMoveNumber);
        });
    });
});

describe("Test getSquare", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '8/8/8/2p1pR2/3rk1P1/2K5/8/8 w - - 6 67', square: Squares.e4, expectedOutput: { piece: 'k', color: 'b' } },
        { fen: '8/pN1b2Q1/8/5P2/2k2K2/6P1/8/7r w - - 0 1', square: Squares.g3, expectedOutput: { piece: 'P', color: 'w' } },
        { fen: '8/pN1b2Q1/8/5P2/2k2K2/6P1/8/7r w - - 0 1', square: Squares.a6, expectedOutput: { piece: 'e', color: 'b' } },
        { fen: '6R1/p3r1k1/P1q2bp1/8/5P1P/6P1/Q6K/8 b - - 2 58', square: Squares.a2, expectedOutput: { piece: 'Q', color: 'w' } },
    ];

    testCases.forEach(({ fen, square, expectedOutput }) => {
        test(`getSquare(${fen}) should return ${expectedOutput}`, () => {
            chessboard.parseFen(fen);
            expect(chessboard.getSquare(square)).toEqual(expectedOutput);
        });
    });
});

describe("Test isCheckmate", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '6k1/R4p1p/8/6N1/3q4/8/2n1P3/4KB2 w - - 0 1', expectedCheckmate: true },
        { fen: '8/5r2/4K1q1/4p3/3k4/8/8/8 w - - 0 7', expectedCheckmate: true },
        { fen: 'r1b1r1k1/ppp2ppp/1b1p4/3BP3/5P2/2P2N2/P4qP1/RNBQRK2 w - - 4 18', expectedCheckmate: true },
        { fen: 'r6r/ppp2R1p/5kbR/4p1p1/2Bn4/2B5/PPP2PP1/2K5 b - - 7 19', expectedCheckmate: true },
        { fen: '8/1p6/2p2B2/5R2/3k3p/1r1rNK2/6P1/8 b - - 2 38', expectedCheckmate: true },
        { fen: 'r5k1/pb3R2/1p5p/4P1n1/1P1p4/2NQ2P1/P1B3qP/R5K1 w - - 1 26', expectedCheckmate: true },

        { fen: '5r1k/rp5p/p2p1p2/4pB1Q/4P3/P2nP1qP/1P6/5R1K b - - 1 24', expectedCheckmate: false },
        { fen: 'R5k1/1r3ppp/8/1p6/1P6/1K6/8/8 b - - 0 1', expectedCheckmate: false },
    ];

    testCases.forEach(({ fen, expectedCheckmate }) => {
        test(`isCheckmate(${fen}) should return ${expectedCheckmate}`, () => {
            chessboard.parseFen(fen);
            expect(chessboard.isCheckmate()).toBe(expectedCheckmate);
        });
    });
});