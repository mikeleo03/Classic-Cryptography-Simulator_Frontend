// For Vigenere Cipher and Auto-Key Vigenere Cipher
export type VigenereRequest = {
    input: string;
    key: string;
    encrypt: boolean;
}

export type VigenereResponse = {
    success: boolean;
    output: string;
}

// For Extended Vigenere Cipher
export type ExtendedVigenereRequest = {
    input: number[];
    key: number[];
    encrypt: boolean;
}

export type ExtendedVigenereResponse = {
    success: boolean;
    output: string;
}

// For Playfair Cipher
export type PlayfairRequest = {
    input: string;
    keyword: string;
    encrypt: boolean;
}

export type PlayfairResponse = {
    success: boolean;
    output: string;
    key: string;
}

// For Affine Cipher
export type AffineRequest = {
    input: string;
    slope: number;
    intercept: number;
    encrypt: boolean;
}

export type AffineResponse = {
    success: boolean;
    output: string;
}

// For Hill Cipher
export type HillRequest = {
    input: string;
    matrix: number[][];
    encrypt: boolean;
}

export type HillResponse = {
    success: boolean;
    output: string;
}

// For Super Encryption
export type SuperRequest = {
    input: number[];
    key1: number[];
    key2: number;
    encrypt: boolean;
}

export type SuperResponse = {
    success: boolean;
    output: string;
}

// For Enigma Cipher
export type EnigmaRequest = {
    input: string;
    pos1: number;
    pos2: number;
    pos3: number;
    order1: number;
    order2: number;
    order3: number;
    plugboard: string;
}

export type EnigmaResponse = {
    success: boolean;
    output: string;
}
