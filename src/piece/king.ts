import { Castling, ChessBoard, Square } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { encodeMove } from "../move/move-invoker";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "./piece";


export default class King extends PieceBaseClass {
    constructor(coordinates: Square, color: PieceColor) {
        super(coordinates, color);
    }

    static getLegalMoves(coordinates: Square, color: PieceColor): Square[] {
        const isKing: boolean = (() => {
            const pieceAtCoordinate = ChessBoard.board[coordinates];
            return pieceAtCoordinate === PieceType.WHITE_KING || pieceAtCoordinate === PieceType.BLACK_KING;
        })();

        if (isKing) {
            for (let index = 0; index < this.KING_OFFSETS.length; index++) {
                const targetSquare: Square = coordinates + PieceBaseClass.KING_OFFSETS[index];

                // TODO: Check if this if is required also for the other pieces
                if (targetSquare < 0 || targetSquare > 127) {
                    continue;
                }

                let targetPiece: PieceType = ChessBoard.board[targetSquare];
                if (!(targetSquare & 0x88)) {
                    // If hits opponent's piece
                    const hitsOpponentWhitePiece: boolean = color === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                    const hitsOpponentBlackPiece: boolean = color === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);
                    const isTargetSquareAttacked = ChessBoard.isSquareAttacked(targetSquare, ChessBoard.getOppositeSideColor());

                    if ((hitsOpponentWhitePiece || hitsOpponentBlackPiece || targetPiece === PieceType.EMPTY) && !isTargetSquareAttacked) {
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

        const isKingSideCastlingAvailable: number = this.CASTLE & (color === PieceColor.WHITE ? Castling.KC : Castling.kc);
        if (isKingSideCastlingAvailable) {
            // Make sure there are empty squares between King & Rook
            const kingSideEmptySquares: boolean = (() => {
                if (color === PieceColor.WHITE) {
                    // return [Square.e1, Square.f1].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                    return [Square.f1, Square.g1].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                } else {
                    return [Square.f8, Square.g8].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                }
            })();

            if (kingSideEmptySquares) {
                // Make sure king & next square are not under attack
                const kingSideSquareNotAttacked: boolean = (() => {
                    if (color === PieceColor.WHITE) {
                        return !ChessBoard.isSquareAttacked(Square.e1, PieceColor.BLACK) && !ChessBoard.isSquareAttacked(Square.f1, PieceColor.BLACK);
                    } else {
                        return !ChessBoard.isSquareAttacked(Square.e8, PieceColor.WHITE) && !ChessBoard.isSquareAttacked(Square.f8, PieceColor.WHITE);
                    }
                })();

                if (kingSideSquareNotAttacked) {
                    ChessBoard.legalMoves.add(
                        encodeMove({
                            source: color === PieceColor.WHITE ? Square.e1 : Square.e8,
                            targetSquare: color === PieceColor.WHITE ? Square.g1 : Square.g8,
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
        if (isKingSideCastlingAvailable) {
            // Make sure there are empty squares between king & rook
            const queenSideEmptySquares: boolean = (() => {
                if (color === PieceColor.WHITE) {
                    return [Square.d1, Square.c1, Square.b1].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                } else {
                    return [Square.d8, Square.c8, Square.b8].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                }
            })();

            if (queenSideEmptySquares) {
                // Make sure king & next square are not under attack
                const queenSideSquareNotAttacked: boolean = (() => {
                    if (color === PieceColor.WHITE) {
                        return !ChessBoard.isSquareAttacked(Square.e1, PieceColor.BLACK) && !ChessBoard.isSquareAttacked(Square.d1, PieceColor.BLACK);
                    } else {
                        return !ChessBoard.isSquareAttacked(Square.e8, PieceColor.WHITE) && !ChessBoard.isSquareAttacked(Square.d8, PieceColor.WHITE);
                    }
                })();

                if (queenSideSquareNotAttacked) {
                    ChessBoard.legalMoves.add(
                        encodeMove({
                            source: color === PieceColor.WHITE ? Square.e1 : Square.e8,
                            targetSquare: color === PieceColor.WHITE ? Square.c1 : Square.c8,
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

        return ChessBoard.legalMoves.legalMovesMap.get(coordinates)!;
    }
}