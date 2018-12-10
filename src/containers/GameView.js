import React, { Component } from "react";
import { connect } from "react-redux";
import * as logicActions from "../actions/logicActions";
import * as soundActions from "../actions/soundActions";
import Aux from "../hoc/Auxilliary";
import Modals from "./Modals";
import Header from "./Header";
import Player from "./Player";
import Icons from "./Icons";
import Deck from "../components/Deck";
import Pile from "../components/Pile";
import Confetti from "react-dom-confetti";
import CpuPlayer from "../components/CpuPlayer";

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
    this.props.playSound("take_card");
    this.props.endTurn();
  }

  restartGame() {
    this.props.restartGame();
    this.props.hideModal("gameOver");
  }

  render() {
    const gameState = this.props.gameState,
    playerCanMove = !gameState.player.wait && !gameState.waitTurn ? true : false,
    { pile } = gameState;

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
        <div className="flex-container middle">
          <Deck takeCard={this.takeCards} playerCanMove={playerCanMove} />
          <Pile cards={pile} />
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
    restartGame: () => dispatch({ type: logicActions.RESTART_GAME }),
    playSound: soundName => dispatch(soundActions.playSound(soundName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameView);
