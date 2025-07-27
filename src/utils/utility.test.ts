import { describe, expect, test } from 'vitest';
import { getSquareColor, squareToString } from './utility';
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

describe("Test squareToString", () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']; // Correct order from 8 to 1
    
    const testCases = [];
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const squareIndex = rank * 16 + file; // 0x88 board representation
            const expected = `${files[file]}${ranks[rank]}`;
            testCases.push({ square: squareIndex, expected });
        }
    }

    test.each(testCases)(
        'squareToString($square) should return "$expected"',
        ({ square, expected }) => {
            expect(squareToString(square)).toEqual(expected);
        }
    );

    test('squareToString(Square.no_sq) should return no_sq', () => {
        expect(squareToString(Square.no_sq)).toEqual('no_sq');
    });
});
