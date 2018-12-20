import React from "react";
import classNames from "classnames";
import PropTypes from 'prop-types';
import cardBack from '../../content/images/cards/card_back.png';

const card = props => {
  let cardStyle = {
    backgroundImage:
      "url(" + cardBack + ")",
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
