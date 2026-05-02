import { voiceService } from '../services/voice.service.js';
import { aiService } from '../services/ai.service.js';

export const translate = async (req, res, next) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) return res.status(400).json({ error: 'text and targetLang are required' });
    const translated = await voiceService.translate(text, targetLang);
    res.json({ success: true, original: text, translated, language: targetLang });
  } catch (err) { next(err); }
};

export const processVoice = async (req, res, next) => {
  try {
    const { text, language } = req.body;
    if (!text) return res.status(400).json({ error: 'Transcribed text is required' });

    // Process through AI agent
    const context = {
      language: language || 'en',
      location: req.user?.location,
    };
    const result = await aiService.processMessage(text, context);

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
