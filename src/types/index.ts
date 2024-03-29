import { World } from "./../index";
export type Translation = Record<string, string>;
export type Translations = Record<string, Translation>;
export type TranslationContext = { translations: Translations; locale: string };
export type TranslationKey = any;
export type TranslationOptions = Record<string, any>;
export type TranslationLocale = string;

export type WorldFormatterProps = {
  key: string;
  value: any;
  method: string;
  locale: string;
};
export type WorldFormatter = (props: WorldFormatterProps) => string;
export type WorldOnLocaleChange = (
  locale: TranslationLocale,
  callback?: any,
) => void;
export type WorldFetch = (locale: TranslationLocale) => Promise<Translation>;

export type WorldConfig = {
  locale: TranslationLocale;
  locales: Array<TranslationLocale>;
  fallbackLocale: TranslationLocale;
  translations: Translations;
  formatter?: WorldFormatter;
  onLocaleChange?: WorldOnLocaleChange;
  fetch?: WorldFetch;
};

export type WorldContext = {
  instance: World;
  locale: TranslationLocale;
  locales: Array<TranslationLocale>;
  initializedLocales?: Array<TranslationLocale>;
  t: (
    key: TranslationKey,
    options?: TranslationOptions,
    locale?: TranslationLocale,
  ) => string;
  setLocale: (locale: TranslationLocale, callback?: any) => void;
};

export type WorldHook = () => WorldContext;
