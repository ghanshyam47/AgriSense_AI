import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "overview": "Overview",
        "market": "Market MSP",
        "irrigation": "Irrigation",
        "recommendation": "Crop Recommendation",
        "weather": "Weather",
        "alerts": "Alerts",
        "schedule": "Schedule",
        "settings": "Settings",
        "home": "Home"
      },
      "dashboard": {
        "title": "My Farms Health",
        "subtitle": "Real-time Farm Health Analytics",
        "overallHealth": "Overall Farm Health",
        "viewDetails": "View Farm Details",
        "agentTitle": "Consult your Neural Agent",
        "agentSubtitle": "for predictive farm insights.",
        "accessNeural": "Access Neural Command...",
        "myCrops": "My Crops",
        "activePipeline": "Active Cultivation Pipeline",
        "registerCrop": "Register New Crop",
        "analyzeGrowth": "Analyze Growth Path",
        "planted": "Planted",
        "harvest": "Est. Harvest",
        "intelligenceFeed": "Agent Intelligence Feed",
        "mlSync": "ML Sync"
      },
      "metrics": {
        "moisture": "Moisture",
        "temp": "Temp",
        "nitrogen": "Nitrogen",
        "phosphorus": "Phosphorus",
        "potassium": "Potassium",
        "hydration": "Hydration Model",
        "thermal": "Thermal Node"
      },
      "languages": {
        "en": "English",
        "hi": "Hindi",
        "pa": "Punjabi"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "overview": "अवलोकन",
        "market": "बाजार एमएसपी",
        "irrigation": "सिंचाई",
        "recommendation": "फसल सिफारिश",
        "weather": "मौसम",
        "alerts": "अलर्ट",
        "schedule": "अनुसूची",
        "settings": "सेटिंग्स",
        "home": "होम"
      },
      "dashboard": {
        "title": "मेरे फार्म का स्वास्थ्य",
        "subtitle": "वास्तविक समय फार्म स्वास्थ्य विश्लेषण",
        "overallHealth": "कुल फार्म स्वास्थ्य",
        "viewDetails": "फार्म विवरण देखें",
        "agentTitle": "अपने न्यूरल एजेंट से परामर्श करें",
        "agentSubtitle": "भविष्य कहनेवाला फार्म अंतर्दृष्टि के लिए।",
        "accessNeural": "न्यूरल कमांड एक्सेस करें...",
        "myCrops": "मेरी फसलें",
        "activePipeline": "सक्रिय खेती पाइपलाइन",
        "registerCrop": "नई फसल पंजीकृत करें",
        "analyzeGrowth": "विकास पथ का विश्लेषण करें",
        "planted": "रोपा गया",
        "harvest": "अनुमानित कटाई",
        "intelligenceFeed": "एजेंट इंटेलिजेंस फीड",
        "mlSync": "एमएल सिंक"
      },
      "metrics": {
        "moisture": "नमी",
        "temp": "तापमान",
        "nitrogen": "नाइट्रोजन",
        "phosphorus": "फास्फोरस",
        "potassium": "पोटेशियम",
        "hydration": "जलयोजन मॉडल",
        "thermal": "थर्मल नोड"
      },
      "languages": {
        "en": "अंग्रेजी",
        "hi": "हिंदी",
        "pa": "पंजाबी"
      }
    }
  },
  pa: {
    translation: {
      "nav": {
        "overview": "ਸੰਖੇਪ",
        "market": "ਮਾਰਕੀਟ MSP",
        "irrigation": "ਸਿੰਚਾਈ",
        "recommendation": "ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼",
        "weather": "ਮੌਸਮ",
        "alerts": "ਅਲਰਟ",
        "schedule": "ਸ਼ਡਿਊਲ",
        "settings": "ਸੈਟਿੰਗਾਂ",
        "home": "ਹੋਮ"
      },
      "dashboard": {
        "title": "ਮੇਰੇ ਫਾਰਮ ਦੀ ਸਿਹਤ",
        "subtitle": "ਰੀਅਲ-ਟਾਈਮ ਫਾਰਮ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ",
        "overallHealth": "ਕੁੱਲ ਫਾਰਮ ਸਿਹਤ",
        "viewDetails": "ਫਾਰਮ ਦੇ ਵੇਰਵੇ ਦੇਖੋ",
        "agentTitle": "ਆਪਣੇ ਨਿਊਰਲ ਏਜੰਟ ਨਾਲ ਸਲਾਹ ਕਰੋ",
        "agentSubtitle": "ਭਵਿੱਖਬਾਣੀ ਵਾਲੇ ਫਾਰਮ ਇਨਸਾਈਟਸ ਲਈ।",
        "accessNeural": "ਨਿਊਰਲ ਕਮਾਂਡ ਐਕਸੈਸ ਕਰੋ...",
        "myCrops": "ਮੇਰੀਆਂ ਫਸਲਾਂ",
        "activePipeline": "ਸਰਗਰਮ ਖੇਤੀ ਪਾਈਪਲਾਈਨ",
        "registerCrop": "ਨਵੀਂ ਫਸਲ ਰਜਿਸਟਰ ਕਰੋ",
        "analyzeGrowth": "ਵਿਕਾਸ ਮਾਰਗ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
        "planted": "ਬੀਜਿਆ ਗਿਆ",
        "harvest": "ਅੰਦਾਜ਼ਨ ਵਾਢੀ",
        "intelligenceFeed": "ਏਜੰਟ ਇੰਟੈਲੀਜੈਂਸ ਫੀਡ",
        "mlSync": "ML ਸਿੰਕ"
      },
      "metrics": {
        "moisture": "ਨਮੀ",
        "temp": "ਤਾਪਮਾਨ",
        "nitrogen": "ਨਾਇਟ੍ਰੋਜਨ",
        "phosphorus": "ਫਾਸਫੋਰਸ",
        "potassium": "ਪੋਟਾਸ਼ੀਅਮ",
        "hydration": "ਹਾਈਡ੍ਰੇਸ਼ਨ ਮਾਡਲ",
        "thermal": "ਥਰਮਲ ਨੋਡ"
      },
      "languages": {
        "en": "ਅੰਗਰੇਜ਼ੀ",
        "hi": "ਹਿੰਦੀ",
        "pa": "ਪੰਜਾਬੀ"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
