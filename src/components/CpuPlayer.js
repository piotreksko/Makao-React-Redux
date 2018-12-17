import React, { Component } from "react";
import Card from "./cards/Card";
import CardBack from "./cards/CardBack";
import WaitIcon from "../components/icons/WaitIcon";
import PropTypes from "prop-types";

// class CpuPlayer extends Component {
//   render() {
//     return (
//       <div className={"flex-container cards-container"}>
//         <div className={"row cards"}>
//           {this.props.cpuPlayer.cards.map((card, index) => (
//             <CardBack key={index} />
//           ))}
//         </div>
//         <WaitIcon waitTurn={this.props.cpuPlayer.wait} playerInfo={true} />
//       </div>
//     );
//   }
// }

// For development to see CPU cards

class CpuPlayer extends Component {
  render() {
    return (
      <div className={"flex-container cards-container"}>
        <div className={"row cards"}>
          {this.props.cpuPlayer.cards.map((card, index) => (
            <Card
              key={index}
              clickOwnCard={this.props.clickOwnCard}
              card={card}
              index={index}
              cardClass={"cardsInHand"}
            />
          ))}
        </div>
        <WaitIcon waitTurn={this.props.cpuPlayer.wait} />
      </div>
    );
  }
}

CpuPlayer.propTypes = {
  cpuPlayer: PropTypes.shape({
    cards: PropTypes.array,
    wait: PropTypes.number
  })
};

export default CpuPlayer;
