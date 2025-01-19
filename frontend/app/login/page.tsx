import { Button } from '@/components/ui/button'

export default function Login() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <div className="space-y-4 w-full max-w-md">
        <Button className="w-full" size="lg" variant="default">Login with Spotify</Button>
        <Button className="w-full" size="lg" variant="default">Login with Google</Button>
      </div>
    </div>
  )
}

