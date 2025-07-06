import { PieceType } from "../piece/piece";

export enum Castling {
    KC = 1,
    QC = 2,
    kc = 4,
    qc = 8,
}

export enum Square {
    a8 = 0,
    b8,
    c8,
    d8,
    e8,
    f8,
    g8,
    h8,
    a7 = 16,
    b7,
    c7,
    d7,
    e7,
    f7,
    g7,
    h7,
    a6 = 32,
    b6,
    c6,
    d6,
    e6,
    f6,
    g6,
    h6,
    a5 = 48,
    b5,
    c5,
    d5,
    e5,
    f5,
    g5,
    h5,
    a4 = 64,
    b4,
    c4,
    d4,
    e4,
    f4,
    g4,
    h4,
    a3 = 80,
    b3,
    c3,
    d3,
    e3,
    f3,
    g3,
    h3,
    a2 = 96,
    b2,
    c2,
    d2,
    e2,
    f2,
    g2,
    h2,
    a1 = 112,
    b1,
    c1,
    d1,
    e1,
    f1,
    g1,
    h1,
    no_sq,
}

type Ranks = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
type Files = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type SquareDescription = `${Files}${Ranks}`;

/*
    - File (string). Only letters beetwen 'a' and 'h'
    - Rank (number). Only numbers beetwen 1 and 8
*/
export type PieceCoordinates = [string, number];
export type BoardPiece = { square: string, piece: PieceType; color: 'w' | 'b'; };
export type GameVariant = 'standard' | '960';
export type InitBoard = {
    fen?: string;
    variant?: GameVariant;
};