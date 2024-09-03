import { createStore } from 'redux'

export type TInitState = {
  token: string
}
const DefaultValueState: TInitState = {
  token: ''
}

export const ActionTypes = {
  TOKEN: 'token'
}

function counterReducer(state: TInitState = DefaultValueState, action: { type: string; payload: any }) {
  switch (action.type) {
    case ActionTypes.TOKEN:
      return { ...state, token: action.payload }
    default:
      return state
  }
}

let store = createStore(counterReducer)

export default store
