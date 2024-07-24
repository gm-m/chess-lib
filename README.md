# ChessLib

Made using the [0x88](https://www.chessprogramming.org/0x88) chess board representation.

## API

### .prettyPrint()

Print an ASCII diagram of the current position.

### .isSquareAttacked(square, color)

Returns a boolean indicating whether a specific square is under attack by any piece belonging to a particular colour.

### .isInCheck()

Returns a boolean indicating whether if the side to move is in check.

### .isStaleMate()

Returns a boolean indicating whether if the side to move has been stalemated.

### .isInsufficientMaterial()

Returns a boolean indicating whether if there is no way to end the game in checkmate.