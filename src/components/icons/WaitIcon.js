import React from "react";

const WaitIcon = props => {
  let style = {
    backgroundImage:
      "url(https://cdn4.iconfinder.com/data/icons/about-time-line/100/time-hourglass-512.png)"
  };
  const styleClass = props.playerInfo ? 'player-wait-icon' : 'info-icon';
  debugger;
  return props.waitTurn && !props.gameOver ? (
    <div
      className={`${styleClass} ${
        props.waitTurn ? "modal-shown" : "modal-hidden"
      }`}
      style={style}
    >
      <div className="blue-icon">{props.waitTurn}</div>
    </div>
  ) : null;
};

export default WaitIcon;
