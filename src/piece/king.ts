import { Castling, ChessBoard, Squares } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { encodeMove } from "../move/move-invoker";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "./piece";


export default class King extends PieceBaseClass {
    constructor(coordinates: Squares, color: PieceColor) {
        super(coordinates, color);
    }

    static getLegalMoves(coordinates: Squares, color: PieceColor): Squares[] {
        const isKing: boolean = (() => {
            const pieceAtCoordinate = ChessBoard.board[coordinates];
            return pieceAtCoordinate === PieceType.WHITE_KING || pieceAtCoordinate === PieceType.BLACK_KING;
        })();

        if (isKing) {
            for (let index = 0; index < this.KING_OFFSETS.length; index++) {
                const targetSquare: Squares = coordinates + PieceBaseClass.KING_OFFSETS[index];

                // TODO: Check if this if is required also for the other pieces
                if (targetSquare < 0 || targetSquare > 127) {
                    continue;
                }

                let targetPiece: PieceType = ChessBoard.board[targetSquare];
                if (!(targetSquare & 0x88)) {
                    // If hits opponent's piece
                    const hitsOpponentWhitePiece: boolean = color === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                    const hitsOpponentBlackPiece: boolean = color === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);
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

        const isKingSideCastlingAvailable: number = this.CASTLE & (color === PieceColor.WHITE ? Castling.KC : Castling.kc);
        if (isKingSideCastlingAvailable) {
            // Make sure there are empty squares between King & Rook
            const kingSideEmptySquares: boolean = (() => {
                if (color === PieceColor.WHITE) {
                    // return [Squares.e1, Squares.f1].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                    return [Squares.f1, Squares.g1].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                } else {
                    return [Squares.f8, Squares.g8].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                }
            })();

            if (kingSideEmptySquares) {
                // Make sure king & next square are not under attack
                const kingSideSquareNotAttacked: boolean = (() => {
                    if (color === PieceColor.WHITE) {
                        return !ChessBoard.isSquareAttacked(Squares.e1, PieceColor.BLACK) && !ChessBoard.isSquareAttacked(Squares.f1, PieceColor.BLACK);
                    } else {
                        return !ChessBoard.isSquareAttacked(Squares.e8, PieceColor.WHITE) && !ChessBoard.isSquareAttacked(Squares.f8, PieceColor.WHITE);
                    }
                })();

                if (kingSideSquareNotAttacked) {
                    ChessBoard.legalMoves.add(
                        encodeMove({
                            source: color === PieceColor.WHITE ? Squares.e1 : Squares.e8,
                            targetSquare: color === PieceColor.WHITE ? Squares.g1 : Squares.g8,
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
                    return [Squares.d1, Squares.c1, Squares.b1].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                } else {
                    return [Squares.d8, Squares.c8, Squares.b8].every(square => ChessBoard.board[square] === PieceType.EMPTY);
                }
            })();

            if (queenSideEmptySquares) {
                // Make sure king & next square are not under attack
                const queenSideSquareNotAttacked: boolean = (() => {
                    if (color === PieceColor.WHITE) {
                        return !ChessBoard.isSquareAttacked(Squares.e1, PieceColor.BLACK) && !ChessBoard.isSquareAttacked(Squares.d1, PieceColor.BLACK);
                    } else {
                        return !ChessBoard.isSquareAttacked(Squares.e8, PieceColor.WHITE) && !ChessBoard.isSquareAttacked(Squares.d8, PieceColor.WHITE);
                    }
                })();

                if (queenSideSquareNotAttacked) {
                    ChessBoard.legalMoves.add(
                        encodeMove({
                            source: color === PieceColor.WHITE ? Squares.e1 : Squares.e8,
                            targetSquare: color === PieceColor.WHITE ? Squares.c1 : Squares.c8,
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