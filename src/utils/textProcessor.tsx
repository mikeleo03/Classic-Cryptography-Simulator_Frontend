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

    static toUint8FromBase64(base64String: string) {
        const binaryString = atob(base64String);

        // Create a Uint8Array from the binary string
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        return uint8Array;
    }

    static toUint8Array(text: string) {
        const textEncoder = new TextEncoder();
        return textEncoder.encode(text);
    }

    static toStringFromUint8Array(array: Uint8Array) {
        const textDecoder = new TextDecoder('utf-8');
        return textDecoder.decode(array);
    }

    static stringToArrayAscii(input: string): number[] {
        const asciiArray: number[] = [];
        
        for (let i = 0; i < input.length; i++) {
            const charIndex: number = i % input.length;
            asciiArray.push(input.charCodeAt(charIndex));
        }

        return asciiArray;
    }

    static arrayAsciiToString(array: number[]): string {
        let result: string = '';

        array.forEach(code => {
            result += String.fromCharCode(code);
        });

        return result;
    }
}

export default TextProcessor;