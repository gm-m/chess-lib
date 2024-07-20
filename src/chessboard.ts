import { PieceColor } from "./enum/PieceColor";
import { MoveInvoker } from "./move/move-invoker";
import { MoveList } from "./move/move-list";
import Bishop from "./piece/bishop";
import King from "./piece/king";
import Knight from "./piece/knight";
import Pawn from "./piece/pawn";
import { PieceBaseClass, PieceType } from "./piece/piece";
import Rook from "./piece/rook";
import {
    charToPieceType,
    prettyLog,
    getPieceColor,
    isAlphabetCharacter,
    isDigitCharacter
} from "./utility";


export enum Castling {
    KC = 1,
    QC = 2,
    kc = 4,
    qc = 8,
}

export enum Squares {
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

export class ChessBoard {
    static instance: ChessBoard;
    static enpassant = Squares.no_sq;

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

    // TODO : Move to a better place
    isWhiteKingAttacked: boolean = false;
    isBlackKingAttacked: boolean = false;

    // trickyFen: string = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPbBPPP/R3K2R w KQkq - 0 1";
    // trickyFen: string = "r3k2r/ppp3bp/1nn2pp1/4p3/2N1PP2/1P4PN/PBP3BP/2KR3R w - - 0 1";
    // trickyFen: string = "rn1q2k1/1p3pb1/p2p2p1/2pP2B1/P1P1r1b1/5N2/1P2BPP1/R2Q1K1R b - - 3 15";
    // trickyFen: string = "rn1q2k1/1p3pb1/p2p2p1/2pP2B1/P1P1r1b1/5p2/1P2BPP1/R2Q1K1R w - - 3 15";
    // trickyFen: string = "4r1k1/3n1p2/pp1p1bp1/2pP4/P1P5/4PN1R/5KP1/1R6 w - - 0 27";
    // trickyFen: string = "4k3/P7/8/8/8/8/8/6K1 w - - 0 1"; // Promotion

    trickyFen: string = "7k/p4Q2/6R1/8/8/3K4/8/8 w - - 0 1";
    defaultFen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    PGN: string = '';

    moveInvoker: MoveInvoker = new MoveInvoker(this);

    constructor(fen?: string) {
        if (ChessBoard.instance) {
            return ChessBoard.instance;
        }

        ChessBoard.instance = this;
        this.getAllLegalMoves();

        if (!fen) fen = this.defaultFen;

        ChessBoard.parseFen(this.defaultFen);

        ChessBoard.legalMoves.printMoves();
        this.printBoard();
        this.prettyPrint(ChessBoard.board);
    }

    appendToPGN(pgn: string) {
        this.PGN += pgn;
        console.log("Updated PGN: ", this.PGN);
    }

