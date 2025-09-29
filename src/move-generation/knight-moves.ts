import { Board } from "../core/board";
import { Square } from "../model/model";
import { PieceColor } from "../model/PieceColor.enum";
import { encodeMove } from "../move/move-invoker";
import { MoveList } from "../move/move-list";
import { BLACK_PIECES, PieceBaseClass, PieceType, WHITE_PIECES } from "../piece/piece";

export function generateKnightMoves(
    coordinates: Square,
    color: PieceColor,
    board: Board,
    moveList: MoveList,
) {
    const isCurrentPlayerKnight: boolean = (() => {
        const pieceAtCoordinate = board.getPiece(coordinates);
        return pieceAtCoordinate === PieceType.WHITE_KNIGHT || pieceAtCoordinate === PieceType.BLACK_KNIGHT;
    })();

    if (isCurrentPlayerKnight) {
        for (let index = 0; index < PieceBaseClass.KNIGHT_OFFSETS.length; index++) {
            let targetSquare: Square = coordinates + PieceBaseClass.KNIGHT_OFFSETS[index];

            // TODO: Check if it is possible to use while instead of if just to be consistent with the other pieces
            if (!(targetSquare & 0x88)) {
                let targetPiece: PieceType = board.getPiece(targetSquare);

                const hitsOpponentWhitePiece: boolean = color === PieceColor.WHITE && BLACK_PIECES.includes(targetPiece);
                const hitsOpponentBlackPiece: boolean = color === PieceColor.BLACK && WHITE_PIECES.includes(targetPiece);
                if (hitsOpponentWhitePiece || hitsOpponentBlackPiece || targetPiece === PieceType.EMPTY) {
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

}

