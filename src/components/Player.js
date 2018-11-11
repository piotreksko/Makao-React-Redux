import React, { Component } from "react";
import Card from "./cards/Card";
import PropTypes from "prop-types";
var _ = require('lodash');

class Player extends Component {

  stylePlayerCards (playerCards, groupedCards){
    const { availableCards, possibleCards, selectedCards } = groupedCards;
    let cards = _.cloneDeep(playerCards);

    if (!cards) return;
    if (
      !availableCards.length &&
      !selectedCards.length &&
      !possibleCards.length
    )
      return playerCards;

    const topCard = selectedCards.length
      ? selectedCards[selectedCards.length - 1]
      : null;

    const styleTopCard = cards => {
      if (!topCard) return;
      return cards.forEach(function(card, i) {
        if (topCard.type === card.type && topCard.weight === card.weight)
          card.class = "topCard";
      });
    };

    const styleAvailableCards = cards => {
      return cards.forEach(card => {
        availableCards.forEach(availableCard => {
          if (
            availableCard.type === card.type &&
            availableCard.weight === card.weight
          )
            card.class = "available";
        });
      });
    };

    const stylePossibleCards = cards => {
      return cards.forEach(card => {
        possibleCards.forEach(possibleCard => {
          if (
            possibleCard.type === card.type &&
            possibleCard.weight === card.weight
          )
            card.class = "possible";
        });
      });
    };

    const styleSelectedCards = () => {
      return cards.forEach(card => {
        selectedCards.forEach(selectedCard => {
          if (
            selectedCard.type === card.type &&
            selectedCard.weight === card.weight
          )
            card.isSelected = true;
        });
      });
    };
    
    stylePossibleCards(cards);
    styleAvailableCards(cards);
    styleTopCard(cards);
    styleSelectedCards(cards);

    // .styleAvailableCards(cards)
    //   .styleSelectedCards(cards)
    //   .styleTopCard(cards);

    return cards;
  };

  checkClass (card){
    if (card.isSelected) {
      card.class += " selected";
    }
    return card.class ? card.class : '';
  }

  
  render() {
    return (
      <div className={"flex-container cards-container"}>
        <div className={"row cards"}>
          {this.stylePlayerCards(this.props.playerCards, this.props.groupedCards).map((card, index) => (
            <Card key={index} clickOwnCard={this.props.clickOwnCard} card={card} index={index} cardClass={this.checkClass(card) + ' cardsInHand'} />
          ))}
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  pickCard: PropTypes.func,
  player: PropTypes.shape({
    wait: PropTypes.bool,
    cards: PropTypes.array
  }),
  groupedCards: PropTypes.shape({
    selectedCards: PropTypes.array,
    availableCards: PropTypes.array,
    possibleCards: PropTypes.array,
  })
};

export default Player;
