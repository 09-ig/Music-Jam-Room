import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward } from "lucide-react"
import { YT } from "@/types/youtube"

interface GlassmorphismPlayerProps {
  isPlaying: boolean
  currentSong: {
    id: string
    title: string
    channelTitle: string
    thumbnailUrl: string
    duration: number
  }
  currentTime: number
  onPlayPause: () => void
  onNext: () => void
  onSeek: (time: number) => void
}

export function GlassmorphismPlayer({
  isPlaying,
  currentSong,
  currentTime,
  onPlayPause,
  onNext,
  onSeek,
}: GlassmorphismPlayerProps) {
  const playerRef = useRef<YT.Player | null>(null)

  useEffect(() => {
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: currentSong.id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [currentSong.id])

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo()
      } else {
        playerRef.current.pauseVideo()
      }
    }
  }, [isPlaying])

  const onPlayerReady = (event: YT.PlayerEvent) => {
    // Player is ready
  }

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.ENDED) {
      onNext()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-4 backdrop-blur-lg bg-black/30 border border-white/10 rounded-lg w-full">
      <div id="youtube-player" style={{ display: "none" }}></div>
      <div className="flex items-center space-x-4">
        <img
          src={currentSong.thumbnailUrl || "/placeholder.svg"}
          alt={currentSong.title}
          className="w-16 h-16 rounded-md"
        />
        <div className="flex-grow">
          <div className="font-semibold">{currentSong.title}</div>
          <div className="text-sm text-gray-400">{currentSong.channelTitle}</div>
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

