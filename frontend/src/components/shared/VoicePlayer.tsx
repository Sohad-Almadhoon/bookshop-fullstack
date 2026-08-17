import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { formatTime } from "../../utils/helpers";

const VoicePlayer = ({ url }: { url: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      toast.error("This audio file could not be played.");
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Named handlers so removeEventListener actually removes them: the previous
    // version passed brand new empty functions and leaked a listener per mount.
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onError = () => toast.error("Audio failed to load.");

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, [url]);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCurrentTime(value);
    if (audioRef.current) audioRef.current.currentTime = value;
  };

  return (
    <div className="flex items-center justify-center flex-1 px-1 py-0.5 gap-1">
      {/* key forces a reload when the source changes */}
      <audio ref={audioRef} src={url} key={url} preload="metadata" />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="rounded-full w-10 h-10 flex justify-center items-center z-10">
        {isPlaying ? (
          <BsPauseFill className="text-3xl" />
        ) : (
          <BsPlayFill className="text-3xl" />
        )}
      </button>
      <span>{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="1"
        value={currentTime}
        aria-label="Seek"
        onChange={handleSliderChange}
        className="flex-1 appearance-none bg-black h-1"
      />
      <span>{formatTime(duration)}</span>
    </div>
  );
};

export default VoicePlayer;
