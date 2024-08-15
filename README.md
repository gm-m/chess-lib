# ChessLib

Made using the [0x88](https://www.chessprogramming.org/0x88) chess board representation.

## API

### .prettyPrint()

Print an ASCII diagram of the current position.

### .isSquareAttacked(square, color)

Returns a boolean indicating whether a specific square is under attack by any piece belonging to a particular colour.

### .isInCheck()

Returns a boolean indicating whether if the side to move is in check.

### .isCheckmate()

Returns a boolean indicating whether if the side to move has been checkmated.

### .isStaleMate()

Returns a boolean indicating whether if the side to move has been stalemated.

### .isInsufficientMaterial()

Returns a boolean indicating whether if there is no way to end the game in checkmate.

### .isDraw()

Returns a boolean indicating whether if isStaleMate or isInsufficientMaterial or isThreefoldRepetition.

### .getAscii()

Returns a string that rappresents the current position.

```ts

const chessBoard = new ChessBoard();
chessBoard.movePiece({ fromSquare: Squares.c2, toSquare: Squares.c4 });
chessBoard.movePiece({ fromSquare: Squares.e7, toSquare: Squares.e5 });

//   +-------------------------------+
// 8 | r | n | b | q | k | b | n | r |
// 7 | p | p | p | p | . | p | p | p |
// 6 | . | . | . | . | . | . | . | . |
// 5 | . | . | . | . | p | . | . | . |
// 4 | . | . | P | . | . | . | . | . |
// 3 | . | . | . | . | . | . | . | . |
// 2 | P | P | . | P | P | P | P | P |
// 1 | R | N | B | Q | K | B | N | R |
//   +-------------------------------+
//     a   b   c   d   e   f   g   h

```

### .getSquare()

Returns the piece and color of the given square.

```ts

const chessBoard = new ChessBoard({ fen: '8/pN1b2Q1/8/5P2/2k2K2/6P1/8/7r w - - 0 1' });

chessBoard.getSquare(Squares.e1); // { piece: 'K', color: 'w' }
chessBoard.getSquare(Squares.e6); // { piece: 'e', color: 'b' }

```

### .getBoardPieces()

Returns an array representation of the pieces on the board.

```ts
const chessBoard = new ChessBoard({ fen: '8/7P/4kbK1/5N2/8/8/8/8 w HAha - 0 1' });
chessBoard.getBoardPieces();

/*
[
    {
        "square": "h7",
        "piece": "P",
        "color": "w"
    },
    {
        "square": "e6",
        "piece": "k",
        "color": "b"
    },
    {
        "square": "f6",
        "piece": "b",
        "color": "b"
    },
    {
        "square": "g6",
        "piece": "K",
        "color": "w"
    },
    {
        "square": "f5",
        "piece": "N",
        "color": "w"
    }
]
*/.
```

### .getMoveNumber()

Returns a number indicating the current move.

### .getFen()

Returns the FEN of the current position.

### .removePiece(square)

Remove and return the piece on the give square.

```ts
const chessBoard = new ChessBoard('r3r1k1/p2qppbp/1n4p1/3b4/1QpP3B/4PN2/P3BPPP/1RR3K1 b - - 8 17');
chessBoard.remove(Squares.h4)  // { piece: 'B', color: 'w' }
```

### .movePiece({fromSquare, toSquare})

Moves a piece from the a square to another.

### .undoMove(quantity?: number)

Undo the last half-move, or the number of moves given in input.

### .clear()

Remove every piece from the board. The new FEN will be: 8/8/8/8/8/8/8/8 w - - 0 1
