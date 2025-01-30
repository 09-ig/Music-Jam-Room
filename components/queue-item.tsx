interface QueueItemProps {
  songName: string
  addedBy: string
  addedTime: string
  duration: string
  thumbnailUrl: string
}

export function QueueItem({ songName, addedBy, addedTime, duration, thumbnailUrl }: QueueItemProps) {
  return (
    <div className="flex p-2 bg-secondary rounded-lg">
      <div className="w-2/5 pr-2">
        <img src={thumbnailUrl || "/placeholder.svg"} alt={songName} className="w-full h-auto rounded" />
      </div>
      <div className="w-3/5 flex flex-col justify-between">
        <div>
          <div className="font-semibold truncate">{songName}</div>
          <div className="text-sm text-muted-foreground truncate">{addedBy}</div>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-sm text-muted-foreground">{duration}</div>
          <div className="text-sm text-muted-foreground">{addedTime}</div>
        </div>
      </div>
    </div>
  )
}

