'use client'

import { useState, useEffect } from 'react'

export default function Status() {
  const [status, setStatus] = useState({
    server: 'Checking...',
    database: 'Checking...',
    spotifyApi: 'Checking...',
  })

  useEffect(() => {
    // TODO: Implement actual status checks
    const checkStatus = async () => {
      // This is a placeholder, replace with actual status checks
      setStatus({
        server: 'Online',
        database: 'Connected',
        spotifyApi: 'Authenticated',
      })
    }

    checkStatus()
  }, [])

  return (
    <div className="text-center w-full max-w-md">
      <h1 className="text-4xl font-bold mb-8">System Status</h1>
      <div className="space-y-4">
        <StatusItem label="Server" status={status.server} />
        <StatusItem label="Database" status={status.database} />
        <StatusItem label="Spotify API" status={status.spotifyApi} />
      </div>
    </div>
  )
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-bold">{label}:</span>
      <span className={status === 'Online' || status === 'Connected' || status === 'Authenticated' ? 'text-green-500' : 'text-red-500'}>
        {status}
      </span>
    </div>
  )
}

