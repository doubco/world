import React, { ReactChild, useContext, useState } from "react";
import { World } from "..";

import {
  TranslationKey,
  TranslationOptions,
  TranslationLocale,
} from "../types";

const Context = React.createContext({});

type WorldContext = {
  instance: World;
  locale: TranslationLocale;
  locales: Array<TranslationLocale>;
  initializedLocales: Array<TranslationLocale>;
  t: (
    key: TranslationKey,
    options: TranslationOptions,
    locale?: TranslationLocale,
  ) => string;
  setLocale: (locale: TranslationLocale, callback: any) => void;
};

export const WorldProvider = (props: {
  children: ReactChild;
  instance: World;
}) => {
  const { children, instance } = props;
  const [locale, setLocale] = useState(instance.locale);
  const context: WorldContext = {
    instance,
    locale,
    t: instance.t,
    setLocale: (locale: TranslationLocale, callback: any) => {
      instance.setLocale(locale, () => {
        setLocale(locale);
        if (callback) callback();
      });
    },
    locales: instance.locales,
    initializedLocales: instance.initializedLocales,
  };
  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useWorld = () => {
  const world = useContext(Context);
  return world;
};
