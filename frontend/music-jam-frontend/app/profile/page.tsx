'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile:', { name, email })
  }

  return (
    <div className="text-center w-full max-w-md">
      <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>
      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSave} size="lg" variant="default">Save Profile</Button>
      </div>
    </div>
  )
}

