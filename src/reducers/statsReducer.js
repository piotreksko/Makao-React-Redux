import {
  FETCH_STATS
} from "../actions/statActions";

const initialState = {
  current: {
    movesCount: -1,
    playerWinCounter: 0,
    cpuWinCounter: 0
  },
  global: {
    totalPlayerWinCount: 0,
    totalComputerWinCount: 0,
    totalMovesCount: 0,
    macaoCallCount: 0
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATS:
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
}
