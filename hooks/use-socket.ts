import { useEffect, useState } from "react"
import io, { type Socket } from "socket.io-client"

export function useSocket(roomId: string, user: any) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      query: { roomId },
    })

    socketIo.on("connect", () => {
      console.log("Connected to socket")
      socketIo.emit("joinRoom", { roomId, userId: user.id })
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [roomId, user])

  return socket
}

