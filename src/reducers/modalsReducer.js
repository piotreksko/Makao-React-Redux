const initialState = {
    ace: false,
    jack: false,
    macao: false,
    gameOver: false,
    whoStarts: false
  }
  
export default function modal(state = initialState, action) {
    switch (action.type) {
      case 'SHOW_MODAL':
        return { ...state,
          [action.modal]: true
        }
      case 'HIDE_MODAL':
        return { ...state,
          [action.modal]: false
        }
      default:
        return state
    }
  }
  