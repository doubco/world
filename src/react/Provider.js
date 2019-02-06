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
            locale: this.state.locale,
            instance: this.instance,
            t: this.instance.t,
            setLocale: locale => {
              this.instance.setLocale(locale, () => {
                this.setState({ locale });
              });
            },
            locales: this.instance.locales
          }
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default WorldProvider;
