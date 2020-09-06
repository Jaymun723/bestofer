import React, { createContext, useContext, useReducer, Reducer, Dispatch } from "react"

// interface CreatorTypeState {
//   gameType: "creator"
//   targetId: string
// }

// interface GameTypeState {
//   gameType: "game"
// }

// interface DefaultTypeState {
//   gameType: undefined
// }

// type AppState = CreatorTypeState | GameTypeState | DefaultTypeState

interface AppState {
  gameType?: "creator" | "game"
  target?: { id: string; name: string }
}

const initialState: AppState = {}

interface SetTypeAction {
  type: "SET_TYPE"
  value: "creator" | "game"
}

interface SetTargetIdAction {
  type: "SET_TARGET_ID"
  value: { id: string; name: string }
}

type Action = SetTypeAction | SetTargetIdAction

const appReducer: Reducer<AppState, Action> = (prevState, action) => {
  switch (action.type) {
    case "SET_TYPE":
      return {
        ...prevState,
        gameType: action.value,
      }
    case "SET_TARGET_ID":
      return {
        ...prevState,
        target: action.value,
      }
    default:
      return prevState
  }
}

export const StateContext = createContext([initialState, () => {}] as [AppState, Dispatch<Action>])

export const AppStateProvider: React.SFC = ({ children }) => (
  <StateContext.Provider value={useReducer(appReducer, initialState)}>{children}</StateContext.Provider>
)

export const useAppState = () => useContext(StateContext)
