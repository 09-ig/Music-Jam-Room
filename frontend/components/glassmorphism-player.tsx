import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, Repeat } from 'lucide-react'

interface GlassmorphismPlayerProps {
  isPlaying: boolean
  currentSong: {
    name: string
    artist: string
    albumCover: string
    duration: number
  }
  currentTime: number
  onPlayPause: () => void
  onNext: () => void
  onRepeat: () => void
  onSeek: (time: number) => void
}

export function GlassmorphismPlayer({
  isPlaying,
  currentSong,
  currentTime,
  onPlayPause,
  onNext,
  onRepeat,
  onSeek
}: GlassmorphismPlayerProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-4 backdrop-blur-lg bg-black/30 border border-white/10 rounded-lg w-full">
      <div className="flex items-center space-x-4">
        <img src={currentSong.albumCover || "/placeholder.svg"} alt={currentSong.name} className="w-16 h-16 rounded-md" />
        <div className="flex-grow">
          <div className="font-semibold">{currentSong.name}</div>
          <div className="text-sm text-gray-400">{currentSong.artist}</div>
        </div>
      </div>
      <div className="mt-4">
        <Slider
          value={[currentTime]}
          max={currentSong.duration}
          step={1}
          onValueChange={(value) => onSeek(value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentSong.duration)}</span>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-4 mt-4">
        <Button variant="ghost" size="icon" onClick={onRepeat}>
          <Repeat className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onPlayPause}>
          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext}>
          <SkipForward className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

