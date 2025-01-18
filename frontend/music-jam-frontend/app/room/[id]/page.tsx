'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { SongRequestItem } from '@/components/song-request-item'
import { QueueItem } from '@/components/queue-item'
import { GlassmorphismPlayer } from '@/components/glassmorphism-player'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, HardDriveIcon as Boot } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Room() {
  const params = useParams()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalUsers, setTotalUsers] = useState(5) // Mock total users count

  useEffect(() => {
    // TODO: Check if user is admin
    setIsAdmin(Math.random() > 0.5)
  }, [])

  // Mock data for song requests and queue
  const songRequests = [
    { id: 1, songName: "Song 1", requestedBy: "User 1", requestedTime: "5m ago", duration: "3:45", albumCover: "/placeholder.svg?height=100&width=100", votes: 3 },
    { id: 2, songName: "Song 2", requestedBy: "User 2", requestedTime: "10m ago", duration: "4:20", albumCover: "/placeholder.svg?height=100&width=100", votes: 4 },
  ]

  const queue = [
    { id: 1, songName: "Queue Song 1", addedBy: "User 3", addedTime: "2m ago", duration: "3:30", albumCover: "/placeholder.svg?height=100&width=100" },
    { id: 2, songName: "Queue Song 2", addedBy: "User 4", addedTime: "7m ago", duration: "4:15", albumCover: "/placeholder.svg?height=100&width=100" },
  ]

  const users = [
    { id: 1, name: "User 1", role: "Host", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "User 2", role: "Listener", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "User 3", role: "Listener", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "User 4", role: "Listener", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "User 5", role: "Listener", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const currentSong = {
    name: "Current Song",
    artist: "Current Artist",
    albumCover: "/placeholder.svg?height=100&width=100",
    duration: 180, // 3 minutes in seconds
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    console.log('Next song')
  }

  const handleRepeat = () => {
    console.log('Toggle repeat')
  }

  const handleSeek = (time: number) => {
    setCurrentTime(time)
  }

  const handleKickUser = (userId: number) => {
    console.log(`Kick user ${userId}`)
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
              songName={request.songName}
              requestedBy={request.requestedBy}
              requestedTime={request.requestedTime}
              duration={request.duration}
              albumCover={request.albumCover}
              votes={request.votes}
              totalUsers={totalUsers}
              onApprove={() => console.log('Approved', request.id)}
              onReject={() => console.log('Rejected', request.id)}
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
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Glassmorphism Player */}
        <div className="mb-8 flex justify-center items-center">
          <div className="w-full max-w-2xl">
            <GlassmorphismPlayer
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onRepeat={handleRepeat}
              onSeek={handleSeek}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="content" className="flex-grow">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="flex-grow">
            {isAdmin ? (
              <AdminView />
            ) : (
              <UserView />
            )}
          </TabsContent>
          <TabsContent value="users">
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.role}</div>
                    </div>
                  </div>
                  {isAdmin && user.role !== "Host" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleKickUser(user.id)}
                    >
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
              songName={item.songName}
              addedBy={item.addedBy}
              addedTime={item.addedTime}
              duration={item.duration}
              albumCover={item.albumCover}
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

