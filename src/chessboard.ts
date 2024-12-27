import { PieceColor } from "./enum/PieceColor";
import { MakeMove, MoveInvoker } from "./move/move-invoker";
import { MoveList } from "./move/move-list";
import Bishop from "./piece/bishop";
import King from "./piece/king";
import Knight from "./piece/knight";
import Pawn from "./piece/pawn";
import { PieceBaseClass, PieceType } from "./piece/piece";
import Rook from "./piece/rook";
import {
    charToPieceType,
    decodeEnum,
    decodePieceColor,
    getPieceColor,
    getSquareColor,
    isAlphabetCharacter,
    isDigitCharacter
} from "./utility";


export enum Castling {
    KC = 1,
    QC = 2,
    kc = 4,
    qc = 8,
}

export enum Square {
    a8 = 0,
    b8,
    c8,
    d8,
    e8,
    f8,
    g8,
    h8,
    a7 = 16,
    b7,
    c7,
    d7,
    e7,
    f7,
    g7,
    h7,
    a6 = 32,
    b6,
    c6,
    d6,
    e6,
    f6,
    g6,
    h6,
    a5 = 48,
    b5,
    c5,
    d5,
    e5,
    f5,
    g5,
    h5,
    a4 = 64,
    b4,
    c4,
    d4,
    e4,
    f4,
    g4,
    h4,
    a3 = 80,
    b3,
    c3,
    d3,
    e3,
    f3,
    g3,
    h3,
    a2 = 96,
    b2,
    c2,
    d2,
    e2,
    f2,
    g2,
    h2,
    a1 = 112,
    b1,
    c1,
    d1,
    e1,
    f1,
    g1,
    h1,
    no_sq,
}

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

/*
    - File (string). Only letters beetwen 'a' and 'h'
    - Rank (number). Only numbers beetwen 1 and 8
*/
export type PieceCoordinates = [string, number];
export type BoardPiece = { square: string, piece: PieceType; color: 'w' | 'b'; };

export type GameVariant = 'standard' | '960';

