import React from "react";

export default function ChangeSuitModal(props) {
  return (
    <div>
      <span>Pick card suit</span>
      <div className="suit-pick">
        <button onClick={e => props.changeSuit('hearts')} className="suit-icon">
          <img
            alt="heartSymbol"
            className="icon-image"
            src="https://upload.wikimedia.org/wikipedia/commons/7/77/Heart_symbol_c00.png"
          />
        </button>
        <button onClick={e => props.changeSuit('diamonds')} className="suit-icon">
          <img
            alt="diamondsSymbol"
            className="icon-image"
            src="https://www.spreadshirt.com/image-server/v1/designs/11631716,width=178,height=178/card-suit-diamond.png"
          />
        </button>
      </div>
      <div className="suit-pick">
        <button onClick={e => props.changeSuit('clubs')} className="suit-icon">
          <img
            alt="clubsSymbol"
            className="icon-image"
            src="http://www.clker.com/cliparts/U/3/0/g/Z/y/carte-de-trefla-md.png"
          />
        </button>
        <button onClick={e => props.changeSuit('spades')} className="suit-icon">
          <img
            alt="spadesSymbol"
            className="icon-image"
            src="https://image.freepik.com/free-icon/spades-symbol_318-40683.jpg"
          />
        </button>
      </div>
    </div>
  );
}
