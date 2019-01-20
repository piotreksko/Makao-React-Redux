import React from "react";
import heartsSymbol from "../../content/images/symbols/hearts_symbol.png";
import diamondsSymbol from "../../content/images/symbols/diamonds_symbol.png";
import clubsSymbol from "../../content/images/symbols/clubs_symbol.png";
import spadesSymbol from "../../content/images/symbols/spades_symbol.png";
import PropTypes from "prop-types";

export default function ChangeSuitModal(props) {
  return (
    <div>
      <span>Pick card suit</span>
      <div className="suit-pick">
        <button onClick={e => props.changeSuit("hearts")} className="suit-icon">
          <img alt="heartSymbol" className="icon-image" src={heartsSymbol} />
        </button>
        <button
          onClick={e => props.changeSuit("diamonds")}
          className="suit-icon"
        >
          <img
            alt="diamondsSymbol"
            className="icon-image"
            src={diamondsSymbol}
          />
        </button>
      </div>
      <div className="suit-pick">
        <button onClick={e => props.changeSuit("clubs")} className="suit-icon">
          <img alt="clubsSymbol" className="icon-image" src={clubsSymbol} />
        </button>
        <button onClick={e => props.changeSuit("spades")} className="suit-icon">
          <img alt="spadesSymbol" className="icon-image" src={spadesSymbol} />
        </button>
      </div>
    </div>
  );
}

ChangeSuitModal.propTypes = {
  changeSuit: PropTypes.func
};
