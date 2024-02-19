import axios from "axios";
import { 
    VigenereRequest,
    VigenereResponse,
    ExtendedVigenereRequest,
    ExtendedVigenereResponse,
    PlayfairRequest,
    PlayfairResponse,
    AffineRequest,
    AffineResponse,
    HillRequest,
    HillResponse,
    SuperRequest,
    SuperResponse,
    EnigmaRequest,
    EnigmaResponse 
} from "@/types";

class CipherApi {
    private static axios = axios.create({
        baseURL: import.meta.env.VITE_BACKEND + "/api",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    static async standardVigenereCipher(payload: VigenereRequest): Promise<VigenereResponse> {
        try {
            const response = await this.axios.post<VigenereResponse>('/vigenere', JSON.stringify(payload));

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async autokeyVigenereCipher(payload: VigenereRequest): Promise<VigenereResponse> {
        try {
            const response = await this.axios.post<VigenereResponse>('/auto-vigenere', JSON.stringify(payload));

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async extendedVigenereCipher(payload: ExtendedVigenereRequest): Promise<ExtendedVigenereResponse> {
        try {
            const response = await this.axios.post<ExtendedVigenereResponse>('/extended-vigenere', JSON.stringify(payload));

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async playfairCipher(payload: PlayfairRequest): Promise<PlayfairResponse> {
        try {
            const response = await this.axios.post<PlayfairResponse>('/playfair', JSON.stringify(payload));

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default CipherApi;