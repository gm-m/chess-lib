import { GameStateEvaluator } from "../core/game-state-evaluator";
import { Board } from "../core/board";
import { PieceColor } from "../model/PieceColor.enum";
import { BoardPiece, Castling, InitBoard, Square, SquareDescription } from "../model/model";
import { MakeMove, MoveInvoker } from "../move/move-invoker";
import { MoveList } from "../move/move-list";
import { PieceBaseClass, PieceType } from "../piece/piece";
import { MoveGenerator } from '../move-generation/move-generator';
import { BoardPresenter } from "../core/board-presenter";
import {
    charToPieceType,
    squareToString,
    decodePieceColor,
    getCoordinates,
    getSquareColor,
    isAlphabetCharacter,
    isDigitCharacter
} from "../utils/utility";


// Convert board square indexes to coordinates
export const SQUARE_TO_COORDS = [
    "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "i8", "j8", "k8", "l8", "m8", "n8", "o8", "p8",
    "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "i7", "j7", "k7", "l7", "m7", "n7", "o7", "p7",
    "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "i6", "j6", "k6", "l6", "m6", "n6", "o6", "p6",
    "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "i5", "j5", "k5", "l5", "m5", "n5", "o5", "p5",
    "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "i4", "j4", "k4", "l4", "m4", "n4", "o4", "p4",
    "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "i3", "j3", "k3", "l3", "m3", "n3", "o3", "p3",
    "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "i2", "j2", "k2", "l2", "m2", "n2", "o2", "p2",
    "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", "i1", "j1", "k1", "l1", "m1", "n1", "o1", "p1",
] as const;


// -1 if not found
export const getSquareIndex = (stringSquare: string) => {
    return SQUARE_TO_COORDS.findIndex((square: string) => square === stringSquare);
};

function placeBackRankPieces() {
    const squares = [0, 1, 2, 3, 4, 5, 6, 7];

    // Place bishops on opposite colors
    const darkSquares = [1, 3, 5, 7];
    const lightSquares = [0, 2, 4, 6];
    const darkBishopPosition = darkSquares[Math.floor(Math.random() * darkSquares.length)];
    const lightBishopPosition = lightSquares[Math.floor(Math.random() * lightSquares.length)];

    const result = new Array(8).fill(null);
    result[darkBishopPosition] = 'b';
    result[lightBishopPosition] = 'b';

    // Place king and rooks
    const availableSquares = squares.filter(sq => result[sq] === null);
    const kingRookPositions = availableSquares.sort(() => Math.random() - 0.5).slice(0, 3);
    kingRookPositions.sort((a, b) => a - b);

    result[kingRookPositions[0]] = 'r';
    result[kingRookPositions[1]] = 'k';
    result[kingRookPositions[2]] = 'r';

    // Place queen and knights
    const remainingSquares = result.map((piece, index) => piece === null ? index : null).filter(sq => sq !== null);
    const [queenPosition, ...knightPositions] = remainingSquares.sort(() => Math.random() - 0.5);

    result[queenPosition] = 'q';
    knightPositions.forEach(pos => result[pos] = 'n');

    return result;
}

function generateFENString(backRank: string[]) {
    const fenParts = [];
    fenParts.push(backRank.join('')); // First rank (black pieces)
    fenParts.push('pppppppp'); // Second rank (black pawns)
    fenParts.push('8', '8', '8', '8'); // Empty ranks
    fenParts.push('PPPPPPPP'); // Seventh rank (white pawns)
    fenParts.push(backRank.join('').toUpperCase()); // Eighth rank (white pieces)

    return fenParts.join('/') + ' w KQkq - 0 1'; // ' w' (White to move), 'KQkq' (all castling rights available), '-' (no en passant square), '0 1' (zero halfmoves, first full move).
}

function generateFischerRandomFEN() {
    const backRank = placeBackRankPieces();
    return generateFENString(backRank);
}

export class ChessGame {
    boardState: Board;
    boardEvaluator: GameStateEvaluator;
    legalMoves: MoveList;
    moveGenerator: MoveGenerator;
    boardPresenter: BoardPresenter;

    side: PieceColor = PieceColor.WHITE;

    // Board State
    enpassant: Square | boolean = false;
    totalPieces = 0;
    halfMoveNumber = 0;
    fullMoveNumber = 0;
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    PGN: string = '';

    // TODO : Move to a better place
    isWhiteKingAttacked: boolean = false;
    isBlackKingAttacked: boolean = false;

    moveInvoker: MoveInvoker = new MoveInvoker(this);

