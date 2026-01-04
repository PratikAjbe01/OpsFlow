import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

//  Force load 
dotenv.config(); 

export const generateFormSchema = async (description: string) => {
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(" GEMINI_API_KEY is undefined in ai.service.ts");
    throw new Error("API Key missing");
  }
  console.log("✅ API Key found:", apiKey.slice(0, 5) + "...");

 
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    You are an expert form builder AI. Create a form schema based on this description: "${description}".
    
    Output strictly valid JSON. DO NOT include markdown formatting (like \`\`\`json).
    
    The output must be an array of objects matching this TypeScript interface:
    interface FormField {
      id: string; // Generate a random short string like "f1", "f2"
      type: 'text' | 'number' | 'email' | 'textarea' | 'checkbox' | 'select';
      label: string;
      placeholder?: string;
      required: boolean;
      options?: string[]; // Only for 'select' type
    }

    Example Output:
    [
      { "id": "a1", "type": "text", "label": "Full Name", "required": true, "placeholder": "John Doe" },
      { "id": "a2", "type": "email", "label": "Email Address", "required": true }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate form schema');
  }
};