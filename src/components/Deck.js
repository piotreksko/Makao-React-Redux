import React from "react";
import CardBack from "./cards/CardBack";
import PropTypes from "prop-types";

const Deck = props => {
  const number = props.cardsInDeck;
  let howManyToRender = parseInt(number / 10) + 2;
  let deckToRender = [];

  for (let i = 0; i < howManyToRender; i++) {
    let cardToPush = (
      <CardBack
        key={i}
        number={i}
        highlight={i === 0 && props.isPlayerTurn ? true : false}
        deckCard={true}
        takeCard={props.takeCard}
        playerCanMove={props.playerCanMove}
      />
    );

    deckToRender.push(cardToPush);
  }

  return (
    <div className="deck">
      {deckToRender}
    </div>
  );
};

Deck.propTypes = {
  playerCanMove: PropTypes.bool,
  takeFromDeck: PropTypes.func
};

export default Deck;
