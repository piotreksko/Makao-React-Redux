import React from "react";
import PropTypes from "prop-types";

const Card = props => {
  const fileName = props.card.type + "_of_" + props.card.weight;
  const img =
    "https://res.cloudinary.com/bosmanone/image/upload/v1477397924/cards/" +
    fileName +
    ".png";

  let cardStyle = {
    backgroundImage: "url(" + img + ")"
  };

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
