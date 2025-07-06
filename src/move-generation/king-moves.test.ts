import { beforeAll, describe, expect, test } from 'vitest';
import { ChessGame } from "../chessboard/chess-game";
import { PieceColor } from "../model/PieceColor.enum";
import { Square } from '../model/model';
import { MoveList } from '../move/move-list';
import { generateKingMoves } from './king-moves';

let chessGame!: ChessGame;

beforeAll(() => {
    chessGame = new ChessGame();
});

describe("Test King Moves", () => {
    test('king moves', () => {
        // chessGame.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"); // Expect undefined
        chessGame.loadFen("rnbq1bnr/pppppppp/1k6/8/8/6K1/PPPPPPPP/RNBQ1BNR w HAha - 0 1");

        const moveList = new MoveList();
        generateKingMoves(
            Square.g3,
            PieceColor.WHITE,
            chessGame.boardState,
            chessGame.boardEvaluator,
            moveList
        );
        const expectedLegalMoves = ['h3', 'h4', 'f3', 'f4', 'g4'];
        const decodedLegalMoves = moveList.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(expectedLegalMoves.length);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });

    test('king moves', () => {
        chessGame.loadFen("rn2kb1r/ppp1pppp/5n2/qb6/8/2N2N1B/PPPP1PPP/R1BQK2R w KQkq - 6 6");

        const moveList = new MoveList();
        generateKingMoves(
            Square.e1,
            PieceColor.WHITE,
            chessGame.boardState,
            chessGame.boardEvaluator,
            moveList
        );
        const expectedLegalMoves = ['f1', 'e2'];
        const decodedLegalMoves = moveList.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(expectedLegalMoves.length);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });

    test('castling moves', () => {
        chessGame.loadFen("rn2kb1r/ppp1pppp/5n2/q7/6b1/2N2N2/PPPPBPPP/R1BQK2R w KQkq - 6 6");

        const moveList = new MoveList();
        generateKingMoves(
            Square.e1,
            PieceColor.WHITE,
            chessGame.boardState,
            chessGame.boardEvaluator,
            moveList
        );
        const expectedLegalMoves = ['f1', 'g1'];
        const decodedLegalMoves = moveList.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(expectedLegalMoves.length);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });


});

