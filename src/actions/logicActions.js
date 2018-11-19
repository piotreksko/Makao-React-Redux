// import firebase from "firebase";
import { sortCards } from "../utility/utility";
export const UPDATE_PLAYER_CARDS = "UPDATE_PLAYER_CARDS";
export const TAKE_FROM_DECK = "TAKE_FROM_DECK";
export const ADD_TO_PILE = "ADD_TO_PILE";
export const UPDATE_GAME_FACTOR = "UPDATE_GAME_FACTOR";
export const UPDATE_CPU_CARDS = "UPDATE_CPU_CARDS";
export const WAIT_TURNS = "WAIT_TURNS";
export const FETCH_STATS = "FETCH_STATS";
export const CHANGE_SUIT = "CHANGE_SUIT";
export const DEMAND_CARD = "DEMAND_CARD";
export const SHUFFLE_DECK = "SHUFFLE_DECK";
export const RESTART_GAME = "RESTART_GAME";
var _ = require("lodash");
// const ref = firebase.database().ref("/winCounter");

export const fetchGlobalStats = () => dispatch => {
  //   ref.on("value", snapshot => {
  //     const stats = {
  //       totalComputerWinCount: "",
  //       totalPlayerWinCount: "",
  //       totalMovesCount: "",
  //       macaoCallCount: ""
  //     };
  //     this.totalComputerWinCount = snapshot.val().computerWinCount;
  //     this.totalPlayerWinCount = snapshot.val().playerWinCount;
  //     //Only overwrite at the game start - dont overwrite from realtime database updates
  //     if (this.totalMovesCount === 0) {
  //       this.totalMovesCount = snapshot.val().totalMovesCount;
  //     }
  //     if (this.macaoCallCount === 0) {
  //       this.macaoCallCount = snapshot.val().macaoCallCount;
  //     }
  //     dispatch({
  //       type: FETCH_STATS,
  //       payload: stats
  //     });
  //     this.setTotalCounters();
  //   });
};

export function makePlayerMove(cards) {
  return function(dispatch, getState) {
    const { gameState } = getState();
    const { player } = gameState;
    let { cardsToTake, waitTurn, jackActive, battleCardActive } = gameState;
    let gameFactors = { cardsToTake, waitTurn, jackActive, battleCardActive };

    let newPlayerCards = _.cloneDeep(player.cards);
    let aceActive, changeDemand;

    const nobodyIsWaiting = () => {
      return !player.wait && !gameState.cpuPlayer.wait;
    };

    // Clear cards from class key
    cards = cards.map(card => {
      return (card = _.omit(card, "class"));
    });

    // Battle cards - add cards to take accordingly
    cards.forEach(card => {
      switch (card.type) {
        case "2":
          if (nobodyIsWaiting()) gameFactors.cardsToTake += 2;
          break;
        case "3":
          if (nobodyIsWaiting()) gameFactors.cardsToTake += 3;
          break;
        case "4":
          if (!gameState.cpuPlayer.wait) {
            gameFactors.waitTurn += 1;
          }
          break;
        case "jack":
          gameFactors.jackActive = 2;
          changeDemand = 1;
          break;
        case "ace":
          aceActive = 1;
          break;
        case "king":
          if (
            card.weight === "hearts" ||
            (card.weight === "spades" && nobodyIsWaiting())
          ) {
            gameFactors.cardsToTake += 5;
            break;
          }

          //Kings of clubs and diamonds nullify amount of cards to be taken
          else {
            gameFactors.cardsToTake = 1;
            break;
          }
        default:
          break;
      }

      //Remove cards from playerCards
      let cardIndexInPlayerCards = newPlayerCards.findIndex(
        c => card.type === c.type && card.weight === c.weight
      );
      newPlayerCards.splice(cardIndexInPlayerCards, 1);
    });

    if (gameFactors.cardsToTake > 1) gameFactors.battleCardActive = true;
    else gameFactors.battleCardActive = false;

    _.forOwn(gameFactors, function(value, key) {
      if (value !== gameState[key] && value)
        dispatch(updateGameFactor(key, value));
    });
    dispatch(addToPile(cards));
    dispatch(updatePlayerCards(newPlayerCards));

    //Open a dialog box if ace or jack was used
    if (aceActive) {
      dispatch({ type: "SHOW_MODAL", modal: "ace" });
      return;
    }
    if (gameFactors.jackActive && changeDemand && newPlayerCards.length) {
      dispatch({ type: "SHOW_MODAL", modal: "jack" });
      return;
    }

    // gameState.nextTurn = 1;

    //Decrease jack counter
    if (gameState.jackActive) {
      jackActive -= 1;
      return;
    }

    if (!gameState.aceActive && !gameState.jackActive && newPlayerCards.length) {
      dispatch(makeCpuMove());
      dispatch(checkMacaoAndWin());
    }
    // If jack is active, but player did not use it this turn
  };
}

