import I18n from "i18n-js";

import en from './locales/en.json';
import vn from './locales/vn.json';
import kannada from './locales/kannada.json';
import hindi from './locales/hindi.json';

// Next 2 lines are for default and current locale
I18n.defaultLocale = 'en';
I18n.locale = 'en';
I18n.fallbacks = true;
I18n.translations = { en, vn, kannada, hindi };

export default I18n;