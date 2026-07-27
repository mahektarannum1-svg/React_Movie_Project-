import React, { useEffect, useState, useRef } from "react";
import "./IntroOverlay.css";

const SESSION_KEY = "intro_v6_played";

const VIDEO_SPIRAL    = "https://videos.pexels.com/video-files/33830768/14358475_1280_720_30fps.mp4";
const VIDEO_BLACKHOLE = "https://videos.pexels.com/video-files/34875776/14777476_1280_720_30fps.mp4";

const SCENES = [
  {
    src: VIDEO_SPIRAL,
    duration: 3500, // 3.5 seconds total
    words: [
      { text: "Welcome", delay: 0 },
      { text: "to",      delay: 150 },
      { text: "Cine",    delay: 300, className: "word-cine" },
      { text: "Verse",   delay: 450, className: "word-verse" },
    ],
    className: "scene-spiral",
  },
  {
    src: VIDEO_BLACKHOLE,
    duration: 4500, // 4.5 seconds total
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
  const [videoFade, setVideoFade] = useState("in");
  const [closing, setClosing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [disappearIntoLoop, setDisappearIntoLoop] = useState(false); // suck text into vortex
  const videoRef = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const handleVideoPlaying = () => {
    if (hasStarted) return;
    setHasStarted(true);

    const scene = SCENES[sceneIdx];
    clearTimers();
    setVisibleWords([]);
    setVideoFade("in");
    setDisappearIntoLoop(false);

    // Reveal words sequentially
    scene.words.forEach(({ delay }, i) => {
      const t = setTimeout(() => {
        setVisibleWords((prev) => [...prev, i]);
      }, delay);
      timers.current.push(t);
    });

    if (sceneIdx === 0) {
      // In first video, make text disappear into the loop at 1.8s (after showing for 1.3s)
      const vanish = setTimeout(() => {
        setDisappearIntoLoop(true);
      }, 1800);
      timers.current.push(vanish);
    }

    // Video fade out 500ms before transition
    const fadeOut = setTimeout(() => {
      setVideoFade("out");
    }, scene.duration - 500);
    timers.current.push(fadeOut);

    // Transition or complete
    const next = setTimeout(() => {
      if (sceneIdx < SCENES.length - 1) {
        setSceneIdx((prev) => prev + 1);
      } else {
        setClosing(true);
        setTimeout(onComplete, 1000);
      }
    }, scene.duration);
    timers.current.push(next);
  };

  useEffect(() => {
    return clearTimers;
  }, []);

  useEffect(() => {
    setHasStarted(false);
    setVisibleWords([]);
    setVideoFade("in");
    setDisappearIntoLoop(false);
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx];

  const handleSkip = () => {
    clearTimers();
    setClosing(true);
    setTimeout(onComplete, 600);
  };

  return (
    <div className={`intro-overlay ${closing ? "warp-out" : ""}`}>
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

      <div className="intro-vignette" />

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