export function waitTurns(who) {
  return function(dispatch, getState) {
    const gameState = getState().gameState;
    if (gameState.waitTurn) {
      dispatch(updateGameFactor("waitTurn", 0));
      dispatch({ type: "WAIT_TURNS", waitTurns: gameState.waitTurn - 1 });
    } else dispatch({ type: "WAIT_TURNS", waitTurns: gameState[who].wait - 1 });
  };
}

export function addToPile(cards) {
  return dispatch => {
    dispatch({
      type: "ADD_TO_PILE",
      cards: cards
    });
  };
}

export function takeCards(who) {
  return function(dispatch, getState) {
    debugger;
    const gameState = getState().gameState;
    let howMany = gameState.cardsToTake - 1;
    if (!howMany) howMany = 1;

    let deck = gameState.deck;
    if (deck.length < howMany) {
      dispatch(shuffleDeck);
      deck = getState().gameState.deck;
    }
    const cardsToTake = deck.slice(deck.length - howMany, deck.length);
    dispatch({
      type: "TAKE_FROM_DECK",
      howMany
    });
    let cardsToUpdate = sortCards([
      ...cardsToTake,
      ..._.cloneDeep(gameState[who].cards)
    ]);

    if (who === "player") dispatch(updatePlayerCards(cardsToUpdate));
    else dispatch(updateCpuCards(cardsToUpdate));

    if (gameState.battleCardActive)
      dispatch(updateGameFactor("battleCardActive", false));

    if (gameState.cardsToTake > 1) dispatch(updateGameFactor("cardsToTake", 1));
    // dispatch(updateGameFactor("nextTurn", !getState().gameState.nextTurn));
  };
}

export function updatePlayerCards(cards) {
  return function(dispatch, getState) {
    // dispatch(updateGameFactor("nextTurn", 1));
    dispatch({ type: UPDATE_PLAYER_CARDS, cards });
  };
}

export function updateGameFactor(factor, value) {
  return dispatch => {
    dispatch({
      type: "UPDATE_GAME_FACTOR",
      factor,
      value
    });
  };
}

export function updateCpuCards(cards) {
  return function(dispatch, getState) {
    debugger;
    cards = cards.map(card => {
      card = _.omit(card, "sameTypeAmount");
      card = _.omit(card, "sameWeightAmount");
      return card;
    });
    dispatch({ type: "UPDATE_CPU_CARDS", cards });
    // dispatch(updateGameFactor("nextTurn", 0));
  };
}

export function shuffleDeck() {
  return function(dispatch, getState) {
    const { pile } = getState().gameState;
    let cardsForShuffle = _.cloneDeep(pile);
    cardsForShuffle.pop();
    let shuffledCards = _.shuffle(cardsForShuffle);
    dispatch({
      type: "SHUFFLED_CARDS",
      cards: shuffledCards
    });
  };
}

export function addToDeck(cards) {
  return dispatch => {
    dispatch({
      type: "ADD_TO_DECK",
      cards
    });
  };
}

export function newGame() {
  return dispatch => {
    dispatch({
      type: "NEW_GAME"
    });
  };
}

export function checkMacaoAndWin() {
  return function(dispatch, getState) {
    const gameState = getState().gameState;
    if (
      gameState.player.cards.length === 1 ||
      gameState.cpuPlayer.cards.length === 1
    ) {
      dispatch({ type: "SHOW_MODAL", modal: "macao" });
      setTimeout(() => {
        dispatch({ type: "HIDE_MODAL", modal: "macao" });
      }, 1000);
    }

    if (
      gameState.player.cards.length === 0 ||
      gameState.cpuPlayer.cards.length === 0
    )
      dispatch({ type: "SHOW_MODAL", modal: "gameOver" });
  };
}

