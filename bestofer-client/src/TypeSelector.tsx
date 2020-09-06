import React from "react"
import { useAppState } from "./AppState"

export const TypeSelector: React.SFC = () => {
  const [{ gameType }, dispatch] = useAppState()

  const setType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "DEFAULT") {
      dispatch({ type: "SET_TYPE", value: e.target.value as "creator" | "game" })
    }
  }

  return (
    <div className="field">
      <label htmlFor="type-selector" className="label">
        Select "Best Of" type:
      </label>
      <div className="control">
        <div className="select is-fullwidth">
          <select name="type-selector" onChange={setType} value={gameType}>
            <option value="DEFAULT">Choose a type</option>
            <option value="creator">Creator</option>
            <option value="game">Game</option>
          </select>
        </div>
      </div>
    </div>
  )
}
