import React from "react";

export default function RestartButton (props) {
    return (
      <button className="rules-icon" onClick={props.onClick}>
        <img
          alt="rules"
          className="icon-image"
          src="https://cdn2.iconfinder.com/data/icons/basic-ui-elements-round/700/012_restart-2-512.png"
        />
      </button>
    );
}
