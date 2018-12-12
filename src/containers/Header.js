import React, { Component } from "react";
import { connect } from "react-redux";
import * as logicActions from "../actions/logicActions";
import * as soundActions from "../actions/soundActions";
import * as statsActions from "../actions/statsActions";
import RulesModal from "../components/modals/RulesModal";
import RulesButton from "../components/buttons/RulesButton";
import RestartButton from "../components/buttons/RestartButton";
import ReactModal from "react-modal";

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openRules: false
    };
  }

  componentDidMount () {
    this.props.playSound('click');
    this.props.fetchStats();
  }

  toggleRules = () => {
    this.props.playSound('click');
    this.setState({
      openRules: !this.state.openRules
    });
  };

  restartGame = () => {
    this.props.playSound('click');
    this.props.restartGame();
  };

  render() {
    return (
      <div id="score">
        <ReactModal
          isOpen={this.state.openRules}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          ariaHideApp={false}
          id="rules"
          className="center rules"
          overlayClassName="overlay"
        >
          <RulesModal close={this.toggleRules} />
        </ReactModal>
        <RestartButton onClick={this.restartGame} />
        <RulesButton onClick={this.toggleRules} />
        <div className="moves-count" data-moves={0}>
          <label>Moves:</label>
          <span id="moves-count"> {this.props.currentStats.movesCount}</span>
        </div>
        <div className="message">
          <label>Message:</label>
        </div>
        <div className="global-stats">
          <h6>Global statistics</h6>
          <div className="score">
            <label>Macao call count:</label>
            <span id="macao-call-counter"> {this.props.globalStats.macaoCallCount}</span>
          </div>
          <div className="score">
            <label>Total player score:</label>
            <span id="total-player-win-counter"> {this.props.globalStats.playerWinCount}</span>
          </div>
          <div className="score">
            <label>Total computer score:</label>
            <span id="total-cpu-win-counter"> {this.props.globalStats.computerWinCount}</span>
          </div>
          <div className="total-moves-counter" data-moves={0}>
            <label>Total moves:</label>
            <span id="total-moves-counter"> {this.props.globalStats.totalMovesCount}</span>
          </div>
        </div>
        <div className="score">
          <label>Computer score:</label>
          <span id="cpu-win-counter"> {this.props.currentStats.computerWinCount}</span>
        </div>
        <div className="score">
          <label>Your score:</label>
          <span id="player-win-counter"> {this.props.currentStats.playerWinCount}</span>
        </div>
      </div>
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
    fetchStats: () => dispatch(statsActions.fetchStats()),
    restartGame: () => dispatch({ type: logicActions.RESTART_GAME }),
    playSound: soundName => dispatch(soundActions.playSound(soundName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
