import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Aux from "../hoc/Auxilliary";

import * as logicActions from "../actions/logicActions";
import * as soundActions from "../actions/soundActions";
import ActionButtons from "../components/buttons/ActionButtons";
import Card from "../components/cards/Card";
import WaitIcon from "../components/icons/WaitIcon";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableCards: [],
      possibleCards: [],
      selectedCards: []
    };
  }

  componentWillMount() {
    if (this.props.gameState.playerTurn)
      setTimeout(() => {
        this.checkAvailableCards();
      }, 1200);
    else
      setTimeout(() => {
        this.props.endTurn();
      }, 1200);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !_.isEqual(prevState, this.state) ||
      !_.isEqual(
        prevProps.gameState.cpuPlayer,
        this.props.gameState.cpuPlayer
      ) ||
      !_.isEqual(prevProps.gameState.Player, this.props.gameState.Player)
    )
      this.checkAvailableCards();
  }

  waitTurns = () => {
    this.props.playSound("click");
    this.props.playerWait();
    this.props.endTurn();
  };

  clickOwnCard = (card, index) => {
    if (!card.class) return;
    let newSelected = _.cloneDeep(this.state.selectedCards);

    const randomSoundNumber = Math.floor(Math.random() * 3) + 1;
    this.props.playSound(`pick_card${randomSoundNumber}`);

    let playerCards = this.props.gameState.player.cards;

    const updateSelectedCards = () => {
      this.setState({
        ...this.state,
        selectedCards: newSelected
      });
    };

    if (!newSelected.length) {
      newSelected.push(card);
      updateSelectedCards();
    }

    const removeFromSelected = () => {
      for (let i = 0; i < newSelected.length; i++) {
        //Find index of the card to remove from selected
        if (
          newSelected[i].type === playerCards[index].type &&
          newSelected[i].weight === playerCards[index].weight
        ) {
          newSelected.splice(i, 1);
          if (i === 0) {
            newSelected = [];
          }
        }
      }
    };

    if (card.class.includes("selected")) {
      removeFromSelected();
      return updateSelectedCards();
    }

    switch (card.class) {
      case "possible":
        newSelected.push(card);
        break;
      case "available":
        newSelected = [];
        newSelected.push(playerCards[index]);
        break;
      default:
        return newSelected;
    }
    updateSelectedCards();
  };

  confirmCards = () => {
    if (!this.state.selectedCards.length) return;
    this.props.playSound("click");
    const { makePlayerMove } = this.props;
    makePlayerMove(this.state.selectedCards);
    this.setState({
      ...this.state,
      selectedCards: []
    });
  };

  checkAvailableCards = () => {
    const selectedCards = this.state.selectedCards;
    const playerWait = this.props.gameState.player.wait;

    if (playerWait) return;

    if (!selectedCards.length) {
      this.hasNoSelectedCards();
    } else if (selectedCards.length) {
      this.hasSelectedCards();
    }
  };

  hasNoSelectedCards = () => {
    const {
      player,
      chosenWeight,
      chosenType,
      waitTurn,
      jackActive,
      battleCardActive,
      pile
    } = this.props.gameState;
    const playerCards = player.cards;

    let pileTopCard = _.cloneDeep(pile[pile.length - 1]),
      newAvailable = [],
      newPossible = [];

    if (pileTopCard.type === "ace") {
      pileTopCard.weight = chosenWeight;
    }

    playerCards.forEach((card, idx) => {
      // Make battle cards available if battle is on
      if (battleCardActive) {
        return (newAvailable = [
          ...newAvailable,
          ...this.getBattleCards(card, idx, playerCards, pileTopCard)
        ]);
      }

      // Make 4 available if it was used
      if (waitTurn) {
        return card.type === "4" ? newAvailable.push(playerCards[idx]) : null;
      }

      // Jack demand is active
      if (jackActive) {
        return card.type === chosenType ||
          (card.type === "jack" && pileTopCard.type === "jack")
          ? newAvailable.push(playerCards[idx])
          : null;
      }

      // No special conditions
      if (card.type === pileTopCard.type) {
        newAvailable.push(playerCards[idx]);
      }
      if (
        card.weight === pileTopCard.weight &&
        card.type !== pileTopCard.type
      ) {
        newAvailable.push(playerCards[idx]);
      }
    });
    this.updatePlayerCards(newAvailable, newPossible);
  };

  getBattleCards = (card, idx, playerCards, pileTopCard, newAvailable = []) => {

    // Battle cards are 2, 3, king of spades and hearts
    if (
      card.type === pileTopCard.type ||
      // 2 or 3
      (card.weight === pileTopCard.weight &&
        (card.type === "2" || card.type === "3")) ||
      // Kings - spades and hearts
      (card.type === "king" &&
        card.weight === pileTopCard.weight &&
        (card.weight === "spades" || card.weight === "hearts")) ||
      // If last card was a battle king, make king of diamond and clubs available
      (card === pileTopCard.type &&
        (card.weight === "diamond" || card.weight === "clubs"))
    ) {
      newAvailable.push(playerCards[idx]);
    }
    return newAvailable;
  };

  hasSelectedCards() {
    const {
      player,
      waitTurn,
      chosenWeight,
      jackActive,
      battleCardActive,
      pile
    } = this.props.gameState;
    const playerCards = player.cards;

    let pileTopCard = _.cloneDeep(pile[pile.length - 1]),
      newAvailable = [],
      newPossible = [];

    if (pileTopCard.type === "ace") {
      pileTopCard.weight = chosenWeight;
    }

    let chosenCard = this.state.selectedCards[0];

    // Adjust available cards according to chosen card
    playerCards.forEach((card, idx) => {
      // Get cards with the same type as chosen card (possibleCards)
      if (card.type === chosenCard.type) {
        return newPossible.push(playerCards[idx]);
      }

      if (
        this.sameType(card, pileTopCard) ||
        this.sameWeightNoConditions(
          card,
          pileTopCard,
          battleCardActive,
          jackActive,
          waitTurn
        ) ||
        this.jackWasUsed(card, jackActive) ||
        this.fourWasUsed(card, waitTurn)
      )
        return newAvailable.push(playerCards[idx]);
    });
    this.updatePlayerCards(newAvailable, newPossible);
  }

  sameType(card, pileTopCard) {
    return card.type === pileTopCard.type;
  }

  sameWeightNoConditions(
    card,
    pileTopCard,
    battleCardActive,
    jackActive,
    waitTurn
  ) {
    return (
      card.weight === pileTopCard.weight &&
      !battleCardActive &&
      !jackActive &&
      !waitTurn
    );
  }

  jackWasUsed(card, jackActive) {
    return card.type === "jack" && jackActive;
  }

  fourWasUsed(card, waitTurn) {
    return card.type === "4" && waitTurn;
  }

  updatePlayerCards(newAvailable, newPossible) {
    this.setState({
      ...this.state,
      availableCards: newAvailable,
      possibleCards: newPossible
    });
  }

  stylePlayerCards(playerCards, availableCards, possibleCards, selectedCards) {
    let cards = _.cloneDeep(playerCards);

    if (
      !cards.length ||
      (!availableCards.length && !selectedCards.length && !possibleCards.length)
    )
      return playerCards;

    const topCard = selectedCards.length
      ? selectedCards[selectedCards.length - 1]
      : null;

    const styleTopCard = cards => {
      if (!topCard) return;
      return cards.forEach(function(card, i) {
        if (topCard.type === card.type && topCard.weight === card.weight)
          card.class += " topCard";
      });
    };

    const styleCards = (styleType, styleCards, cards) => {
      return cards.forEach(card => {
        styleCards.forEach(styledCard => {
          if (
            styledCard.type === card.type &&
            styledCard.weight === card.weight
          ) {
            card.class = styleType;
          }
        });
      });
    };

    styleCards("possible", possibleCards, cards);
    styleCards("available", availableCards, cards);
    styleCards("selected", selectedCards, cards);
    styleTopCard(cards);

    return cards;
  }

  checkClass(card) {
    if (card.isSelected) {
      card.class += " selected";
    }
    return card.class ? card.class : "";
  }

  render() {
    const gameState = this.props.gameState,
      playerCards = gameState.player.cards,
      pileTopCard = gameState.pile[gameState.pile.length - 1],
      playerCanWait =
        (pileTopCard.type === "4" && gameState.waitTurn) ||
        gameState.player.wait
          ? true
          : false;
    return (
      <Aux>
        <div className={"flex-container cards-container"}>
          <div className={"row cards"}>
            {this.stylePlayerCards(
              playerCards,
              this.state.availableCards,
              this.state.possibleCards,
              this.state.selectedCards
            ).map((card, index) => (
              <Card
                key={index}
                clickOwnCard={this.clickOwnCard}
                card={card}
                index={index}
                cardClass={card.class + " cardsInHand"}
              />
            ))}
          </div>
          <WaitIcon waitTurn={this.props.gameState.player.wait} />
        </div>
        <ActionButtons
          confirmCards={this.confirmCards}
          hasSelected={this.state.selectedCards.length}
          waitTurn={this.waitTurns}
          playerCanWait={playerCanWait}
        />
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    gameState: state.gameState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    makePlayerMove: cards => dispatch(logicActions.makePlayerMove(cards)),
    playerWait: () => dispatch(logicActions.waitTurns("player")),
    endTurn: () => {
      dispatch(logicActions.updateGameFactor("playerTurn", false));
      dispatch(logicActions.makeCpuMove());
      dispatch(logicActions.checkMacaoAndWin());
    },
    playSound: soundName => dispatch(soundActions.playSound(soundName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);
