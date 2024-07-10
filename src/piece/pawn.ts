import { ChessBoard, Squares } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { encodeMove } from "../move/move-invoker";
import { MoveList } from "../move/move-list";
import { PIECES, PROMOTION_PIECES, PieceBaseClass, PieceType } from "./piece";


export default class Pawn extends PieceBaseClass {
    static readonly TWO_SQUARES_AHEAD_OFFSET = 32;

    constructor(coordinates: Squares, color: PieceColor) {
        super(coordinates, color);
        // this.getLegalMoves();
    }

    static getLegalMoves(coordinates: Squares, color: PieceColor): MoveList {
        const isCurrentPlayerPawn = ChessBoard.board[coordinates] === (ChessBoard.side === PieceColor.WHITE ? PieceType.WHITE_PAWN : PieceType.BLACK_PAWN);
        if (!isCurrentPlayerPawn) {
            return ChessBoard.legalMoves;
        }

        ChessBoard.legalMoves.resetExecuted();
        const targetSquare: Squares = coordinates - PieceBaseClass.PAWN_OFFSETS[color];

        // Pawn Promotion
        if (!(targetSquare & 0x88) && ChessBoard.board[targetSquare] === PieceType.EMPTY) {
            if (coordinates >= ChessBoard.seventhRankSquares.get(color)![0] && coordinates <= ChessBoard.seventhRankSquares.get(color)![1]) {
                // Add all possible promotion moves

                /*                 PROMOTION_PIECES[color].forEach(piece => {
                                    ChessBoard.legalMoves.add(
                                        encodeMove({
                                            source: coordinates,
                                            targetSquare: targetSquare,
                                            //@ts-ignore
                                            piece: piece,
                                            capture: false,
                                            pawn: false,
                                            enpassant: false,
                                            castling: false,
                                        })
                                    );
                                }); */

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


                ChessBoard.legalMoves.printLegalMoves();
            } else {
                // One square ahead pawn move
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

                // Two squares ahead pawn move
                const twoSquaresAheadMove: boolean = (() => {
                    if (color === PieceColor.WHITE) {
                        return coordinates >= Squares.a2 && ChessBoard.board[coordinates - this.TWO_SQUARES_AHEAD_OFFSET] === PieceType.EMPTY;
                    } else {
                        return coordinates >= Squares.a7 && coordinates <= Squares.h7 && ChessBoard.board[coordinates + this.TWO_SQUARES_AHEAD_OFFSET] === PieceType.EMPTY;
                    }
                })();

                if (twoSquaresAheadMove) {
                    ChessBoard.legalMoves.add(
                        encodeMove({
                            source: coordinates,
                            targetSquare: color === PieceColor.WHITE ? coordinates - this.TWO_SQUARES_AHEAD_OFFSET : coordinates + this.TWO_SQUARES_AHEAD_OFFSET,
                            piece: 0,
                            capture: false,
                            pawn: true,
                            enpassant: false,
                            castling: false,
                        })
                    );
                }
            }
        }

        // TODO: 2 -> Possible moves
        // White & Black Pawn Capture Moves
        for (let pawnOffset = 0; pawnOffset < 2; pawnOffset++) {
            // White pawn offsets are negative
            let toSquare: number = coordinates + this.BISHOP_OFFSETS[pawnOffset + (color === PieceColor.WHITE ? 2 : 0)];

            if (!(toSquare & 0x88)) {
                // Capture pawn promotion
                if (coordinates >= ChessBoard.seventhRankSquares.get(color)![0] &&
                    coordinates <= ChessBoard.seventhRankSquares.get(color)![1] &&
                    PIECES.get(color)!.includes(ChessBoard.board[toSquare])) {
                    // Add all possible promotion moves
                    [PROMOTION_PIECES[color]].forEach(piece => {
                        ChessBoard.legalMoves.add(
                            encodeMove({
                                source: coordinates,
                                targetSquare: toSquare,
                                piece: piece,
                                capture: true,
                                pawn: false,
                                enpassant: false,
                                castling: false,
                            })
                        );
                    });
                } else {
                    if (PIECES.get(color ^ 1)!.includes(ChessBoard.board[toSquare])) {
                        ChessBoard.legalMoves.add(
                            encodeMove({
                                source: coordinates,
                                targetSquare: toSquare,
                                piece: 0,
                                capture: true,
                                pawn: false,
                                enpassant: false,
                                castling: false,
                            })
                        );
                    }

                    // Enpassant capture
                    if (toSquare === ChessBoard.enpassant) {
                        ChessBoard.legalMoves.add(
                            encodeMove({
                                source: coordinates,
                                targetSquare: toSquare,
                                piece: 0,
                                capture: true,
                                pawn: false,
                                enpassant: true,
                                castling: false,
                            })
                        );
                    }
                }
            }
        }

        return ChessBoard.legalMoves;
    }

}
