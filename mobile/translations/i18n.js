import { I18n } from "i18n-js";

import en from './locales/en.json';
import vn from './locales/vn.json';
import kn from './locales/kn.json';
import hi from './locales/hi.json';

// Next 2 lines are for default and current locale
const i18n = new I18n({
    ...en,
    ...vn,
    ...kn,
    ...hi,
});
i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.fallbacks = true;
i18n.translations = { en, vn, kn, hi };

export default i18n;