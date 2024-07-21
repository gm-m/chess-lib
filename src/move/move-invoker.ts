import { ChessBoard, Squares } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import { BLACK_PROMOTION_PIECES, PieceBaseClass, PieceType, WHITE_PROMOTION_PIECES } from "../piece/piece";
import { charToPieceType, decodeEnum } from "../utility";


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
    captureMove: boolean;
    castlingMove: boolean;
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
            console.log("Last move: ", lastMove);

            let lastMovePiece = ChessBoard.board[lastMove.toSquareIdx].toUpperCase();
            if (lastMovePiece === "P") {
                lastMovePiece = '';
            }
            const captureMove = lastMove.captureMove ? "x" : "";

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

        console.log("PGN", this.chessboard.PGN);
    }

    async executeMove(fromMove: Move, toMove: Move, updateMoveHistory: boolean = true) {
        /*
            Check for promotion moves:
            0 - Get the fromSquare pieceType. If it's a pawn then check if it's a promotion move

            Update State:
            1 - Move piece fromSquare to toSquare
            2 - Remove piece from fromSquare

            Switch Side:
            3 - Update side to move

            Verify Check or Checkmate:
            4 - Verify if there is any Check or Checkmate
        */

        // Update king squares
        const fromSquarePieceType: PieceType = charToPieceType(ChessBoard.board[fromMove.square]);
        this.updateKingSquares(fromSquarePieceType, toMove);

        // Detect capture move
        const isCaptureMove = ChessBoard.board[toMove.square] !== PieceType.EMPTY;

        function extractXLastDigits(extractNumber: number, digitsNum: number) {
            const numBaseString = extractNumber.toString();
            return +numBaseString.slice(numBaseString.length - digitsNum);
        }

        console.log("From move square idx: ", fromMove.square);
        const encodedMoves = ChessBoard.legalMoves.encodedMovesMap.get(fromMove.square);
        const encodedMove = encodedMoves?.find((move: number) => extractXLastDigits(move, toMove.square.toString().length) === toMove.square);
        const isCastlingMove = Boolean(ChessBoard.legalMoves.getMoveCastling(encodedMove!));
        console.log(ChessBoard.legalMoves.encodedMovesMap);
        console.log("encodedMove:", encodedMove);
        console.log("isCastlingMove:", isCastlingMove);


        // Promotion move
        // const promotionPiece = await this.getPromotionPiece(fromSquarePieceType, fromMove, toMove);
        // if (promotionPiece) {
        //     ChessBoard.board[toMove.square] = promotionPiece;
        //     toMove.pieceRappresentation = getHtmlPieceRappresentation(promotionPiece);
        // } else {
        //     ChessBoard.board[toMove.square] = ChessBoard.board[fromMove.square];
        // }

        ChessBoard.board[toMove.square] = ChessBoard.board[fromMove.square];
        ChessBoard.board[fromMove.square] = PieceType.EMPTY;

        if (updateMoveHistory) {
            this.movesHistory.push(
                {
                    fromSquareIdx: fromMove.square,
                    toSquareIdx: toMove.square,
                    captureMove: isCaptureMove,
                    castlingMove: isCastlingMove,
                }
            );

            this.updateChessNotation();
            console.log('Update History: ', this.movesHistory);
        } else {
            // When Rewinding || Redo move
            console.log('Do not update History: ', this.movesHistory);
        }

        this.chessboard.resetHighlightedSquares();
        ChessBoard.legalMoves.resetLegalMoves();

        // Stalemate && Flip side
        this.chessboard.isStaleMate();

        // All legal moves per Side
        // this.chessboard.getAllLegalMoves();

        // Is King in Check
        // this.chessboard.isInCheck();
    }

    private updateKingSquares(fromSquarePieceType: PieceType, toMove: Move) {
        if (fromSquarePieceType === PieceType.WHITE_KING) {
            PieceBaseClass.KING_SQUARES[PieceColor.WHITE] = toMove.square;
        } else if (fromSquarePieceType === PieceType.BLACK_KING) {
            PieceBaseClass.KING_SQUARES[PieceColor.BLACK] = toMove.square;
        }
    }

    // private getLegalMove(piece: PieceType, coordinates: Squares){
    // }

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
            this.executeMove({ square: fromSquare }, { square: toSquare }, false);
        }
    }

    rewindMove(quantity?: number) {
        /*
            - Get last move
            - Calculate the inverted coordinates. Es: If last move was e2 -> e4 now we need to execute the opposite e4 -> e2
            - Execute move
            - Update click event listeners
            - Remove it from movesHistory
        */

        const movesToRewind: number = quantity ?? 1;
        for (let index = 0; index < movesToRewind; index++) {

            const lastMove = this.movesHistory[this.movesHistory.length - (this.undoMoveCounter + 1)];
            if (!lastMove) {
                return;
            }

            this.undoMoveCounter++;
            const { fromSquareIdx: fromSquare, toSquareIdx: toSquare } = lastMove;
            this.executeMove(
                { square: toSquare },
                { square: fromSquare, },
                false
            );

            const lastMoveInverted: Squares[] = [lastMove.toSquareIdx, lastMove.fromSquareIdx];
            console.group("Rewind Move Fn");
            console.log("This", this);
            console.log("Moves counter: ", this.movesHistory.length);
            console.log("Last move: ", this.movesHistory.at(-1));
            console.log("From Square: ", fromSquare);
            console.log("To Square: ", toSquare);
            console.log("Inverted Coords: ", lastMoveInverted);
            console.log("Board", ChessBoard.board);
            console.groupEnd();
        }
    }

};
