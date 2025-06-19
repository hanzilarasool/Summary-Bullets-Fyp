import React, { useState, useEffect, useRef, useCallback } from "react";
import config from "../config";
import { useCreateBlockNote } from "@blocknote/react";
import "./styles/AudioPlayer1.css"; // Your Figma-matching CSS

const AudioPlayer1 = ({ bookName, content }) => {
  const editor = useCreateBlockNote();
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // in seconds
  const [duration, setDuration] = useState(0); // in seconds
  const [voice] = useState("alloy");
  const [hasUserClicked, setHasUserClicked] = useState(false);
  const audioRef = useRef(null);

  // Generate audio and fetch from API
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

      if (!response.ok) throw new Error("Failed to generate audio");
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioSrc(audioUrl);
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("There was an error generating the audio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [bookName, content, editor, isGenerating, voice]);

  useEffect(() => {
    if (bookName && content && !audioSrc) {
      generateAudio();
    }
  }, [bookName, content, audioSrc, generateAudio]);

  // Load audio when source changes
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.load();
    }
  }, [audioSrc]);

  // Auto play after user click and audio is ready
  useEffect(() => {
    if (audioSrc && hasUserClicked && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioSrc, hasUserClicked]);

  // Audio time and progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime || 0);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const percent = Number(e.target.value);
    const seekTime = (percent / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(seekTime);
  };

  const handlePlayPause = () => {
    if (!hasUserClicked) setHasUserClicked(true);
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

  // Skip -5s/+5s
  const skipSeconds = (secs) => {
    if (!audioRef.current || !duration) return;
    let newTime = audioRef.current.currentTime + secs;
    newTime = Math.max(0, Math.min(newTime, duration));
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  // Download audio
  const handleDownload = () => {
    if (!audioSrc) return;
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = `${bookName}-summary.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Time format mm:ss
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="audio-container-box">
      <div className="audio-controls">
        <div className="left-five">
          <button
            type="button"
            aria-label="Rewind 5 seconds"
            onClick={() => skipSeconds(-5)}
            disabled={!audioSrc || isGenerating}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <img src="/assets/left-five-sec.svg" alt="Rewind 5s" />
          </button>
        </div>
        <div className="play-pause-conditional">
          <button
            type="button"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            onClick={handlePlayPause}
            disabled={isGenerating}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <img
              src={
                isPlaying
                  ? "/assets/play-button.svg"
                  : "/assets/pause-button.svg"
              }
              alt={isPlaying ? "Pause" : "Play"}
            />
          </button>
        </div>
        <div className="right-five">
          <button
            type="button"
            aria-label="Forward 5 seconds"
            onClick={() => skipSeconds(5)}
            disabled={!audioSrc || isGenerating}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <img src="/assets/right-five-sec.svg" alt="Forward 5s" />
          </button>
        </div>
      </div>

      <div className="progress-duration-plus-bar">
        <div className="current-time">
          <span>{formatTime(progress)}</span>
        </div>
        <div className="progress-bar" style={{ width: "92%" }}>
          
          
          


          <input
  type="range"
  min={0}
  max={100}
  value={duration ? ((progress / duration) * 100) : 0}
  onChange={handleSeek}
  style={{
    width: "100%",
    position: "relative",
    zIndex: 2,
    // 👇 This is key! Makes the progress bar fill black up to the thumb
    "--progress-percent": `${duration ? ((progress / duration) * 100) : 0}%`
  }}
  disabled={!audioSrc}
  aria-label="Seek audio"
/>
         
        </div>
        <div className="duration-time">
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="audio-download-icon">
        <button
          type="button"
          aria-label="Download audio"
          onClick={handleDownload}
          disabled={!audioSrc}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <img src="/assets/audio-download-icon.svg" alt="Download audio" />
        </button>
      </div>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AudioPlayer1;