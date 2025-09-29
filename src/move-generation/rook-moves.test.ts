import { beforeAll, describe, expect, test } from 'vitest';
import { ChessGame } from "../chessboard/chess-game";
import { PieceColor } from "../model/PieceColor.enum";
import { Square } from '../model/model';
import { MoveList } from '../move/move-list';
import { generateRookMoves } from './rook-moves';

describe("Rook Moves", () => {
    let chessGame: ChessGame;

    beforeAll(() => {
        chessGame = new ChessGame();
    });

    interface RookTestCase {
        name: string;
        fen: string;
        square: Square;
        color: PieceColor;
        expectedMoves: string[] | null;
    }

    const testCases: RookTestCase[] = [
        {
            name: "white rook on h1",
            fen: "rnbqkb1r/ppppppp1/4n2p/7P/7N/4P3/PPPP1PP1/RNBQKB1R w KQkq - 0 1",
            square: Square.h1,
            color: PieceColor.WHITE,
            expectedMoves: ['g1', 'h2', 'h3']
        },
        {
            name: "white rook on b7",
            fen: "R5k1/1r3ppp/8/1p6/1P6/1K6/8/8 b - - 0 1",
            square: Square.b7,
            color: PieceColor.BLACK,
            expectedMoves: ['a7', 'b6', 'b8', 'c7', 'd7', 'e7']
        },
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

    const generateAndTestMoves = (testCase: RookTestCase) => {
        chessGame.loadFen(testCase.fen);
        const moveList = new MoveList();

        generateRookMoves(
            testCase.square,
            testCase.color,
            chessGame.boardState,
            moveList,
        );

        const decodedLegalMoves = moveList.decodeLegalMoves();
        assertMoves(decodedLegalMoves, testCase.expectedMoves);
    };

    testCases.forEach(testCase => {
        test(testCase.name, () => {
            generateAndTestMoves(testCase);
        });
    });
});
