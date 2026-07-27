import React, { useEffect, useState, useRef } from "react";
import "./IntroOverlay.css";

const INTRO_VIDEOS = [
  {
    src: "https://videos.pexels.com/video-files/33830768/14358479_7680_4320_30fps.mp4",
    text: "Welcome to CineVerse",
    duration: 4000
  },
  {
    src: "https://videos.pexels.com/video-files/34875776/14777479_3840_2160_30fps.mp4",
    text: "A platform to feel the real cinema.",
    duration: 5000
  }
];

export default function IntroOverlay({ onComplete }) {
  const [videoIndex, setVideoIndex] = useState(0);
  const [fade, setFade] = useState(false); // Controls inner element visibility
  const [closing, setClosing] = useState(false); // Controls final slide/fade out
  const videoRef = useRef(null);

  useEffect(() => {
    // Start fade-in of elements
    const fadeTimer = setTimeout(() => setFade(true), 300);
    
    // Set timer for current video scene duration
    const sceneTimer = setTimeout(() => {
      setFade(false); // Start fade-out of current text
      setTimeout(() => {
        if (videoIndex < INTRO_VIDEOS.length - 1) {
          setVideoIndex((prev) => prev + 1);
        } else {
          // Final transition
          setClosing(true);
          setTimeout(onComplete, 1200); // Trigger complete after zoom animation
        }
      }, 500);
    }, INTRO_VIDEOS[videoIndex].duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(sceneTimer);
    };
  }, [videoIndex, onComplete]);

  // Adjust playback speed to make it feel extra dramatic and fluent
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
    }
  }, [videoIndex]);

  const current = INTRO_VIDEOS[videoIndex];

  return (
    <div className={`intro-overlay ${closing ? "closing" : ""}`}>
      {/* Background Video */}
      <video
        ref={videoRef}
        key={current.src}
        className="intro-video"
        autoPlay
        muted
        playsInline
      >
        <source src={current.src} type="video/mp4" />
      </video>

      {/* Cinematic Overlays */}
      <div className="intro-vignette" />
      <div className="intro-glow" />

      {/* Text Container */}
      <div className={`intro-content ${fade ? "visible" : "hidden"}`}>
        <h1 className="intro-text">{current.text}</h1>
      </div>

      {/* Skip Button */}
      <button 
        type="button" 
        className="intro-skip" 
        onClick={() => {
          setClosing(true);
          setTimeout(onComplete, 800);
        }}
      >
        Skip Intro ➜
      </button>
    </div>
  );
}