export type InitBoard = {
    fen?: string;
    variant?: GameVariant;
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


export class ChessBoard {
    static instance: ChessBoard;
    static enpassant = Square.no_sq;

    static board: PieceType[] = [
        PieceType.BLACK_ROOK,
        PieceType.BLACK_KNIGHT,
        PieceType.BLACK_BISHOP,
        PieceType.BLACK_QUEEN,
        PieceType.BLACK_KING,
        PieceType.BLACK_BISHOP,
        PieceType.BLACK_KNIGHT,
        PieceType.BLACK_ROOK,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.BLACK_PAWN,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.EMPTY,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.WHITE_PAWN,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.WHITE_ROOK,
        PieceType.WHITE_KNIGHT,
        PieceType.WHITE_BISHOP,
        PieceType.WHITE_QUEEN,
        PieceType.WHITE_KING,
        PieceType.WHITE_BISHOP,
        PieceType.WHITE_KNIGHT,
        PieceType.WHITE_ROOK,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
        PieceType.OUT_BOARD,
    ];

    static legalMoves = new MoveList();
    static side: PieceColor = PieceColor.WHITE;

    // Board State
    enpassant = false;
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
        if (ChessBoard.instance) {
            return ChessBoard.instance;
        }

        ChessBoard.instance = this;

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
        this.iterateBoard((square: Square) => ChessBoard.board[square] = PieceType.EMPTY);
    }

    static getOppositeSideColor(side: PieceColor = ChessBoard.side): PieceColor {
        return side === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    }

    updateSideToMove() {
        ChessBoard.side = ChessBoard.getOppositeSideColor();
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

    /*
        square = number
        color = Attacked from color
    */
    static isSquareAttacked(square: Square, attackedFromColor: PieceColor): boolean {
        // PAWNS
        if (attackedFromColor === PieceColor.WHITE) {
            if (!(square + 17 & 0x88) && ChessBoard.board[square + 17] === PieceType.WHITE_PAWN) {
                return true;
            }

            if (!(square + 15 & 0x88) && ChessBoard.board[square + 15] === PieceType.WHITE_PAWN) {
                return true;
            }
        } else {
            if (!(square - 17 & 0x88) && ChessBoard.board[square - 17] === PieceType.BLACK_PAWN) {
                return true;
            }

            if (!(square - 15 & 0x88) && ChessBoard.board[square - 15] === PieceType.BLACK_PAWN) {
                return true;
            }
        }

        // KNIGHTS
        for (let index = 0; index < PieceBaseClass.KNIGHT_OFFSETS.length; index++) {
            let offset = PieceBaseClass.KNIGHT_OFFSETS[index];

            if (!(square + offset & 0x88)) {
                if (attackedFromColor === PieceColor.WHITE) {
                    if (ChessBoard.board[square + offset] === PieceType.WHITE_KNIGHT) {
                        return true;
                    }
                } else {
                    if (ChessBoard.board[square + offset] === PieceType.BLACK_KNIGHT) {
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
                    if (ChessBoard.board[targetSquare] === PieceType.WHITE_BISHOP || ChessBoard.board[targetSquare] === PieceType.WHITE_QUEEN) {
                        return true;
                    }
                } else {
                    if (ChessBoard.board[targetSquare] === PieceType.BLACK_BISHOP || ChessBoard.board[targetSquare] === PieceType.BLACK_QUEEN) {
                        return true;
                    }
                }

                if (ChessBoard.board[targetSquare] !== PieceType.EMPTY) {
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
                    if (ChessBoard.board[targetSquare] === PieceType.WHITE_ROOK || ChessBoard.board[targetSquare] === PieceType.WHITE_QUEEN) {
                        return true;
                    }
                } else {
                    if (ChessBoard.board[targetSquare] === PieceType.BLACK_ROOK || ChessBoard.board[targetSquare] === PieceType.BLACK_QUEEN) {
                        return true;
                    }
                }

                if (ChessBoard.board[targetSquare] !== PieceType.EMPTY) {
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
                    if (ChessBoard.board[square + offset] === PieceType.WHITE_KING) {
                        return true;
                    }
                } else {
                    if (ChessBoard.board[square + offset] === PieceType.BLACK_KING) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public movePiece(move: MakeMove) {
        this.moveInvoker.executeMove(move);
    }

    public removePiece(square: Square) {
        const piece = this.getPiece(square);

        if (ChessBoard.board[square] === PieceType.EMPTY) return null;
        ChessBoard.board[square] = PieceType.EMPTY;

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
                    const piece = ChessBoard.board[square];
                    if (piece !== PieceType.EMPTY) {
                        callback(square, piece);
                    }
                }
            }
        }
    }

    public isInCheck(side: PieceColor = ChessBoard.side): boolean {
        return ChessBoard.isSquareAttacked(PieceBaseClass.KING_SQUARES[side], ChessBoard.getOppositeSideColor(side));
    }

    /*
        - Initial Check: Check if the current player is in check.
        - Iterating Over Legal Moves: Iterates over all legal moves for the current player.
        - Move Simulation: For each legal move, it simulates the move using movePiece().
        - Check for Checkmate: After making a move, checks if the player is still in check.
        - Undo Move: If the move doesn’t resolve the check, it undoes the move using this.undoMove().
    */
    public isCheckmate(): boolean {
        if (!this.isInCheck()) return false;

        const currentSideToMove = ChessBoard.side;
        const legalMovesMap = new Map(ChessBoard.legalMoves.legalMovesMap); // Shallow copy of the og map, since it will get modified durint the execution of the moves
        for (const [square, _] of legalMovesMap) {
            if (getPieceColor(square) !== currentSideToMove) continue;

            const legalMoves = legalMovesMap.get(square);
            if (legalMoves) {
                for (let index = 0; index < legalMoves.length; index++) {
                    const targetSquare = legalMoves[index];

                    this.movePiece({ fromSquare: square, toSquare: targetSquare, updateMoveHistory: true });

                    if (this.isInCheck(currentSideToMove) === false) {
                        console.log("No checkmate, because of square:", targetSquare);
                        return false;
                    }

                    this.undoMove();
                    this.moveInvoker.undoMoveCounter = 0;
                }
            }
        }

        return true;
    }

    public isStaleMate(): boolean {
        return !this.isInCheck() && this.getAllLegalMoves(ChessBoard.side).size === 0;
    }

    // Combinations with insufficient material to checkmate include:
    // - King versus King
    // - King and Bishop vs King
    // - King and Knight vs king
    // - King and Bishop vs King and Bishop with the Bishops on the same color.

    public isInsufficientMaterial(): boolean {
        const pieceCount = new Map<PieceType, number>();
        const bishopColors: PieceColor[] = [];

        this.iterateBoard((square: Square, piece: PieceType) => {
            pieceCount.set(piece, ((pieceCount.get(piece) || 0) + 1));
            if (piece === PieceType.BLACK_BISHOP || piece === PieceType.WHITE_BISHOP) {
                bishopColors.push(getSquareColor(square)!);
            }
        });

        if (this.totalPieces === 2) return true; // King vs King
        if (this.isKingVsKingAndMinorPiece(pieceCount)) return true;
        if (this.isKingAndBishopVsKingAndBishop(pieceCount, bishopColors)) return true;

        return false;
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

    private isKingVsKingAndMinorPiece(pieceCount: Map<PieceType, number>): boolean {
        if (this.totalPieces !== 3) return false;

        const minorPieces = [
            PieceType.WHITE_BISHOP,
            PieceType.BLACK_BISHOP,
            PieceType.WHITE_KNIGHT,
            PieceType.BLACK_KNIGHT
        ];

        return minorPieces.some(piece => pieceCount.get(piece) === 1);
    }

    private isKingAndBishopVsKingAndBishop(pieceCount: Map<PieceType, number>, bishopColors: PieceColor[]): boolean {
        if (this.totalPieces !== 4) return false;

        const whiteBishopCount = pieceCount.get(PieceType.WHITE_BISHOP) || 0;
        const blackBishopCount = pieceCount.get(PieceType.BLACK_BISHOP) || 0;

        if (whiteBishopCount !== 1 || blackBishopCount !== 1) return false;

        return bishopColors[0] === bishopColors[1];
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
                    const piece = ChessBoard.board[square];

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
        fen += ' ' + decodePieceColor(ChessBoard.side);

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
        let nextFenChar: string = fenIterator.next().value;
        for (let rank = 0; rank < 8; rank++) {
            let file: number = 0;

            while (file < 16) {
                let square: number = (rank * 16) + file;

                // If square is on Board
                if (!(square & 0x88)) {
                    if (isAlphabetCharacter(nextFenChar)) {
                        if (nextFenChar === PieceType.WHITE_KING) {
                            PieceBaseClass.KING_SQUARES[PieceColor.WHITE] = square;
                            console.log("KING_SQUARES:", PieceBaseClass.KING_SQUARES);
                        } else if (nextFenChar === PieceType.BLACK_KING) {
                            PieceBaseClass.KING_SQUARES[PieceColor.BLACK] = square;
                            console.log("KING_SQUARES:", PieceBaseClass.KING_SQUARES);
                        }

                        // Set the piece on board
                        ChessBoard.board[square] = charToPieceType(nextFenChar);
                        ++this.totalPieces;
                        nextFenChar = fenIterator.next().value;
                    }

                    // Match empty squares
                    if (isDigitCharacter(nextFenChar)) {
                        // Decrement file on empty squares
                        if (ChessBoard.board[square] === PieceType.EMPTY) {
                            file--;
                        }

                        // Skip empty squares
                        file += parseInt(nextFenChar);

                        nextFenChar = fenIterator.next().value;
                    }

                    // Match end of rank
                    if (nextFenChar === '/') {
                        nextFenChar = fenIterator.next().value;
                    }
                }

                file++;
            }
        }

        console.group("Fen Analisys");
        nextFenChar = fenIterator.next().value;
        nextFenChar === 'w' ? (ChessBoard.side = PieceColor.WHITE, console.log("Player: White")) : (ChessBoard.side = PieceColor.BLACK, console.log("Player: Black"));

        nextFenChar = fenIterator.next().value && fenIterator.next().value;
        console.log("Fen After Side To Move: ", nextFenChar);
        // console.log("Next Char Val: ", nextFenChar);

        while (nextFenChar === '') {
            console.log("Until Whitespace: {}\n", nextFenChar);

            nextFenChar = fenIterator.next().value;
            switch (nextFenChar) {
                case PieceType.WHITE_KING:
                    PieceBaseClass.CASTLE |= Castling.KC;
                    break;
                case PieceType.WHITE_QUEEN:
                    PieceBaseClass.CASTLE |= Castling.QC;
                    break;
                case PieceType.BLACK_KING:
                    PieceBaseClass.CASTLE |= Castling.kc;
                    break;
                case PieceType.BLACK_QUEEN:
                    PieceBaseClass.CASTLE |= Castling.qc;
                    break;
                default:
                    break;
            }

            nextFenChar = fenIterator.next().value;
        }

        nextFenChar = fenIterator.next().value;
        this.enpassant = nextFenChar === '-';

        console.log("Enpassant: ", this.enpassant);
        console.log("Pieces on board:", this.totalPieces);
        console.groupEnd();

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

    public loadPGN(pgn: string) {
        const fen = this.extractFenFromPgn(pgn);
        fen ? this.loadFen(fen) : this.loadFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }

    public exportPGN() {
        return "TODO";
    }

    public getAllLegalMoves(side?: PieceColor): Map<Square, Square[]> {
        ChessBoard.legalMoves.resetState();

        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 16; file++) {
                const square: number = (rank * 16) + file;

                // If square is on Board
                if (!(square & 0x88)) {
                    if (ChessBoard.board[square] !== PieceType.EMPTY) {
                        if (side === undefined || getPieceColor(square) === side) {
                            this.getLegalMovesFromSquare(square);
                        }
                    }
                }
            }
        }

        // console.log(ChessBoard.legalMoves.legalMovesMap);
        return ChessBoard.legalMoves.legalMovesMap;
    }

    public getLegalMovesFromSquare(fromSquare: Square) {
        const pieceType: PieceType = charToPieceType(ChessBoard.board[fromSquare]);
        const pieceColor = getPieceColor(fromSquare)!;

        switch (pieceType) {
            case PieceType.WHITE_PAWN:
            case PieceType.BLACK_PAWN:
                Pawn.getLegalMoves(fromSquare, pieceColor);
                break;
            case PieceType.WHITE_ROOK:
            case PieceType.BLACK_ROOK:
                Rook.getLegalMoves(fromSquare, pieceColor);
                break;
            case PieceType.WHITE_BISHOP:
            case PieceType.BLACK_BISHOP:
                Bishop.getLegalMoves(fromSquare, pieceColor);
                break;
            case PieceType.WHITE_KNIGHT:
            case PieceType.BLACK_KNIGHT:
                Knight.getLegalMoves(fromSquare, pieceColor);
                break;
            case PieceType.WHITE_QUEEN:
            case PieceType.BLACK_QUEEN:
                Rook.getLegalMoves(fromSquare, pieceColor);
                Bishop.getLegalMoves(fromSquare, pieceColor);
                // Queen.getLegalMoves(square, PieceColor.WHITE);
                break;
            case PieceType.WHITE_KING:
            case PieceType.BLACK_KING:
                King.getLegalMoves(fromSquare, pieceColor);
                break;
            default:
                break;
        }
    }
    public getMaterialAdvantage() {
        const pieces = this.getBoardPieces();
        const scoreMap = new Map<PieceType, number>([
            [PieceType.WHITE_PAWN, 1],
            [PieceType.BLACK_PAWN, -1],

            [PieceType.WHITE_KNIGHT, 3],
            [PieceType.BLACK_KNIGHT, -3],

            [PieceType.WHITE_BISHOP, 3],
            [PieceType.BLACK_BISHOP, -3],

            [PieceType.WHITE_QUEEN, 9],
            [PieceType.BLACK_QUEEN, -9],

            [PieceType.WHITE_ROOK, 5],
            [PieceType.BLACK_ROOK, -5],

            [PieceType.WHITE_KING, 0],
            [PieceType.BLACK_KING, 0],
        ]);

        const totalScore = pieces.reduce((score, piece) => {
            return score + scoreMap.get(piece.piece)!;
        }, 0);

        return {
            w: totalScore,
            b: totalScore === 0 ? totalScore : -totalScore
        };
    }

    private getPiece(square: Square) {
        return { piece: ChessBoard.board[square], color: decodePieceColor(getPieceColor(square)!) };
    }

    public getSquare(square: Square) {
        return { piece: ChessBoard.board[square], color: decodePieceColor(getSquareColor(square)) };
    }

    public getBoardPieces(): BoardPiece[] {
        let pieces: BoardPiece[] = [];
        this.iterateBoard((square: number) => {
            pieces.push({ square: SQUARE_TO_COORDS[square], ...this.getPiece(square) });
        });

        return pieces;
    }

    public getFullMoveNumber(): number {
        return this.fullMoveNumber;
    }

    public getHistory() {
        return this.moveInvoker.movesHistory.map((move) => decodeEnum(move.toSquareIdx));
    }

    public clear() {
        this.totalPieces = 0;

        const emptyBoardFen = '8/8/8/8/8/8/8/8 w - - 0 1';
        this.loadFen(emptyBoardFen);
    }

    public getAscii() {
        let ascii = '  +-------------------------------+\n';

        const boardSize = 8;
        for (let row = 0; row < boardSize; row++) {
            let rowString = `${8 - row} |`;
            for (let col = 0; col < boardSize; col++) {
                const index = row * 16 + col;
                const piece = ChessBoard.board[index];

                rowString += ` ${piece === 'e' ? '.' : piece} |`;
            }

            ascii += `${rowString}\n`;
        }

        ascii += '  +-------------------------------+\n';
        ascii += '    a   b   c   d   e   f   g   h';

        return ascii;
    }

    public prettyPrint(): void {
        const pieceRepresentation: { [key: string]: string; } = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
            'e': '　', 'o': ' '
        };

        const boardSize = 8;
        for (let row = 0; row < boardSize; row++) {
            let rowString = `${8 - row} |`;
            for (let col = 0; col < boardSize; col++) {
                const index = row * 16 + col;
                const piece = ChessBoard.board[index];

                rowString += ` ${pieceRepresentation[piece]} |`;
            }

            console.log(rowString);
        }

        console.log('    a    b    c    d    e    f    g    h');
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