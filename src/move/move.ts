import { ChessBoard, SQUARE_TO_COORDS, Squares, } from "../chessboard";
import { PieceColor } from "../enum/PieceColor";
import King from "../piece/king";
import { WHITE_PROMOTION_PIECES, BLACK_PROMOTION_PIECES, PieceType, PieceBaseClass } from "../piece/piece";
import { charToPieceType, customLog, decodeEnum, getHtmlPieceRappresentation, getPieceColor } from "../utility";


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
// Maybe it's better to avoid any type of converion and instead change the Move interface so that boolean became a number;
// Check if macros exists in Javascript. If so convert thi function into a Macro in order to get a performance boost
export function encodeMove(rawMove: EncodeMove): number {
    return (rawMove.source)
        | (rawMove.targetSquare << 7)
        | (+rawMove.piece << 14)
        | (+rawMove.capture << 18)
        | (+rawMove.pawn << 19)
        | (+rawMove.enpassant << 20)
        | (+rawMove.castling << 21);
}

export class MoveList {
    counter: number = 0;
    executed: number[] = [];
    map: Map<Squares, Squares[]> = new Map();

    constructor() {
    }

    // Decode move's source flag
    private getMoveSource(encoded_move: number): Squares {
        return encoded_move & 0x7f;
    }

    // Decode move's target flag
    private getMoveTarget(encoded_move: number): Squares {
        return (encoded_move >> 7) & 0x7f;
    }

    public resetLegalMoves() {
        // Remove highlighted squares from DOM
        for (const [key, value] of this.map) {
            value.forEach((legalMove: Squares) => {
                const htmlEl = document.getElementById(SQUARE_TO_COORDS[legalMove]);

                if (htmlEl && htmlEl.classList.contains("move-dest")) {
                    htmlEl.classList.remove("move-dest");
                }
            });
        }

        this.map.clear();
    }

    public resetMap() {
        this.map.clear();
    }

    public resetExecuted() {
        this.executed = [];
    }

    public add(encodeMove: number) {
        const [key, targetSquare]: [Squares, Squares] = [this.getMoveSource(encodeMove), this.getMoveTarget(encodeMove)];
        this.map.set(key, [...(this.map.get(key) || []), targetSquare]);
    }

    public getExecutedMoves(): string[] {
        let decodedMoves: string[] = [];
        this.executed.forEach((move: number) => {
            decodedMoves.push(SQUARE_TO_COORDS[this.getMoveSource(move)], SQUARE_TO_COORDS[this.getMoveTarget(move)]);
        });

        return decodedMoves;
    }

    public printLegalMoves() {
        if (this.map.size === 0) {
            console.log("No legal moves");
            return;
        }

        console.log([...this.map.values()]);
    }

    public decodeLegalMoves() {
        if (this.map.size === 0) {
            console.log("No legal moves");
            return;
        }

        return [...this.map.values()].flat().map(el => decodeEnum(el));
    }

    public printMoves() {
        this.executed.forEach((move: number) => {
            console.log(SQUARE_TO_COORDS[this.getMoveSource(move)], SQUARE_TO_COORDS[this.getMoveTarget(move)]);
        });
    }
}

export interface Move {
    square: Squares;
    pieceRappresentation?: string;
}

export class MoveInvoker {
    constructor(private chessboard: ChessBoard) {
        console.log("Chessboard: ", chessboard);
    }

    movesHistory: [Squares, string, Squares, string][] = [];
    undoMoveCounter: number = 0;

