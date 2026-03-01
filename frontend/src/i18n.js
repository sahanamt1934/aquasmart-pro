import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "title": "AquaSmart Pro",
          "subtitle": "Universal Karnataka Advisory System",
          "select_lang": "SELECT LANGUAGE:",
          "loc_label": "LOCATION",
          "crop_label": "CROP",
          "stage_label": "STAGE",
          "soil_label": "SOIL",
          "gps_btn": "Use My GPS",
          "analyze_btn": "Analyze Field Advisory",
          "water_table": "Water Table",
          "daily_need": "Daily Need",
          "history_title": "HISTORICAL ADVISORIES",
          "live_weather": "LIVE WEATHER",
          "danger": "DANGER",
          "warning": "WARNING",
          "optimal": "OPTIMAL",
          "red": "Red",
          "black": "Black"
        }
      },
      kn: {
        translation: {
          "title": "ಆಕ್ವಾಸ್ಮಾರ್ಟ್ ಪ್ರೊ",
          "subtitle": "ಕರ್ನಾಟಕದ ಸಾರ್ವತ್ರಿಕ ಸಲಹಾ ವ್ಯವಸ್ಥೆ",
          "select_lang": "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ:",
          "loc_label": "ಸ್ಥಳ",
          "crop_label": "ಬೆಳೆ",
          "stage_label": "ಬೆಳೆಯ ಹಂತ",
          "soil_label": "ಮಣ್ಣಿನ ವಿಧ",
          "gps_btn": "ನನ್ನ ಜಿಪಿಎಸ್ ಬಳಸಿ",
          "analyze_btn": "ಕ್ಷೇತ್ರದ ಸಲಹೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
          "water_table": "ಅಂತರ್ಜಲ ಮಟ್ಟ",
          "daily_need": "ದೈನಂದಿನ ಅಗತ್ಯ",
          "history_title": "ಹಿಂದಿನ ಸಲಹೆಗಳು",
          "live_weather": "ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
          "danger": "ಅಪಾಯ", 
          "warning": "ಎಚ್ಚರಿಕೆ",
          "optimal": "ಸೂಕ್ತ",
          "red": "ಕೆಂಪು ಮಣ್ಣು",
          "black": "ಕಪ್ಪು ಮಣ್ಣು"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;