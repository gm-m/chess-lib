import { SQUARE_TO_COORDS, Squares } from "../chessboard";
import { decodeEnum } from "../utility";

export class MoveList {
    counter: number = 0;
    executed: number[] = [];

    encodedMovesMap: Map<Squares, number[]> = new Map();
    legalMovesMap: Map<Squares, Squares[]> = new Map();
    // map: Map<Squares, MoveMapTest[a]> = new Map();

    constructor() {
    }

    // Decode move's source flag
    private getMoveSource(encoded_move: number): Squares {
        return encoded_move & 127;
    }

    // Decode move's target flag
    private getMoveTarget(encoded_move: number): Squares {
        return (encoded_move >> 7) & 127;
    }

    // Decode move's promoted piece
    private getMovePiece(encodeMove: number) {
        return ((encodeMove >> 14) & 0xf);
    };

    // Decode move's capture flag
    private getMoveCapture(encodeMove: number) {
        return ((encodeMove >> 18) & 0x1);
    };

    // Decode move's double pawn push flag
    private getDoubleMovePawn(encodeMove: number) {
        return ((encodeMove >> 19) & 0x1);
    };

    // Decode move's enpassant flag
    private getMoveEnpassant(encodeMove: number) {
        return ((encodeMove >> 20) & 0x1);
    };

    // Decode move's castling flag
    // private getMoveCastling(encodeMove: number) {
    public getMoveCastling(encodeMove: number) {
        return ((encodeMove >> 21) & 0x1);
    }

    public resetLegalMoves() {
        this.legalMovesMap.clear();
        this.encodedMovesMap.clear();
    }

    public resetMap() {
        this.legalMovesMap.clear();
        this.encodedMovesMap.clear();
    }

    public resetExecuted() {
        this.executed = [];
    }

    public add(encodeMove: number) {
        console.log({ encodeMove });

        if (0) {
            console.log("getMoveSource", this.getMoveSource(encodeMove));
            console.log("movePiece", this.getMovePiece(encodeMove));
            console.log("getMoveCapture", this.getMoveCapture(encodeMove));
            console.log("getDoubleMovePawn", this.getDoubleMovePawn(encodeMove));
            console.log("getMoveEnpassant", this.getMoveEnpassant(encodeMove));
            console.log("getMoveCastling", this.getMoveCastling(encodeMove));
        }

        const [key, targetSquare]: [Squares, Squares] = [this.getMoveSource(encodeMove), this.getMoveTarget(encodeMove)];
        this.legalMovesMap.set(key, [...(this.legalMovesMap.get(key) || []), targetSquare]);
        this.encodedMovesMap.set(key, [...(this.encodedMovesMap.get(key) || []), +`${encodeMove}${targetSquare}`]);
    }

    public getExecutedMoves(): string[] {
        let decodedMoves: string[] = [];
        this.executed.forEach((move: number) => {
            decodedMoves.push(SQUARE_TO_COORDS[this.getMoveSource(move)], SQUARE_TO_COORDS[this.getMoveTarget(move)]);
        });

        return decodedMoves;
    }

    public printLegalMoves() {
        if (this.legalMovesMap.size === 0) {
            console.log("No legal moves");
            return;
        }

        console.log([...this.legalMovesMap.values()]);
    }

    public decodeLegalMoves() {
        if (this.legalMovesMap.size === 0) {
            console.log("No legal moves");
            return;
        }

        return [...this.legalMovesMap.values()].flat().map(el => decodeEnum(el));
    }

    public printMoves() {
        this.executed.forEach((move: number) => {
            console.log(SQUARE_TO_COORDS[this.getMoveSource(move)], SQUARE_TO_COORDS[this.getMoveTarget(move)]);
        });
    }
}