    async executeMove(fromMove: Move, toMove: Move, updateMoveHistory: boolean = true) {
        // executeMove(fromSquare: Squares, toSquare: Squares, updateMoveHistory: boolean = true) {
        /*
            0 - Get the fromSquare pieceType. If it's a pawn then check if it's a promotion move
            1 - Move piece fromSquare to toSquare
            2 - Update toSquare HTML
            3 - Remove piece from fromSquare
            4 - Remove event listener from fromSquare
            5 - Update fromSquare HTML
            6 - Update side to move
            7 - Verify if there is any Check or Checkmate
        */

        // Update king squares
        const fromSquarePiece: PieceType = charToPieceType(ChessBoard.board[fromMove.square]);
        if (fromSquarePiece === PieceType.WHITE_KING) {
            PieceBaseClass.KING_SQUARES[PieceColor.WHITE] = toMove.square;
        }
        if (fromSquarePiece === PieceType.BLACK_KING) {
            PieceBaseClass.KING_SQUARES[PieceColor.BLACK] = toMove.square;
        }

        // Detect promotion move
        let promotionTime = false;
        let piecePromotion;

        const fromSquareColor = getPieceColor(fromMove.square);
        if (fromSquareColor !== undefined) {
            const isPawn = fromSquarePiece === PieceType.WHITE_PAWN || fromSquarePiece === PieceType.BLACK_PAWN;
            const pieceColorEighthRankSquares: number[] = ChessBoard.eighthRankSquares.get(fromSquareColor)!;
            if (isPawn && (toMove.square >= pieceColorEighthRankSquares[0] && toMove.square <= pieceColorEighthRankSquares[1])) {
                console.log("Promotion Time");
                document.getElementById("promotionDiv")!.style.display = "flex";
                promotionTime = true;
                // this.runPiecePromotion(toMove);
                piecePromotion = await this.piecePromotion();
            }
        }


        // Move piece && Handle promotion move
        const fromSquarePieceType: PieceType = charToPieceType(ChessBoard.board[fromMove.square]);
        if (promotionTime) {
            if (piecePromotion) {
                ChessBoard.board[toMove.square] = piecePromotion;
                toMove.pieceRappresentation = getHtmlPieceRappresentation(piecePromotion);
            }
        } else {
            ChessBoard.board[toMove.square] = ChessBoard.board[fromMove.square];
        }

        // ChessBoard.board[toMove.square] = ChessBoard.board[fromMove.square];
        ChessBoard.board[fromMove.square] = PieceType.EMPTY;

        const fromSquareHtmlEl = document.getElementById(SQUARE_TO_COORDS[fromMove.square]);
        const toSquareHtmlEl = document.getElementById(SQUARE_TO_COORDS[toMove.square]);
        if (fromSquareHtmlEl && toSquareHtmlEl) {
            if (updateMoveHistory) {
                // this.movesHistory.push([fromSquare, toSquare]);
                this.movesHistory.push([fromMove.square, fromSquareHtmlEl.innerHTML, toMove.square, toSquareHtmlEl.innerHTML]);
                console.log('Update History: ', this.movesHistory);
            } else {
                // Rewind || Redo move
                console.log('Do not update History: ', this.movesHistory);
            }

            toSquareHtmlEl.innerHTML = toMove.pieceRappresentation || fromSquareHtmlEl.innerHTML;
            toSquareHtmlEl.classList.add("piece");
            toSquareHtmlEl.removeEventListener('click', this.chessboard.eventListenerHandlers.get(toMove.square));

            fromSquareHtmlEl.innerText = "";
            fromSquareHtmlEl.classList.remove("piece");
            this.chessboard.resetHighlightedSquares(fromMove.square, true);
            // fromSquareHtmlEl.removeEventListener('click', this.chessboard.eventListenerHandlers.get(fromSquare));

            // Add click event listener
            this.chessboard.addCLickListener(toMove.square, toSquareHtmlEl);
        }

        ChessBoard.legalMoves.resetLegalMoves();

        // Flip side
        const previousSide = ChessBoard.side;
        this.chessboard.switchSide();

        /*
            Stalemate
        */
        console.groupCollapsed("Stalemate");
        King.getLegalMoves(PieceBaseClass.KING_SQUARES[ChessBoard.side], ChessBoard.side);
        console.log("All Legal Move: ", ChessBoard.legalMoves.map.get(PieceBaseClass.KING_SQUARES[ChessBoard.side]));
        // this.chessboard.highlightSquares(PieceBaseClass.KING_SQUARES[ChessBoard.side]);
        const isKingBlocked = ChessBoard.legalMoves.map.get(PieceBaseClass.KING_SQUARES[ChessBoard.side])!.every((legalMove: Squares) => {
            console.log("Legal Move: ", legalMove);
            console.log("Is Square Attacked: ", ChessBoard.isSquareAttacked(legalMove, previousSide));

            return ChessBoard.isSquareAttacked(legalMove, previousSide);
        });
        ChessBoard.legalMoves.resetLegalMoves();
        console.log("isKingBlocked: ", isKingBlocked);

        let movesAvailable = false;
        for (let square = 0; square < ChessBoard.board.length; square++) {
            const isKing = square === PieceBaseClass.KING_SQUARES[ChessBoard.side];
            if (!(square & 0x88) && ChessBoard.board[square] !== PieceType.EMPTY && !isKing) {
                const pieceColor = getPieceColor(square);

                if (pieceColor && pieceColor === ChessBoard.side) {
                    this.chessboard.getLegalMovesFromSquare(square);
                    const legalMoves = ChessBoard.legalMoves.map.get(square);
                    if (legalMoves && legalMoves.length > 0) {
                        movesAvailable = true;
                        break;
                    }
                }
            }
        }
        console.log("movesAvailable for non king: ", movesAvailable);

        if (!movesAvailable && isKingBlocked) {
            customLog("Stalemate 100%");
        } else {
            customLog("No Stalemate cowboy");
        }
        console.groupEnd();
        /*
            Check or Checkmates
        */

        const isKingAttacked = ChessBoard.isSquareAttacked(PieceBaseClass.KING_SQUARES[ChessBoard.side], previousSide);
        if (ChessBoard.side === PieceColor.WHITE) {
            this.chessboard.isWhiteKingAttacked = isKingAttacked;
            customLog(`is White King Attacked: ${isKingAttacked}`);
        } else {
            this.chessboard.isBlackKingAttacked = isKingAttacked;
            customLog(`is Black King Attacked: ${isKingAttacked}`);
        }
    }

