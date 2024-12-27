# ChessLib

Made using the [0x88](https://www.chessprogramming.org/0x88) chess board representation.

## API

### .prettyPrint()

Print an ASCII diagram of the current position.

### .loadFen()

Resets the board and imports the given FEN string.

### .loadPgn()

Resets the chess board and imports a given PGN (Portable Game Notation) string. The method loads the FEN of the starting position from the PGN string, but does not import any subsequent moves.

```ts
const chessBoard = new ChessBoard();

chessBoard.loadPGN(`
    [Event "?"]
    [Site "?"]
    [Date "1128.??.??"]
    [Round "?"]
    [White "White to move"]
    [Black "?"]
    [Result "1-0"]
    [SetUp "1"]
    [FEN "rn2rk2/5pp1/p7/2pb1qN1/7Q/2P5/5PPP/1R3RK1 w - - 0 1"]
    [PlyCount "0"]
    [SourceTitle "31 agosot 2018"]
    [Source "Tipter Napoleon"]
    [SourceDate "2018.08.31"]
    [SourceVersion "1"]
    [SourceVersionDate "2018.08.31"]
    [SourceQuality "1"]

    1-0
`)

```


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

### .isThreefoldRepetition() [Not yet implemented]

Returns a boolean indicating whether if there are three or more identical positions in the game history.

### .isDraw()

Returns a boolean indicating whether if `isStaleMate` or `isInsufficientMaterial` or `isThreefoldRepetition`.

### .getAscii()

Returns a string that rappresents the current position.

```ts

const chessBoard = new ChessBoard();

chessBoard.movePiece({ fromSquare: Square.c2, toSquare: Square.c4 });
chessBoard.movePiece({ fromSquare: Square.e7, toSquare: Square.e5 });
chessBoard.getAscii();

//    +-------------------------------+
//  8 | r | n | b | q | k | b | n | r |
//  7 | p | p | p | p | . | p | p | p |
//  6 | . | . | . | . | . | . | . | . |
//  5 | . | . | . | . | p | . | . | . |
//  4 | . | . | P | . | . | . | . | . |
//  3 | . | . | . | . | . | . | . | . |
//  2 | P | P | . | P | P | P | P | P |
//  1 | R | N | B | Q | K | B | N | R |
//    +-------------------------------+
//      a   b   c   d   e   f   g   h

```

### .getSquare()

Returns the piece and color of the given square.

```ts

const chessBoard = new ChessBoard({ fen: '8/pN1b2Q1/8/5P2/2k2K2/6P1/8/7r w - - 0 1' });

chessBoard.getSquare(Square.e1); // { piece: 'K', color: 'w' }
chessBoard.getSquare(Square.e6); // { piece: 'e', color: 'b' }

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

### .getLegalMoves(square?: Square) [Not yet implemented]

Returns list of legal moves based on the current position. An optional square can be specified to obtain the legal moves for that square.

```ts

const chessBoard = new ChessBoard({ fen: '8/7P/4kbK1/8/8/8/8/8 w - - 4 3' });

board.getLegalMoves(); // [ "h8", "h6, h5" ]

```

### .getHistory()

Returns a list of the current game's moves.

```ts

const chessBoard = new ChessBoard();

board.movePiece({ fromSquare: Square.c2, toSquare: Square.c4 });
board.movePiece({ fromSquare: Square.e7, toSquare: Square.e5 });

board.getHistory(); // [ "c4", "e5" ]

```

### .getMoveNumber()

Returns a number indicating the current move.

### .getFen()

Returns the FEN of the current position.

### .getMaterialAdvantage()

Returns separate scores for white and black players. Calculates the material advantage based on the current board state.

```ts
const chessBoard = new ChessBoard({ fen: '1k6/R5R1/2p5/2Ppp3/7p/NP2P1nP/5KP1/r7 w - - 3 34' });

chessBoard.getMaterialAdvantage(); // { w: 6, b: -6 }
```

### .removePiece(square)

Remove and return the piece on the give square.

```ts
const chessBoard = new ChessBoard('r3r1k1/p2qppbp/1n4p1/3b4/1QpP3B/4PN2/P3BPPP/1RR3K1 b - - 8 17');

chessBoard.remove(Square.h4)  // { piece: 'B', color: 'w' }
```

### .movePiece({fromSquare, toSquare})

Moves a piece from one square to another.

### .undoMove(quantity?: number)

Undo the number of half-moves given in input. Defaults to 1.

### .redoMove(quantity?: number)

Redo the number of half-moves given in input. Defaults to 1.

### .clear()

Remove every piece from the board. The new FEN will be: `8/8/8/8/8/8/8/8 w - - 0 1`
