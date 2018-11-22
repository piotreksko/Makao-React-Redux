import React from "react";
import { connect } from "react-redux";
import Aux from "../hoc/Auxilliary";
import BattleIcon from "../components/icons/BattleIcon";
import DemandIcon from "../components/icons/DemandIcon";
import SuitIcon from "../components/icons/SuitIcon";
import WaitIcon from "../components/icons/WaitIcon";

const Icons = props => {
  const gameState = props.gameState,
    modals = props.modals;

  return (
    <Aux>
      <BattleIcon
        battleCards={gameState.cardsToTake}
        gameOver={gameState.gameOver}
      />
      <DemandIcon
        jackActive={gameState.jackActive && !modals.jack}
        chosenType={gameState.chosenType}
        gameOver={gameState.gameOver}
      />
      <SuitIcon
        show={
          gameState.pile[gameState.pile.length - 1].type === "ace" &&
          !modals.ace
        }
        chosenWeight={gameState.chosenWeight}
        gameOver={gameState.gameOver}
      />
      <WaitIcon
        waitTurn={gameState.waitTurn}
        gameOver={gameState.gameOver}
        playerIcon={true}
      />
    </Aux>
  );
};

const mapStateToProps = state => {
  return {
    gameState: state.gameState,
    modals: state.modals
  };
};

export default connect(mapStateToProps)(Icons);
