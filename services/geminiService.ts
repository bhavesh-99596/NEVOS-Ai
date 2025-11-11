import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, HospitalInfo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    conditionName: {
      type: Type.STRING,
      description: "The most likely dermatological condition. E.g., 'Melanoma', 'Eczema', 'Normal Mole'."
    },
    severity: {
      type: Type.STRING,
      enum: ["Normal", "Mild", "Moderate", "Serious"],
      description: "The assessed severity level of the condition."
    },
    confidence: {
      type: Type.NUMBER,
      description: "A confidence score from 0 to 100 for the main condition."
    },
    description: {
      type: Type.STRING,
      description: "A brief, easy-to-understand description of the potential condition and its characteristics based on the image."
    },
    recommendations: {
      type: Type.ARRAY,
      description: "A checklist of 3-4 clear, actionable next steps for the user. E.g., ['Consult a dermatologist immediately', 'Schedule a biopsy', 'Monitor for changes in size, shape, or color'].",
      items: { type: Type.STRING }
    },
    disclaimer: {
      type: Type.STRING,
      description: "A mandatory medical disclaimer stating this is not a diagnosis and a doctor should be consulted."
    },
    allPredictions: {
      type: Type.ARRAY,
      description: "A list of the top 4 potential conditions and their confidence percentages, including the main one.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the potential condition." },
          confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100." }
        },
        required: ["name", "confidence"]
      }
    }
  },
  required: ["conditionName", "severity", "confidence", "description", "recommendations", "disclaimer", "allPredictions"]
};

export const analyzeSkinImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Analyze this skin lesion image. Provide a detailed analysis following the JSON schema. Identify the most likely condition, its severity, and your confidence. Give a brief description, a checklist of recommendations, a standard medical disclaimer, and a list of the top 4 potential conditions you considered, ranked by confidence.`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (!result.conditionName || !result.recommendations || !result.allPredictions) {
      throw new Error("Invalid response structure from Gemini API");
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing image with Gemini API:", error);
    throw new Error("Failed to analyze image. The AI model may be temporarily unavailable or the image could not be processed.");
  }
};

export const getChatbotResponse = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are a helpful AI assistant for NEVOS, a skin cancer detection app. Your role is to answer user questions about skin health, skin conditions, and how to use the app. Do not provide medical diagnoses. Always encourage users to consult a healthcare professional for any medical concerns. Keep your answers concise and easy to understand."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response from Gemini API:", error);
    throw new Error("Failed to get a response from the assistant. Please try again later.");
  }
};

const hospitalSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The full name of the hospital or clinic." },
            address: { type: Type.STRING, description: "The complete street address of the facility." },
            phone: { type: Type.STRING, description: "A valid contact phone number for the facility." },
            website: { type: Type.STRING, description: "The full URL for the facility's official website, starting with http or https." },
        },
        required: ["name", "address", "phone", "website"]
    }
};

export const findNearbyHospitals = async (lat: number, lon: number): Promise<HospitalInfo[]> => {
  try {
    const prompt = `Based on the location (latitude: ${lat}, longitude: ${lon}), generate a realistic list of 5 nearby hospitals or clinics that have dermatology departments. For each facility, provide its name, a plausible full address, a phone number, and a website URL. Your response MUST strictly follow the provided JSON schema. Ensure the website URL is a valid, fully-formed URL.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: hospitalSchema,
      }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (!Array.isArray(result)) {
        throw new Error("Invalid response structure from Gemini API: Expected an array.");
    }

    return result as HospitalInfo[];

  } catch (error) {
    console.error("Error finding hospitals with Gemini API:", error);
    throw new Error("Failed to find nearby hospitals. The AI model may be temporarily unavailable.");
  }
};