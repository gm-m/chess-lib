import { beforeAll, describe, expect, onTestFinished, test } from 'vitest';
import { ChessBoard, Square } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { MoveInvoker } from "../move/move-invoker";
import Knight from "./knight";
import Pawn from "./pawn";

let chessBoard!: ChessBoard;

beforeAll(() => {
    chessBoard = new ChessBoard();
});

function getLegalMoves(pieceType: any, square: Square, color: PieceColor) {
    const legalMoves = pieceType.getLegalMoves(square, color);

    onTestFinished(() => {
        ChessBoard.legalMoves.resetState();
    });

    return legalMoves;
}

function expectLegalMovesToBe(moveList: string[] | undefined) {
    expect(ChessBoard.legalMoves.decodeLegalMoves()).toEqual(moveList);
}

describe.skip("Test Pawn Moves", () => {
    test('white pawn moves', () => {
        chessBoard.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

        getLegalMoves(Pawn, Square.a2, PieceColor.WHITE);
        expectLegalMovesToBe(['a3', 'a4']);
    });

    test('white pawn moves', () => {
        chessBoard.loadFen("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");

        getLegalMoves(Pawn, Square.e4, PieceColor.WHITE);
        expectLegalMovesToBe(undefined);
    });

    test('white pawn moves', () => {
        chessBoard.loadFen("r1b2rk1/p1pnnpbp/1p2pqp1/2p5/1P6/P1N2NP1/2PPQPBP/R1B2RK1 w Qq - 0 1");

        getLegalMoves(Pawn, Square.b4, PieceColor.WHITE);
        expectLegalMovesToBe(['b5', 'c5']);
    });

    test('black pawn moves', () => {
        chessBoard.loadFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1");

        getLegalMoves(Pawn, Square.a7, PieceColor.BLACK);
        expectLegalMovesToBe(['a6', 'a5']);
    });

    test.skip('black pawn moves', () => { // isInCheck, so no move from pawn are possible
        chessBoard.loadFen("rn1qk2r/ppp2pbp/3p1np1/1B2p3/4P1b1/2NP1N2/PPPB1PPP/R2Q1RK1 b Qkq - 0 1");

        getLegalMoves(Pawn, Square.d6, PieceColor.BLACK);
        expectLegalMovesToBe(undefined);
    });

});

describe.skip("Test Knight Moves", () => {
    test('knight moves', () => {
        chessBoard.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

        const knightLegalMoves = getLegalMoves(Knight, Square.g1, PieceColor.WHITE);
        const expectedLegalMoves = ['h3', 'f3'];
        const decodedLegalMoves = knightLegalMoves.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(2);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });
});


describe.skip("Test Rewind Moves", () => {
    test('rewind moves', () => {
        chessBoard.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

        const moveInvoker = new MoveInvoker(new ChessBoard());
        moveInvoker.movesHistory = [
            {
                "fromSquareIdx": 100,
                "toSquareIdx": 68,
                "isCaptureMove": false,
                "isCastlingMove": false
            },
            {
                "fromSquareIdx": 19,
                "toSquareIdx": 51,
                "isCaptureMove": false,
                "isCastlingMove": false
            },
            {
                "fromSquareIdx": 68,
                "toSquareIdx": 51,
                "isCaptureMove": true,
                "isCastlingMove": false
            },
            {
                "fromSquareIdx": 3,
                "toSquareIdx": 51,
                "isCaptureMove": true,
                "isCastlingMove": false
            }
        ];

        const expectedBoard = [
            "r", "n", "b", "e", "k", "b", "n", "r", "o", "o", "o", "o", "o", "o", "o", "o",
            "p", "p", "p", "e", "p", "p", "p", "p", "o", "o", "o", "o", "o", "o", "o", "o",
            "e", "e", "e", "e", "e", "e", "e", "e", "o", "o", "o", "o", "o", "o", "o", "o",
            "e", "e", "e", "q", "e", "e", "e", "e", "o", "o", "o", "o", "o", "o", "o", "o",
            "e", "e", "e", "e", "e", "e", "e", "e", "o", "o", "o", "o", "o", "o", "o", "o",
            "e", "e", "e", "e", "e", "e", "e", "e", "o", "o", "o", "o", "o", "o", "o", "o",
            "P", "P", "P", "P", "e", "P", "P", "P", "o", "o", "o", "o", "o", "o", "o", "o",
            "R", "N", "B", "Q", "K", "B", "N", "R", "o", "o", "o", "o", "o", "o", "o", "o"
        ];
        expect(ChessBoard.board).toEqual(expectedBoard);
    });
});
