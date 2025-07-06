import { beforeAll, describe, expect, test } from 'vitest';
import { ChessGame } from "../chessboard/chess-game";
import { PieceColor } from "../model/PieceColor.enum";
import { Square } from '../model/model';
import { MoveList } from '../move/move-list';
import { generateRookMoves } from './rook-moves';
import { generateBishopMoves } from './bishop-moves';

let chessGame!: ChessGame;

beforeAll(() => {
    chessGame = new ChessGame();
});

describe("Test queen Moves", () => {
    test('queen moves', () => {
        chessGame.loadFen("r4rk1/pbpnnpbp/1p2p1p1/2p5/1P3Q2/P1N1P1P1/1BPP3P/1R3RK1 w q - 0 1");

        const moveList = new MoveList();
        generateRookMoves(
            Square.f4,
            PieceColor.WHITE,
            chessGame.boardState,
            moveList
        );
        generateBishopMoves(
            Square.f4,
            PieceColor.WHITE,
            chessGame.boardState,
            moveList
        );
        const expectedLegalMoves = ['c4', 'c7', 'd4', 'd6', 'e4', 'e5', 'f2', 'f3', 'f5', 'f6', 'f7', 'g4', 'g5', 'h4', 'h6'];
        const decodedLegalMoves = moveList.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(expectedLegalMoves.length);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });
});

