import { GoogleGenAI } from '@google/genai';
import Constants from 'expo-constants';

export const ai = new GoogleGenAI({
  apiKey: Constants.expoConfig?.extra?.GOOGLE_GENAI_API_KEY,
});