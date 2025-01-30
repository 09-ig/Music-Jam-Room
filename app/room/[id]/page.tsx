"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import io from "socket.io-client"
import { SongRequestItem } from "@/components/song-request-item"
import { QueueItem } from "@/components/queue-item"
import { GlassmorphismPlayer } from "@/components/glassmorphism-player"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, HardDriveIcon as Boot } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

let socket: any

export default function Room() {
  const params = useParams()
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [songRequests, setSongRequests] = useState([])
  const [queue, setQueue] = useState([])
  const [users, setUsers] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    socketInitializer()

    return () => {
      if (socket) socket.disconnect()
    }
  }, [])

  const socketInitializer = async () => {
    await fetch("/api/socket")
    socket = io()

    socket.on("connect", () => {
      console.log("Connected to socket")
      socket.emit("joinRoom", { roomId: params.id, userId: session?.user?.id })
    })

    socket.on("updateRoom", (data) => {
      setIsAdmin(data.isAdmin)
      setTotalUsers(data.totalUsers)
      setSongRequests(data.songRequests)
      setQueue(data.queue)
      setUsers(data.users)
      setCurrentSong(data.currentSong)
    })

    socket.on("updatePlayer", (data) => {
      setIsPlaying(data.isPlaying)
      setCurrentTime(data.currentTime)
    })
  }

  const handlePlayPause = () => {
    socket.emit("togglePlayPause", { roomId: params.id })
  }

  const handleNext = () => {
    socket.emit("nextSong", { roomId: params.id })
  }

  const handleSeek = (time: number) => {
    socket.emit("seekSong", { roomId: params.id, time })
  }

  const handleSearch = async () => {
    const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`)
    const data = await res.json()
    setSearchResults(data.items)
  }

  const handleAddSong = (videoId: string) => {
    socket.emit("addSong", { roomId: params.id, videoId })
  }

  const handleKickUser = (userId: string) => {
    socket.emit("kickUser", { roomId: params.id, userId })
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Sidebar - Song Requests */}
      <div className="w-full md:w-[30%] p-4 overflow-y-auto border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">Song Requests</h2>
        <div className="space-y-4">
          {songRequests.map((request) => (
            <SongRequestItem
              key={request.id}
              songName={request.title}
              requestedBy={request.requestedBy}
              requestedTime={request.requestedTime}
              duration={request.duration}
              thumbnailUrl={request.thumbnailUrl}
              votes={request.votes}
              totalUsers={totalUsers}
              onApprove={() => socket.emit("approveSong", { roomId: params.id, songId: request.id })}
              onReject={() => socket.emit("rejectSong", { roomId: params.id, songId: request.id })}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:flex-1 p-4 overflow-y-auto flex flex-col">
        <h1 className="text-4xl font-bold mb-8">Room: {params.id}</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Search for a song..."
            className="pl-4 pr-10 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={handleSearch}
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div key={result.id.videoId} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={result.snippet.thumbnails.default.url || "/placeholder.svg"}
                      alt={result.snippet.title}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <div className="font-medium">{result.snippet.title}</div>
                      <div className="text-sm text-muted-foreground">{result.snippet.channelTitle}</div>
                    </div>
                  </div>
                  <Button onClick={() => handleAddSong(result.id.videoId)}>Add</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Glassmorphism Player */}
        <div className="mb-8 flex justify-center items-center">
          <div className="w-full max-w-2xl">
            {currentSong && (
              <GlassmorphismPlayer
                isPlaying={isPlaying}
                currentSong={currentSong}
                currentTime={currentTime}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onSeek={handleSeek}
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="content" className="flex-grow">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="flex-grow">
            {isAdmin ? <AdminView /> : <UserView />}
          </TabsContent>
          <TabsContent value="users">
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.role}</div>
                    </div>
                  </div>
                  {isAdmin && user.role !== "Host" && (
                    <Button size="sm" variant="destructive" onClick={() => handleKickUser(user.id)}>
                      <Boot className="h-4 w-4 mr-2" />
                      Kick
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Sidebar - Queue */}
      <div className="w-full md:w-[30%] p-4 overflow-y-auto border-l border-gray-700">
        <h2 className="text-xl font-bold mb-4">Queue</h2>
        <div className="space-y-4">
          {queue.map((item) => (
            <QueueItem
              key={item.id}
              songName={item.title}
              addedBy={item.addedBy}
              addedTime={item.addedTime}
              duration={item.duration}
              thumbnailUrl={item.thumbnailUrl}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminView() {
  return (
    <div className="flex-grow">
      <h2 className="text-2xl font-bold mb-4">Admin View</h2>
      {/* Add admin-specific content here */}
    </div>
  )
}

function UserView() {
  return (
    <div className="flex-grow">
      <h2 className="text-2xl font-bold mb-4">User View</h2>
      {/* Add user-specific content here */}
    </div>
  )
}

