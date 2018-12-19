import React from "react";
import classNames from "classnames";
import PropTypes from 'prop-types';

const card = props => {
  debugger;
  let cardStyle = {
    backgroundImage:
      "url(https://bfa.github.io/solitaire-js/img/card_back_bg.png)",
    transform: props.deckCard ? `translateY(-${props.number * 3}px)` : 0  
  };
  const cardClasses = classNames({
    card: true,
    deckPossible: props.highlight && props.playerCanMove && props.deckCard,
    cardsInHand: !props.deckCard
  });
  return <div className={cardClasses} onClick={props.playerCanMove && props.deckCard ? props.takeCard : null} style={cardStyle} />;
};

card.propTypes = {
  playerCanMove: PropTypes.bool,
  deckCard: PropTypes.bool,
  takeCardFromDeck: PropTypes.func
}

export default card;
