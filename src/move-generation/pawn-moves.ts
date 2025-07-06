import { ChessGame } from "../chessboard/chess-game";
import { Board } from "../core/board";
import { Square } from "../model/model";
import { PieceColor } from "../model/PieceColor.enum";
import { encodeMove } from "../move/move-invoker";
import { MoveList } from "../move/move-list";
import { PieceBaseClass, PIECES, PieceType, PROMOTION_PIECES } from "../piece/piece";

export function generatePawnMoves(
    moveList: MoveList,
    board: Board,
    pieceColor: PieceColor,
    fromSquare: Square,
    enpassant: Square | boolean
) {
    const TWO_SQUARES_AHEAD_OFFSET = 32;

    const isCurrentPlayerPawn = board.getPiece(fromSquare) === (pieceColor === PieceColor.WHITE ? PieceType.WHITE_PAWN : PieceType.BLACK_PAWN);
    if (!isCurrentPlayerPawn) {
        return;
    }

    const targetSquare: Square = fromSquare - PieceBaseClass.PAWN_OFFSETS[pieceColor];

    // Pawn Promotion
    if (!(targetSquare & 0x88) && board.getPiece(targetSquare) === PieceType.EMPTY) {
        if (fromSquare >= ChessGame.seventhRankSquares.get(pieceColor)![0] && fromSquare <= ChessGame.seventhRankSquares.get(pieceColor)![1]) {
            [PROMOTION_PIECES[pieceColor]].forEach(piece => {
                moveList.add(
                    encodeMove({
                        source: fromSquare,
                        targetSquare: targetSquare,
                        piece: piece,
                        capture: false,
                        pawn: false,
                        enpassant: false,
                        castling: false,
                    })
                );
            });
        } else {
            // One square ahead pawn move
            moveList.add(
                encodeMove({
                    source: fromSquare,
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
                if (pieceColor === PieceColor.WHITE) {
                    return fromSquare >= Square.a2 && fromSquare <= Square.h2 && board.getPiece(fromSquare - TWO_SQUARES_AHEAD_OFFSET) === PieceType.EMPTY;
                } else {
                    return fromSquare >= Square.a7 && fromSquare <= Square.h7 && board.getPiece(fromSquare + TWO_SQUARES_AHEAD_OFFSET) === PieceType.EMPTY;
                }
            })();

            if (twoSquaresAheadMove) {
                moveList.add(
                    encodeMove({
                        source: fromSquare,
                        targetSquare: pieceColor === PieceColor.WHITE ? fromSquare - TWO_SQUARES_AHEAD_OFFSET : fromSquare + TWO_SQUARES_AHEAD_OFFSET,
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

    // White & Black Pawn Capture Moves
    for (let pawnOffset = 0; pawnOffset < 2; pawnOffset++) {
        // White pawn offsets are negative
        let toSquare: number = fromSquare + PieceBaseClass.BISHOP_OFFSETS[pawnOffset + (pieceColor === PieceColor.WHITE ? 2 : 0)];

        if (!(toSquare & 0x88)) {
            // Capture pawn promotion
            if (fromSquare >= ChessGame.seventhRankSquares.get(pieceColor)![0] &&
                fromSquare <= ChessGame.seventhRankSquares.get(pieceColor)![1] &&
                PIECES.get(pieceColor ^ 1)!.includes(board.getPiece(toSquare))) {
                // Add all possible promotion moves
                [PROMOTION_PIECES[pieceColor]].forEach(piece => {
                    moveList.add(
                        encodeMove({
                            source: fromSquare,
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
                if (PIECES.get(pieceColor ^ 1)!.includes(board.getPiece(toSquare))) {
                    moveList.add(
                        encodeMove({
                            source: fromSquare,
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
                if (toSquare === enpassant) {
                    moveList.add(
                        encodeMove({
                            source: fromSquare,
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
}
