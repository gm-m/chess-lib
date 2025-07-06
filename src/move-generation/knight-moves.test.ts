import { beforeAll, describe, expect, test } from 'vitest';
import { ChessGame } from "../chessboard/chess-game";
import { PieceColor } from "../model/PieceColor.enum";
import { Square } from '../model/model';
import { MoveList } from '../move/move-list';
import { generateKnightMoves } from './knight-moves';

let chessGame!: ChessGame;

beforeAll(() => {
    chessGame = new ChessGame();
});

describe("Test Knight Moves", () => {
    test('knight moves', () => {
        chessGame.loadFen("rnbq1bnr/pppppppp/1k6/8/8/6K1/PPPPPPPP/RNBQ1BNR w HAha - 0 1");

        const moveList = new MoveList();
        generateKnightMoves(
            Square.g1,
            PieceColor.WHITE,
            chessGame.boardState,
            moveList
        );
        const expectedLegalMoves = ['h3', 'f3'];
        const decodedLegalMoves = moveList.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(expectedLegalMoves.length);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });
});

