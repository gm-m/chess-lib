import { BLACK_PIECES, PieceType, WHITE_PIECES } from "./piece/piece";
import { ChessBoard, Squares } from "./chessboard.ts";
import { PieceColor } from "./enum/PieceColor.ts";

// isAlphabetCharacter = (ch) => ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
export const isAlphabetCharacter = (ch: string) => /^[A-Z]$/i.test(ch);
export const isDigitCharacter = (ch: string) => ch >= '0' && ch <= '9';

// export function stringIterator(str: string) {
//     let index: number = 0;
//     let iterator: IterableIterator<string> = str[Symbol.iterator]();
//
//     return {
//         next() {
//             index++;
//             return iterator.next();
//         },
//         peek() {
//             return str[index];
//         }
//     };
// }

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


export function decodeEnum(el: any) {
    const match = Object.entries(Squares).find(([key, value]) => value === el);
    return match ? match[0] : undefined;
}

export function getPieceColor(square: Squares): PieceColor | undefined {
    if (WHITE_PIECES.includes(ChessBoard.board[square])) {
        return PieceColor.WHITE;
    }

    if (BLACK_PIECES.includes(ChessBoard.board[square])) {
        return PieceColor.BLACK;
    }
}

export function customLog(message: string = "customLog") {
    const baseStyles = [
        "color: #fff",
        "background-color: #444",
        "padding: 2px 4px",
        "border-radius: 2px"
    ].join(";");

    console.log(`%c${message}`, baseStyles);
}