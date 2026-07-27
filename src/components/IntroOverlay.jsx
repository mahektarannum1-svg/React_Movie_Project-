import React, { useEffect, useState, useRef } from "react";
import "./IntroOverlay.css";

// 720p versions for fast loading
const VIDEO_SPIRAL    = "https://videos.pexels.com/video-files/33830768/14358475_1280_720_30fps.mp4";
const VIDEO_BLACKHOLE = "https://videos.pexels.com/video-files/34875776/14777476_1280_720_30fps.mp4";

// Timeline (ms) of what appears while each video plays
const SCENES = [
  {
    src: VIDEO_SPIRAL,
    duration: 6000,
    // words appear at these offsets (ms from scene start)
    words: [
      { text: "Welcome", delay: 0 },
      { text: "to",      delay: 400 },
      { text: "Cine",    delay: 900,  className: "word-cine" },
      { text: "Verse",   delay: 1300, className: "word-verse" },
    ],
    className: "scene-spiral",
  },
  {
    src: VIDEO_BLACKHOLE,
    duration: 7000,
    words: [
      { text: "A platform",     delay: 0 },
      { text: "to feel",        delay: 600 },
      { text: "the",            delay: 1100 },
      { text: "real cinema.",   delay: 1600, className: "word-cinema" },
    ],
    className: "scene-blackhole",
  },
];

export default function IntroOverlay({ onComplete }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [visibleWords, setVisibleWords] = useState([]);
  const [videoFade, setVideoFade] = useState("in"); // "in" | "out"
  const [closing, setClosing] = useState(false);
  const videoRef = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => timers.current.forEach(clearTimeout);

  const startScene = (idx) => {
    const scene = SCENES[idx];
    setVisibleWords([]);
    setVideoFade("in");

    // Reveal each word at its scheduled offset
    scene.words.forEach(({ delay }, i) => {
      const t = setTimeout(() => {
        setVisibleWords((prev) => [...prev, i]);
      }, delay);
      timers.current.push(t);
    });

    // Fade out video 500ms before switching
    const fadeOut = setTimeout(() => setVideoFade("out"), scene.duration - 500);
    timers.current.push(fadeOut);

    // Advance to next scene or end
    const advance = setTimeout(() => {
      if (idx < SCENES.length - 1) {
        startScene(idx + 1);
        setSceneIdx(idx + 1);
      } else {
        setClosing(true);
        setTimeout(onComplete, 1200);
      }
    }, scene.duration);
    timers.current.push(advance);
  };

  useEffect(() => {
    startScene(0);
    return clearTimers;
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 1.0;
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx];

  const handleSkip = () => {
    clearTimers();
    setClosing(true);
    setTimeout(onComplete, 700);
  };

  return (
    <div className={`intro-overlay ${closing ? "warp-out" : ""}`}>

      {/* ── Full-screen video ── */}
      <video
        ref={videoRef}
        key={scene.src}
        className={`intro-video video-${videoFade}`}
        autoPlay
        muted
        playsInline
        loop
      >
        <source src={scene.src} type="video/mp4" />
      </video>

      {/* ── Overlays ── */}
      <div className="intro-vignette" />

      {/* ── TEXT on the video ── */}
      <div className={`intro-text-block ${scene.className}`}>
        {scene.words.map((w, i) => (
          <span
            key={`${sceneIdx}-${i}`}
            className={`intro-word ${w.className || ""} ${visibleWords.includes(i) ? "word-visible" : "word-hidden"}`}
          >
            {w.text}
          </span>
        ))}
      </div>

      {/* ── Decorative rings (spiral scene only) ── */}
      {sceneIdx === 0 && (
        <>
          <div className="intro-ring ring-a" />
          <div className="intro-ring ring-b" />
        </>
      )}

      {/* ── Skip ── */}
      <button type="button" className="intro-skip" onClick={handleSkip}>
        Skip ➜
      </button>
    </div>
  );
}