    redoMove(quantity?: number) {
        console.group("Redo Move Fn");
        console.log("History", this.movesHistory);
        console.log("Moves counter: ", this.movesHistory.length);
        console.log("Rewinded Moves counter: ", this.undoMoveCounter);
        console.groupEnd();

        const movesToRewind: number = quantity ?? 1;
        for (let index = 0; index < movesToRewind; index++) {
            if (this.undoMoveCounter === 0) {
                return;
            }

            this.undoMoveCounter--;
            // const lastMove: Squares[] | undefined = this.movesHistory[this.movesHistory.length - (this.undoMoveCounter + 1)];
            const lastMove = this.movesHistory[this.movesHistory.length - (this.undoMoveCounter + 1)];
            if (!lastMove) {
                return;
            }

            const [fromSquare, fromSquarePieceRappresentation, toSquare, toSquarePieceRappresentation] = lastMove;
            this.executeMove(
                { square: fromSquare, pieceRappresentation: fromSquarePieceRappresentation },
                { square: toSquare, pieceRappresentation: toSquarePieceRappresentation },
                false
            );
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
            const [fromSquare, fromSquarePieceRappresentation, toSquare, toSquarePieceRappresentation] = lastMove;
            this.executeMove(
                { square: toSquare, pieceRappresentation: toSquarePieceRappresentation },
                { square: fromSquare, pieceRappresentation: fromSquarePieceRappresentation },
                false
            );

            const lastMoveInverted: Squares[] = [lastMove[2], lastMove[0]];
            console.group("Rewind Move Fn");
            console.log("This", this);
            console.log("Moves counter: ", this.movesHistory.length);
            console.log("Last move: ", this.movesHistory[this.movesHistory.length - 1]);
            console.log("From Square: ", fromSquare);
            console.log("To Square: ", toSquare);
            console.log("Inverted Coords: ", lastMoveInverted);
            console.log("Board", ChessBoard.board);
            console.groupEnd();
        }
    }

    // Code reference: https://codepen.io/bjkim/pen/JjXKjvr
    piecePromotion() {
        return new Promise<PieceType>(resolve => {
            const onClick = (promoteTo: PieceType) => {
                document.getElementById('promotionDiv')!.style.display = 'none';
                resolve(promoteTo);
            };

            let elementsArray = document.querySelectorAll(".promotion");
            // TODO: Black piece promotion
            const piecePromotionMap: Map<string, PieceType> = new Map([
                ["knightPromotion", PieceType.WHITE_KNIGHT],
                ["bishopPromotion", PieceType.WHITE_BISHOP],
                ["rookPromotion", PieceType.WHITE_ROOK],
                ["queenPromotion", PieceType.WHITE_QUEEN],
            ]);

            elementsArray.forEach(elem => {
                elem.addEventListener('click', onClick.bind(null, piecePromotionMap.get(elem.id)!));
            });
        });
    };

    /*     async runPiecePromotion(move: Move) {
            const piecePromotion = await this.asyncConfirm();
            if (piecePromotion) {
                ChessBoard.board[move.square] = piecePromotion;
                move.pieceRappresentation = getHtmlPieceRappresentation(piecePromotion);
                console.log('Promoted to', piecePromotion);
            }
        }; */
};
