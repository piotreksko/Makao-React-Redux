import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Aux from "../hoc/Auxilliary";

import * as logicActions from "../actions/logicActions";
import * as soundActions from "../actions/soundsActions";
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
        this.checkAvailableCards(this.props.gameState, this.state);
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
      this.checkAvailableCards(this.props.gameState, this.state);
  }

  waitTurns = () => {
    this.props.playerWait();
    this.props.endTurn();
  };

  clickOwnCard = (card, index) => {
    debugger;
    // this.props.playSound.pickCard();
    let newSelected = _.cloneDeep(this.state.selectedCards);
    if (!card.class) return;

    let player = this.props.gameState.player;
    if (!newSelected.length) {
      newSelected.push(card);
      return this.setState({
        ...this.state,
        selectedCards: [...this.state.selectedCards, card]
      });
    }

    const removeFromSelected = () => {
      for (let i = 0; i < newSelected.length; i++) {
        //Find index of the card to remove from selected
        if (
          newSelected[i].type === player.cards[index].type &&
          newSelected[i].weight === player.cards[index].weight
        ) {
          newSelected.splice(i, 1);
          if (i === 0) {
            newSelected = [];
          }
        }
      }
    };

    if (card.isSelected) {
      removeFromSelected();
      return this.setState({
        ...this.state,
        selectedCards: newSelected
      });
    }

    switch (card.class) {
      case "possible":
        newSelected.push(card);
        break;
      case "available":
        newSelected = [];
        newSelected.push(player.cards[index]);
        break;
      default:
        return newSelected;
    }

    this.setState({
      ...this.state,
      selectedCards: newSelected
    });
  };

  confirmCards = () => {
    if (!this.state.selectedCards.length) return;
    const { makePlayerMove } = this.props;
    makePlayerMove(this.state.selectedCards);
    this.setState({
      ...this.state,
      selectedCards: []
    });
  };

  checkAvailableCards(gameState, groupedCards) {
    const {
      chosenWeight,
      chosenType,
      waitTurn,
      jackActive,
      battleCardActive
    } = gameState;

    const { cards } = gameState.player;
    const { selectedCards } = groupedCards;
    let pileTopCard = gameState.pile[gameState.pile.length - 1];
    const playerWait = gameState.player.wait;
    let newAvailable = [];
    let newPossible = [];
    if (playerWait) return;
    if (pileTopCard.type === "ace") {
      const lastCardAfterAce = {
        type: "ace",
        weight: chosenWeight
      };
      pileTopCard = Object.assign({}, lastCardAfterAce);
    }
    // No cards have been chosen
    if (!selectedCards.length) {
      cards.forEach((card, idx) => {
        // Battle card is active - the same cardtype available + 2, 3, kings of given weight
        if (battleCardActive) {
          // Card of same type is available
          if (
            card.type === pileTopCard.type ||
            // Cards of same weight + it's a 2 or 3
            (card.weight === pileTopCard.weight &&
              (card.type === "2" || card.type === "3")) ||
            // Available kings - spades and hearts
            (card.type === "king" &&
              card.weight === pileTopCard.weight &&
              (card.weight === "spades" || card.weight === "hearts")) ||
            // If last card was a king, make king of diamond and clubs available
            (card === pileTopCard.type &&
              (card.weight === "diamond" || card.weight === "clubs"))
          ) {
            newAvailable.push(cards[idx]);
          }
          return;
        }

        // Make 4 available if it was used
        if (waitTurn) {
          if (card.type === "4") newAvailable.push(cards[idx]);
          return;
        }

        // Jack demand is active
        if (jackActive) {
          if (
            card.type === chosenType ||
            (card.type === "jack" && pileTopCard.type === "jack")
          )
            newAvailable.push(cards[idx]);
          return;
        }

        // No special conditions
        if (card.type === pileTopCard.type) {
          newAvailable.push(cards[idx]);
        }
        if (
          card.weight === pileTopCard.weight &&
          card.type !== pileTopCard.type
        ) {
          newAvailable.push(cards[idx]);
        }
      });
      this.setState({
        ...this.state,
        availableCards: newAvailable,
        possibleCards: newPossible
      });
    } else if (selectedCards.length) {
      let chosenCard = selectedCards[0];

      // Adjust available cards according to chosen card
      cards.forEach((card, idx) => {
        // Get cards with the same type as chosen card - possible card addition
        if (card.type === chosenCard.type) {
          newPossible.push(cards[idx]);
          return;
        }

        // If type or weight is the same last card and jack is not active
        if (
          card.type === pileTopCard.type ||
          (card.weight === pileTopCard.weight &&
            card.type !== chosenCard.type &&
            !battleCardActive &&
            !jackActive)
        ) {
          // And is not in availableCards yet
          newAvailable.push(cards[idx]);
          return;
        }

        // Make jack available if it was used
        if (card.type === "jack" && jackActive && !waitTurn) {
          newAvailable.push(cards[idx]);
          return;
        }
        // Make 4 possible if it was used
        if (card.type === "4" && !jackActive && waitTurn) {
          newAvailable.push(cards[idx]);
          return;
        }
      });
      this.setState({
        ...this.state,
        availableCards: newAvailable,
        possibleCards: newPossible
      });
    }
  }

  stylePlayerCards(playerCards, availableCards, possibleCards, selectedCards) {
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
                cardClass={this.checkClass(card) + " cardsInHand"}
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
    playSound: {
      pickCard: () => {
        dispatch(soundActions.pickCard());
      }
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);
