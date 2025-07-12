import { describe, expect, test } from 'vitest';
import { ChessBoard, SQUARE_TO_COORDS, Square } from './chessboard';
import { PieceColor } from './enum/PieceColor';
import { PieceType } from './piece/piece';

describe.todo("Test getFullMoveNumber", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '5r1k/rp5p/p2p1p2/4pB1Q/4P3/P2nP1qP/1P6/5R1K b - - 1 24', expectedMoveNumber: 24 },
        { fen: '1rbk1b1r/1p2q1pp/p1n1pn2/3p2N1/3P2B1/2N5/PPP2PPP/R1BQ1RK1 b - - 5 14', expectedMoveNumber: 14 },
    ];

    testCases.forEach(({ fen, expectedMoveNumber }) => {
        test(`getMoveNumber(${fen}) should return ${expectedMoveNumber}`, () => {
            chessboard.loadFen(fen);
            expect(chessboard.getFullMoveNumber()).toEqual(expectedMoveNumber);
        });
    });
});

describe("Test removePiece", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: 'r3r1k1/p2qppbp/1n4p1/3b4/1QpP3B/4PN2/P3BPPP/1RR3K1 b - - 8 17', square: Square.h4, expectedPiece: { piece: 'B', color: 'w' } },
        { fen: '4r1k1/b2N4/p1p1r2p/2Pp4/P4P2/2P3P1/7P/1R3R1K b - - 3 32', square: Square.b1, expectedPiece: { piece: 'R', color: 'w' } },
        { fen: '4r1k1/b2N4/p1p1r2p/2Pp4/P4P2/2P3P1/7P/1R3R1K b - - 3 32', square: Square.h7, expectedPiece: null },
    ];

    testCases.forEach(({ fen, square, expectedPiece }) => {
        test(`removePiece at square ${SQUARE_TO_COORDS[square]}`, () => {
            chessboard.loadFen(fen);
            expect(chessboard.removePiece(square)).toEqual(expectedPiece);
        });
    });
});

describe.only("Test getPieceSquares", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '8/8/1k6/3n4/7P/5PP1/6K1/8 w HAha - 0 1', piece: PieceType.WHITE_PAWN, expectedOutput: ["h4", "f3", "g3"] },
        { fen: '8/8/1k6/3n4/7P/5PP1/6K1/8 w HAha - 0 1', piece: PieceType.BLACK_KNIGHT, expectedOutput: ["d5"] },
        
        { fen: '8/8/1b6/3p2k1/2pP4/2P4b/4R2p/5K2 w - - 0 1', piece: PieceType.BLACK_PAWN, expectedOutput: ["d5", "c4", "h2"] },
        { fen: '8/8/1b6/3p2k1/2pP4/2P4b/4R2p/5K2 w - - 0 1', piece: PieceType.BLACK_BISHOP, expectedOutput: ["h3", "b6"] },
    ];

    testCases.forEach(({ fen, piece, expectedOutput }) => {
        test(`getPieceSquares(${fen}) should return ${expectedOutput}`, () => {
            chessboard.loadFen(fen);
            expect(chessboard.getPieceSquares(piece)).toEqual(expect.arrayContaining(expectedOutput));
        });
    });
});

describe("Test getSquare", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '8/8/8/2p1pR2/3rk1P1/2K5/8/8 w - - 6 67', square: Square.e4, expectedOutput: { piece: 'k', color: 'w' } },
        { fen: '8/pN1b2Q1/8/5P2/2k2K2/6P1/8/7r w - - 0 1', square: Square.g3, expectedOutput: { piece: 'P', color: 'b' } },
        { fen: '8/pN1b2Q1/8/5P2/2k2K2/6P1/8/7r w - - 0 1', square: Square.a6, expectedOutput: { piece: 'e', color: 'w' } },
        { fen: '6R1/p3r1k1/P1q2bp1/8/5P1P/6P1/Q6K/8 b - - 2 58', square: Square.c6, expectedOutput: { piece: 'q', color: 'w' } },
    ];

    testCases.forEach(({ fen, square, expectedOutput }) => {
        test(`getSquare(${fen}) should return ${expectedOutput}`, () => {
            chessboard.loadFen(fen);
            expect(chessboard.getSquare(square)).toEqual(expectedOutput);
        });
    });
});

describe("Test getMaterialAdvantage", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        {
            fen: '8/8/8/2p1pR2/3rk1P1/2K5/8/8 w - - 6 67',
            expectedScore: { w: -1, b: 1 }
        },
        {
            fen: '1k6/R5R1/2p5/2Ppp3/7p/NP2P1nP/5KP1/r7 w - - 3 34',
            expectedScore: { w: 6, b: -6 }
        },
        {
            fen: '2nq3r/3r1pk1/1p2p1p1/p1b1PP2/P1Pp2P1/1P1R2Q1/1B4B1/5RK1 w - - 1 34',
            expectedScore: { w: 0, b: 0 }
        },

    ];

    testCases.forEach(({ fen, expectedScore }) => {
        test(`getScore(${fen}) should return ${expectedScore}`, () => {
            chessboard.loadFen(fen);
            expect(chessboard.getMaterialAdvantage()).toEqual(expectedScore);
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
            chessboard.loadFen(fen);
            expect(chessboard.getBoardPieces()).toEqual(expectedPieces);
        });
    });
});

