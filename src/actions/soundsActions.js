export function pickCard(sound) {
  return {
    type: 'PICK_CARD',
    meta: {
      sound: {
        play : sound
      }
    }
  }
}
  export function takeCard(){
    debugger
  return {
    type: 'TAKE_CARD',
    meta: {
      sound: {
        play : 'take_card'
      }
    }
  } 
}