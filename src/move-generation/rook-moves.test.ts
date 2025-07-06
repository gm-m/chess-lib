import { beforeAll, describe, expect, test } from 'vitest';
import { ChessGame } from "../chessboard/chess-game";
import { PieceColor } from "../model/PieceColor.enum";
import { Square } from '../model/model';
import { MoveList } from '../move/move-list';
import { generateRookMoves } from './rook-moves';

let chessGame!: ChessGame;

beforeAll(() => {
    chessGame = new ChessGame();
});

describe("Test rook Moves", () => {
    test('rook moves', () => {
        chessGame.loadFen("rnbqkb1r/ppppppp1/4n2p/7P/7N/4P3/PPPP1PP1/RNBQKB1R w KQkq - 0 1");

        const moveList = new MoveList();
        generateRookMoves(
            Square.h1,
            PieceColor.WHITE,
            chessGame.boardState,
            moveList
        );
        const expectedLegalMoves = ['g1', 'h2', 'h3'];
        const decodedLegalMoves = moveList.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(expectedLegalMoves.length);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });
});

