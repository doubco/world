import {
  Translation,
  TranslationKey,
  TranslationContext,
  TranslationLocale,
  Translations,
  WorldFormatter,
  WorldOnLocaleChange,
  WorldFetch,
  WorldConfig,
  TranslationOptions,
} from "./types";

import { isObject, isString, isArray } from "@doubco/wtf";

export class World {
  initializedLocales: Array<TranslationLocale>;
  locales: Array<TranslationLocale>;
  locale: TranslationLocale;
  fallbackLocale: TranslationLocale;
  translations: Translations;
  formatter?: WorldFormatter;
  onLocaleChange?: WorldOnLocaleChange;
  fetch?: WorldFetch;

  constructor(config: WorldConfig) {
    const {
      locale,
      locales,
      fallbackLocale = "en",
      translations = {},
      formatter,
      onLocaleChange,
      fetch,
    } = config;

    this.initializedLocales = [];
    this.locales = locales || [fallbackLocale];
    this.locale = locale || fallbackLocale;
    this.fallbackLocale = fallbackLocale;
    this.translations = translations || {};
    this.formatter = formatter;
    this.onLocaleChange = onLocaleChange;
    this.fetch = fetch;

    this.t = this.t.bind(this);
    this.parse = this.parse.bind(this);
    this.setLocale = this.setLocale.bind(this);
    this.registerTranslation = this.registerTranslation.bind(this);
    this.registerTranslations = this.registerTranslations.bind(this);

    if (this.fetch) {
      this.fetch = this.fetch.bind(this);
    }
  }

  parse(phrase: string) {
    return (props: TranslationOptions) => {
      return phrase.replace(/{{([^{}]*)}}/g, (a, b) => {
        let k = b.replace(/ /g, "");
        let value = "";
        let key;
        let method;
        if (k.includes(",")) {
          let [x, m] = k.split(",");
          let v = props[x];
          if (v && m) {
            value = v;
            method = m;
            key = x;
          }
        } else {
          let x = k;
          let v = String(props[x]);
          if (v) {
            value = v;
            key = x;
          }
        }

        if (this.formatter) {
          value = this.formatter({ key, value, method, locale: this.locale });
        }

        return value;
      });
    };
  }

  registerTranslation(key: string, translation: Translation) {
    if (!this.initializedLocales.includes(key)) {
      this.initializedLocales.push(key);
    }

    const previousTranslation: Translation = this.translations[key] || {};

    this.translations[key] = {
      ...previousTranslation,
      ...translation,
    };
  }

  registerTranslations(translations: Translations) {
    Object.keys(translations).forEach((key) => {
      let translation = translations[key];

      if (!this.initializedLocales.includes(key)) {
        this.initializedLocales.push(key);
      }

      const previousTranslation: Translation = this.translations[key] || {};

      this.translations[key] = {
        ...previousTranslation,
        ...translation,
      };
    });
  }

  createContext(locale: string) {
    // eslint-disable-next-line
    return new Promise((resolve) => {
      this.setLocale(locale, () => {
        resolve({
          locale: this.locale,
          translations: this.translations,
        });
      });
    });
  }

  registerContext(context: TranslationContext) {
    this.registerTranslations(context.translations);
    this.setLocale(context.locale, null, true);
  }

  setLocale(locale = this.fallbackLocale, callback?: any, dontFetch?: boolean) {
    if (!isString(locale)) locale = this.fallbackLocale;
    this.locale = locale;

    if (this.fetch && !dontFetch) {
      this.fetch(this.locale).then((translation) => {
        if (translation) {
          this.registerTranslation(this.locale, translation);
        }
        if (this.onLocaleChange) {
          this.onLocaleChange(this.locale, callback);
        } else {
          if (callback) callback();
        }
      });
    } else {
      if (this.onLocaleChange) {
        this.onLocaleChange(this.locale, callback);
      } else {
        if (callback) callback();
      }
    }
  }

  t(
    key: TranslationKey,
    options: TranslationOptions,
    locale = this.locale || this.fallbackLocale,
  ) {
    let phrase;

    if (!key) key = "";
    if (!options) options = {};

    if (isObject(key)) {
      phrase = key[locale];

      if (!phrase) {
        phrase = key[this.fallbackLocale];
      }

      if (phrase) {
        if (isArray(phrase) && phrase.length) {
          phrase = phrase.join("\n");
        }
        if (isString(phrase)) {
          return this.parse(phrase)(options);
        } else {
          return phrase;
        }
      }

      return "";
    }

    let phrases = this.translations[locale];

    if (phrases) {
      phrase = phrases[key];
      // TODO: add support for other pluralization rules (arabic etc.)
      // plural
      if (options.count && options.count > 1) {
        let pluralKey = `${key}_plural`;
        if (phrases[pluralKey]) {
          phrase = phrases[pluralKey];
        }
      }
      // zero
      if (options.count === 0) {
        let pluralKey = `${key}_zero`;
        if (phrases[pluralKey]) {
          phrase = phrases[pluralKey];
        }
      }
    }

    if (phrase) {
      if (isString(phrase)) {
        return this.parse(phrase)(options);
      } else {
        return phrase;
      }
    } else {
      return key;
    }
  }
}
