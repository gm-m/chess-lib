import { beforeAll, describe, expect, test } from 'vitest';
import { ChessGame } from "../chessboard/chess-game";
import { PieceColor } from "../model/PieceColor.enum";
import { Square } from '../model/model';
import { MoveList } from '../move/move-list';
import { generatePawnMoves } from './pawn-moves';

describe("Pawn Moves", () => {
    let chessGame: ChessGame;

    beforeAll(() => {
        chessGame = new ChessGame();
    });

    interface PawnTestCase {
        name: string;
        fen: string;
        square: Square;
        color: PieceColor;
        expectedMoves: string[] | null;
    }

    const testCases: PawnTestCase[] = [
        {
            name: "white pawn on h2 with standard initial position",
            fen: "rnbq1bnr/pppppppp/1k6/8/8/6K1/PPPPPPPP/RNBQ1BNR w HAha - 0 1",
            square: Square.h2,
            color: PieceColor.WHITE,
            expectedMoves: ['h3', 'h4']
        },
        {
            name: "white pawn on a2 with standard initial position",
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            square: Square.a2,
            color: PieceColor.WHITE,
            expectedMoves: ['a3', 'a4']
        },
        {
            name: "white pawn on e4 blocked by black pawn",
            fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            square: Square.e4,
            color: PieceColor.WHITE,
            expectedMoves: null
        },
        {
            name: "white pawn on b4 can capture and advance",
            fen: "r1b2rk1/p1pnnpbp/1p2pqp1/2p5/1P6/P1N2NP1/2PPQPBP/R1B2RK1 w Qq - 0 1",
            square: Square.b4,
            color: PieceColor.WHITE,
            expectedMoves: ['b5', 'c5']
        },
        {
            name: "black pawn on a7 with standard initial position",
            fen: "r1b2rk1/p1pnnpbp/1p2pqp1/2p5/1P6/P1N2NP1/2PPQPBP/R1B2RK1 b Qq - 0 1",
            square: Square.a7,
            color: PieceColor.BLACK,
            expectedMoves: ['a5', 'a6']
        },
        {
            name: "black pawn on d6 when king is in check",
            fen: "rn1qk2r/ppp2pbp/3p1np1/1B2p3/4P1b1/2NP1N2/PPPB1PPP/R2Q1RK1 b Qkq - 0 1",
            square: Square.d6,
            color: PieceColor.BLACK,
            expectedMoves: null
        }
    ];

    const assertMoves = (actualMoves: (string | undefined)[] | undefined, expectedMoves: string[] | null) => {
        if (expectedMoves === null) {
            expect(actualMoves).toBe(undefined);
        } else {
            expect(actualMoves).toBeDefined();
            expect(actualMoves).toHaveLength(expectedMoves.length);
            expectedMoves.forEach(expectedMove => {
                expect(actualMoves).toContain(expectedMove);
            });
        }
    };

    const generateAndTestMoves = (testCase: PawnTestCase) => {
        chessGame.loadFen(testCase.fen);
        const moveList = new MoveList();

        generatePawnMoves(
            moveList,
            chessGame.boardState,
            testCase.color,
            testCase.square,
            chessGame.enpassant
        );

        const decodedLegalMoves = moveList.decodeLegalMoves();
        assertMoves(decodedLegalMoves, testCase.expectedMoves);
    };

    testCases.forEach(testCase => {
        test(testCase.name, () => {
            generateAndTestMoves(testCase);
        });
    });

    // Additional edge case tests
    describe("Edge Cases", () => {
        test("pawn promotion scenarios", () => {
            // TODO
        });
    });
});