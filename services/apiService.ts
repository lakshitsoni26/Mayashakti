// This service simulates a secure API layer for the frontend.
// In a real application, the frontend would use fetch() to call these endpoints on a server.
// This layer is responsible for checking the authentication token before allowing
// a request to proceed to the core logic (like calling the Gemini API).

import * as geminiService from './geminiService';
import { verifyToken } from './authService';
import { MayaBhedanResponse, ShaktiUpcharResponse, DivyaChakshuResponse } from '../types';

/**
 * A wrapper function to verify the auth token before proceeding with an API call.
 * @param {string} token - The user's JWT.
 * @param {Function} apiCall - The function to execute if the token is valid.
 * @returns {Promise<any>} The result of the apiCall.
 */
const _protectedRoute = async <T>(token: string, apiCall: () => Promise<T>): Promise<T> => {
    const isTokenValid = await verifyToken(token);
    if (!isTokenValid) {
        throw new Error("Unauthorized. Your session may have expired.");
    }
    return apiCall();
};

export const analyzeClaim = (token: string, claim: string): Promise<MayaBhedanResponse> => {
    return _protectedRoute(token, () => geminiService.analyzeClaim(claim));
};

export const resolveGrievance = (token: string, grievance: string): Promise<ShaktiUpcharResponse> => {
    return _protectedRoute(token, () => geminiService.resolveGrievance(grievance));
};

export const analyzeScene = (token: string, imageBase64: string, mimeType: string, context?: string): Promise<DivyaChakshuResponse> => {
    return _protectedRoute(token, () => geminiService.analyzeScene(imageBase64, mimeType, context));
};

export const analyzeMedia = (token: string, imageBase64: string, mimeType: string): Promise<MayaBhedanResponse> => {
    return _protectedRoute(token, () => geminiService.analyzeMedia(imageBase64, mimeType));
};