export function makeCpuMove() {
  return function(dispatch, getState) {
    const { gameState } = getState(),
      {
        jackActive,
        battleCardActive,
        waitTurn,
        cardsToTake,
        chosenWeight,
        chosenType,
        deck,
        pile
      } = gameState,
      playerWait = gameState.player.wait,
      playerCards = gameState.player.cards;

    let { cpuWait } = gameState.cpuPlayer,
      gameFactors = {
        cardsToTake,
        waitTurn,
        jackActive,
        battleCardActive,
        chosenType,
        chosenWeight
      },
      pileTopCard = gameState.pile[gameState.pile.length - 1],
      newCpuCards = _.cloneDeep(gameState.cpuPlayer.cards),
      availableCards = [],
      cardsToUse = [];

    if (getState().modals.gameOver) return;

    const nobodyIsWaiting = () => !playerWait && !cpuWait;

    pileTopCard.type === "ace"
      ? (availableCards = newCpuCards.filter(
          card =>
            card.weight === gameFactors.chosenWeight ||
            card.type === pileTopCard.type
        ))
      : (availableCards = newCpuCards.filter(
          card =>
            card.weight === pileTopCard.weight || card.type === pileTopCard.type
        ));

    if (jackActive) {
      availableCards = newCpuCards.filter(
        card => "jack" === card.type || card.type === gameFactors.chosenType
      );
    }
    //IF CPU does have available cards

    debugger;

    if (availableCards.length) {
      //console.log("cpu had available cards");

      //Map all cards to get information about cards of same type & weight
      let cpuPossibleMoves = availableCards.map(card => {
        return {
          type: card.type,
          weight: card.weight,
          sameTypeAmount: (() => {
            let amount = 0;
            newCpuCards.forEach(c => {
              if (c.type === card.type) {
                amount += 1;
              }
            });
            return amount - 1;
          })(),
          sameWeightAmount: (() => {
            let moves = 0;
            newCpuCards.forEach(c => {
              if (c.weight === card.weight) {
                moves += 1;
              }
            });
            return moves - 1;
          })()
        };
      });

      let neutralCards = getNeutralCards(cpuPossibleMoves);
      let allNeutralCards = getNeutralCards(newCpuCards);

      function getNeutralCards(array) {
        return array.filter(
          card =>
            card.type === "5" ||
            card.type === "6" ||
            card.type === "7" ||
            card.type === "8" ||
            card.type === "9" ||
            card.type === "10" ||
            card.type === "queen" ||
            (card.type === "king" && card.weight === "diamonds") ||
            (card.type === "king" && card.weight === "clubs")
        );
      }
      let battleCards = cpuPossibleMoves.filter(
        card =>
          card.type === "2" ||
          card.type === "3" ||
          (card.type === "king" && card.weight === "hearts") ||
          (card.type === "king" && card.weight === "spades")
      );
      let fours = cpuPossibleMoves.filter(card => card.type === "4");
      let jacks = cpuPossibleMoves.filter(card => card.type === "jack");
      let aces = cpuPossibleMoves.filter(card => card.type === "ace");
      let kings = cpuPossibleMoves.filter(
        card =>
          (card.type === "king" && card.weight === "diamonds") ||
          (card.type === "king" && card.weight === "clubs")
      );

      //Use jack if one neutral card is available
      if (
        jacks.length &&
        !battleCardActive &&
        !cpuWait &&
        neutralCards.length === 1
      ) {
        cardsToUse = jacks;
      }

      let cardsDifference;
      newCpuCards.length - playerCards.length > 0
        ? (cardsDifference = newCpuCards.length - playerCards.length)
        : (cardsDifference = 0);
      if (newCpuCards.length === playerCards.length) {
        cardsDifference = 1;
      }

      function neutralValue() {
        if (
          neutralCards.length === 0 ||
          battleCardActive ||
          waitTurn ||
          cpuWait
        ) {
          return 0;
        } else {
          let weight = 15;
          let value = neutralCards.length * weight;
          return value;
        }
      }
      function battleValue() {
        if (battleCards.length === 0 || waitTurn || cpuWait || jackActive) {
          return 0;
        } else {
          let weight = 6;
          let value =
            battleCards.length * weight +
            (Math.pow(cardsDifference, 2) / 10) * weight;
          return value;
        }
      }
      function foursValue() {
        if (fours.length === 0 || battleCardActive || jackActive || cpuWait) {
          return 0;
        } else {
          let weight;
          let foursOnPile = pile.filter(x => x.type === "4").length;

          (function checkWeight() {
            if (4 - foursOnPile - fours.length === 0) {
              weight = 500;
            } else if (4 - foursOnPile - fours.length === 1) {
              weight = 20;
            } else if (4 - foursOnPile - fours.length === 2) {
              weight = 5;
            } else {
              weight = 2;
            }
          })();

          let value = (weight * deck.length) / playerCards.length;
          return value;
        }
      }
      function jacksValue() {
        if (jacks.length === 0 || battleCardActive || waitTurn || cpuWait) {
          return 0;
        } else {
          let jacksWeight = 24;
          let jackNeutralRatio = 1;
          if (neutralCards.length) {
            jackNeutralRatio = jacksWeight / neutralCards.length;
          }
          let value =
            jacks.length * jackNeutralRatio +
            (cardsDifference / jacksWeight) * 3 +
            (jacksWeight / playerCards.length) * 2;
          return value;
        }
      }
      function acesValue() {
        if (
          aces.length === 0 ||
          battleCardActive ||
          waitTurn ||
          cpuWait ||
          jackActive
        ) {
          return 0;
        } else {
          let weight = 3;
          let value =
            aces.length * weight +
            (newCpuCards.length / availableCards.length) * weight;
          return value;
        }
      }
      function kingsValue() {
        if (
          kings.length &&
          ((pileTopCard.type === "king" && pileTopCard.weight === "hearts") ||
            (pileTopCard.type === "king" && pileTopCard.weight === "spades"))
        ) {
          return 15;
        } else {
          return 0;
        }
      }

      let min = 0;
      let max =
        neutralValue() +
        battleValue() +
        foursValue() +
        jacksValue() +
        acesValue() +
        kingsValue();
      let previousUpperRange = 0;

      let neutralRange = calculateRange(neutralValue());
      let battleRange = calculateRange(battleValue());
      let foursRange = calculateRange(foursValue());
      let jacksRange = calculateRange(jacksValue());
      let acesRange = calculateRange(acesValue());
      let kingsRange = calculateRange(kingsValue());

      function calculateRange(rangeWidth) {
        previousUpperRange = previousUpperRange + rangeWidth;
        if (rangeWidth) {
          previousUpperRange += rangeWidth;
          return previousUpperRange;
        } else {
          return 0;
        }
      }

      let rand = function(min, max) {
        return Math.random() * (max - min) + min;
      };

      let randomNumber = rand(min, max);
      let weightPicked;
      if (randomNumber < neutralRange) {
        cardsToUse = neutralCards;
        weightPicked = 1;
      } else if (randomNumber < battleRange) {
        cardsToUse = battleCards;
        weightPicked = 2;
      } else if (randomNumber < foursRange) {
        cardsToUse = fours;
        weightPicked = 3;
      } else if (randomNumber < jacksRange) {
        cardsToUse = jacks;
        weightPicked = 4;
      } else if (randomNumber < acesRange) {
        cardsToUse = aces;
        weightPicked = 5;
      } else if (randomNumber < kingsRange) {
        cardsToUse = kings;
        weightPicked = 6;
      }

      if (jacks.length && neutralCards.length === 1) {
        cardsToUse = jacks;
        weightPicked = 4;
      }

      if (gameState.jackActive && weightPicked !== 4) {
        gameFactors.jackActive = false;
      }

      if (randomNumber === 0) {
        return noCardsToUse();
      } else {
        let mostMoves = cardsToUse.reduce((prev, curr) =>
          prev.possibleCardsAfter < curr.possibleCardsAfter ? prev : curr
        );

        let cpuSelectedCards = [];

        if (!mostMoves.sameTypeAmount) {
          availableCards = [];
          cpuSelectedCards.push(mostMoves);
        } else {
          cpuSelectedCards = newCpuCards.filter(c => c.type === mostMoves.type);

          //While the first selected card does not match the card on pile - move it to the end of array
          if (
            pileTopCard.type !== cpuSelectedCards[0].type &&
            pileTopCard.type !== "ace" &&
            !jackActive
          ) {
            while (cpuSelectedCards[0].weight !== pileTopCard.weight) {
              const firstCard = cpuSelectedCards.shift();
              cpuSelectedCards.push(firstCard);
            }
          }
          if (
            gameFactors.chosenType !== cpuSelectedCards[0].type &&
            pileTopCard.type === "ace" &&
            !jackActive
          ) {
            while (cpuSelectedCards[0].weight !== gameFactors.chosenWeight) {
              const firstCard = cpuSelectedCards.shift();
              cpuSelectedCards.push(firstCard);
            }
          }
        }
        
        cpuSelectedCards.forEach(card => {
          let notCheckedYet = true;
          switch (card.type) {
            case "2":
              if (nobodyIsWaiting()) gameFactors.cardsToTake += 2;
              break;
            case "3":
              if (nobodyIsWaiting()) gameFactors.cardsToTake += 3;
              break;
            case "4":
              gameFactors.waitTurn += 1;
              break;
            case "jack":
              if (allNeutralCards.length) {
                for (let i = 0; i < 2; i++) {
                  let index = allNeutralCards.findIndex(x => x.type === "king");
                  if (index !== -1)
                    allNeutralCards = allNeutralCards.slice(index, 1);
                  else i = 2;
                }
                if (allNeutralCards.length)
                  gameFactors.chosenType = allNeutralCards.reduce(
                    (prev, curr) =>
                      prev.sameTypeAmount < curr.sameTypeAmount ? prev : curr
                  ).type;
                else gameFactors.chosenType = null;
              }
              gameFactors.chosenType
                ? (gameFactors.jackActive = 2)
                : (gameFactors.jackActive = 0);
              break;
            case "ace":
              if (notCheckedYet) {
                let cpuCardsWithoutMostMoves = [...newCpuCards];
                cpuCardsWithoutMostMoves.splice(
                  cpuCardsWithoutMostMoves.indexOf(mostMoves),
                  1
                );
                if (newCpuCards.length > 1)
                  gameFactors.chosenWeight = cpuCardsWithoutMostMoves.reduce(
                    (prev, curr) =>
                      prev.sameWeightAmount < curr.sameWeightAmount
                        ? prev
                        : curr
                  ).weight;
                //console.log("chosenWeight");
                //console.log(chosenWeight);
              }
              break;
            case "king":
              if (
                card.weight === "hearts" ||
                (card.weight === "spades" && nobodyIsWaiting())
              ) {
                gameFactors.cardsToTake += 5;
                break;
              }

              //Kings of clubs and diamonds nullify amount of cards to be taken
              else {
                gameFactors.cardsToTake = 1;
                break;
              }
            default:
              break;
          }
          let indexInCpuCards = newCpuCards.findIndex(
            x => x.type === card.type && x.weight === card.weight
          );
          newCpuCards.splice(indexInCpuCards, 1);
        });
        availableCards = [];
        dispatch(addToPile(cpuSelectedCards));
      }
      debugger;
      newCpuCards = sortCards(newCpuCards);
      dispatch(updateCpuCards(newCpuCards));
      updateGameFactors();
    } else {
      noCardsToUse();
    }
    // gameState.playerTurn = true;

    function noCardsToUse() {
      if (gameFactors.jackActive) {
        gameFactors.jackActive -= 1;
      }
      updateGameFactors();

      // Do nothing if last card was 4
      if (waitTurn > 0 || cpuWait) {
        dispatch(waitTurns("cpuPlayer"));
      } else {
        dispatch(takeCards("cpuPlayer"));
      }
    }

    function updateGameFactors() {
      if (gameFactors.cardsToTake > 1) gameFactors.battleCardActive = true;
      else gameFactors.battleCardActive = false;

      _.forOwn(gameFactors, function(value, key) {
        debugger;
        if (value !== gameState[key]) dispatch(updateGameFactor(key, value));
      });
    }

    // dispatch(updateGameFactor("nextTurn", !gameState.nextTurn));
  };
}
