import { Square } from "../model/model";
import { PieceColor } from "../model/PieceColor.enum";
import { MoveGenerator } from "../move-generation/move-generator";
import { PieceBaseClass, PieceType } from "../piece/piece";
import { getSquareColor } from "../utils/utility";
import { Board } from "./board";

export class GameStateEvaluator {
    public isCheckmate(sideToMove: PieceColor, moveGenerator: MoveGenerator): boolean {
        const kingSquare = PieceBaseClass.KING_SQUARES[sideToMove];
        const opponentColor = sideToMove === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

        if (!this.isSquareAttacked(kingSquare, opponentColor)) {
            return false; // Not in check, so not checkmate
        }

        const legalMoveList = moveGenerator.generateMoves(this.boardState, sideToMove);
        for (const [fromSquare, toSquares] of legalMoveList.legalMovesMap) {
            for (const toSquare of toSquares) {
                const originalPiece = this.boardState.getPiece(fromSquare);
                const capturedPiece = this.boardState.getPiece(toSquare);

                // Simulate the move
                this.boardState.setPiece(toSquare, originalPiece);
                this.boardState.setPiece(fromSquare, PieceType.EMPTY);
                if (originalPiece === PieceType.WHITE_KING || originalPiece === PieceType.BLACK_KING) {
                    PieceBaseClass.KING_SQUARES[sideToMove] = toSquare;
                }

                const isKingStillInCheck = this.isSquareAttacked(PieceBaseClass.KING_SQUARES[sideToMove], opponentColor);

                // Undo the move
                this.boardState.setPiece(fromSquare, originalPiece);
                this.boardState.setPiece(toSquare, capturedPiece);
                if (originalPiece === PieceType.WHITE_KING || originalPiece === PieceType.BLACK_KING) {
                    PieceBaseClass.KING_SQUARES[sideToMove] = fromSquare;
                }

                if (!isKingStillInCheck) {
                    return false; // Found a move to escape check, so not checkmate
                }
            }
        }

        return true; // In check and no legal moves to escape it
    }

    public isStaleMate(sideToMove: PieceColor, moveGenerator: MoveGenerator): boolean {
        const kingSquare = PieceBaseClass.KING_SQUARES[sideToMove];
        const opponentColor = sideToMove === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

        if (this.isSquareAttacked(kingSquare, opponentColor)) {
            return false; // In check, so not stalemate
        }

        const legalMoveList = moveGenerator.generateMoves(this.boardState, sideToMove);
        return legalMoveList.legalMovesMap.size === 0;
    }

    public isInsufficientMaterial(): boolean {
        const pieces = this.boardState.getAllPieces();
        const pieceCountMap = new Map<PieceType, number>();
        const bishopColors: PieceColor[] = [];

        for (const { piece, square } of pieces) {
            pieceCountMap.set(piece, ((pieceCountMap.get(piece) || 0) + 1));
            if (piece === PieceType.BLACK_BISHOP || piece === PieceType.WHITE_BISHOP) {
                bishopColors.push(getSquareColor(square)!);
            }
        }

        if (pieces.length <= 2) return true; // King vs King
        if (this.isKingVsKingAndMinorPiece(pieces.length, pieceCountMap)) return true;
        if (this.isKingAndBishopVsKingAndBishop(pieces.length, pieceCountMap, bishopColors)) return true;

        return false;
    }

    private isKingVsKingAndMinorPiece(totalPieces: number, pieceCount: Map<PieceType, number>): boolean {
        if (totalPieces !== 3) return false;

        const minorPieces = [
            PieceType.WHITE_BISHOP,
            PieceType.BLACK_BISHOP,
            PieceType.WHITE_KNIGHT,
            PieceType.BLACK_KNIGHT
        ];

        return minorPieces.some(piece => pieceCount.get(piece) === 1);
    }

    private isKingAndBishopVsKingAndBishop(totalPieces: number, pieceCount: Map<PieceType, number>, bishopColors: PieceColor[]): boolean {
        if (totalPieces !== 4) return false;

        const whiteBishopCount = pieceCount.get(PieceType.WHITE_BISHOP) || 0;
        const blackBishopCount = pieceCount.get(PieceType.BLACK_BISHOP) || 0;

        if (whiteBishopCount !== 1 || blackBishopCount !== 1) return false;

        return bishopColors[0] === bishopColors[1];
    }

    boardState: Board;

    constructor(board: Board) {
        this.boardState = board;
    }

