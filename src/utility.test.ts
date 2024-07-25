import { describe, expect, test } from 'vitest';
import { Squares } from './chessboard';
import { getSquareColor } from './utility';
import { PieceColor } from './enum/PieceColor';

describe("Test utility functions", () => {
    const testCases = [
        { square: Squares.a1, expectedColor: PieceColor.BLACK },
        { square: Squares.a2, expectedColor: PieceColor.WHITE },
        { square: Squares.a3, expectedColor: PieceColor.BLACK },
        { square: Squares.a4, expectedColor: PieceColor.WHITE },
        { square: Squares.a5, expectedColor: PieceColor.BLACK },
        { square: Squares.a6, expectedColor: PieceColor.WHITE },
        { square: Squares.a7, expectedColor: PieceColor.BLACK },
        { square: Squares.a8, expectedColor: PieceColor.WHITE },

        { square: Squares.h1, expectedColor: PieceColor.WHITE },
        { square: Squares.h2, expectedColor: PieceColor.BLACK },
        { square: Squares.h3, expectedColor: PieceColor.WHITE },
        { square: Squares.h4, expectedColor: PieceColor.BLACK },
        { square: Squares.h5, expectedColor: PieceColor.WHITE },
        { square: Squares.h6, expectedColor: PieceColor.BLACK },
        { square: Squares.h7, expectedColor: PieceColor.WHITE },
        { square: Squares.h8, expectedColor: PieceColor.BLACK },
    ];

    testCases.forEach(({ square, expectedColor }) => {
        test(`getSquareColor(${square}) should return ${expectedColor}`, () => {
            expect(getSquareColor(square)).toEqual(expectedColor);
        });
    });
});

