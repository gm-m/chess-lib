import { ChessBoard, Squares } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { BLACK_PROMOTION_PIECES, PieceBaseClass, PieceType, WHITE_PROMOTION_PIECES } from "../piece/piece";
import { decodeEnum, getPieceColor } from "../utility";


export interface EncodeMove {
    source: Squares;
    targetSquare: number;
    piece: typeof WHITE_PROMOTION_PIECES | typeof BLACK_PROMOTION_PIECES | 0;
    capture: boolean;
    pawn: boolean;
    enpassant: boolean;
    castling: boolean;
}

// TODO:
// Maybe it's better to avoid any type of conversion and instead change the Move interface so that boolean became a number;
// Check if macros exists in Javascript. If so convert this function into a Macro in order to get a performance boost
export function encodeMove(rawMove: EncodeMove): number {
    return (rawMove.source)
        | (rawMove.targetSquare << 7)
        | (+rawMove.piece << 14)
        | (+rawMove.capture << 18)
        | (+rawMove.pawn << 19)
        | (+rawMove.enpassant << 20)
        | (+rawMove.castling << 21);
}

export interface Move {
    square: Squares;
}

interface MoveHistory {
    fromSquareIdx: Squares;
    toSquareIdx: Squares;
    isCaptureMove: boolean;
    isCastlingMove: boolean;
    capturedPiece?: PieceType;
}

export interface MakeMove {
    fromSquare: Squares,
    toSquare: Squares,
    rewindMove?: boolean;
    updateMoveHistory?: boolean;
}

export class MoveInvoker {
    constructor(private chessboard: ChessBoard) { }

    movesHistory: MoveHistory[] = [];
    undoMoveCounter: number = 0;
    domHistory: string[] = [];
    isHalfMove = false;

    updateChessNotation() {
        // Algebraic Notation
        // https://www.chess.com/terms/chess-notation

        // TODO: Captures, castling, check, checkmate and the result of the game all have special symbols
        // When a pawn captures a piece, you write the name of the file (in lower case) that the pawn is on, followed by a lower-case "x" and then the file where the pawn moves.

        const lastMove = this.movesHistory.at(-1);
        if (lastMove) {
            let lastMovePiece = ChessBoard.board[lastMove.toSquareIdx].toUpperCase();
            if (lastMovePiece === "P") {
                lastMovePiece = '';
            }
            const captureMove = lastMove.isCaptureMove ? "x" : "";

            const lastMoveStr = `${decodeEnum(lastMove.fromSquareIdx)}, ${decodeEnum(lastMove.toSquareIdx)}`;
            this.domHistory.push(lastMoveStr);

            this.isHalfMove = this.domHistory.length % 2 === 0;

            let moveRappresentation = `${lastMovePiece}${captureMove}${decodeEnum(lastMove.toSquareIdx)}`;
            if (this.isHalfMove) {
                moveRappresentation = ` ${moveRappresentation}`;

                // For the PGN
                moveRappresentation += " ";
            } else {
                const moveNumber = Math.ceil(this.domHistory.length / 2);
                moveRappresentation = `${moveNumber}. ${moveRappresentation}`;
            }

            this.chessboard.appendToPGN(moveRappresentation);
        }
    }


