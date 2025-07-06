import { Board } from "../core/board";
import { Square } from "../model/model";
import { PieceColor } from "../model/PieceColor.enum";
import { encodeMove } from "../move/move-invoker";
import { MoveList } from "../move/move-list";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "../piece/piece";

export function generateRookMoves(
    coordinates: Square,
    color: PieceColor,
    board: Board,
    moveList: MoveList,
) {
    const isRookOrQueen: boolean = (() => {
        const pieceAtCoordinate = board.getPiece(coordinates);
        return pieceAtCoordinate === PieceType.WHITE_ROOK ||
            pieceAtCoordinate === PieceType.WHITE_QUEEN ||
            pieceAtCoordinate === PieceType.BLACK_ROOK ||
            pieceAtCoordinate === PieceType.BLACK_QUEEN;
    })();

    if (isRookOrQueen) {
        for (let index = 0; index < 4; index++) {
            let targetSquare: Square = coordinates + PieceBaseClass.ROOK_OFFSETS[index];

            while (!(targetSquare & 0x88)) {
                let targetPiece: PieceType = board.getPiece(targetSquare);

                const hitsOwnWhitePiece: boolean = color === PieceColor.WHITE && WHITE_PIECES.includes(targetPiece);
                const hitsOwnBlackPiece: boolean = color === PieceColor.BLACK && BLACK_PIECES.includes(targetPiece);
                if (hitsOwnWhitePiece || hitsOwnBlackPiece) {
                    break;
                }

                const hitsOpponentWhitePiece: boolean = color === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                const hitsOpponentBlackPiece: boolean = color === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);
                if (hitsOpponentWhitePiece || hitsOpponentBlackPiece) {
                    moveList.add(
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
                    moveList.add(
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

                targetSquare += PieceBaseClass.ROOK_OFFSETS[index];
            }
        }
    }

    return moveList.legalMovesMap.get(coordinates)!;
}