    /*
        square = number
        color = Attacked from color
    */
    public getMaterialAdvantage(): { w: number, b: number; } {
        const pieces = this.boardState.getAllPieces();

        const scoreMap = new Map<PieceType, number>([
            [PieceType.WHITE_PAWN, 1],
            [PieceType.BLACK_PAWN, -1],

            [PieceType.WHITE_BISHOP, 3],
            [PieceType.BLACK_BISHOP, -3],

            [PieceType.WHITE_KNIGHT, 3],
            [PieceType.BLACK_KNIGHT, -3],

            [PieceType.WHITE_QUEEN, 9],
            [PieceType.BLACK_QUEEN, -9],

            [PieceType.WHITE_ROOK, 5],
            [PieceType.BLACK_ROOK, -5],

            [PieceType.WHITE_KING, 0],
            [PieceType.BLACK_KING, 0],
        ]);

        const totalScore = pieces.reduce((score, pieceInfo) => {
            return score + (scoreMap.get(pieceInfo.piece) || 0);
        }, 0);

        return {
            w: totalScore,
            b: totalScore === 0 ? totalScore : -totalScore
        };
    }

    isSquareAttacked(square: Square, attackedFromColor: PieceColor): boolean {
        // PAWNS
        if (attackedFromColor === PieceColor.WHITE) {
            if (!(square + 17 & 0x88) && this.boardState.getPiece(square + 17) === PieceType.WHITE_PAWN) {
                return true;
            }

            if (!(square + 15 & 0x88) && this.boardState.getPiece(square + 15) === PieceType.WHITE_PAWN) {
                return true;
            }
        } else {
            if (!(square - 17 & 0x88) && this.boardState.getPiece(square - 17) === PieceType.BLACK_PAWN) {
                return true;
            }

            if (!(square - 15 & 0x88) && this.boardState.getPiece(square - 15) === PieceType.BLACK_PAWN) {
                return true;
            }
        }

        // KNIGHTS
        for (let index = 0; index < PieceBaseClass.KNIGHT_OFFSETS.length; index++) {
            let offset = PieceBaseClass.KNIGHT_OFFSETS[index];

            if (!(square + offset & 0x88)) {
                if (attackedFromColor === PieceColor.WHITE) {
                    if (this.boardState.getPiece(square + offset) === PieceType.WHITE_KNIGHT) {
                        return true;
                    }
                } else {
                    if (this.boardState.getPiece(square + offset) === PieceType.BLACK_KNIGHT) {
                        return true;
                    }
                }
            }
        }

        // BISHOPS & QUEENS
        for (let index = 0; index < PieceBaseClass.BISHOP_OFFSETS.length; index++) {
            let offset = PieceBaseClass.BISHOP_OFFSETS[index];
            let targetSquare: Square = square + offset;

            while (!(targetSquare & 0x88)) {
                if (attackedFromColor === PieceColor.WHITE) {
                    if (this.boardState.getPiece(targetSquare) === PieceType.WHITE_BISHOP || this.boardState.getPiece(targetSquare) === PieceType.WHITE_QUEEN) {
                        return true;
                    }
                } else {
                    if (this.boardState.getPiece(targetSquare) === PieceType.BLACK_BISHOP || this.boardState.getPiece(targetSquare) === PieceType.BLACK_QUEEN) {
                        return true;
                    }
                }

                if (this.boardState.getPiece(targetSquare) !== PieceType.EMPTY) {
                    break;
                }

                offset += PieceBaseClass.BISHOP_OFFSETS[index];
                targetSquare = square + offset;
            }
        }

        // ROOKS & QUEENS
        for (let index = 0; index < PieceBaseClass.ROOK_OFFSETS.length; index++) {
            let offset = PieceBaseClass.ROOK_OFFSETS[index];
            let targetSquare: Square = square + offset;

            while (!(targetSquare & 0x88)) {
                if (attackedFromColor === PieceColor.WHITE) {
                    if (this.boardState.getPiece(targetSquare) === PieceType.WHITE_ROOK || this.boardState.getPiece(targetSquare) === PieceType.WHITE_QUEEN) {
                        return true;
                    }
                } else {
                    if (this.boardState.getPiece(targetSquare) === PieceType.BLACK_ROOK || this.boardState.getPiece(targetSquare) === PieceType.BLACK_QUEEN) {
                        return true;
                    }
                }

                if (this.boardState.getPiece(targetSquare) !== PieceType.EMPTY) {
                    break;
                }

                offset += PieceBaseClass.ROOK_OFFSETS[index];
                targetSquare = square + offset;
            }
        }

        // KINGS
        for (let index = 0; index < PieceBaseClass.KING_OFFSETS.length; index++) {
            let offset = PieceBaseClass.KING_OFFSETS[index];

            if (!(square + offset & 0x88)) {
                if (attackedFromColor === PieceColor.WHITE) {
                    if (this.boardState.getPiece(square + offset) === PieceType.WHITE_KING) {
                        return true;
                    }
                } else {
                    if (this.boardState.getPiece(square + offset) === PieceType.BLACK_KING) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
