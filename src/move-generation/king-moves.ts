
import { GameStateEvaluator } from "../core/game-state-evaluator";
import { Board } from "../core/board";
import { Castling, Square } from "../model/model";
import { PieceColor } from "../model/PieceColor.enum";
import { encodeMove } from "../move/move-invoker";
import { MoveList } from "../move/move-list";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "../piece/piece";

export function generateKingMoves(
    coordinates: Square,
    color: PieceColor,
    board: Board,
    evaluator: GameStateEvaluator,
    moveList: MoveList,
) {
    const isKing: boolean = (() => {
        const pieceAtCoordinate = board.getPiece(coordinates);
        return pieceAtCoordinate === PieceType.WHITE_KING || pieceAtCoordinate === PieceType.BLACK_KING;
    })();

    if (isKing) {
        for (let index = 0; index < PieceBaseClass.KING_OFFSETS.length; index++) {
            const targetSquare: Square = coordinates + PieceBaseClass.KING_OFFSETS[index];

            // TODO: Check if this if is required also for the other pieces
            if (targetSquare < 0 || targetSquare > 127) {
                continue;
            }

            let targetPiece: PieceType = board.getPiece(targetSquare);
            if (!(targetSquare & 0x88)) {
                // If hits opponent's piece
                const hitsOpponentWhitePiece: boolean = color === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                const hitsOpponentBlackPiece: boolean = color === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);

                if ((hitsOpponentWhitePiece || hitsOpponentBlackPiece || targetPiece === PieceType.EMPTY)) {
                    moveList.add(
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

    const isKingSideCastlingAvailable: number = PieceBaseClass.CASTLE & (color === PieceColor.WHITE ? Castling.KC : Castling.kc);
    if (isKingSideCastlingAvailable) {
        // Make sure there are empty squares between King & Rook
        const kingSideEmptySquares: boolean = (() => {
            if (color === PieceColor.WHITE) {
                return [Square.f1, Square.g1].every(square => board.getPiece(square) === PieceType.EMPTY);
            } else {
                return [Square.f8, Square.g8].every(square => board.getPiece(square) === PieceType.EMPTY);
            }
        })();

        if (kingSideEmptySquares) {
            // Make sure king & next square are not under attack
            const kingSideSquareNotAttacked: boolean = (() => {
                if (color === PieceColor.WHITE) {
                    return !evaluator.isSquareAttacked(Square.e1, PieceColor.BLACK) && !evaluator.isSquareAttacked(Square.f1, PieceColor.BLACK);
                } else {
                    return !evaluator.isSquareAttacked(Square.e8, PieceColor.WHITE) && !evaluator.isSquareAttacked(Square.f8, PieceColor.WHITE);
                }
            })();

            if (kingSideSquareNotAttacked) {
                moveList.add(
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
                return [Square.d1, Square.c1, Square.b1].every(square => board.getPiece(square) === PieceType.EMPTY);
            } else {
                return [Square.d8, Square.c8, Square.b8].every(square => board.getPiece(square) === PieceType.EMPTY);
            }
        })();

        if (queenSideEmptySquares) {
            // Make sure king & next square are not under attack
            const queenSideSquareNotAttacked: boolean = (() => {
                if (color === PieceColor.WHITE) {
                    return !evaluator.isSquareAttacked(Square.e1, PieceColor.BLACK) && !evaluator.isSquareAttacked(Square.d1, PieceColor.BLACK);
                } else {
                    return !evaluator.isSquareAttacked(Square.e8, PieceColor.WHITE) && !evaluator.isSquareAttacked(Square.d8, PieceColor.WHITE);
                }
            })();

            if (queenSideSquareNotAttacked) {
                moveList.add(
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

        return moveList.legalMovesMap.get(coordinates)!;
    }

}
