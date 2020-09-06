import React, { useState } from "react"
import { useAppState } from "./AppState"

export const Options = () => {
  const [{ target }] = useAppState()
  const [clipsNumber, setClipsNumber] = useState(2)

  if (!target) return null

  return (
    <>
      <div className="field">
        <label htmlFor="number-clips" className="label">
          Number of clips:
        </label>
        <div className="control">
          <input
            type="number"
            className="input"
            name="number-clips"
            min="2"
            max="100"
            value={clipsNumber}
            onChange={(e) => setClipsNumber(Number(e.target.value))}
          />
        </div>
      </div>
    </>
  )
}
