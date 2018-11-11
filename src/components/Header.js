import React, { Component } from "react";
import RestartButton from "./buttons/RestartButton";
import RulesButton from "./buttons/RulesButton";
import RulesModal from "./modals/RulesModal";
import ReactModal from "react-modal";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openRules: false
    };
  }

  toggleRules = () => {
    console.log(this);
    this.setState({
      openRules: !this.state.openRules
    });
  };

  restartGame = () => {
    // To be done
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
          <span id="moves-count">0</span>
        </div>
        <div className="message">
          <label>Message:</label>
        </div>
        <div className="global-stats">
          <h6>Global statistics</h6>
          <div className="score" data-score={0}>
            <label>Macao call count:</label>
            <span id="macao-call-counter">0</span>
          </div>
          <div className="score" data-score={0}>
            <label>Total player score:</label>
            <span id="total-player-win-counter">0</span>
          </div>
          <div className="score" data-score={0}>
            <label>Total computer score:</label>
            <span id="total-cpu-win-counter">0</span>
          </div>
          <div className="total-moves-counter" data-moves={0}>
            <label>Total moves:</label>
            <span id="total-moves-counter">0</span>
          </div>
        </div>
        <div className="score" data-score={0}>
          <label>Computer score:</label>
          <span id="cpu-win-counter">0</span>
        </div>
        <div className="score" data-score={0}>
          <label>Your score:</label>
          <span id="player-win-counter">0</span>
        </div>
      </div>
    );
  }
}