    constructor(initSettings?: InitBoard) {
        this.boardState = new Board();
        this.boardEvaluator = new GameStateEvaluator(this.boardState);
        this.legalMoves = new MoveList();
        this.moveGenerator = new MoveGenerator();
        this.boardPresenter = new BoardPresenter(this.boardState);

        if (initSettings?.variant === "960") {
            this.fen = generateFischerRandomFEN();
        } else if (initSettings?.fen) {
            this.fen = initSettings.fen;
        }

        this.loadFen(this.fen);
    }

    public increaseMoveNumber() {
        this.fullMoveNumber++;
    }

    appendToPGN(pgn: string) {
        this.PGN += pgn;
    }

    resetBoard() {
        this.totalPieces = 0;
        this.iterateBoard((square: Square) => this.boardState.setPiece(square, PieceType.EMPTY));
    }

    getOppositeSideColor(side: PieceColor = this.side): PieceColor {
        return side === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    }

    updateSideToMove() {
        this.side = this.getOppositeSideColor();
    }

    // TODO: Replace hardcoded seventhRankSquares with the following
    //     [PieceColor.WHITE, [Square.a7, Square.h7]],
    //     [PieceColor.BLACK, [Square.a2, Square.h2]],
    static readonly seventhRankSquares: Map<PieceColor, number[]> = new Map([
        [PieceColor.WHITE, [16, 31]],
        [PieceColor.BLACK, [96, 103]],
    ]);

    // TODO: Replace hardcoded seventhRankSquares with the following
    //     [PieceColor.WHITE, [Square.a8, Square.h8]],
    //     [PieceColor.BLACK, [Square.a1, Square.h1]],
    static readonly eighthRankSquares: Map<PieceColor, number[]> = new Map([
        [PieceColor.WHITE, [0, 7]],
        [PieceColor.BLACK, [112, 119]],
    ]);

    public movePiece(move: MakeMove) {
        this.moveInvoker.executeMove(move);
    }

    public removePiece(square: Square) {
        const piece = this.getPiece(square);

        if (this.boardState.getPiece(square) === PieceType.EMPTY) return null;
        this.boardState.setPiece(square, PieceType.EMPTY);

        return piece;
    }

    public undoMove(quantity?: number) {
        this.moveInvoker.undoMove(quantity);
    }

    public redoMove(quantity?: number) {
        this.moveInvoker.redoMove(quantity);
    }

