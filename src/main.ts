import { ChessBoard } from "./chessboard";

const CHESSBOARD = new ChessBoard();

// @ts-ignore
window.ChessBoard = CHESSBOARD;
// @ts-ignore
window.isSquareAttacked = ChessBoard.isSquareAttacked;
