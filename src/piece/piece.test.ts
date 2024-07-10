import { ChessBoard, Squares } from '../chessboard';
import { PieceColor } from '../enum/PieceColor';
import { MoveInvoker } from '../move/move-invoker';
import Knight from './knight';
import Pawn from './pawn';

function getLegalMoves(pieceType: any, square: Squares, color: PieceColor) {
    const legalMoves = pieceType.getLegalMoves(square, color);
    onTestFinished(() => {
        legalMoves.resetMap();
    });

    return legalMoves;
}

describe("Test Pawn Moves", () => {
    test('white pawn moves', () => {
        ChessBoard.parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

        const pawnLegalMoves = getLegalMoves(Pawn, Squares.a2, PieceColor.WHITE);
        const expectedLegalMoves = ['a3', 'a4'];

        expect(pawnLegalMoves.decodeLegalMoves()).toEqual(expectedLegalMoves);
    });

    test('white pawn moves', () => {
        ChessBoard.parseFen("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");

        const pawnLegalMoves = getLegalMoves(Pawn, Squares.e4, PieceColor.WHITE);
        const expectedLegalMoves = undefined;

        expect(pawnLegalMoves.decodeLegalMoves()).toEqual(expectedLegalMoves);
    });

    test('black pawn moves', () => {
        ChessBoard.parseFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1");

        const pawnLegalMoves = getLegalMoves(Pawn, Squares.a7, PieceColor.BLACK);
        const expectedLegalMoves = ['a6', 'a5'];

        expect(pawnLegalMoves.decodeLegalMoves()).toEqual(expectedLegalMoves);
    });
});

describe("Test Knight Moves", () => {
    test('knight moves', () => {
        ChessBoard.parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

        const knightLegalMoves = getLegalMoves(Knight, Squares.g1, PieceColor.WHITE);
        const expectedLegalMoves = ['h3', 'f3'];
        const decodedLegalMoves = knightLegalMoves.decodeLegalMoves();

        expect(decodedLegalMoves).toHaveLength(2);
        expectedLegalMoves.forEach(expectMove => {
            expect(decodedLegalMoves).toContain(expectMove);
        });
    });
});


describe("Test Rewind Moves", () => {
    test('rewind moves', () => {
        ChessBoard.parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

        const moveInvoker = new MoveInvoker(new ChessBoard());
        moveInvoker.movesHistory = [
            {
                "fromSquareIdx": 100,
                "toSquareIdx": 68,
                "captureMove": false,
                "castlingMove": false
            },
            {
                "fromSquareIdx": 19,
                "toSquareIdx": 51,
                "captureMove": false,
                "castlingMove": false
            },
            {
                "fromSquareIdx": 68,
                "toSquareIdx": 51,
                "captureMove": true,
                "castlingMove": false
            },
            {
                "fromSquareIdx": 3,
                "toSquareIdx": 51,
                "captureMove": true,
                "castlingMove": false
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