    private iterateBoard(callback: (square: Square, piece: PieceType) => void) {
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 16; file++) {
                const square: number = (rank * 16) + file;

                // If square is on Board
                if (!(square & 0x88)) {
                    const piece = this.boardState.getPiece(square);
                    if (piece !== PieceType.EMPTY) {
                        callback(square, piece);
                    }
                }
            }
        }
    }

    public isInCheck(side: PieceColor = this.side): boolean {
        return this.boardEvaluator.isSquareAttacked(PieceBaseClass.KING_SQUARES[side], this.getOppositeSideColor(side));
    }

    /*
        - Initial Check: Check if the current player is in check.
        - Iterating Over Legal Moves: Iterates over all legal moves for the current player.
        - Move Simulation: For each legal move, it simulates the move using movePiece().
        - Check for Checkmate: After making a move, checks if the player is still in check.
        - Undo Move: If the move doesn’t resolve the check, it undoes the move using this.undoMove().
    */
    public isCheckmate(): boolean {
        return this.boardEvaluator.isCheckmate(this.side, this.moveGenerator);
    }

    public isStaleMate(): boolean {
        return this.boardEvaluator.isStaleMate(this.side, this.moveGenerator);
    }

    // Combinations with insufficient material to checkmate include:
    // - King versus King
    // - King and Bishop vs King
    // - King and Knight vs king
    // - King and Bishop vs King and Bishop with the Bishops on the same color.

    public isInsufficientMaterial(): boolean {
        return this.boardEvaluator.isInsufficientMaterial();
    }

    // TODO
    public isThreefoldRepetition() {
        return true;
    }

    public isDraw() {
        return this.isStaleMate() || this.isInsufficientMaterial() || this.isThreefoldRepetition();
    }

    public isGameOver(): boolean {
        return this.isCheckmate() || this.isDraw();
    }


    getFen() {
        let fen = '';

        for (let rank = 0; rank < 8; rank++) {
            let file: number = 0;
            let emptySquares = 0;

            while (file < 16) {
                let square: number = (rank * 16) + file;

                // If square is on Board
                if (!(square & 0x88)) {
                    const piece = this.boardState.getPiece(square);

                    if (piece === PieceType.EMPTY) {
                       emptySquares++;
                    } else {
                        if (emptySquares > 0) fen += emptySquares;
                        fen += piece;

                        emptySquares = 0;
                    }
                }

                file++;
            }

            if (emptySquares > 0) fen += emptySquares;
            if (rank < 7) fen += '/';
        }

        // Append side to move
        fen += ' ' + decodePieceColor(this.side);

        // Append enpassant
        if (this.enpassant === false) fen += ' -';

        // Append moves number
        fen += ` ${this.halfMoveNumber}`;
        fen += ` ${this.fullMoveNumber || 1}`;

        // TODO: Castling

        return fen;
    }

    public loadFen(fen: string) {
        this.resetBoard();

        let fenIterator = fen[Symbol.iterator]();
        let nextFenChar: string = fenIterator.next().value || '';
        for (let rank = 0; rank < 8; rank++) {
            let file: number = 0;

            while (file < 16) {
                let square: number = (rank * 16) + file;

                // If square is on Board
                if (!(square & 0x88)) {
                    if (isAlphabetCharacter(nextFenChar)) {
                        if (nextFenChar === PieceType.WHITE_KING) {
                            PieceBaseClass.KING_SQUARES[PieceColor.WHITE] = square;
                            // console.log("KING_SQUARES:", PieceBaseClass.KING_SQUARES);
                        } else if (nextFenChar === PieceType.BLACK_KING) {
                            PieceBaseClass.KING_SQUARES[PieceColor.BLACK] = square;
                            // console.log("KING_SQUARES:", PieceBaseClass.KING_SQUARES);
                        }

                        // Set the piece on board
                        this.boardState.setPiece(square, charToPieceType(nextFenChar));
                        ++this.totalPieces;
                        nextFenChar = fenIterator.next().value || '';
                    }

                    // Match empty squares
                    if (isDigitCharacter(nextFenChar)) {
                        // Decrement file on empty squares
                        if (this.boardState.getPiece(square) === PieceType.EMPTY) {
                            file--;
                        }

                        // Skip empty squares
                        file += parseInt(nextFenChar);

                        nextFenChar = fenIterator.next().value || '';
                    }

                    // Match end of rank
                    if (nextFenChar === '/') {
                        nextFenChar = fenIterator.next().value || '';
                    }
                }

                file++;
            }
        }

        // console.group("Fen Analisys");
        nextFenChar = fenIterator.next().value || '';
        this.side = nextFenChar === 'w' ? PieceColor.WHITE : PieceColor.BLACK;
        // console.log("Player:", this.side === PieceColor.WHITE ? "White" : "Black");

        nextFenChar = fenIterator.next().value || ''; // Move to the character after side to move
        nextFenChar = fenIterator.next().value || ''; // and the space after
        // console.log("Fen After Side To Move: ", nextFenChar);
        // console.log("Next Char Val: ", nextFenChar);

        // Castling rights
        if (nextFenChar !== '-') {
            while (nextFenChar !== ' ' && nextFenChar !== '') {
                switch (nextFenChar) {
                    case 'K': PieceBaseClass.CASTLE |= Castling.KC; break;
                    case 'Q': PieceBaseClass.CASTLE |= Castling.QC; break;
                    case 'k': PieceBaseClass.CASTLE |= Castling.kc; break;
                    case 'q': PieceBaseClass.CASTLE |= Castling.qc; break;
                    default: break;
                }
                nextFenChar = fenIterator.next().value || '';
            }
        } else {
            // Skip the '-'
            nextFenChar = fenIterator.next().value || '';
        }

        // Skip the space after castling rights
        nextFenChar = fenIterator.next().value || '';

        // En-passant square
        if (nextFenChar !== '-') {
            const file = nextFenChar.charCodeAt(0) - 'a'.charCodeAt(0);
            const rank = 8 - parseInt(fenIterator.next().value || '0');
            this.enpassant = rank * 16 + file;
        } else {
            this.enpassant = false;
        }


        // console.log("Enpassant: ", this.enpassant);
        // console.log("Pieces on board:", this.totalPieces);
        // console.groupEnd();

        this.getAllLegalMoves();
    }

    private extractFenFromPgn(pgn: string) {
        const indexOfFirstFenChar = (line: string) => line.indexOf('"');
        const indexOfLastFenChar = (line: string) => line.lastIndexOf('"');

        const lines = pgn.split('\n');
        for (const line of lines) {
            if (line.substring(1, 4) === 'FEN') {
                const startIndex = indexOfFirstFenChar(line);
                const endIndex = indexOfLastFenChar(line);

                if (startIndex !== -1 && endIndex !== -1) {
                    const fen = line.substring(startIndex + 1, endIndex);
                    return fen;  // Stop the loop once FEN is found
                }
            }
        }

        return null;  // Return null if no FEN is found
    }

    public loadPgn(pgn: string) {
        const fen = this.extractFenFromPgn(pgn);
        fen ? this.loadFen(fen) : this.loadFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }

    public exportPGN() {
        return "TODO";
    }

    public getAllLegalMoves(side?: PieceColor): Map<Square, Square[]> {
        this.legalMoves.resetState();

        // If a specific side is provided, use the MoveGenerator's generateMoves method
        if (side !== undefined) {
            this.moveGenerator.generateMoves(this.boardState, side);
            return this.legalMoves.legalMovesMap;
        }

        // Otherwise, iterate through the board and generate moves for all pieces
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 16; file++) {
                const square: number = (rank * 16) + file;

                // If square is on Board
                if (!(square & 0x88)) {
                    if (this.boardState.getPiece(square) !== PieceType.EMPTY) {
                        this.moveGenerator.generateMovesFromSquare(
                            square,
                            this.boardState,
                            this.legalMoves,
                            this.enpassant,
                            this.boardEvaluator
                        );
                    }
                }
            }
        }

        return this.legalMoves.legalMovesMap;
    }

    public isLegalMove(move: MakeMove) {
        const pieceColor = this.boardState.getPieceColor(move.fromSquare);
        const currentSideToMove = this.side;
        if (pieceColor !== currentSideToMove) return false;

        this.movePiece(move);
        const isKingInCheck = this.isInCheck(currentSideToMove);
        this.undoMove();

        return !isKingInCheck;
    }

    // TODO: Rename to filterIllegalMoves
    public filterPseudoLegalMoves() {
        const pseudoLegalMovesMap = this.legalMoves.legalMovesMap;
        const legalMovesMap: Map<Square, Square[]> = new Map();

        for (const [fromSquare, possibleMoves] of pseudoLegalMovesMap) {
            const legalTargets = possibleMoves.filter(toSquare =>
                this.isLegalMove({ fromSquare, toSquare, rewindMove: true, updateMoveHistory: true })
            );

            if (legalTargets.length) legalMovesMap.set(fromSquare, legalTargets);
        }

        return legalMovesMap;
    }

    public getMaterialAdvantage(): { w: number, b: number } {
        return this.boardEvaluator.getMaterialAdvantage();
    }

    private getPiece(square: Square) {
        return { piece: this.boardState.getPiece(square), color: decodePieceColor(this.boardState.getPieceColor(square)!) };
    }

    public getSquare(square: Square) {
        return { piece: this.boardState.getPiece(square), color: decodePieceColor(getSquareColor(square)) };
    }

    public getBoardPieces(): BoardPiece[] {
        return this.boardState.getBoardPieces();
    }

    // TODO: Rename. The current name does not comunicate clearly what this Fn does
    public getPieceSquares(pieceType: PieceType): SquareDescription[] {
        let coordinates: SquareDescription[] = [];

        this.iterateBoard((square: Square, piece: PieceType) => {
            if (piece === pieceType) {
                coordinates.push(getCoordinates(square));
            }
        });

        return coordinates;
    }

    public getFullMoveNumber(): number {
        return this.fullMoveNumber;
    }

    public getHistory() {
        return this.moveInvoker.movesHistory.map((move) => squareToString(move.toSquareIdx));
    }

    public clear() {
        this.totalPieces = 0;

        const emptyBoardFen = '8/8/8/8/8/8/8/8 w - - 0 1';
        this.loadFen(emptyBoardFen);
    }

    public getAscii(): string {
        return this.boardPresenter.getAscii();
    }

    public prettyPrint(): void {
        this.boardPresenter.prettyPrint();
    }

}

/*

8    0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13,  14,  15,
7   16,  17,  18,  19,  20,  21,  22,  23,  24,  25,  26,  27,  28,  29,  30,  31,
6   32,  33,  34,  35,  36,  37,  38,  39,  40,  41,  42,  43,  44,  45,  46,  47,
5   48,  49,  50,  51,  52,  53,  54,  55,  56,  57,  58,  59,  60,  61,  62,  63,
4   64,  65,  66,  67,  68,  69,  70,  71,  72,  73,  74,  75,  76,  77,  78,  79,
3   80,  81,  82,  83,  84,  85,  86,  87,  88,  89,  90,  91,  92,  93,  94,  95,
2   96,  97,  98,  99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
1  112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,

     a    b    c    d    e    f    g    h

*/
