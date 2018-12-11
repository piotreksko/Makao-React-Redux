import React from "react";

const BattleIcon = props => {
  let style = {
    backgroundImage:
      "url(https://cdn.iconscout.com/icon/premium/png-256-thumb/swords-56-798933.png)"
  };
  return props.battleCards > 1 ? (
    <div
      className={`info-icon ${
        props.battleCards > 1 ? "modal-shown" : "modal-hidden"
      }`}
      style={style}
    >
      <div className="red-icon">{props.battleCards - 1}</div>
    </div>
  ) : null;
};

export default BattleIcon;
