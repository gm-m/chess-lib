import { SQUARE_TO_COORDS } from "../chessboard/chess-game";
import { Square, SquareDescription } from "../model/model";
import { PieceColor } from "../model/PieceColor.enum";
import { PieceType } from "../piece/piece";

export function stringIterator(str: string, fallbackValue = undefined) {
    return {
        length: str.length,
        index: 0,
        next: function () {
            const value = str[this.index] ?? fallbackValue;
            const done = this.index >= this.length;
            this.index++;

            return { value, done };
        },
        nextWhile: function (predicate: (char: string) => boolean) {
            while (this.index < this.length && predicate(str[this.index])) {
                this.index++;
            }

            return this.next();
        },
    };
}

// isAlphabetCharacter = (ch) => ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
export const isAlphabetCharacter = (ch: string) => /^[A-Z]$/i.test(ch);
export const isDigitCharacter = (ch: string) => ch >= '0' && ch <= '9';
export const isWhiteSpace = (ch: string) => ch === ' ' || ch === '';

export function charToPieceType(char: string): PieceType {
    const charToPieceMap: Map<string, PieceType> = new Map([
        ['P', PieceType.WHITE_PAWN],
        ['N', PieceType.WHITE_KNIGHT],
        ['B', PieceType.WHITE_BISHOP],
        ['R', PieceType.WHITE_ROOK],
        ['Q', PieceType.WHITE_QUEEN],
        ['K', PieceType.WHITE_KING],
        ['p', PieceType.BLACK_PAWN],
        ['n', PieceType.BLACK_KNIGHT],
        ['b', PieceType.BLACK_BISHOP],
        ['r', PieceType.BLACK_ROOK],
        ['q', PieceType.BLACK_QUEEN],
        ['k', PieceType.BLACK_KING],
    ]);

    return charToPieceMap.get(char) ?? PieceType.EMPTY;
}

export function squareToString(square: Square): keyof typeof Square {
    return Square[square] as keyof typeof Square;
}

export function decodePieceColor(color: PieceColor): 'w' | 'b' {
    return color === 0 ? 'w' : 'b';
}


export function getSquareColor(square: Square): PieceColor {
    return (getRank(square) + getFile(square)) % 2 === 0 ? PieceColor.WHITE : PieceColor.BLACK;
}

// https://en.wikipedia.org/wiki/0x88#Algebraic_notation_and_conversion
// Extracts the zero-based rank of an 0x88 square.
function getRank(square: number): number {
    return square >> 4;
}

// Extracts the zero-based file of an 0x88 square.
function getFile(square: number): number {
    return square & 0xf;
}

export function getCoordinates(square: Square): SquareDescription {
    return SQUARE_TO_COORDS[square] as SquareDescription;
}

export function prettyLog(message: string = "customLog") {
    const baseStyles = [
        "color: #fff",
        "background-color: #444",
        "padding: 2px 4px",
        "border-radius: 2px"
    ].join(";");

    console.log(`%c${message}`, baseStyles);
}