import { ChessBoard, Squares } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { encodeMove } from "../move/move-invoker";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "./piece";


export default class Bishop extends PieceBaseClass {
    constructor(coordinates: Squares, color: PieceColor) {
        super(coordinates, color);
    }

    static getLegalMoves(coordinates: Squares, color: PieceColor): Squares[] {
        const isCurrentPlayerBishopOrQueen: boolean = (() => {
            const pieceAtCoordinate = ChessBoard.board[coordinates];
            return pieceAtCoordinate === PieceType.WHITE_BISHOP ||
                pieceAtCoordinate === PieceType.WHITE_QUEEN ||
                pieceAtCoordinate === PieceType.BLACK_BISHOP ||
                pieceAtCoordinate === PieceType.BLACK_QUEEN;
        })();

        if (isCurrentPlayerBishopOrQueen) {
            for (let index = 0; index < 4; index++) {
                let targetSquare: Squares = coordinates + this.BISHOP_OFFSETS[index];

                // Loop over attack ray
                while (!(targetSquare & 0x88)) {
                    let targetPiece: PieceType = ChessBoard.board[targetSquare];

                    // If hits own piece
                    const hitsOwnWhitePiece: boolean = color === PieceColor.WHITE && WHITE_PIECES.includes(targetPiece);
                    const hitsOwnBlackPiece: boolean = color === PieceColor.BLACK && BLACK_PIECES.includes(targetPiece);
                    if (hitsOwnWhitePiece || hitsOwnBlackPiece) {
                        break;
                    }

                    // If hits opponent's piece
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

        return ChessBoard.legalMoves.legalMovesMap.get(coordinates)!;
    }
}