import React, { Component } from 'react';

const ref = firebase.database().ref("/winCounter");

class GameStats extends Component {

// TODO

//     componentDidMount() {
//         ref.on("value", snapshot => {
//             this.props.updateTotalComputerWinCount = snapshot.val().computerWinCount;
//             this.props.updateTotalPlayerWinCount = snapshot.val().playerWinCount;
      
//             // Only overwrite at the game start - dont overwrite from realtime database updates
//             if (this.props.global.totalMovesCount == 0) {
//               this.props.global.totalMovesCount = snapshot.val().totalMovesCount;
//             }
//             if (this.props.global.macaoCallCount == 0) {
//               this.props.global.macaoCallCount = snapshot.val().macaoCallCount;
//             }
//             this.props.setTotalCounters();
//           });
//     }

//     render(){
//         <div>
//   <div className="global-stats">
//     <h6>Global statistics</h6>
//     <div className="score" data-score={0}>
//       <label>Macao call count:</label>
//       <span id="macao-call-counter">{this.props.global.macaoCallCount}</span>
//     </div>
//     <div className="score" data-score={0}>
//       <label>Total player score:</label>
//       <span id="total-player-win-counter">{this.props.global.playerWinCount}</span>
//     </div>
//     <div className="score" data-score={0}>
//       <label>Total computer score:</label>
//       <span id="total-cpu-win-counter">{this.props.global.computerWinCount}</span>
//     </div>
//     <div className="total-moves-counter" data-moves={0}>
//       <label>Total moves:</label>
//       <span id="total-moves-counter">{this.props.global.movesCount}</span>
//     </div>
//   </div>
//   <div className="score" data-score={0}>
//     <label>Computer score:</label>
//     <span id="cpu-win-counter">{this.props.current.computerWinCount}</span>
//   </div>
//   <div className="score" data-score={0}>
//     <label>Your score:</label>
//     <span id="player-win-counter">{this.props.current.playerWinCount}</span>
//   </div>
// </div>
// }
}

const mapStateToProps = state => {
    return {
        global: state.globalStats,
        current: state.currentStats
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setTotalCounters: (stats) => dispatch({type: actionTypes.SET_GLOBAL_COUNTERS, stats: stats})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( GameStats );
