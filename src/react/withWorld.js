import React, { Component } from "react";

import displayName from "../../../utils/browser/displayName";
import { WorldConsumer } from "./Context";

const withWorld = options => {
  return ComposedComponent => {
    const ComposedComponentName = displayName(ComposedComponent);

    class C extends Component {
      render() {
        return (
          <WorldConsumer>
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
          </WorldConsumer>
        );
      }
    }
    C.displayName = `withWorld.${ComposedComponentName}`;
    return C;
  };
};

export default withWorld;
