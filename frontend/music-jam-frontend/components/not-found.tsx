import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link href="/">
        <Button size="lg" variant="default">Go Home</Button>
      </Link>
    </div>
  )
}

