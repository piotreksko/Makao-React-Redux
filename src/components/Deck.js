import React from "react";
import CardBack from "./cards/CardBack";
import PropTypes from 'prop-types';

const Deck = props => {
  return <CardBack deckCard={true} takeCard={props.takeCard} playerCanMove={props.playerCanMove}/>;
};

Deck.propTypes = { 
  playerCanMove: PropTypes.bool,
  takeFromDeck: PropTypes.func
 };
 
export default Deck;
