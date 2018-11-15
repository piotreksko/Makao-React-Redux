import React, { Component } from "react";
import Card from "./cards/Card";
import CardBack from "./cards/CardBack";
import PropTypes from 'prop-types';

class CpuPlayer extends Component {
  render() {
    return (
      <div className={"flex-container cards-container"}>
        <div className={"row cards"}>
          {this.props.cpuPlayer.cards.map((card, index) => (
            <CardBack key={index} />
          ))}
        </div>
      </div>
    );
  }
}

// class CpuPlayer extends Component {
//   render() {
//     return (
//       <div className={"flex-container cards-container"}>
//         <div className={"row cards"}>
//                     {this.props.cpuPlayer.cards.map((card, index) => (
//             <Card key={index} clickOwnCard={this.props.clickOwnCard} card={card} index={index} cardClass={'cardsInHand'} />
//           ))}
//         </div>
//       </div>
//     );
//   }
// }

CpuPlayer.propTypes = {
  cpuPlayer: PropTypes.shape({
    cards: PropTypes.array,
    wait: PropTypes.bool,
  }),
}

export default CpuPlayer;
