import { describe, expect, test } from 'vitest';
import { getSquareColor } from './utility';
import { Square } from '../model/model';
import { PieceColor } from '../model/PieceColor.enum';

describe("Test utility functions", () => {
    const testCases = [
        { square: Square.a1, expectedColor: PieceColor.BLACK },
        { square: Square.a2, expectedColor: PieceColor.WHITE },
        { square: Square.a3, expectedColor: PieceColor.BLACK },
        { square: Square.a4, expectedColor: PieceColor.WHITE },
        { square: Square.a5, expectedColor: PieceColor.BLACK },
        { square: Square.a6, expectedColor: PieceColor.WHITE },
        { square: Square.a7, expectedColor: PieceColor.BLACK },
        { square: Square.a8, expectedColor: PieceColor.WHITE },

        { square: Square.h1, expectedColor: PieceColor.WHITE },
        { square: Square.h2, expectedColor: PieceColor.BLACK },
        { square: Square.h3, expectedColor: PieceColor.WHITE },
        { square: Square.h4, expectedColor: PieceColor.BLACK },
        { square: Square.h5, expectedColor: PieceColor.WHITE },
        { square: Square.h6, expectedColor: PieceColor.BLACK },
        { square: Square.h7, expectedColor: PieceColor.WHITE },
        { square: Square.h8, expectedColor: PieceColor.BLACK },
    ];

    testCases.forEach(({ square, expectedColor }) => {
        test(`getSquareColor(${square}) should return ${expectedColor}`, () => {
            expect(getSquareColor(square)).toEqual(expectedColor);
        });
    });
});

