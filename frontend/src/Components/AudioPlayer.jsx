
import React, { useState, useEffect, useCallback, useRef } from "react";
import config from "../config";
import { Play, Pause } from "lucide-react";
import { useCreateBlockNote } from "@blocknote/react";
import "./styles/AudioPlayer.css"; // Ensure you have styles for the audio player
const AudioPlayer = ({ bookName, content }) => {
  const editor = useCreateBlockNote();
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
const [showProgressBar, setShowProgressBar] = useState(false);
const [hasUserClicked, setHasUserClicked] = useState(false);

  // Available voices for selection
  const [voice, setVoice] = useState("alloy");
  // const voices = ["alloy", "shimmer", "echo", "nova"]; // Example voices; adjust based on backend support

 
  const generateAudio = useCallback(async () => {
  if (isGenerating || !bookName || !content) return;
  setIsGenerating(true);

  try {
    const blocks = JSON.parse(content);
    editor.replaceBlocks(editor.document, blocks);
    const htmlContent = await editor.blocksToFullHTML(editor.document);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    const response = await fetch(`${config.API_URL}/api/summary/generate-audio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: plainText, bookName, voice }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate audio");
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    setAudioSrc(audioUrl); // triggers useEffect below
  } catch (error) {
    console.error("Error generating audio:", error);
    alert("There was an error generating the audio. Please try again.");
  } finally {
    setIsGenerating(false);
  }
}, [bookName, content, editor, isGenerating, voice]);

  // Preload audio on component mount
  useEffect(() => {
    if (bookName && content && !audioSrc) {
      generateAudio();
    }
  }, [bookName, content, audioSrc, generateAudio]);

  useEffect(() => {
  if (audioSrc && hasUserClicked && audioRef.current) {
    audioRef.current.play();
    setIsPlaying(true);
  }
}, [audioSrc, hasUserClicked]);
useEffect(() => {
  if (audioSrc && audioRef.current) {
    audioRef.current.load();
  }
}, [audioSrc]);

  // Handle audio progress and duration
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  // const togglePlay = () => {
  //   if (!audioSrc) {
  //     generateAudio();
  //     return;
  //   }

  //   if (isPlaying) {
  //     audioRef.current.pause();
  //   } else {
  //     audioRef.current.play();
  //   }
  //   setIsPlaying(!isPlaying);
  // };
const togglePlay = () => {
  if (!hasUserClicked) setHasUserClicked(true); // first interaction

  if (!audioSrc) {
    generateAudio();
    return;
  }

  if (isPlaying) {
    audioRef.current.pause();
  } else {
    audioRef.current.play();
  }

  setIsPlaying(!isPlaying);
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

  return (
    <div className="audio-player-container">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={isGenerating}
          className={`w-[185px] h-[50px] lg:w-[190px] py-2 px-3 sm:py-1 sm:px-2 mb-0 audio-button-container ${
            isGenerating ? "cursor-not-allowed" : ""
          } rounded-lg shadow transition duration-300 ease-in-out bg-white border border-gray-300 justify-center items-center inline-flex`}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
          <span className="mx-2 text-sm sm:text-base font-medium">
            {isGenerating
              ? "Loading Audio..."
              : isPlaying
              ? "Pause Audio"
              : "Listen Summary"}
          </span>
        </button>

        
      </div>

      {/* {audioSrc  && (
        <div className="mt-4 audio-progress-bar">
          <input
            type="range"
            min="0"
            max="100"
            value={(progress / duration) * 100 || 0}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm text-gray-600">
            {Math.floor(progress)}s / {Math.floor(duration)}s
          </div>
          <audio
            ref={audioRef}
            src={audioSrc}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      )} */}

      {audioSrc && hasUserClicked && (
  <div className="mt-4 audio-progress-bar">
    <input
      type="range"
      min="0"
      max="100"
      value={(progress / duration) * 100 || 0}
      onChange={handleSeek}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  
    <div className="text-sm text-gray-600">
  {formatTime(progress)} / {formatTime(duration)}
</div>

    <audio
      ref={audioRef}
      src={audioSrc}
      onTimeUpdate={handleTimeUpdate}
      onEnded={() => setIsPlaying(false)}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
    />
  </div>
)}

    </div>
  );
};

export default AudioPlayer;
