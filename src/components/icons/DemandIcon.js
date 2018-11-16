import React from "react";

const DemandIcon = props => {
  let style = {
    backgroundImage:
      "url(https://cdn.iconscout.com/icon/premium/png-256-thumb/demand-3-549092.png)"
  };
  return props.jackActive ? (
    <div
      className={`info-icon ${
        props.jackActive ? "modal-shown" : "modal-hidden"
      }`}
      style={style}
    >
      <div className="orange-icon">{props.chosenType !== 'queen' ? props.chosenType : 'Q'}</div>
    </div>
  ) : null;
};


export default DemandIcon;
