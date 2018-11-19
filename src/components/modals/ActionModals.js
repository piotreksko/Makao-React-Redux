import React from "react";
import ReactModal from "react-modal";
import Aux from "../../hoc/Auxilliary";
import ChangeSuitModal from "./ChangeSuitModal";
import DemandCardModal from "./DemandCardModal";
import GameOverModal from "./GameOverModal";
import MacaoModal from "./MacaoModal";
import WhoStartsModal from "./WhoStartsModal";
import PropTypes from "prop-types";

const ActionModals = props => {
  return (
    <Aux>
      <ReactModal
        isOpen={props.show.ace}
        ariaHideApp={false}
        className="suit-popup flex-container"
        overlayClassName="overlay"
      >
        <ChangeSuitModal changeSuit={props.changeSuit} />
      </ReactModal>

      <ReactModal
        isOpen={props.show.jack}
        ariaHideApp={false}
        className="suit-popup flex-container"
        overlayClassName="overlay"
      >
        <DemandCardModal demandCard={props.demandCard} />
      </ReactModal>

      <ReactModal
        isOpen={props.show.gameOver}
        ariaHideApp={false}
        className="suit-popup flex-container"
        overlayClassName="overlay"
      >
        <GameOverModal
          show={props.show.gameOver}
          playerWon={props.playerWon}
          restartGame={props.restartGame}
        />
      </ReactModal>

      <MacaoModal
        show={props.show.macao && !props.show.gameOver}
        playerMacao={props.playerMacao}
        cpuPlayerMacao={props.cpuPlayerMacao}
      />

      <WhoStartsModal
        show={props.show.whoStarts}
        playerStarts={props.playerTurn}
      />
    </Aux>
  );
};

ActionModals.propTypes = {
  show: PropTypes.shape({
    ace: PropTypes.bool,
    jack: PropTypes.bool,
    macao: PropTypes.bool,
    gameOver: PropTypes.bool,
    whoStarts: PropTypes.bool
  }),
  changeSuit: PropTypes.func,
  demandCard: PropTypes.func
};

export default ActionModals;
