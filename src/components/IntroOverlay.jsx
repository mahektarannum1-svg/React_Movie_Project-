import React, { useEffect, useState, useRef } from "react";
import "./IntroOverlay.css";

// Version bump to clear cache
const SESSION_KEY = "intro_v5_played";

const VIDEO_SPIRAL    = "https://videos.pexels.com/video-files/33830768/14358475_1280_720_30fps.mp4";
const VIDEO_BLACKHOLE = "https://videos.pexels.com/video-files/34875776/14777476_1280_720_30fps.mp4";

const SCENES = [
  {
    src: VIDEO_SPIRAL,
    duration: 6500, // 6.5 seconds of active playback
    words: [
      { text: "Welcome", delay: 0 },
      { text: "to",      delay: 500 },
      { text: "Cine",    delay: 1000, className: "word-cine" },
      { text: "Verse",   delay: 1500, className: "word-verse" },
    ],
    className: "scene-spiral",
  },
  {
    src: VIDEO_BLACKHOLE,
    duration: 7000, // 7 seconds of active playback
    words: [
      { text: "A platform",     delay: 0 },
      { text: "to feel",        delay: 700 },
      { text: "the",            delay: 1300 },
      { text: "real cinema.",   delay: 1900, className: "word-cinema" },
    ],
    className: "scene-blackhole",
  },
];

export default function IntroOverlay({ onComplete }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [visibleWords, setVisibleWords] = useState([]);
  const [videoFade, setVideoFade] = useState("in"); // "in" | "out"
  const [closing, setClosing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Only true when video actually plays
  const videoRef = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Run this when the video starts actually playing (triggers onPlaying)
  const handleVideoPlaying = () => {
    if (hasStarted) return;
    setHasStarted(true);

    const scene = SCENES[sceneIdx];
    clearTimers();
    setVisibleWords([]);
    setVideoFade("in");

    // Reveal words sequentially
    scene.words.forEach(({ delay }, i) => {
      const t = setTimeout(() => {
        setVisibleWords((prev) => [...prev, i]);
      }, delay);
      timers.current.push(t);
    });

    // Start video fade out 600ms before transition
    const fadeOut = setTimeout(() => {
      setVideoFade("out");
    }, scene.duration - 600);
    timers.current.push(fadeOut);

    // Transition to next scene or close
    const next = setTimeout(() => {
      if (sceneIdx < SCENES.length - 1) {
        setHasStarted(false);
        setSceneIdx((prev) => prev + 1);
      } else {
        setClosing(true);
        setTimeout(onComplete, 1200);
      }
    }, scene.duration);
    timers.current.push(next);
  };

  useEffect(() => {
    return clearTimers;
  }, []);

  // Whenever scene index changes, reset startup state to wait for next video play
  useEffect(() => {
    setHasStarted(false);
    setVisibleWords([]);
    setVideoFade("in");
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx];

  const handleSkip = () => {
    clearTimers();
    setClosing(true);
    setTimeout(onComplete, 700);
  };

  return (
    <div className={`intro-overlay ${closing ? "warp-out" : ""}`}>
      {/* Background Video */}
      <video
        ref={videoRef}
        key={scene.src}
        className={`intro-video video-${videoFade}`}
        autoPlay
        muted
        playsInline
        onPlaying={handleVideoPlaying}
        onPlay={handleVideoPlaying}
      >
        <source src={scene.src} type="video/mp4" />
      </video>

      {/* Vignette Overlay */}
      <div className="intro-vignette" />

      {/* Intro Text Over Video */}
      <div className={`intro-text-block ${scene.className} ${hasStarted ? "active-motion" : ""}`}>
        {scene.words.map((w, i) => (
          <span
            key={`${sceneIdx}-${i}`}
            className={`intro-word ${w.className || ""} ${visibleWords.includes(i) ? "word-visible" : "word-hidden"}`}
          >
            {w.text}
          </span>
        ))}
      </div>

      {/* Orbiting rings */}
      {sceneIdx === 0 && (
        <>
          <div className="intro-ring ring-a" />
          <div className="intro-ring ring-b" />
        </>
      )}

      {/* Skip Button */}
      <button type="button" className="intro-skip" onClick={handleSkip}>
        Skip ➜
      </button>
    </div>
  );
}
