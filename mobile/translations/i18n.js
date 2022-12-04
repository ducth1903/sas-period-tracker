import { I18n } from "i18n-js";

import en from './locales/en.json';
import vn from './locales/vn.json';
import kannada from './locales/kannada.json';
import hindi from './locales/hindi.json';

// Next 2 lines are for default and current locale
const i18n = new I18n({
    ...en,
    ...vn,
    ...kannada,
    ...hindi,
});
i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.fallbacks = true;
i18n.translations = { en, vn, kannada, hindi };

export default i18n;