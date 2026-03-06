import { ChessGame } from "../chessboard/chess-game";
import { Square } from "../model/model";
import { PieceColor } from "../model/PieceColor.enum";

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
export const KNIGHT_OFFSETS = [33, 31, 18, 14, -33, -31, -18, -14] as const;
export const BISHOP_OFFSETS = [15, 17, -15, -17] as const;
export const ROOK_OFFSETS = [16, -16, 1, -1] as const;
export const KING_OFFSETS = [16, -16, 1, -1, 15, 17, -15, -17] as const;
export const PAWN_OFFSETS = [16, -16] as const;
export const PAWN_CAPTURE_OFFSETS = [
    [BISHOP_OFFSETS[2], BISHOP_OFFSETS[3]],
    [BISHOP_OFFSETS[0], BISHOP_OFFSETS[1]]
] as const;

export interface Piece {
    color: PieceColor;
    coordinates: Square;
}

export class PieceBaseClass implements Piece {
    chessGame: ChessGame = new ChessGame();
    color: PieceColor;
    coordinates: Square;

    constructor(pieceCoordinates: Square, pieceColor: PieceColor) {
        this.color = pieceColor;
        this.coordinates = pieceCoordinates;
    }
}
