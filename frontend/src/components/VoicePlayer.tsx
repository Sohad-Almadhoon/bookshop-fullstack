import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { formatTime } from "../utils/helpers";

const VoicePlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    // Update the currentTime and duration when the audio is loaded
    audioElement.addEventListener("loadedmetadata", () => {
      setDuration(audioElement.duration);
    });

    // Update the currentTime continuously while playing
    audioElement.addEventListener("timeupdate", () => {
      setCurrentTime(audioElement.currentTime);
    });

    return () => {
      // Clean up event listeners
      audioElement.removeEventListener("loadedmetadata", () => {});
      audioElement.removeEventListener("timeupdate", () => {});
    };
  }, []);
  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentTime = +e.target.value;
    setCurrentTime(currentTime);
    if (!audioRef.current) return;
    audioRef.current.currentTime = currentTime;
  };
  return (
    <div className="flex items-center justify-center w-full rounded-lg border-black border border-opacity-30 px-1 py-0.5 gap-1">
      <audio ref={audioRef} src="/assets/voice.mp3" />
      <button
        onClick={togglePlay}
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
        max={duration}
        step="1"
        value={currentTime}
              onChange={handleSliderChange}
              
        className="flex-1 appearance-none bg-black h-1"
      />
          <span>{formatTime(duration)}</span>
          
    </div>
  );
};

export default VoicePlayer;
