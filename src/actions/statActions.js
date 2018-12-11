// import { todosRef } from "../config/firebase";

// export const FETCH_STATS = "FETCH_STATS";
// // var _ = require("lodash");
// // const ref = firebase.database().ref("/winCounter");


// export const fetchToDos = uid => async dispatch => {
//   todosRef.child(uid).on("value", snapshot => {
//     dispatch({
//       type: FETCH_STATS,
//       payload: snapshot.val()
//     });
//   });
// };
//                 // export const fetchGlobalStats = () => dispatch => {
//   //   ref.on("value", snapshot => {
//   //     const stats = {
//   //       totalComputerWinCount: "",
//   //       totalPlayerWinCount: "",
//   //       totalMovesCount: "",
//   //       macaoCallCount: ""
//   //     };
//   //     this.totalComputerWinCount = snapshot.val().computerWinCount;
//   //     this.totalPlayerWinCount = snapshot.val().playerWinCount;
//   //     //Only overwrite at the game start - dont overwrite from realtime database updates
//   //     if (this.totalMovesCount === 0) {
//   //       this.totalMovesCount = snapshot.val().totalMovesCount;
//   //     }
//   //     if (this.macaoCallCount === 0) {
//   //       this.macaoCallCount = snapshot.val().macaoCallCount;
//   //     }
//   //     dispatch({
//   //       type: FETCH_STATS,
//   //       payload: stats
//   //     });
//   //     this.setTotalCounters();
//   //   });
// // };
