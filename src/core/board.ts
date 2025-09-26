import { SQUARE_TO_COORDS } from "../chessboard/chess-game";
import { BoardPiece, Square } from "../model/model";
import { PieceColor } from "../model/PieceColor.enum";
import { BLACK_PIECES, PieceType, WHITE_PIECES } from "../piece/piece";
import { decodePieceColor } from "../utils/utility";

export class Board {
    private board: PieceType[] = [
        PieceType.BLACK_ROOK,
        PieceType.BLACK_KNIGHT,
        PieceType.BLACK_BISHOP,
        PieceType.BLACK_QUEEN,
        PieceType.BLACK_KING,
        PieceType.BLACK_BISHOP,
        PieceType.BLACK_KNIGHT,
        PieceType.BLACK_ROOK,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.WHITE_ROOK,
        PieceType.WHITE_KNIGHT,
        PieceType.WHITE_BISHOP,
        PieceType.WHITE_QUEEN,
        PieceType.WHITE_KING,
        PieceType.WHITE_BISHOP,
        PieceType.WHITE_KNIGHT,
        PieceType.WHITE_ROOK,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
    ];

    setPiece(square: Square, content: PieceType): void {
        this.board[square] = content;
    }

    getPiece(square: Square): PieceType {
        return this.board[square];
    }

    getPieceColor(square: Square): PieceColor | undefined {
        if (WHITE_PIECES.includes(this.board[square])) {
            return PieceColor.WHITE;
        }

        if (BLACK_PIECES.includes(this.board[square])) {
            return PieceColor.BLACK;
        }
    }

    // Intended to be exposed publicly, it returns a different/user friendly rappresentation of Squares and Color
    getBoardPieces(): BoardPiece[] {
	    let pieces: BoardPiece[] = [];
	    this.iterateBoard((square: number) => {
		    pieces.push({ square: SQUARE_TO_COORDS[square], ...this.getPieceType(square) });
	    });

	    return pieces;
    }

    // Intended to be exposed publicly, it returns a different/user friendly rappresentation of Squares and Color
    getAllPieceOfColor(color: PieceColor) {
	    const filterByColor = color === PieceColor.WHITE ? 'w' : 'b';
	    const allPieces = this.getBoardPieces();
	    const filteredPieces =  allPieces.filter((piece) => piece.color === filterByColor);
        
	    return filteredPieces;
    }

    // Intended to be used internally, it returns the usual rappresentation of Square and Color
    _getAllPieceOfColor(color: PieceColor) {
        let pieces: { square: number, color: PieceColor; }[] = [];
	    this.iterateBoard((square: number) => {
		    if(color === this.getPieceColor(square)){
			    pieces.push({square, color});
		    }
	    });

	    return pieces;
    }


    // TODO: This should be renamed to getPiece and the above getPiece should become getPieceType
    private getPieceType(square: Square) {
        return { piece: this.getPiece(square), color: decodePieceColor(this.getPieceColor(square)!) };
    }

    public getAllPieces(): { piece: PieceType, square: Square }[] {
        const pieces: { piece: PieceType, square: Square }[] = [];
        this.iterateBoard((square, piece) => {
            pieces.push({ piece, square });
        });
        return pieces;
    }

    private iterateBoard(callback: (square: Square, piece: PieceType) => void) {
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 16; file++) {
                const square: number = (rank * 16) + file;

                // If square is on Board
                if (!(square & 0x88)) {
                    const piece = this.getPiece(square);
                    if (piece !== PieceType.EMPTY) {
                        callback(square, piece);
                    }
                }
            }
        }
    }

}
