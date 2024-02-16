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
}

export default TextProcessor;