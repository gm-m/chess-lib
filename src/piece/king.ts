import { Castling, ChessBoard, Squares } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { MoveList, encodeMove } from "../move/move";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "./piece";


export default class King extends PieceBaseClass {
    constructor(coordinates: Squares, color: PieceColor) {
        super(coordinates, color);
        // this.getLegalMoves();
    }

    static getLegalMoves(coordinates: Squares, color: PieceColor): MoveList {
        const isCurrentPlayerKing: boolean = (() => {
            if (ChessBoard.side === PieceColor.WHITE) {
                return ChessBoard.board[coordinates] === PieceType.WHITE_KING;
            } else {
                return ChessBoard.board[coordinates] === PieceType.BLACK_KING;
            }
        })();

        if (isCurrentPlayerKing) {
            for (let index = 0; index < this.KING_OFFSETS.length; index++) {
                const targetSquare: Squares = coordinates + PieceBaseClass.KING_OFFSETS[index];

                // TODO: Check if this if is required also for the other pieces
                if (targetSquare < 0 || targetSquare > 127) {
                    continue;
                }

                let targetPiece: PieceType = ChessBoard.board[targetSquare];
                if (!(targetSquare & 0x88)) {
                    // If hits opponent's piece
                    const hitsOpponentWhitePiece: boolean = ChessBoard.side === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                    const hitsOpponentBlackPiece: boolean = ChessBoard.side === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);
                    if (hitsOpponentWhitePiece || hitsOpponentBlackPiece || targetPiece === PieceType.EMPTY) {
                        ChessBoard.legalMoves.add(
                            encodeMove({
                                source: coordinates,
                                targetSquare: targetSquare,
                                piece: 0,
                                capture: targetPiece !== PieceType.EMPTY,
                                pawn: false,
                                enpassant: false,
                                castling: false,
                            })
                        );
                    }
                }
            }
        }

        const isCastlingAvailable: number = this.CASTLE & (ChessBoard.side === PieceColor.WHITE ? Castling.KC : Castling.kc);

        // King side castling
        if (isCastlingAvailable) {
            // Make sure there are empty squares between King & Rook
            const kingSideEmptySquares: boolean = (() => {
                if (ChessBoard.side === PieceColor.WHITE) {
                    return [Squares.e1, Squares.f1].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                } else {
                    return [Squares.f8, Squares.g8].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                }
            })();

            if (kingSideEmptySquares) {
                // Make sure king & next square are not under attack
                const kingSideSquareAttacked: boolean = (() => {
                    if (ChessBoard.side === PieceColor.WHITE) {
                        return !ChessBoard.isSquareAttacked(Squares.e1, PieceColor.BLACK) && !ChessBoard.isSquareAttacked(Squares.f1, PieceColor.BLACK);
                    } else {
                        return !ChessBoard.isSquareAttacked(Squares.e8, PieceColor.WHITE) && !ChessBoard.isSquareAttacked(Squares.f8, PieceColor.WHITE);
                    }
                })();

                if (kingSideSquareAttacked) {
                    ChessBoard.legalMoves.add(
                        encodeMove({
                            source: ChessBoard.side === PieceColor.WHITE ? Squares.e1 : Squares.e8,
                            targetSquare: ChessBoard.side === PieceColor.WHITE ? Squares.g1 : Squares.e8,
                            piece: 0,
                            capture: false,
                            pawn: false,
                            enpassant: false,
                            castling: true,
                        })
                    );
                }
            }
        }

        // Queen Side Castling
        if (isCastlingAvailable) {
            // Make sure there are empty squares between king & rook
            const kingSideEmptySquares: boolean = (() => {
                if (ChessBoard.side === PieceColor.WHITE) {
                    return [Squares.d1, Squares.c1, Squares.b1].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                } else {
                    return [Squares.d8, Squares.c8, Squares.b8].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                }
            })();

            if (kingSideEmptySquares) {
                // Make sure king & next square are not under attack
                const kingSideSquareAttacked: boolean = (() => {
                    if (ChessBoard.side === PieceColor.WHITE) {
                        return !ChessBoard.isSquareAttacked(Squares.e1, PieceColor.BLACK) && !ChessBoard.isSquareAttacked(Squares.d1, PieceColor.BLACK);
                    } else {
                        return !ChessBoard.isSquareAttacked(Squares.e8, PieceColor.WHITE) && !ChessBoard.isSquareAttacked(Squares.d8, PieceColor.WHITE);
                    }
                })();

                if (kingSideSquareAttacked) {
                    ChessBoard.legalMoves.add(
                        encodeMove({
                            source: ChessBoard.side === PieceColor.WHITE ? Squares.e1 : Squares.e8,
                            targetSquare: ChessBoard.side === PieceColor.WHITE ? Squares.c1 : Squares.c8,
                            piece: 0,
                            capture: false,
                            pawn: false,
                            enpassant: false,
                            castling: true,
                        })
                    );
                }
            }
        }

        return ChessBoard.legalMoves;
    }
}