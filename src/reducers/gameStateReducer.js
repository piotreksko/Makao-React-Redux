// import * as actionTypes from "./actions";
import {
  UPDATE_PLAYER_CARDS,
  UPDATE_CPU_CARDS,
  UPDATE_GAME_FACTOR,
  ADD_TO_PILE,
  TAKE_FROM_DECK,
  CHANGE_SUIT,
  DEMAND_CARD,
  SHUFFLE_DECK,
  WAIT_TURNS,
  RESTART_GAME
} from "../actions/logicActions";
import { cardTypes, cardWeights } from "../constants/constants";
import { sortCards } from "../utility/utility";
import _ from "lodash";

const initialState = () => {
  let initGame = {
    player: {
      cards: [],
      wait: 0
    },
    cpuPlayer: {
      cards: [],
      wait: 0
    },
    pile: [],
    deck: [],
    chosenWeight: "",
    chosenType: "",
    nextTurn: 0,
    jackActive: 0,
    cardsToTake: 1,
    waitTurn: 0,
    battleCardActive: false,
    winner: 0,
    gameOver: false
  };

  function card(type, weight) {
    this.type = type;
    this.weight = weight;
  }

  (function createDeck() {
    cardWeights.forEach(weight => {
      cardTypes.forEach(type => {
        initGame.deck.push(new card(type, weight));
      });
    });
  })();

  initGame.playerTurn = Math.round(Math.random() * 1);
  initGame.deck = _.shuffle(initGame.deck);

  // Deal cards
  (function assignCards() {
    initGame.player.cards = sortCards(initGame.deck.splice(0, 5));
    initGame.cpuPlayer.cards = sortCards(initGame.deck.splice(0, 5));

    // Always start game with a neutral card
    for (let i = 0; i < initGame.deck.length; i++) {
      switch (initGame.deck[i].type) {
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "10":
        case "queen":
          initGame.pile = initGame.deck.splice(i, 1);
          return;
        default:
          break;
      }
    }
  })();
  return initGame;
};

export default function(state = initialState(), action) {
  switch (action.type) {
    case UPDATE_PLAYER_CARDS:
      return {
        ...state,
        player: {
          ...state.player,
          cards: [...action.cards]
        }
      };
    case TAKE_FROM_DECK:
      return {
        ...state,
        deck: [...state.deck.slice(0, -action.howMany)]
      };
    case ADD_TO_PILE:
      return {
        ...state,
        pile: [...state.pile, ...action.cards]
      };
    case CHANGE_SUIT:
      return {
        ...state,
        chosenWeight: action.chosenWeight
      };
    case DEMAND_CARD:
      return {
        ...state,
        chosenType: action.chosenType
      };
    case SHUFFLE_DECK:
      return {
        ...state,
        deck: [...state.deck, ...action.cards],
        pile: [...state.pile.slice(-1)]
      };
    case UPDATE_CPU_CARDS:
      return {
        ...state,
        cpuPlayer: {
          ...state.cpuPlayer,
          cards: action.cards
        }
      };
    case WAIT_TURNS:
      return {
        ...state,
        [action.who]: {
          ...state[action.who],
          wait: action.waitTurns
        }
      };
    case UPDATE_GAME_FACTOR:
      return {
        ...state,
        [action.factor]: action.value
      };
    case RESTART_GAME:
      return initialState();
    default:
      return state;
  }
}
