export function pickCard() {
  debugger;
  return {
    type: 'PICK_CARD',
    meta: {
      sound: {
        play :'pick_card'
      }
    }
  }
}