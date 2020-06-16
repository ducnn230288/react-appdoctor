/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/vi';
import 'intl/locale-data/jsonp/ja';

import enGB from "antd/lib/locale-provider/en_GB";
import viVN from "antd/lib/locale-provider/vi_VN";
import jaJP from "antd/lib/locale-provider/ja_JP";

import enTranslationMessages from '@/translations/en.json';
import viTranslationMessages from '@/translations/vi.json';
import jaTranslationMessages from '@/translations/ja.json';

// prettier-ignore
const appLocales = [
  'en',
  'vi',
  'ja',
];

const translationMessages = {
  en: enTranslationMessages,
  vi: viTranslationMessages,
  ja: jaTranslationMessages,
};

const localeAntd = {
  en: enGB,
  vi: viVN,
  ja: jaJP,
};

export {
  appLocales, translationMessages, localeAntd
}
