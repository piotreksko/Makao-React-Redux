import {
  FETCH_STATS
} from "../actions/statsActions";

const initialState = {
  current: {
    movesCount: 0,
    playerWinCount: 0,
    computerWinCount: 0
  },
  global: {
    playerWinCount: 0,
    computerWinCount: 0,
    totalMovesCount: 0,
    macaoCallCount: 0
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATS:
      return { ...state,
        global: action.payload
      }
    default:
      return state;
  }
}
