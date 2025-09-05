import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { MayaBhedanResponse, ShaktiUpcharResponse, DivyaChakshuResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const analyzeClaim = async (claim: string): Promise<MayaBhedanResponse> => {
  const model = "gemini-2.5-flash";
  const systemInstruction = `You are Rishi Gyan, a wise sage. Analyze the user's text for misinformation.
    Your response MUST be a JSON object with three keys: "verdict", "discourse", and "metaphor".
    - "verdict": Must be one of "Truth", "Illusion", or "Unclear".
    - "discourse": A detailed explanation of your reasoning.
    - "metaphor": A Hindu mythological metaphor to explain the situation.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: claim }] }],
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    verdict: { type: Type.STRING, enum: ["Truth", "Illusion", "Unclear"] },
                    discourse: { type: Type.STRING },
                    metaphor: { type: Type.STRING },
                },
                required: ["verdict", "discourse", "metaphor"],
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MayaBhedanResponse;
  } catch (error) {
    console.error("Error in analyzeClaim:", error);
    throw new Error("Failed to analyze the claim. The divine energies are disturbed.");
  }
};

export const resolveGrievance = async (grievance: string): Promise<ShaktiUpcharResponse> => {
  const model = "gemini-2.5-flash";
  const systemInstruction = `You are Shakti, an empathetic and powerful resolver. Analyze the user's grievance.
    Your response MUST be a JSON object with three keys: "sentiment", "resolutionPath", and "message".
    - "sentiment": Classify the user's emotion. Must be one of "Wrathful", "Disturbed", or "Calm".
    - "resolutionPath": Recommend a concrete path to resolution.
    - "message": Provide an empathetic message with a mythological metaphor.`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: grievance }] }],
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    sentiment: { type: Type.STRING, enum: ["Wrathful", "Disturbed", "Calm"] },
                    resolutionPath: { type: Type.STRING },
                    message: { type: Type.STRING },
                },
                required: ["sentiment", "resolutionPath", "message"],
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ShaktiUpcharResponse;
  } catch (error) {
    console.error("Error in resolveGrievance:", error);
    throw new Error("Failed to resolve the grievance. The cosmos seeks balance.");
  }
};

export const analyzeScene = async (imageBase64: string, mimeType: string, context?: string): Promise<DivyaChakshuResponse> => {
  const model = "gemini-2.5-flash";
  const systemInstruction = `You are Satya Darshan, the AI of true perception.
    Analyze the image and any accompanying text. Provide a concise, descriptive analysis.
    Your response MUST be a JSON object with two keys: "proclamation" and "description".
    - "proclamation": Start with a mythological proclamation, like "By the clarity of the third eye, I perceive...".
    - "description": Describe the scene you perceive in the image.`;

  const imagePart = fileToGenerativePart(imageBase64, mimeType);
  const parts = context
    ? [imagePart, { text: `\nUser context: ${context}` }]
    : [imagePart];

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts }],
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    proclamation: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
                required: ["proclamation", "description"],
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as DivyaChakshuResponse;
  } catch (error) {
    console.error("Error in analyzeScene:", error);
    throw new Error("Failed to perceive the scene. The vision is momentarily clouded.");
  }
};

export const analyzeMedia = async (imageBase64: string, mimeType: string): Promise<MayaBhedanResponse> => {
  const model = "gemini-2.5-flash";
  const systemInstruction = `You are Rishi Gyan, a wise sage. Analyze the user's image for digital manipulation or signs of being AI-generated.
    Your response MUST be a JSON object with three keys: "verdict", "discourse", and "metaphor".
    - "verdict": Must be one of "Truth" (appears authentic), "Illusion" (appears manipulated or AI-generated), or "Unclear".
    - "discourse": A detailed explanation of your reasoning. Look for artifacts, inconsistencies in lighting or shadows, unnatural textures, etc.
    - "metaphor": A Hindu mythological metaphor to explain the situation.`;

  const imagePart = fileToGenerativePart(imageBase64, mimeType);
  const parts = [imagePart, { text: 'Analyze this image for manipulation.' }];

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts }],
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    verdict: { type: Type.STRING, enum: ["Truth", "Illusion", "Unclear"] },
                    discourse: { type: Type.STRING },
                    metaphor: { type: Type.STRING },
                },
                required: ["verdict", "discourse", "metaphor"],
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MayaBhedanResponse;
  } catch (error) {
    console.error("Error in analyzeMedia:", error);
    throw new Error("Failed to analyze the media. The divine energies are disturbed.");
  }
};