import { ChessBoard, Squares } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { encodeMove } from "../move/move-invoker";
import { MoveList } from "../move/move-list";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "./piece";


export default class Bishop extends PieceBaseClass {
    constructor(coordinates: Squares, color: PieceColor) {
        super(coordinates, color);
        // this.getLegalMoves();
    }

    static getLegalMoves(coordinates: Squares): MoveList {
        const isCurrentPlayerBishopOrQueen: boolean = (() => {
            if (ChessBoard.side === PieceColor.WHITE) {
                return ChessBoard.board[coordinates] === PieceType.WHITE_BISHOP || ChessBoard.board[coordinates] === PieceType.WHITE_QUEEN;
            } else {
                return ChessBoard.board[coordinates] === PieceType.BLACK_BISHOP || ChessBoard.board[coordinates] === PieceType.BLACK_QUEEN;
            }
        })();

        if (isCurrentPlayerBishopOrQueen) {
            for (let index = 0; index < 4; index++) {
                let targetSquare: Squares = coordinates + this.BISHOP_OFFSETS[index];

                // Loop over attack ray
                while (!(targetSquare & 0x88)) {
                    let targetPiece: PieceType = ChessBoard.board[targetSquare];

                    // If hits own piece
                    const hitsOwnWhitePiece: boolean = ChessBoard.side === PieceColor.WHITE && WHITE_PIECES.includes(targetPiece);
                    const hitsOwnBlackPiece: boolean = ChessBoard.side === PieceColor.BLACK && BLACK_PIECES.includes(targetPiece);
                    if (hitsOwnWhitePiece || hitsOwnBlackPiece) {
                        break;
                    }

                    // If hits opponent's piece
                    const hitsOpponentWhitePiece: boolean = ChessBoard.side === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                    const hitsOpponentBlackPiece: boolean = ChessBoard.side === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);
                    if (hitsOpponentWhitePiece || hitsOpponentBlackPiece) {
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

                        break;
                    }

                    // If steps into an empty squre
                    if (targetPiece === PieceType.EMPTY) {
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

                    // Increment target square
                    targetSquare += this.BISHOP_OFFSETS[index];
                }

                targetSquare += this.BISHOP_OFFSETS[index];
            }
        }

        return ChessBoard.legalMoves;
    }
}