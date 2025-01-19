import { Button } from "@/components/ui/button"
import { Check, X } from 'lucide-react'

interface SongRequestItemProps {
  songName: string
  requestedBy: string
  requestedTime: string
  duration: string
  albumCover: string
  votes: number
  totalUsers: number
  onApprove: () => void
  onReject: () => void
}

export function SongRequestItem({
  songName,
  requestedBy,
  requestedTime,
  duration,
  albumCover,
  votes,
  totalUsers,
  onApprove,
  onReject
}: SongRequestItemProps) {
  return (
    <div className="flex p-2 bg-secondary rounded-lg">
      <div className="w-2/5 pr-2">
        <img src={albumCover || "/placeholder.svg"} alt={songName} className="w-full h-auto rounded" />
      </div>
      <div className="w-3/5 flex flex-col justify-between">
        <div>
          <div className="font-semibold truncate">{songName}</div>
          <div className="text-sm text-muted-foreground truncate">
            {requestedBy}
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-sm text-muted-foreground">{duration}</div>
          <div className="text-sm text-muted-foreground">{requestedTime}</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm font-medium">
            Votes: {votes}/{totalUsers}
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={onApprove}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="default" className="bg-red-600 hover:bg-red-700" onClick={onReject}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

