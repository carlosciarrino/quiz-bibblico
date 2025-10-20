

import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty, Language } from '../types';
import { QUESTIONS_PER_BLOCK } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        // FIX: Using English for schema descriptions as a best practice.
        description: 'The text of the quiz question.'
      },
      options: {
        type: Type.ARRAY,
        // FIX: Using English for schema descriptions as a best practice.
        description: 'An array of 4 possible string answers.',
        items: {
          type: Type.STRING
        }
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        // FIX: Using English for schema descriptions as a best practice.
        description: 'The index (0 to 3) of the correct answer in the options array.'
      }
    },
    required: ['question', 'options', 'correctAnswerIndex']
  }
};

export const generateQuestions = async (topic: string, difficulty: Difficulty, language: Language): Promise<Question[]> => {
  const languageMap: Record<Language, string> = {
    it: 'italiano',
    en: 'inglese',
    pt: 'portoghese',
    es: 'spagnolo',
    fr: 'francese',
    de: 'tedesco'
  };
  const langInstruction = languageMap[language];
  
  try {
    const prompt = `Genera un blocco di esattamente ${QUESTIONS_PER_BLOCK} domande uniche a risposta multipla in lingua ${langInstruction}.
    L'argomento è: "${topic}".
    Il livello di difficoltà deve essere: "${difficulty}".
    Le domande devono basarsi sulla versione della Bibbia "Nuova Riveduta".
    Per ogni domanda, fornisci il testo della domanda, 4 possibili risposte e l'indice (0-3) della risposta corretta.
    Assicurati che ci siano esattamente 4 opzioni per ogni domanda.
    Non ripetere le domande.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 0.8,
      }
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Validate that we received an array of the correct length
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      return parsedData.slice(0, QUESTIONS_PER_BLOCK) as Question[];
    } else {
        console.error("Gemini API returned unexpected data format:", parsedData);
        throw new Error('Received invalid data from API');
    }

  } catch (error) {
    console.error("Error generating questions with Gemini API:", error);
    throw error;
  }
};