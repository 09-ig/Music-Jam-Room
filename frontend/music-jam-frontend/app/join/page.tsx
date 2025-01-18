'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function JoinRoom() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [roomId, setRoomId] = useState(searchParams.get('id') || '')

  const handleJoin = () => {
    if (roomId) {
      router.push(`/room/${roomId}`)
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Join a Room</h1>
      <div className="space-y-4 w-full max-w-md">
        <Input
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button onClick={handleJoin} size="lg" variant="default">Join Room</Button>
      </div>
    </div>
  )
}

