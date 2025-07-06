import { beforeAll, describe, expect, test } from 'vitest';
import { ChessGame } from "../chessboard/chess-game";
import { PieceColor } from "../model/PieceColor.enum";
import { Square } from '../model/model';
import { MoveList } from '../move/move-list';
import { generateBishopMoves } from './bishop-moves';

let chessGame!: ChessGame;

beforeAll(() => {
    chessGame = new ChessGame();
});

describe("Test Bishop Moves", () => {
    test('bishop moves', () => {
        chessGame.loadFen("rnbq1bnr/pppppppp/1k6/8/8/4P1K1/PPPP1PPP/RNBQ1BNR w - - 0 1");

        const moveList = new MoveList();
        generateBishopMoves(
            Square.f1,
            PieceColor.WHITE,
            chessGame.boardState,
            moveList
        );
        const expectedLegalMoves = ['e2', 'd3', 'c4', 'b5', 'a6'];
        const decodedLegalMoves = moveList.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(expectedLegalMoves.length);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });
});

