import { ChessBoard, Square } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { encodeMove } from "../move/move-invoker";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "./piece";


export default class Queen extends PieceBaseClass {
    constructor(coordinates: Square, color: PieceColor) {
        super(coordinates, color);
        // this.getLegalMoves();
    }

    static getLegalMoves(coordinates: Square) {
        const isCurrentPlayerKnight: boolean = (() => {
            if (ChessBoard.side === PieceColor.WHITE) {
                return ChessBoard.board[coordinates] === PieceType.WHITE_KING;
            } else {
                return ChessBoard.board[coordinates] === PieceType.BLACK_KING;
            }
        })();

        if (isCurrentPlayerKnight) {
            for (let index = 0; index < this.KNIGHT_OFFSETS.length; index++) {
                let targetSquare: Square = coordinates + this.KNIGHT_OFFSETS[index];

                // TODO: Check if it is possible to use while instead of if just to be consistent with the other pieces
                if (!(targetSquare & 0x88)) {
                    let targetPiece: PieceType = ChessBoard.board[targetSquare];

                    const hitsOpponentWhitePiece: boolean = ChessBoard.side === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                    const hitsOpponentBlackPiece: boolean = ChessBoard.side === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);
                    if (hitsOpponentWhitePiece || hitsOpponentBlackPiece || targetPiece === PieceType.EMPTY) {
                        if (targetPiece === PieceType.EMPTY) {
                            ChessBoard.legalMoves.add(
                                encodeMove({
                                    source: coordinates,
                                    targetSquare: targetSquare,
                                    piece: 0,
                                    capture: true,
                                    pawn: false,
                                    enpassant: false,
                                    castling: false,
                                })
                            );
                        } else {
                            ChessBoard.legalMoves.add(
                                encodeMove({
                                    source: coordinates,
                                    targetSquare: targetSquare,
                                    piece: 0,
                                    capture: false,
                                    pawn: false,
                                    enpassant: false,
                                    castling: false,
                                })
                            );
                        }
                    }
                }
            }
        }
    }
}