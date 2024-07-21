import { beforeAll, describe, expect, onTestFinished, test } from 'vitest';
import { ChessBoard, Squares } from "./chessboard";
import { PieceColor } from "./enum/PieceColor";
import Pawn from "./piece/pawn";

let chessBoard!: ChessBoard;

beforeAll(() => {
    chessBoard = new ChessBoard();
});

function getLegalMoves(pieceType: any, square: Squares, color: PieceColor) {
    const legalMoves = pieceType.getLegalMoves(square, color);

    onTestFinished(() => {
        ChessBoard.legalMoves.resetMap();
    });

    return legalMoves;
}

function expectLegalMovesToBe(moveList: string[] | undefined) {
    expect(ChessBoard.legalMoves.decodeLegalMoves()).toEqual(moveList);
}

describe("Test Pawn Moves", () => {
    test('white pawn moves', () => {
        chessBoard.parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

        getLegalMoves(Pawn, Squares.a2, PieceColor.WHITE);
        expectLegalMovesToBe(['a3', 'a4']);
    });

    test('white pawn moves', () => {
        chessBoard.parseFen("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");

        getLegalMoves(Pawn, Squares.e4, PieceColor.WHITE);
        expectLegalMovesToBe(undefined);
    });

    test('white pawn moves', () => {
        chessBoard.parseFen("r1b2rk1/p1pnnpbp/1p2pqp1/2p5/1P6/P1N2NP1/2PPQPBP/R1B2RK1 w Qq - 0 1");

        getLegalMoves(Pawn, Squares.b4, PieceColor.WHITE);
        expectLegalMovesToBe(['b5', 'c5']);
    });

    test('black pawn moves', () => {
        chessBoard.parseFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1");

        getLegalMoves(Pawn, Squares.a7, PieceColor.BLACK);
        expectLegalMovesToBe(['a6', 'a5']);
    });
});