    /*
        executeMove Logic:

        Check if is a possibile move
        0 - Check if the fromSquare has the toSquare legal move

        Check for enPassant moves:
        1.1 - Get the fromSquare pieceType. If it's a pawn then check for enPassant move

        Check for promotion moves:
        1.1 - Get the fromSquare pieceType. If it's a pawn then check if it's a promotion move
        1.2 - Get the fromSquare pieceType. If it's a king then update king square

        Update State:
        2 - Move piece fromSquare to toSquare
        3 - Remove piece from fromSquare
        4 - Update move history

        Make the move:
        5 - Make the move
        6 - Update the move counter

        Switch Side To Move:
        7 - Update side to move

        Verify Check, Checkmate and StaleMate:
        8 - Verify for Check, Checkmate and StaleMate
    */
    executeMove(move: MakeMove) {
        // if (!this.isLegalMove(move)) return;

        // Validate that:
        // 1. The piece that we're tring to move is of the same color of player to move.
        // 2. The square where we want to go is not occupiede by our piece.

        const isUndoMove = move.rewindMove;
        if (!isUndoMove) {
            const fromPieceColor = getPieceColor(move.fromSquare);
            const isValidTurn = ChessBoard.side === fromPieceColor && fromPieceColor !== getPieceColor(move.toSquare);

            if (!isValidTurn) return;
        }

        const fromSquarePiece = ChessBoard.board[move.fromSquare];
        if (fromSquarePiece === PieceType.WHITE_KING || fromSquarePiece === PieceType.BLACK_KING) {
            this.updateKingSquares(fromSquarePiece, move.toSquare);
        }

        // Detect capture move
        const isCaptureMove = ChessBoard.board[move.toSquare] !== PieceType.EMPTY;
        const capturedPiece = isCaptureMove ? ChessBoard.board[move.toSquare] : undefined;

        // TODO
        const isCastlingMove = false;

        // Execute Move
        ChessBoard.board[move.toSquare] = ChessBoard.board[move.fromSquare];
        ChessBoard.board[move.fromSquare] = PieceType.EMPTY;
        this.chessboard.increaseMoveNumber();

        // Update History
        if (!isUndoMove) {
            this.updateHistory({
                fromSquareIdx: move.fromSquare,
                toSquareIdx: move.toSquare,
                isCaptureMove,
                isCastlingMove,
                capturedPiece
            });
            this.updateChessNotation();
            console.log('Updated History: ', this.movesHistory);
        }

        // Update state
        this.chessboard.updateSideToMove();
        this.chessboard.getAllLegalMoves();

        // TODO
        // this.chessboard.isCheckmate();
    }

    private updateKingSquares(fromSquarePieceType: PieceType, toSquare: Squares) {
        if (fromSquarePieceType === PieceType.WHITE_KING) {
            PieceBaseClass.KING_SQUARES[PieceColor.WHITE] = toSquare;
        } else if (fromSquarePieceType === PieceType.BLACK_KING) {
            PieceBaseClass.KING_SQUARES[PieceColor.BLACK] = toSquare;
        }
    }

    private updateHistory(move: MoveHistory) {
        this.movesHistory.push(
            {
                fromSquareIdx: move.fromSquareIdx,
                toSquareIdx: move.toSquareIdx,
                isCaptureMove: move.isCaptureMove,
                isCastlingMove: move.isCastlingMove,
                capturedPiece: move.capturedPiece
            }
        );
    }

    isLegalMove(move: MakeMove) {
        if (!ChessBoard.legalMoves.hasLegalMoves(move.fromSquare)) return false;

        const legalMoves = ChessBoard.legalMoves.legalMovesMap.get(move.fromSquare)!;
        return legalMoves.some((_move: Squares) => _move === move.toSquare);
    }

    redoMove(quantity?: number) {
        console.group("Redo Move Fn");
        console.log("History", this.movesHistory);
        console.log("Moves counter: ", this.movesHistory.length);
        console.log("Rewinded Moves counter: ", this.undoMoveCounter);
        console.groupEnd();

        const movesToRewind: number = quantity ?? 1;
        for (let index = 0; index < movesToRewind; index++) {
            if (this.undoMoveCounter === 0) return;

            this.undoMoveCounter--;
            const lastMove = this.movesHistory[this.movesHistory.length - (this.undoMoveCounter + 1)];
            if (!lastMove) return;

            const { fromSquareIdx: fromSquare, toSquareIdx: toSquare } = lastMove;
            this.executeMove({
                fromSquare,
                toSquare,
                rewindMove: false
            });
        }
    }

    /*
        - Get last move
        - Calculate the inverted coordinates. Es: If last move was e2 -> e4 now we need to execute the opposite e4 -> e2
        - Execute move
        - Remove from movesHistory
        - Update legal moves
    */
    undoMove(quantity?: number) {
        const movesToRewind: number = quantity ?? 1;

        for (let index = 0; index < movesToRewind; index++) {
            const lastMove = this.movesHistory[this.movesHistory.length - (this.undoMoveCounter + 1)];
            if (!lastMove) return;

            this.undoMoveCounter++;
            const { fromSquareIdx: fromSquare, toSquareIdx: toSquare } = lastMove;
            this.executeMove({ fromSquare: toSquare, toSquare: fromSquare, rewindMove: true, updateMoveHistory: true }); // TODO: updateMoveHistory -> false

            if (lastMove.isCaptureMove) {
                ChessBoard.board[lastMove.toSquareIdx] = lastMove.capturedPiece!;
            }
        }
    }

};
