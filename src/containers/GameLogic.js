import React, { Component } from "react";
import { connect } from "react-redux";
import * as logicActions from "../actions/logicActions";
import ActionButtons from "../components/buttons/ActionButtons";
import ActionModals from "../components/modals/ActionModals";
import Aux from "../hoc/Auxilliary";
import CpuPlayer from "../components/CpuPlayer";
import Deck from "../components/Deck";
import Header from "../components/Header";
import Pile from "../components/Pile";
import Player from "../components/Player";
import BattleIcon from "../components/icons/BattleIcon";
import DemandIcon from "../components/icons/DemandIcon";
import SuitIcon from "../components/icons/SuitIcon";
import WaitIcon from "../components/icons/WaitIcon";
import Confetti from "react-dom-confetti";
var _ = require("lodash");

export class GameLogic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableCards: [],
      possibleCards: [],
      selectedCards: []
    };

    this.clickOwnCard = this.clickOwnCard.bind(this);
    this.confirmCards = this.confirmCards.bind(this);
    this.takeCards = this.takeCards.bind(this);
    this.waitTurns = this.waitTurns.bind(this);
    this.changeSuit = this.changeSuit.bind(this);
    this.demandCard = this.demandCard.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  componentWillMount() {
    setTimeout(() => {
      this.props.showModal("whoStarts");
    }, 1);
    setTimeout(() => {
      this.props.hideModal("whoStarts");
    }, 1000);

    if (this.props.gameState.playerTurn)
      setTimeout(() => {
        this.checkAvailableCards(this.props.gameState, this.state);
      }, 1200);
    else
      setTimeout(() => {
        this.props.endTurn();
      }, 1200);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     !_.isEqual(nextState, this.state) ||
  //     nextProps.gameState.nextTurn !== this.props.gameState.nextTurn ||
  //     !_.isEqual(nextProps.modals, this.props.modals)
  //   )
  //     return true;

  //   return false;
  // }

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

  clickOwnCard(card, index) {
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
  }

  confirmCards() {
    if (!this.state.selectedCards.length) return;
    const { makePlayerMove } = this.props;
    makePlayerMove(this.state.selectedCards);
    this.setState({
      ...this.state,
      selectedCards: []
    });
  }

  takeCards() {
    this.props.takeCards(this.props.gameState.cardsToTake);
    this.props.endTurn();
  }

  waitTurns() {
    this.props.playerWait();
    this.props.endTurn();
  }

  restartGame() {
    this.props.restartGame();
    this.props.hideModal("gameOver");
  }

  changeSuit(weight) {
    this.props.updateGameFactor("chosenWeight", weight);
    this.props.hideModal("ace");
    this.props.endTurn();
  }

  demandCard(type) {
    this.props.updateGameFactor("chosenType", type);
    if (type === "") this.props.updateGameFactor("jackActive", 0);
    this.props.hideModal("jack");
    this.props.endTurn();
  }

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

  render() {
    const gameState = this.props.gameState,
      pileTopCard = gameState.pile[gameState.pile.length - 1],
      playerCanWait =
        (pileTopCard.type === "4" && gameState.waitTurn) ||
        gameState.player.wait
          ? true
          : false,
      playerCanMove =
        (!gameState.player.wait ||
          (pileTopCard.type === "4" && !gameState.cpuPlayer.wait)) &&
        !playerCanWait,
      playerWon = !gameState.player.cards.length ? true : false;
    const config = {
      angle: 90,
      spread: 100,
      startVelocity: 50,
      elementCount: 100,
      decay: 0.9
    };

    return (
      <Aux>
        <ActionModals
          show={this.props.modals}
          changeSuit={this.changeSuit}
          demandCard={this.demandCard}
          playerTurn={gameState.playerTurn}
          playerWon={playerWon}
          cpuPlayerMacao={gameState.cpuPlayer.cards.length === 1}
          playerMacao={gameState.player.cards.length === 1}
          restartGame={this.restartGame}
        />
        <div className="confetti">
          <Confetti active={!this.props.gameState.player.cards.length} config={config} />
        </div>
        <Header />
        <CpuPlayer cpuPlayer={gameState.cpuPlayer} />
        <WaitIcon waitTurn={gameState.cpuPlayer.wait} />
        <div className="flex-container">
          <Deck takeCard={this.takeCards} playerCanMove={playerCanMove} />
          <Pile cardOnTop={pileTopCard} />
          <BattleIcon
            battleCards={gameState.cardsToTake}
            gameOver={gameState.gameOver}
          />
          <DemandIcon
            jackActive={gameState.jackActive && !this.props.modals.jack}
            chosenType={gameState.chosenType}
            gameOver={gameState.gameOver}
          />
          <SuitIcon
            show={
              gameState.pile[gameState.pile.length - 1].type === "ace" &&
              !this.props.modals.ace
            }
            chosenWeight={gameState.chosenWeight}
            gameOver={gameState.gameOver}
          />
          <WaitIcon
            waitTurn={gameState.waitTurn}
            gameOver={gameState.gameOver}
          />
        </div>
        <Player
          clickOwnCard={this.clickOwnCard}
          playerCards={gameState.player.cards}
          groupedCards={{
            availableCards: this.state.availableCards,
            possibleCards: this.state.possibleCards,
            selectedCards: this.state.selectedCards
          }}
        />
        <WaitIcon waitTurn={gameState.player.wait} />
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
    globalStats: state.stats.global,
    currentStats: state.stats.current,
    modals: state.modals,
    gameState: state.gameState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    makePlayerMove: cards => dispatch(logicActions.makePlayerMove(cards)),
    showModal: modal => dispatch({ type: "SHOW_MODAL", modal: modal }),
    hideModal: modal => dispatch({ type: "HIDE_MODAL", modal: modal }),
    playerWait: () => dispatch(logicActions.waitTurns("player")),
    takeCards: howMany => dispatch(logicActions.takeCards("player")),
    updateGameFactor: (factor, value) =>
      dispatch(logicActions.updateGameFactor(factor, value)),
    endTurn: () => {
      dispatch(logicActions.updateGameFactor("playerTurn", false));
      dispatch(logicActions.makeCpuMove());
      dispatch(logicActions.checkMacaoAndWin());
    },
    restartGame: () => dispatch({ type: logicActions.RESTART_GAME })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameLogic);
