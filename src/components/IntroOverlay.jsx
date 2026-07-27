import React, { useEffect, useState, useRef } from "react";
import "./IntroOverlay.css";

// Scene 1: Spiral particles — text orbits/rotates with the spiral
// Scene 2: Blackhole — text zooms through space toward you
const SCENES = [
  {
    src: "https://videos.pexels.com/video-files/33830768/14358479_7680_4320_30fps.mp4",
    duration: 5500,
  },
  {
    src: "https://videos.pexels.com/video-files/34875776/14777479_3840_2160_30fps.mp4",
    duration: 6000,
  },
];

export default function IntroOverlay({ onComplete }) {
  const [scene, setScene] = useState(0); // 0 = spiral, 1 = blackhole
  const [exiting, setExiting] = useState(false); // final warp-out
  const [sceneExiting, setSceneExiting] = useState(false); // cross-fade between scenes
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
    }
  }, [scene]);

  useEffect(() => {
    const duration = SCENES[scene].duration;

    // Start cross-fade to next scene 600ms before end
    const crossFadeTimer = setTimeout(() => {
      setSceneExiting(true);
    }, duration - 600);

    // Switch scene or end intro
    const nextTimer = setTimeout(() => {
      if (scene < SCENES.length - 1) {
        setScene((s) => s + 1);
        setSceneExiting(false);
      } else {
        setExiting(true);
        setTimeout(onComplete, 1400);
      }
    }, duration);

    return () => {
      clearTimeout(crossFadeTimer);
      clearTimeout(nextTimer);
    };
  }, [scene, onComplete]);

  const handleSkip = () => {
    setExiting(true);
    setTimeout(onComplete, 800);
  };

  return (
    <div className={`intro-overlay ${exiting ? "warp-out" : ""}`}>

      {/* ── VIDEO LAYER ── */}
      <video
        ref={videoRef}
        key={SCENES[scene].src}
        className={`intro-video ${sceneExiting ? "fade-out" : "fade-in"}`}
        autoPlay
        muted
        playsInline
        loop
      >
        <source src={SCENES[scene].src} type="video/mp4" />
      </video>

      {/* ── OVERLAYS ── */}
      <div className="intro-vignette" />
      <div className="intro-noise" />

      {/* ── SCENE 1: SPIRAL — Text orbits from the center ── */}
      {scene === 0 && (
        <div className="scene scene-spiral">
          <p className="spiral-eyebrow">— You have arrived —</p>
          <h1 className="spiral-title">
            <span className="spiral-cine">Cine</span>
            <span className="spiral-verse">Verse</span>
          </h1>
          <p className="spiral-sub">Where every frame tells a story.</p>
          {/* Orbiting ring that matches spiral */}
          <div className="spiral-ring" />
          <div className="spiral-ring ring-2" />
        </div>
      )}

      {/* ── SCENE 2: BLACKHOLE — Text zooms through space ── */}
      {scene === 1 && (
        <div className="scene scene-blackhole">
          <div className="bh-line line-1">A platform to</div>
          <div className="bh-line line-2">feel the real</div>
          <div className="bh-line line-3">cinema.</div>
          {/* Converging speed lines behind text like hyperspace */}
          <div className="bh-speedlines" />
        </div>
      )}

      {/* ── SKIP ── */}
      <button type="button" className="intro-skip" onClick={handleSkip}>
        Skip Intro ➜
      </button>
    </div>
  );
}
