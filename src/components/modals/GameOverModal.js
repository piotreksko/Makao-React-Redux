import React from "react";
import restartButton from '../../content/images/restart_button.png'

export default function GameOverModal(props) {
  return (
    <div className={`center ${props.show ? "modal-shown" : "modal-hidden"}`}>
      <h2 style={{ color: props.playerWon ? "green" : "red" }}>
        {props.playerWon ? "Victory" : "Defeat"}
      </h2>
      <h4 style={{ color: "white" }}>
        {props.playerWon ? "You have won" : "Computer has won"}
      </h4>
      <button onClick={() => props.restartGame()} className="suit-icon">
        <img
          alt="restartButton"
          className="icon-image"
          src={restartButton}
        />
      </button>
      <h5 style={{ color: "white" }}>Play again</h5>
    </div>
  );
}
