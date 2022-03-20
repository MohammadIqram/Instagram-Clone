import { render } from "@testing-library/react";
import React from "react";
import reactDOM from "react-dom";

const UpdateComponent = (WrappedComponent) => {
  class UpdateComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        count: 0,
      };
    }

    incrementCounter = () => {
      this.setState((pre) => {
        return { count: pre.count + 1 };
      });
    };

    render() {
      return (
        <WrappedComponent
          count={this.state.count}
          increment={this.incrementCounter}
        />
      );
    }
  }

  return UpdateComponent;
};

export default UpdateComponent;
