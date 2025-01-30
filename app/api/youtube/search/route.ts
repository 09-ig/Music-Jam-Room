import { NextResponse } from "next/server"
import { google } from "googleapis"

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      q: query,
      type: ["video"],
      maxResults: 10,
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("YouTube API Error:", error)
    return NextResponse.json({ error: "An error occurred while fetching data from YouTube" }, { status: 500 })
  }
}

