import { ChessBoard, Square } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { encodeMove } from "../move/move-invoker";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "./piece";


export default class Rook extends PieceBaseClass {
    constructor(coordinates: Square, color: PieceColor) {
        super(coordinates, color);
    }

    static getLegalMoves(coordinates: Square, color: PieceColor): Square[] {
        const isRookOrQueen: boolean = (() => {
            const pieceAtCoordinate = ChessBoard.board[coordinates];
            return pieceAtCoordinate === PieceType.WHITE_ROOK ||
                pieceAtCoordinate === PieceType.WHITE_QUEEN ||
                pieceAtCoordinate === PieceType.BLACK_ROOK ||
                pieceAtCoordinate === PieceType.BLACK_QUEEN;
        })();

        if (isRookOrQueen) {
            for (let index = 0; index < 4; index++) {
                let targetSquare: Square = coordinates + this.ROOK_OFFSETS[index];

                while (!(targetSquare & 0x88)) {
                    let targetPiece: PieceType = ChessBoard.board[targetSquare];

                    const hitsOwnWhitePiece: boolean = color === PieceColor.WHITE && WHITE_PIECES.includes(targetPiece);
                    const hitsOwnBlackPiece: boolean = color === PieceColor.BLACK && BLACK_PIECES.includes(targetPiece);
                    if (hitsOwnWhitePiece || hitsOwnBlackPiece) {
                        break;
                    }

                    const hitsOpponentWhitePiece: boolean = color === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                    const hitsOpponentBlackPiece: boolean = color === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);
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

                    targetSquare += this.ROOK_OFFSETS[index];
                }
            }
        }

        return ChessBoard.legalMoves.legalMovesMap.get(coordinates)!;
    }
}