describe.todo("Test isLegalMove", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        {
            fen: 'r1bk3r/pp3ppp/2n2n2/2bp4/8/2N2N2/PP2PPPP/R2QKB1R w KQ - 0 9',
            move: { fromSquare: Square.a7, toSquare: Square.a6 },
            expectedOutput: false
        },
    ];

    testCases.forEach(({ fen, move, expectedOutput }) => {
        test(`isLegalMove(${move.fromSquare} -> ${move.toSquare}) should return ${expectedOutput}`, () => {
            chessboard.loadFen(fen);
            expect(chessboard.isLegalMove(move)).toBe(expectedOutput);
        });
    });
});

describe.todo("Test filterPseudoLegalMoves", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        {
            fen: '4Q1k1/q5p1/7p/4n3/3p3n/4B1NP/5PPK/8 b - - 0 40',
            expectedOutput: new Map([
                [Square.g8, [Square.h7]]
            ])
        },
        {
            fen: '8/4P3/5kPK/5n2/8/8/8/8 w - - 3 72',
            expectedOutput: new Map([
                [Square.h6, [Square.h5, Square.h7]]
            ])
        },
        {
            fen: '7K/4Pn2/5kP1/8/8/8/8/8 w - - 3 72',
            expectedOutput: new Map([
                [Square.h8, [Square.h7, Square.g8]],
                [Square.g6, [Square.f7]]
            ])
        },
    ];

    testCases.forEach(({ fen, expectedOutput }) => {
        test(`filterPseudoLegalMoves should return ${expectedOutput}`, () => {
            chessboard.loadFen(fen);
            expect(chessboard.filterPseudoLegalMoves()).toEqual(expectedOutput);
        });
    });
});

describe("Test isSquareAttacked", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        {
            fen: 'r1bk3r/pp3ppp/2n2n2/2bp4/8/2N2N2/PP2PPPP/R2QKB1R w KQ - 0 9',
            square: Square.d5,
            attackedFromColor: PieceColor.WHITE,
            expectedOutput: true
        },
        {
            fen: 'r1bk3r/pp3ppp/2n2n2/2bN4/8/5N2/PP2PPPP/R2QKB1R b KQ - 0 9',
            square: Square.f2,
            attackedFromColor: PieceColor.BLACK,
            expectedOutput: true
        },
        {
            fen: 'rn1q1rk1/4ppbp/B2p1np1/2pP4/P3P3/2N2N2/1P3PPP/R1BQK2R b KQ - 0 11',
            square: Square.a6,
            attackedFromColor: PieceColor.BLACK,
            expectedOutput: true
        },
        {
            fen: 'rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq - 0 4',
            square: Square.b5,
            attackedFromColor: PieceColor.WHITE,
            expectedOutput: true
        },
        {
            fen: 'rnbqkb1r/pp1pppp1/5n1p/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq c6 0 3', // Enpassant
            square: Square.c6,
            attackedFromColor: PieceColor.WHITE,
            expectedOutput: true
        },
        {
            fen: '5r1k/rp5p/p2p1p2/4pB1Q/4P3/P2nP1qP/1P6/5R1K b - - 1 24', // Enpassant
            square: Square.f2,
            attackedFromColor: PieceColor.BLACK,
            expectedOutput: true
        },

        {
            fen: 'rn1q1rk1/4ppbp/B2p1np1/2pP4/P3P3/2N2N2/1P3PPP/R1BQK2R b KQ - 0 11',
            square: Square.c4,
            attackedFromColor: PieceColor.BLACK,
            expectedOutput: false
        },
        {
            fen: '5r1k/rp5p/p2p1p2/4pB1Q/4P3/P2nP1qP/1P6/5R1K w - - 1 24',
            square: Square.g7,
            attackedFromColor: PieceColor.WHITE,
            expectedOutput: false
        },
    ];

    testCases.forEach(({ fen, square, attackedFromColor, expectedOutput }) => {
        test(`isSquareAttacked(${square}) should return ${expectedOutput}`, () => {
            chessboard.loadFen(fen);
            expect(ChessBoard.isSquareAttacked(square, attackedFromColor)).toBe(expectedOutput);
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
            chessboard.loadFen(fen);
            expect(chessboard.isInCheck(side)).toBe(expectedOutput);
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
            chessboard.loadFen(fen);
            expect(chessboard.isCheckmate()).toBe(expectedCheckmate);
        });
    });
});

describe("Test isInsufficientMaterial", () => {
    const chessboard = new ChessBoard();
    const testCases = [
        { fen: '8/4k3/8/6K1/8/8/8/8 w - - 0 1', expectedOutput: true }, // K vs K
        { fen: '1k6/2n5/2K5/8/8/8/8/8 w - - 0 1', expectedOutput: true }, // K & N vs K
        { fen: '8/8/8/8/8/5BK1/8/7k b - - 0 1', expectedOutput: true }, // K & B vs K
        { fen: '4B3/4K3/8/4k3/2b5/8/8/8 w - - 0 1', expectedOutput: true }, // K & B vs K & B (Same colors)

        { fen: '8/8/8/8/8/3N2K1/8/6nk w - - 0 1', expectedOutput: false }, // K & N vs K & N
        { fen: '3B4/4K3/8/4k3/2b5/8/8/8 w - - 0 1', expectedOutput: false }, // K & B vs K & B (Different colors)
    ];

    testCases.forEach(({ fen, expectedOutput }) => {
        test(`isInsufficientMaterial(${fen}) should return ${expectedOutput}`, () => {
            chessboard.loadFen(fen);
            expect(chessboard.isInsufficientMaterial()).toBe(expectedOutput);
        });
    });
});
