import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import gameState from "./reducers/gameStateReducer";
import modals from './reducers/modalsReducer';
import stats from './reducers/statsReducer';
import thunk from "redux-thunk";
import soundsMiddleware from 'redux-sounds';
// import { soundsData } from './constants/soundsData';

const rootReducer = combineReducers({
  gameState,
  modals,
  stats
});

const soundsData = {
  ace: './sounds/ace.mp3',
  battle: '../sounds/battle.mp3',
  card_pick1: './sounds/card_pick1.mp3',
  card_pick2: '../sounds/card_pick2.mp3',
  card_pick3: '../sounds/card_pick3.mp3',
  click: '../sounds/click.mp3',
  defeat: '../sounds/defeat.mp3',
  jack: '../sounds/jack.mp3',
  pick_card: './sounds/pick_card.mp3',
  shuffle: '../sounds/shuffle.mp3',
  throw_cards: '../sounds/throw_cards.mp3',
  turn_card: '../sounds/turn_card.mp3',
  victory: '../sounds/victory.mp3',
  wait: '../sounds/wait.mp3'
}

const middleware = [thunk];

const loadedSoundsMiddleware = soundsMiddleware(soundsData);

const logger = store => {
  return next => {
    return action => {
      console.log("MiddleWare dispatching", action);
      const result = next(action);
      console.log("[MiddleWare] next state", store.getState());
      return result;
    };
  };
};

const store = createStore(rootReducer, compose(applyMiddleware(...middleware, logger, loadedSoundsMiddleware), window.devToolsExtension ? window.devToolsExtension() : f => f));

export default store;
