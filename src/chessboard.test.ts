import { describe, expect, test } from 'vitest';
import { ChessBoard, SQUARE_TO_COORDS, Squares } from './chessboard';
import { PieceColor } from './enum/PieceColor';

describe.todo("Test getFullMoveNumber", () => {
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

describe("Test isInCheck", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '8/8/7Q/8/3qp2p/4k2P/6P1/6K1 b - - 1 63', side: PieceColor.BLACK, expectedOutput: true },
        { fen: '8/8/7p/6k1/2n1P3/6KN/6P1/8 b - - 5 55', side: PieceColor.BLACK, expectedOutput: true },
        { fen: '4Q1k1/q5p1/7p/4n3/3p3n/4B1NP/5PPK/8 b - - 0 40', side: PieceColor.BLACK, expectedOutput: true },

        { fen: '8/8/7p/4n1k1/4PN2/5K2/6P1/8 w - - 2 54', side: PieceColor.WHITE, expectedOutput: true },
        { fen: '8/1b3k2/1P3p2/P3p3/2Np4/3P2P1/6K1/2B5 w - - 0 1', side: PieceColor.WHITE, expectedOutput: true },

        { fen: '8/4P3/5kPK/5n2/8/8/8/8 w - - 3 72', side: PieceColor.BLACK, expectedOutput: false },
    ];

    testCases.forEach(({ fen, side, expectedOutput }) => {
        test(`isInCheck(${side}) should return ${expectedOutput}`, () => {
            chessboard.parseFen(fen);
            expect(chessboard.isInCheck(side)).toBe(expectedOutput);
        });
    });
});

describe("Test removePiece", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: 'r3r1k1/p2qppbp/1n4p1/3b4/1QpP3B/4PN2/P3BPPP/1RR3K1 b - - 8 17', square: Squares.h4, expectedPiece: { piece: 'B', color: 'w' } },
        { fen: '4r1k1/b2N4/p1p1r2p/2Pp4/P4P2/2P3P1/7P/1R3R1K b - - 3 32', square: Squares.b1, expectedPiece: { piece: 'R', color: 'w' } },
        { fen: '4r1k1/b2N4/p1p1r2p/2Pp4/P4P2/2P3P1/7P/1R3R1K b - - 3 32', square: Squares.h7, expectedPiece: null },
    ];

    testCases.forEach(({ fen, square, expectedPiece }) => {
        test(`removePiece at square ${SQUARE_TO_COORDS[square]}`, () => {
            chessboard.parseFen(fen);
            expect(chessboard.removePiece(square)).toEqual(expectedPiece);
        });
    });
});

describe("Test getSquare", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '8/8/8/2p1pR2/3rk1P1/2K5/8/8 w - - 6 67', square: Squares.e4, expectedOutput: { piece: 'k', color: 'w' } },
        { fen: '8/pN1b2Q1/8/5P2/2k2K2/6P1/8/7r w - - 0 1', square: Squares.g3, expectedOutput: { piece: 'P', color: 'b' } },
        { fen: '8/pN1b2Q1/8/5P2/2k2K2/6P1/8/7r w - - 0 1', square: Squares.a6, expectedOutput: { piece: 'e', color: 'w' } },
        { fen: '6R1/p3r1k1/P1q2bp1/8/5P1P/6P1/Q6K/8 b - - 2 58', square: Squares.c6, expectedOutput: { piece: 'q', color: 'w' } },
    ];

    testCases.forEach(({ fen, square, expectedOutput }) => {
        test(`getSquare(${fen}) should return ${expectedOutput}`, () => {
            chessboard.parseFen(fen);
            expect(chessboard.getSquare(square)).toEqual(expectedOutput);
        });
    });
});

describe("Test getBoardPieces", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        {
            fen: '8/8/8/2p1pR2/3rk1P1/2K5/8/8 w - - 6 67',
            expectedPieces: [
                {
                    "color": "b",
                    "piece": "p",
                    "square": "c5",
                },
                {
                    "color": "b",
                    "piece": "p",
                    "square": "e5",
                },
                {
                    "color": "w",
                    "piece": "R",
                    "square": "f5",
                },
                {
                    "color": "b",
                    "piece": "r",
                    "square": "d4",
                },
                {
                    "color": "b",
                    "piece": "k",
                    "square": "e4",
                },
                {
                    "color": "w",
                    "piece": "P",
                    "square": "g4",
                },
                {
                    "color": "w",
                    "piece": "K",
                    "square": "c3",
                },
            ]
        },
        {
            fen: '8/p7/P4bPk/5P2/5K2/8/8/8 b - - 36 116',
            expectedPieces: [
                {
                    "color": "b",
                    "piece": "p",
                    "square": "a7",
                },
                {
                    "color": "w",
                    "piece": "P",
                    "square": "a6",
                },
                {
                    "color": "b",
                    "piece": "b",
                    "square": "f6",
                },
                {
                    "color": "w",
                    "piece": "P",
                    "square": "g6",
                },
                {
                    "color": "b",
                    "piece": "k",
                    "square": "h6",
                },
                {
                    "color": "w",
                    "piece": "P",
                    "square": "f5",
                },
                {
                    "color": "w",
                    "piece": "K",
                    "square": "f4",
                },
            ]
        }
    ];

    testCases.forEach(({ fen, expectedPieces }) => {
        test(`getSquare(${fen}) should return ${expectedPieces}`, () => {
            chessboard.parseFen(fen);
            expect(chessboard.getBoardPieces()).toEqual(expectedPieces);
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