# World 🌎

Lightweight internationalization library for JS with React Library.

## Install

`npm install world-i18n --save` or `yarn add world-i18n`

## Usage

### Simple

```js
import { World } from "world-i18n";

export default new World({
  locale: "en",
  defaultLocale: "en",
  translations: {
    en: {
      hello: "Hello",
      item: "Item",
      item_plural: "Items",
      "x-selected": "{{count}} Selected Item {{by}}",
      "x-selected_plural": "{{count}} Selected Items {{by}}",
      yell: "Yell as {{name,uppercase}}"
    },
    tr: {
      hello: "Merhaba!",
      item: "Madde",
      item_plural: "Madde",
      "x-selected": "{{by}} tarafından {{count}} Seçili",
      "x-selected_plural": "{{by}} tarafından {{count}} Seçili",
      yell: "{{name,uppercase}} diye bağır!"
    }
  },
  onLocaleChange: (locale, callback) => {
    // do your stuff with locale

    // don't forget to call the callback
    if (callback) callback();
  },
  formatter: ({ method, value, locale, options }) => {
    // do your stuff in here
    if (method == "uppercase") return value.toLocaleUpperCase(locale);
    return value;
  }
});
```

any.js

```js
import __ from "./world";

export const translatedTitle = () => {
  return __.t("x-selected", { count: 2, by: "Berkay" });
  // returns 1 Selected Items by Berkay
};

export const switchLanguage = () => {
  return __.setLocale(
    "en",
    callback /* will run after locale and onLocalChange*/,
    dontFetch /* if true, won't trigger fetch*/
  );
};
```

### Fetch translations

```js
import { World } from "world-i18n";

export default new World({
  locale: "en",
  defaultLocale: "en",
  fetch: locale => {
    // return a promise
    // translations == { en: {key:"value"}, tr: {key:"value"}}
    return new Promise(resolve => {
      fetch(url)
        .then((translations = {}) => {
          resolve(translations);
        })
        .catch(e => {
          resolve({});
        });
    });
  }
});
```

### Register translations

```js
import WorldInstance from "./world";

WorldInstance.registerTranslation("en", { hello: "Hello" });
WorldInstance.registerTranslations({
  en: { hello: "Hello" },
  tr: { hello: "Merhaba" }
});
```

### Usage with React

App.js

```js
import WorldInstance from "./world";

const App = () => {
  return (
    <WorldProvider instance={WorldInstance}>
      <MyApp {...this.props} />
    </WorldProvider>
  );
};

export default App;
```

MyComponent.js

```js
import { withWorld } from "world-i18n/lib/react";

class MyComponent extends React.Component {
  render() {
    const { t, world } = this.props;
    return (
      <div>
        {t("hello")} | {world.locale}
      </div>
    );
  }
}

export default withWorld({})(MyComponent);
```

### Usage with Next.js (SSR)

\_app.js

```js
import React from "react";
import App, { Container } from "next/app";

import WorldInstance from "./world";

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const worldContext = await World.createContext(locale);

    return { pageProps, worldContext };
  }
  constructor(props) {
    super(props);

    const { worldContext } = this.props;

    if (worldContext) {
      WorldInstance.registerContext(worldContext);
    }
  }
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
```

---

## Notes

> For now only `_plural` rule supported. It will work on most use cases, if you need anything else please open an issue or create a pull request.

---

## Contribute

Pull requests are welcome and please submit bugs 🐛.

## Contact

- Follow [@doubco](https://twitter.com/doubco) on Twitter
- Follow [@doubco](http://facebook.com/doubco) on Facebook
- Follow [@doubco](http://instagram.com/doubco) on Instagram
- Email <mailto:hi@doub.co>
