import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import gameState from "./reducers/gameStateReducer";
import stats from './reducers/statsReducer';
import modals from './reducers/modalsReducer';
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  gameState,
  stats,
  modals
});
const middleware = [thunk];

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

const store = createStore(rootReducer, compose(applyMiddleware(...middleware, logger), window.devToolsExtension ? window.devToolsExtension() : f => f));

export default store;
