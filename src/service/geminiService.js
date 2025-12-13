import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

class GeminiService {
  constructor() {
    this.model = process.env.MODEL_NAME;
    this.ai = new GoogleGenAI({
        vertexai: true,
        project: process.env.GOOGLE_CLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION,
     });

  }

  async evaluateLayout(resumeId, prompt, jsonSchema) {
    try {
      if (!resumeId || !prompt || !jsonSchema) {
        throw new Error("resumeId, prompt and jsonSchema are required");
      }
      
      if (!this.model) {
        throw new Error("MODEL_NAME environment variable is not set");
      }

      const image = {
        fileData: {
          fileUri: `gs://evaluate_resume/resumes/${resumeId}`,
          mimeType: 'application/pdf',
        },
      };
      
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { fileData: image.fileData }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: jsonSchema
        },
      });
      
      const rawData = response.text;
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Error evaluating layout:", error);
      throw error;
    }
  }

  async extractData(prompt, jsonSchema) {
    try {
      if (!prompt || !jsonSchema) {
        throw new Error("prompt and jsonSchema are required");
      }
      
      if (!this.model) {
        throw new Error("MODEL_NAME environment variable is not set");
      }

  
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: jsonSchema
        },
      });
      const rawData = response.text;
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Error extracting data:", error);
      throw error; 
    }
  }
}

const geminiService = new GeminiService();
export default geminiService;