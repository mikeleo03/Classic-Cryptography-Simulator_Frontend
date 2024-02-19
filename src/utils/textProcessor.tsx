class TextProcessor {
    private static removeNonAlphabet(text: string) {
        return text.replace(/[^a-zA-Z]/g, "");
    }

    private static toUpperCase(text: string) {
        return text.toUpperCase();
    }

    static cleanFormat(text: string) {
        return this.toUpperCase(this.removeNonAlphabet(text));
    }

    static toBase64(text: string) {
        return btoa(text);
    }

    static toUint8Array(text: string) {
        const textEncoder = new TextEncoder();
        return textEncoder.encode(text);
    }

    static toStringFromUint8Array(array: Uint8Array) {
        const textDecoder = new TextDecoder('utf-8');
        return textDecoder.decode(array);
    }
}

export default TextProcessor;