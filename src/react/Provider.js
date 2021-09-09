import React, { Component } from "react";
import Context from "./Context";
class WorldProvider extends Component {
  constructor(props) {
    super(props);

    const { instance } = this.props;

    this.state = { locale: instance.locale };

    this.instance = instance;
  }

  render() {
    return (
      <Context.Provider
        value={{
          world: {
            instance: this.instance,
            locale: this.state.locale,
            t: this.instance.t,
            setLocale: (locale, callback) => {
              this.instance.setLocale(locale, () => {
                this.setState({ locale });
                if (callback) callback();
              });
            },
            locales: this.instance.locales,
            initializedLocales: this.instance.initializedLocales,
          },
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default WorldProvider;
