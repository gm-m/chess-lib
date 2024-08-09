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

### .getMoveNumber()

Returns a number indicating the current move.

### .movePiece({fromSquare, toSquare})

Moves a piece from the a square to another.

### .undoMove(quantity?: number)

Undo the last half-move, or the number of moves given in input.
