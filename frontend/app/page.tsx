import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to CCSJam</h1>
      <div className="space-y-4">
        <Link href="/join">
          <Button size="lg" variant="default">Join a Room</Button>
        </Link>
        <Link href="/create">
          <Button size="lg" variant="default">Create a Room</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="default">Login with Spotify</Button>
        </Link>
      </div>
    </div>
  )
}