    static resetBoard() {
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 16; file++) {
                const square = (rank * 16) + file;

                if (!(square & 0x88)) {
                    ChessBoard.board[square] = PieceType.EMPTY;
                }
            }
        }
    }

    public flipSide(): PieceColor {
        return ChessBoard.side === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    }

    // TODO: Replace hardcoded seventhRankSquares with the following
    //     [PieceColor.WHITE, [Squares.a7, Squares.h7]],
    //     [PieceColor.BLACK, [Squares.a2, Squares.h2]],
    static readonly seventhRankSquares: Map<PieceColor, number[]> = new Map([
        [PieceColor.WHITE, [16, 31]],
        [PieceColor.BLACK, [96, 103]],
    ]);

    // TODO: Replace hardcoded seventhRankSquares with the following
    //     [PieceColor.WHITE, [Squares.a8, Squares.h8]],
    //     [PieceColor.BLACK, [Squares.a1, Squares.h1]],
    static readonly eighthRankSquares: Map<PieceColor, number[]> = new Map([
        [PieceColor.WHITE, [0, 7]],
        [PieceColor.BLACK, [112, 119]],
    ]);

    /*
        square = number
        color = Attacked from color
    */
    static isSquareAttacked(square: Squares, attackedFromColor: PieceColor): boolean {
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
            let targetSquare: Squares = square + offset;

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
            let targetSquare: Squares = square + offset;

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

    static parseFen(fen: string) {
        ChessBoard.resetBoard();

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
                        } else if (nextFenChar === PieceType.BLACK_KING) {
                            PieceBaseClass.KING_SQUARES[PieceColor.BLACK] = square;
                        }

                        // Set the piece on board
                        ChessBoard.board[square] = charToPieceType(nextFenChar);
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

        console.groupCollapsed("Fen Analisys");
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
        nextFenChar != '-' ? console.log("Enpassant") : console.log("No Enpassant");
        console.log("KING_SQUARES:", PieceBaseClass.KING_SQUARES);
        console.groupEnd();
    }

    public exportPGN() {
        return "TODO";
    }

    public resetHighlightedSquares() {
        ChessBoard.legalMoves.legalMovesMap.clear();
    }

    public getAllLegalMoves() {
        for (let rank = 0; rank < 8; rank++) {
            let file: number = 0;

            while (file < 16) {
                let square: number = (rank * 16) + file;

                // If square is on Board
                if (!(square & 0x88)) {
                    if (ChessBoard.board[square] !== PieceType.EMPTY) {
                        this.getLegalMovesFromSquare(square);
                    }
                }

                file++;
            }
        }

        console.log("Legal moves: ", ChessBoard.legalMoves);
    }

    public getLegalMovesFromSquare(fromSquare: Squares) {
        const pieceType: PieceType = charToPieceType(ChessBoard.board[fromSquare]);
        const pieceColor = getPieceColor(fromSquare)!;

        switch (pieceType) {
            case PieceType.WHITE_PAWN:
            case PieceType.BLACK_PAWN:
                Pawn.getLegalMoves(fromSquare, pieceColor);
                break;
            case PieceType.WHITE_ROOK:
            case PieceType.BLACK_ROOK:
                Rook.getLegalMoves(fromSquare);
                break;
            case PieceType.WHITE_BISHOP:
            case PieceType.BLACK_BISHOP:
                Bishop.getLegalMoves(fromSquare);
                break;
            case PieceType.WHITE_KNIGHT:
            case PieceType.BLACK_KNIGHT:
                Knight.getLegalMoves(fromSquare);
                break;
            case PieceType.WHITE_QUEEN:
            case PieceType.BLACK_QUEEN:
                Rook.getLegalMoves(fromSquare);
                Bishop.getLegalMoves(fromSquare);
                // Queen.getLegalMoves(square, PieceColor.WHITE);
                break;
            case PieceType.WHITE_KING:
            case PieceType.BLACK_KING:
                King.getLegalMoves(fromSquare);
                break;
            default:
                break;
        }
    }

    handleAttackedKing() {
        if (this.isWhiteKingAttacked) {
            prettyLog("White King is Attacked");
            return;
        }

        if (this.isBlackKingAttacked) {
            prettyLog("Black King is Attacked");
            return;
        }

        prettyLog("No King is under attack");
    }

    public getSquare(square: Squares) {
        return { piece: ChessBoard.board[square], color: getPieceColor(square) };
    }

    public printBoard() {
        console.log("Board Len!:", ChessBoard.board.length);
        console.log("Board:", ChessBoard.board);
    }

    public prettyPrint(board: string[]): void {
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
                const piece = board[index];

                rowString += ` ${pieceRepresentation[piece]} |`;
            }

            console.log(rowString);
        }

        console.log('    a    b    c    d    e    f    g    h');
    }


    public setPiece(fromSquare: Squares, toSquare: Squares): boolean {
        if (ChessBoard.legalMoves.legalMovesMap.has(fromSquare)) {
            const legalMoves = ChessBoard.legalMoves.legalMovesMap.get(fromSquare)!;
            if (legalMoves.some((move: Squares) => move === toSquare)) {
                this.moveInvoker.executeMove({ square: fromSquare }, { square: toSquare });
                return true;
            }
        }

        return false;
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