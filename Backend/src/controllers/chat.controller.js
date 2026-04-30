import { geminiService } from '../services/gemini.service.js';
import Conversation from '../models/Conversation.js';
import FarmProfile from '../models/FarmProfile.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message, language } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Build context
    const context = { language: language || req.user?.language || 'en' };

    if (req.user) {
      context.location = req.user.location;
      const farm = await FarmProfile.findOne({ userId: req.user._id });
      if (farm) {
        context.crops = farm.currentCrops || [];
        context.soilType = farm.soilType;
      }

      // Load recent conversation history
      let conversation = await Conversation.findOne({ userId: req.user._id }).sort({ updatedAt: -1 });
      if (conversation) {
        context.conversationHistory = conversation.messages.slice(-10);
      } else {
        conversation = new Conversation({ userId: req.user._id, messages: [] });
      }

      // Process through Gemini agent
      const result = await geminiService.processMessage(message, context);

      // Save to conversation
      conversation.messages.push({ role: 'user', content: message });
      conversation.messages.push({ role: 'assistant', content: result.response });
      
      // Keep last 50 messages to avoid unbounded growth
      if (conversation.messages.length > 50) {
        conversation.messages = conversation.messages.slice(-50);
      }
      await conversation.save();

      return res.json({ success: true, data: result });
    }

    // Unauthenticated — process without history
    const result = await geminiService.processMessage(message, context);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getHistory = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Login required for history' });
    const conversation = await Conversation.findOne({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: conversation?.messages || [] });
  } catch (err) { next(err); }
};

export const clearHistory = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    await Conversation.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'Conversation history cleared' });
  } catch (err) { next(err); }
};
