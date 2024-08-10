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

### .getSquare()

Returns the piece type and color of the given square.

```ts

chessBoard.getSquare(Squares.e1); // { type: 'K', color: 'w' }

```

### .getBoardPieces()

Returns an array representation of the pieces on the board.

```ts
const board = new ChessBoard({ fen: '8/7P/4kbK1/5N2/8/8/8/8 w HAha - 0 1' });
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

### .movePiece({fromSquare, toSquare})

Moves a piece from the a square to another.

### .undoMove(quantity?: number)

Undo the last half-move, or the number of moves given in input.
