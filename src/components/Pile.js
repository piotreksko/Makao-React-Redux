import React from "react";
import Card from "./cards/Card";
import PropTypes from "prop-types";

export default function Pile(props) {
if (!props.cards) return null;
  return (
    <div id="pile">
      {props.cards.map((card, idx) => (
        <Card card={card} fromPile={true} key={idx}/>
      ))}
    </div>
  );
}

Pile.propTypes = {
  cards: PropTypes.array
};
