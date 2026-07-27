import React, { useEffect, useState, useRef } from "react";
import "./IntroOverlay.css";

const SESSION_KEY = "intro_v7_played";

const VIDEO_SPIRAL    = "https://videos.pexels.com/video-files/33830768/14358475_1280_720_30fps.mp4";
const VIDEO_BLACKHOLE = "https://videos.pexels.com/video-files/34875776/14777476_1280_720_30fps.mp4";

const SCENES = [
  {
    duration: 2800, // 2.8 seconds total
    words: [
      { text: "Welcome", delay: 0 },
      { text: "to",      delay: 150 },
      { text: "Cine",    delay: 300, className: "word-cine" },
      { text: "Verse",   delay: 450, className: "word-verse" },
    ],
    className: "scene-spiral",
  },
  {
    duration: 3800, // 3.8 seconds total
    words: [
      { text: "A platform",     delay: 0 },
      { text: "to feel",        delay: 400 },
      { text: "the",            delay: 800 },
      { text: "real cinema.",   delay: 1200, className: "word-cinema" },
    ],
    className: "scene-blackhole",
  },
];

export default function IntroOverlay({ onComplete }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [visibleWords, setVisibleWords] = useState([]);
  const [closing, setClosing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [disappearIntoLoop, setDisappearIntoLoop] = useState(false);
  
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const handleVideoPlaying = (idx) => {
    // Only trigger when the active video starts playing
    if (idx !== sceneIdx || hasStarted) return;
    setHasStarted(true);

    const scene = SCENES[idx];
    clearTimers();
    setVisibleWords([]);
    setDisappearIntoLoop(false);

    // Reveal words sequentially
    scene.words.forEach(({ delay }, i) => {
      const t = setTimeout(() => {
        setVisibleWords((prev) => [...prev, i]);
      }, delay);
      timers.current.push(t);
    });

    if (idx === 0) {
      // In first video, make text disappear into the center loop at 1.3 seconds
      const vanish = setTimeout(() => {
        setDisappearIntoLoop(true);
      }, 1300);
      timers.current.push(vanish);
    }

    // Transition or complete
    const next = setTimeout(() => {
      if (idx < SCENES.length - 1) {
        setSceneIdx(idx + 1);
      } else {
        setClosing(true);
        setTimeout(onComplete, 800);
      }
    }, scene.duration);
    timers.current.push(next);
  };

  useEffect(() => {
    return clearTimers;
  }, []);

  // Whenever sceneIdx changes, prepare triggers
  useEffect(() => {
    setHasStarted(false);
    setVisibleWords([]);
    setDisappearIntoLoop(false);

    // Play next video programmatically to guarantee instant load
    if (sceneIdx === 1 && videoRef2.current) {
      videoRef2.current.play().catch(() => {});
    }
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx];

  const handleSkip = () => {
    clearTimers();
    setClosing(true);
    setTimeout(onComplete, 500);
  };

  return (
    <div className={`intro-overlay ${closing ? "warp-out" : ""}`}>
      
      {/* ── VIDEO 1 (Spiral) ── */}
      <video
        ref={videoRef1}
        className={`intro-video ${sceneIdx === 0 ? "active" : "inactive"}`}
        autoPlay
        muted
        playsInline
        onPlaying={() => handleVideoPlaying(0)}
        onPlay={() => handleVideoPlaying(0)}
      >
        <source src={VIDEO_SPIRAL} type="video/mp4" />
      </video>

      {/* ── VIDEO 2 (Blackhole) ── */}
      <video
        ref={videoRef2}
        className={`intro-video ${sceneIdx === 1 ? "active" : "inactive"}`}
        muted
        playsInline
        onPlaying={() => handleVideoPlaying(1)}
        onPlay={() => handleVideoPlaying(1)}
      >
        <source src={VIDEO_BLACKHOLE} type="video/mp4" />
      </video>

      <div className="intro-vignette" />

      {/* ── TEXT OVERLAY ── */}
      <div className={`intro-text-block ${scene.className} ${disappearIntoLoop ? "disappear-loop" : ""}`}>
        {scene.words.map((w, i) => (
          <span
            key={`${sceneIdx}-${i}`}
            className={`intro-word ${w.className || ""} ${visibleWords.includes(i) ? "word-visible" : "word-hidden"}`}
          >
            {w.text}
          </span>
        ))}
      </div>

      {sceneIdx === 0 && (
        <>
          <div className="intro-ring ring-a" />
          <div className="intro-ring ring-b" />
        </>
      )}

      <button type="button" className="intro-skip" onClick={handleSkip}>
        Skip ➜
      </button>
    </div>
  );
}
