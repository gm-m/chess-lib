import { Board } from '../core/board';
import { GameStateEvaluator } from '../core/game-state-evaluator';
import { PieceColor } from '../model/PieceColor.enum';
import { MoveList } from '../move/move-list';
import { PieceType } from '../piece/piece';
import { generateBishopMoves } from './bishop-moves';
import { generateKingMoves } from './king-moves';
import { generateKnightMoves } from './knight-moves';
import { generatePawnMoves } from './pawn-moves';
import { generateRookMoves } from './rook-moves';

export class MoveGenerator {
    /**
     * The main public method. It iterates the board and calls the
     * appropriate helper function for each piece.
     */
    public generateMoves(board: Board, sideToMove: PieceColor, enpassant: number | boolean = false): MoveList {
        const moveList = new MoveList();
        const evaluator = new GameStateEvaluator(board);

        for (const piece of board._getAllPieceOfColor(sideToMove)) {
            this.generateMovesFromSquare(piece.square, board, moveList, enpassant, evaluator);
        }

        return moveList;
    }

    /**
     * Generates all legal moves for a piece at the given square.
          * This replaces a similar method from the old ChessBoard class.
     */
    public generateMovesFromSquare(fromSquare: number, board: Board, moveList: MoveList, enpassant: number | boolean = false, evaluator?: GameStateEvaluator): void {
        const piece = board.getPiece(fromSquare);
        if (piece === PieceType.EMPTY) return;

        const pieceColor = board.getPieceColor(fromSquare)!;
        const gameEvaluator = evaluator || new GameStateEvaluator(board);

        switch (piece) {
            case PieceType.WHITE_PAWN:
            case PieceType.BLACK_PAWN:
                generatePawnMoves(moveList, board, pieceColor, fromSquare, enpassant);
                break;
            case PieceType.WHITE_KNIGHT:
            case PieceType.BLACK_KNIGHT:
                generateKnightMoves(fromSquare, pieceColor, board, moveList);
                break;
            case PieceType.WHITE_BISHOP:
            case PieceType.BLACK_BISHOP:
                generateBishopMoves(fromSquare, pieceColor, board, moveList);
                break;
            case PieceType.WHITE_ROOK:
            case PieceType.BLACK_ROOK:
                generateRookMoves(fromSquare, pieceColor, board, moveList);
                break;
            case PieceType.WHITE_QUEEN:
            case PieceType.BLACK_QUEEN:
                // Queens move like rooks and bishops
                generateRookMoves(fromSquare, pieceColor, board, moveList);
                generateBishopMoves(fromSquare, pieceColor, board, moveList);
                break;
            case PieceType.WHITE_KING:
            case PieceType.BLACK_KING:
                generateKingMoves(fromSquare, pieceColor, board, gameEvaluator, moveList);
                break;
        }
    }
}

