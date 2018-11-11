import React from "react";
import classNames from "classnames";
import PropTypes from 'prop-types';

const card = props => {
  let cardStyle = {
    backgroundImage:
      "url(https://bfa.github.io/solitaire-js/img/card_back_bg.png)"
  };
  const cardClasses = classNames({
    card: true,
    available: !props.playerCanMove && props.deckCard,
    deckPossible: props.playerCanMove && props.deckCard,
    cardsInHand: !props.deckCard,
    'mr-2': props.deckCard
  });
  return <div className={cardClasses} onClick={props.playerCanMove && props.deckCard ? props.takeCard : null} style={cardStyle} />;
};

card.propTypes = {
  playerCanMove: PropTypes.bool,
  deckCard: PropTypes.bool,
  takeCardFromDeck: PropTypes.func
}

export default card;
