import React from "react";
import PropTypes from "prop-types";

const Card = props => {
  const fileName = props.card.type + "_of_" + props.card.weight;
  const card = require(`../../content/images/cards/${fileName}.png`);
  
  let cardStyle = {
    backgroundImage: "url(" + card + ")"
  };

  if (props.fromPile) {
    cardStyle.position = "absolute";
    if (props.card.transform) {
      const { rotate, x, y } = props.card.transform;
      cardStyle.transform = `rotate(${rotate}deg) translate(${x}px, ${y}px)`;
    }
  }

  return (
    <div
      onClick={
        props.clickOwnCard
          ? e => props.clickOwnCard(props.card, props.index)
          : null
      }
      className={["card", props.cardClass].join(" ")}
      style={cardStyle}
    />
  );
};

Card.propTypes = {
  card: PropTypes.object
};

export default Card;
