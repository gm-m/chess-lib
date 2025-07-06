import { Board } from "./board";

export class BoardPresenter {
    private board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    public getAscii(): string {
        let ascii = '  +-------------------------------+\n';

        const boardSize = 8;
        for (let row = 0; row < boardSize; row++) {
            let rowString = `${8 - row} |`;
            for (let col = 0; col < boardSize; col++) {
                const index = row * 16 + col;
                const piece = this.board.getPiece(index);

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
                const piece = this.board.getPiece(index);

                rowString += ` ${pieceRepresentation[piece]} |`;
            }

            console.log(rowString);
        }

        console.log('    a    b    c    d    e    f    g    h');
    }
}
