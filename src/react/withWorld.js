import React, { Component } from "react";

import displayName from "./displayName";
import Context from "./Context";

const withWorld = options => {
  return ComposedComponent => {
    const ComposedComponentName = displayName(ComposedComponent);

    class C extends Component {
      render() {
        return (
          <Context.Consumer>
            {({ world }) => {
              return (
                <ComposedComponent
                  {...this.props}
                  world={world}
                  t={world.t}
                  locale={world.locale}
                />
              );
            }}
          </Context.Consumer>
        );
      }
    }
    C.displayName = `withWorld.${ComposedComponentName}`;
    return C;
  };
};

export default withWorld;
