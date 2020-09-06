import React, { useState, useEffect } from "react"
import { useAppState } from "./AppState"
import { searchCreator, CreatorsSearchResult } from "./twitchApi"

export const Finder: React.SFC = () => {
  const [{ gameType, target }, dispatch] = useAppState()
  const [query, setQuery] = useState("")
  const [creators, setCreators] = useState([] as CreatorsSearchResult[])

  useEffect(() => {
    if (gameType === "creator") {
      searchCreator(query).then((creators) => setCreators(creators))
    }
  }, [query, gameType])

  if (!gameType) {
    return null
  }

  if (target) {
    return (
      <div className="field">
        <div className="search-result columns">
          <div
            className="column is-narrow"
            style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <h2 className="title">{target.name}</h2>
          </div>
          <div className="column level">
            <div className="level-right">
              <div className="level-item">
                <button className="button is-danger is-large">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="field">
        <div className="control is-expanded">
          <input
            type="text"
            className="input"
            placeholder={gameType === "creator" ? "Find a creator..." : "Find a game...."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      {gameType === "creator" &&
        !target &&
        creators.map((creator) => (
          <div className="columns search-result" key={creator.id}>
            <div className="column is-narrow">
              <figure className="image is-128x128">
                <img src={creator.thumbnail_url} alt={creator.display_name} className="is-rounded" />
              </figure>
            </div>
            <div className="column is-narrow">
              <div className="content">
                <h2>
                  <a href={`https://twitch.tv/${creator.display_name}`} target="_blank" rel="noopener noreferrer">
                    {creator.display_name}
                  </a>
                </h2>
                <p>
                  ID: {creator.id}, Lang: {creator.broadcaster_language}
                </p>
              </div>
            </div>
            <div className="column level">
              <div className="level-right">
                <div className="level-item">
                  <button
                    className="button is-primary is-large"
                    onClick={() =>
                      dispatch({
                        type: "SET_TARGET_ID",
                        value: { id: creator.id, name: creator.display_name },
                      })
                    }
                  >
                    Choose
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
