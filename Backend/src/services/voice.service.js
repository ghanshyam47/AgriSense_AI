import { Ollama } from 'ollama';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const ollama = new Ollama({ host: config.OLLAMA_HOST });
const model = config.OLLAMA_MODEL;
/**
 * Translate text to target language using Gemini.
 * Also serves as the voice processing layer.
 */

/** Translate text to target language */
export const translate = async (text, targetLang = 'hi') => {
  const langNames = {
    en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu',
    kn: 'Kannada', mr: 'Marathi', bn: 'Bengali', gu: 'Gujarati', pa: 'Punjabi',
  };

  const langName = langNames[targetLang] || targetLang;

  try {
    const response = await ollama.chat({
      model,
      messages: [
        { role: 'user', content: `Translate the following text to ${langName}. Return ONLY the translated text, nothing else.\n\nText: ${text}` }
      ],
    });
    return response.message.content?.trim() || text;
  } catch (err) {
    logger.error(`Translation error: ${err.message}`);
    return text; // Return original on failure
  }
};

/** Process voice input: transcribed text → AI response → translated response */
export const processVoiceInput = async (transcribedText, language = 'en', userId = null) => {
  // This delegates to the chat service for actual AI processing
  // The voice controller handles the flow: STT (client) → process → TTS (client)
  return {
    input: transcribedText,
    language,
    note: 'Use POST /api/chat/message with this text for AI response, then translate.',
  };
};

export const voiceService = { translate, processVoiceInput };
