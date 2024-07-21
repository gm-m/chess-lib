import { ChessBoard, Squares } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";

export enum PieceType {
    WHITE_PAWN = 'P',
    WHITE_ROOK = 'R',
    WHITE_KNIGHT = 'N',
    WHITE_BISHOP = 'B',
    WHITE_KING = 'K',
    WHITE_QUEEN = 'Q',
    BLACK_PAWN = 'p',
    BLACK_ROOK = 'r',
    BLACK_KNIGHT = 'n',
    BLACK_BISHOP = 'b',
    BLACK_KING = 'k',
    BLACK_QUEEN = 'q',
    EMPTY = 'e',
    OUT_BOARD = 'o',
}

export const WHITE_PROMOTION_PIECES = [PieceType.WHITE_ROOK, PieceType.WHITE_KNIGHT, PieceType.WHITE_BISHOP, PieceType.WHITE_QUEEN] as const;
export const WHITE_PIECES: PieceType[] = [...WHITE_PROMOTION_PIECES, PieceType.WHITE_PAWN, PieceType.WHITE_KING];
export const BLACK_PROMOTION_PIECES = [PieceType.BLACK_ROOK, PieceType.BLACK_KNIGHT, PieceType.BLACK_BISHOP, PieceType.BLACK_QUEEN] as const;
export const BLACK_PIECES: PieceType[] = [...BLACK_PROMOTION_PIECES, PieceType.BLACK_PAWN, PieceType.BLACK_KING];
export const PROMOTION_PIECES = [WHITE_PROMOTION_PIECES, BLACK_PROMOTION_PIECES] as const;
export const PIECES: Map<PieceColor, PieceType[]> = new Map([
    [PieceColor.WHITE, WHITE_PIECES],
    [PieceColor.BLACK, BLACK_PIECES],
]);

export interface Piece {
    color: PieceColor;
    coordinates: Squares;
}

export class PieceBaseClass implements Piece {
    chessboard: ChessBoard = new ChessBoard();
    color: PieceColor;
    coordinates: Squares;

    // Piece move offsets
    static KNIGHT_OFFSETS = [33, 31, 18, 14, -33, -31, -18, -14] as const;
    static BISHOP_OFFSETS = [15, 17, -15, -17] as const;
    static ROOK_OFFSETS = [16, -16, 1, -1] as const;
    static KING_OFFSETS = [16, -16, 1, -1, 15, 17, -15, -17] as const;
    static PAWN_OFFSETS = [16, -16] as const; // 16 -> Quite move

    static PAWN_CAPTURE_OFFSETS = [
        // White pawn capture offsets
        [this.BISHOP_OFFSETS[2], this.BISHOP_OFFSETS[3]]
        // Black pawn capture offsets
        [this.BISHOP_OFFSETS[0], this.BISHOP_OFFSETS[1]]
    ] as const;

    // TODO: Replace hard coded value 116 with Square.e1 and 4 with Squares.e8 enum
    static KING_SQUARES: [Squares, Squares] = [116, 4];

    // dec 15 => bin 1111 => both kings can castle to both sides
    static CASTLE = 15 as const;

    constructor(pieceCoordinates: Squares, pieceColor: PieceColor) {
        this.color = pieceColor;
        this.coordinates = pieceCoordinates;
    }
}
