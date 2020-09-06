import { useState, useEffect } from "react"

const CLIENT_ID = ""
const ACCESS_TOKEN = ""

export interface CreatorsSearchResult {
  broadcaster_language: string
  display_name: string
  game_id: string
  id: string
  is_live: boolean
  started_at: string
  tag_ids: string[]
  thumbnail_url: string
  title: string
}

export const searchCreator = async (query: string) => {
  if (query.length < 3) return []

  const apiUrl = new URL("https://api.twitch.tv/helix/search/channels")
  apiUrl.searchParams.append("query", query)
  apiUrl.searchParams.append("first", "4")

  const res = await fetch(apiUrl.toString(), {
    headers: { "Client-ID": CLIENT_ID, Authorization: `Bearer ${ACCESS_TOKEN}` },
  })
  const json = (await res.json()) as {
    data: CreatorsSearchResult[]
  }

  return json.data
}

export interface UseCreatorResult {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
}
export const useCreator = (id: string) => {
  const [res, setRes] = useState(undefined as UseCreatorResult | undefined)

  useEffect(() => {
    const apiUrl = new URL("https://api.twitch.tv/helix/users")
    apiUrl.searchParams.append("id", id)
    fetch(apiUrl.toString(), {
      headers: { "Client-ID": CLIENT_ID, Authorization: `Bearer ${ACCESS_TOKEN}` },
    }).then((res) => {
      res.json().then((json: UseCreatorResult) => {
        setRes(json)
      })
    })
  })

  return res
}
