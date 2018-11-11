import React, { Component } from "react";

export default class RestartButton extends Component {
  render() {
    return (
      <button id="open-rules" className="rules-icon">
        <img
          alt="rules"
          className="icon-image"
          src="https://cdn2.iconfinder.com/data/icons/basic-ui-elements-round/700/012_restart-2-512.png"
        />
      </button>
    );
  }
}
