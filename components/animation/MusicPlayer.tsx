"use client";

import { useRef, useState, useEffect } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);

  // set volume on mount
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.muted = true;
  }, []);

  // when unmuted, play the audio
  useEffect(() => {
    if (audioRef.current && !muted) {
      audioRef.current.play().catch(() => { });
    }
  }, [muted]);

  const toggleMute = () => {
    setMuted(!muted);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex items-center bg-black/70 backdrop-blur-sm rounded-full px-3 py-2 z-50">
      <button
        onClick={toggleMute}
        className="text-white hover:text-[#FDA51F] transition-colors"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          // muted speaker icon
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 9L5 12L9 15V9z" />
            <line x1="16" y1="8" x2="22" y2="14" />
            <line x1="22" y1="8" x2="16" y2="14" />
          </svg>
        ) : (
          // speaker icon
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 9L5 12L9 15V9z" />
            <path d="M12 5v14" />
            <path d="M15 8v8" />
          </svg>
        )}
      </button>
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" preload="auto" loop muted={muted} />
    </div>
  );
}


