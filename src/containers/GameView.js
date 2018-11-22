import React, { Component } from "react";
import { connect } from "react-redux";
import * as logicActions from "../actions/logicActions";
import Modals from "./Modals";
import Aux from "../hoc/Auxilliary";
import CpuPlayer from "../components/CpuPlayer";
import Deck from "../components/Deck";
import Header from "../components/Header";
import Pile from "../components/Pile";
import Player from "./Player";
import Icons from './Icons';
import Confetti from "react-dom-confetti";

export class GameView extends Component {
  constructor(props) {
    super(props);

    this.takeCards = this.takeCards.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  componentWillMount() {
    setTimeout(() => {
      this.props.showModal("whoStarts");
    }, 1);
    setTimeout(() => {
      this.props.hideModal("whoStarts");
    }, 1000);
  }

  takeCards() {
    this.props.takeCards(this.props.gameState.cardsToTake);
    this.props.endTurn();
  }

  restartGame() {
    this.props.restartGame();
    this.props.hideModal("gameOver");
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
        !playerCanWait;

    const confettiConfig = {
      angle: 90,
      spread: 100,
      startVelocity: 50,
      elementCount: 100,
      decay: 0.9
    };

    return (
      <Aux>
        <Modals restartGame={this.restartGame} />
        <div className="confetti">
          <Confetti
            active={!this.props.gameState.player.cards.length}
            config={confettiConfig}
          />
        </div>
        <Header />
        <CpuPlayer cpuPlayer={gameState.cpuPlayer} />
        <div className="flex-container">
          <Deck takeCard={this.takeCards} playerCanMove={playerCanMove} />
          <Pile cardOnTop={pileTopCard} />
          <Icons />
        </div>
        <Player />
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
    showModal: modal => dispatch({ type: "SHOW_MODAL", modal: modal }),
    hideModal: modal => dispatch({ type: "HIDE_MODAL", modal: modal }),
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
)(GameView);
