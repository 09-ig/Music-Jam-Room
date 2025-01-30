import { Server } from "socket.io"
import type { NextApiResponseServerIO } from "@/types/next"

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: any, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      socket.on("joinRoom", ({ roomId, userId }) => {
        socket.join(roomId)
        // Fetch room data and emit to the client
        // This is where you'd typically query your database
        const roomData = {
          isAdmin: false, // Determine this based on the user's role
          totalUsers: 1,
          songRequests: [],
          queue: [],
          users: [{ id: userId, name: "User", role: "Listener" }],
          currentSong: null,
        }
        io.to(roomId).emit("updateRoom", roomData)
      })

      socket.on("togglePlayPause", ({ roomId }) => {
        // Toggle play/pause state and emit to all clients in the room
        io.to(roomId).emit("updatePlayer", { isPlaying: true, currentTime: 0 })
      })

      socket.on("nextSong", ({ roomId }) => {
        // Logic to move to the next song
        // Update the room state and emit to all clients
      })

      socket.on("seekSong", ({ roomId, time }) => {
        // Logic to seek to a specific time in the current song
        io.to(roomId).emit("updatePlayer", { currentTime: time })
      })

      socket.on("addSong", ({ roomId, videoId }) => {
        // Logic to add a song to the queue or requests
        // Update the room state and emit to all clients
      })

      socket.on("kickUser", ({ roomId, userId }) => {
        // Logic to kick a user from the room
        // Update the room state and emit to all clients
      })

      socket.on("approveSong", ({ roomId, songId }) => {
        // Logic to approve a song request
        // Move the song from requests to queue
        // Update the room state and emit to all clients
      })

      socket.on("rejectSong", ({ roomId, songId }) => {
        // Logic to reject a song request
        // Remove the song from requests
        // Update the room state and emit to all clients
      })
    })
  }

  res.end()
}

export { SocketHandler as GET, SocketHandler as POST }

