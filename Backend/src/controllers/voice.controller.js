import twilio from 'twilio';
import { voiceService } from '../services/voice.service.js';
import { aiService } from '../services/ai.service.js';
import { logger } from '../utils/logger.js';

const { VoiceResponse } = twilio.twiml;

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

/**
 * Initial webhook for incoming Twilio calls.
 */
export const twilioIncomingCall = (req, res) => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    input: 'speech',
    action: '/api/voice/twilio/process',
    method: 'POST',
    language: 'en-IN',
    speechTimeout: 'auto',
  });

  gather.say('Welcome to AgriSense AI. How can I help you today?');

  // Fallback if no input
  twiml.say('I did not hear anything. Please call back if you need help. Goodbye.');
  twiml.hangup();

  res.type('text/xml');
  res.send(twiml.toString());
};

/**
 * Step 1: Handle SpeechResult and buy time with a Redirect
 */
export const twilioProcessSpeech = async (req, res, next) => {
  try {
    const twiml = new VoiceResponse();
    const speechText = req.body.SpeechResult;

    if (!speechText) {
      twiml.say('I am sorry, I did not catch that. Could you please repeat?');
      twiml.redirect('/api/voice/twilio/incoming');
    } else {
      // Say something to keep Twilio happy and reset the 15s timer
      twiml.say('Please wait a moment while I process that for you.');
      
      // Redirect to the actual AI processing endpoint
      // We pass the speech text in the query string to be safe
      twiml.redirect({ method: 'POST' }, `/api/voice/twilio/process-ai?SpeechResult=${encodeURIComponent(speechText)}`);
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (err) {
    next(err);
  }
};

/**
 * Step 2: Long-running AI processing (Ollama)
 */
export const twilioProcessAI = async (req, res, next) => {
  try {
    const twiml = new VoiceResponse();
    const speechText = req.query.SpeechResult || req.body.SpeechResult;

    if (!speechText) {
      twiml.redirect('/api/voice/twilio/incoming');
    } else {
      logger.info(`Voice AI processing for: ${speechText}`);
      
      const voicePrompt = `${speechText}\n\n(Note: You are responding via voice call. Keep your answer very brief and clear, maximum 2 sentences.)`;

      const aiResult = await aiService.processMessage(voicePrompt, { language: 'en' });
      const responseText = aiResult.response;

      twiml.say(responseText);

      // Loop for next question
      const gather = twiml.gather({
        input: 'speech',
        action: '/api/voice/twilio/process',
        method: 'POST',
        language: 'en-IN',
        speechTimeout: 'auto',
      });
      gather.say('Do you have any other questions?');

      twiml.say('Thank you for calling AgriSense. Goodbye.');
      twiml.hangup();
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (err) {
    logger.error(`twilioProcessAI error: ${err.message}`);
    const twiml = new VoiceResponse();
    twiml.say('I am sorry, I am having trouble connecting to my brain. Please try again later.');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  }
};
