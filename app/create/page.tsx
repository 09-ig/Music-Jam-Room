'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateRoom() {
  const router = useRouter()

  useEffect(() => {
    const randomId = Math.random().toString(36).substring(7)
    router.push(`/room/${randomId}`)
  }, [router])

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Creating Room...</h1>
      <p>Please wait while we set up your room.</p>
    </div>
  )
}

