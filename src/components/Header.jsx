import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Header.css";

const GENRE_VIDEOS = [
  {
    genre: "Action",
    label: "Action",
    emoji: "🎬",
    color: "#ff4500",
    grad: "linear-gradient(135deg,#ff4500,#e50914)",
    video: "https://media.istockphoto.com/id/1423719969/video/men-having-fight-in-underground-room.mp4?s=mp4-640x640-is&k=20&c=yqXWg8s-V7dGVIYNNesajS_EjB0GBDAx09DU6zPxeQQ=",
    tagline: "Explosive stunts & intense chases",
    sub: "High-octane. No mercy.",
    speed: 0.75
  },
  {
    genre: "Sci-Fi",
    label: "Sci-Fi",
    emoji: "🚀",
    color: "#818cf8",
    grad: "linear-gradient(135deg,#7c3aed,#818cf8)",
    video: "https://media.istockphoto.com/id/1812865651/video/silhouette-of-a-man-looking-at-the-beauty-of-universe-stars-galaxy-milky-way-zoom-in-infinite.mp4?s=mp4-640x640-is&k=20&c=guJ-2YBrlOSUPo4A9-TtWybf_T9b783yKjjOx4Ls4qc=",
    tagline: "Beyond the stars & imagination",
    sub: "The universe awaits."
  },
  {
    genre: "Drama",
    label: "Drama",
    emoji: "🎭",
    color: "#38bdf8",
    grad: "linear-gradient(135deg,#0369a1,#38bdf8)",
    video: "https://media.istockphoto.com/id/999246074/video/storm-clouds-moving-time-lapse.mp4?s=mp4-640x640-is&k=20&c=6H75jjUqc_nlsVEfSUoMoCwjk2B1iTDD2I4j8KTzEtY=",
    tagline: "Stories that move the soul",
    sub: "Real. Raw. Human."
  },
  {
    genre: "Thriller",
    label: "Thriller",
    emoji: "🔪",
    color: "#fbbf24",
    grad: "linear-gradient(135deg,#b45309,#fbbf24)",
    video: "https://media.istockphoto.com/id/2155306081/video/a-person-is-walking-down-a-dark-hallway-with-dim-light-tenuously-shining-from-a-nearby-doorway.mp4?s=mp4-640x640-is&k=20&c=YPrXfgT8hr6pVukJlccYt0gPprNqrHQ0hR-c44kv-Hw=",
    tagline: "Heart-pounding suspense awaits",
    sub: "Every second counts."
  },
  {
    genre: "Romance",
    label: "Romance",
    emoji: "💕",
    color: "#f472b6",
    grad: "linear-gradient(135deg,#be185d,#f472b6)",
    video: "https://media.istockphoto.com/id/1453876668/video/close-up-rear-view-of-unrecognizable-young-couple-in-love-holding-hands-at-beautiful-summer.mp4?s=mp4-640x640-is&k=20&c=a2N6Zcz6NHKrj2a60ckGb69ArzXc264nAzqjNj4wjsg=",
    tagline: "Love stories worth watching",
    sub: "Timeless. Unforgettable."
  },
  {
    genre: "Comedy",
    label: "Comedy",
    emoji: "😂",
    color: "#f59e0b",
    grad: "linear-gradient(135deg,#d97706,#fde68a)",
    video: "https://media.istockphoto.com/id/1931482561/video/joyous-girls-laughing-on-bed-at-home-party.mp4?s=mp4-640x640-is&k=20&c=oSdMgGXm4tAUs6VcYL8-M0V_S6qW4FriAT-SlxYLSb8=",
    tagline: "Laugh till it hurts",
    sub: "Pure joy, guaranteed."
  },
  {
    genre: "Horror",
    label: "Horror",
    emoji: "👻",
    color: "#a78bfa",
    grad: "linear-gradient(135deg,#4c1d95,#a78bfa)",
    video: "https://media.istockphoto.com/id/1358923414/video/dark-hall-of-room-in-motel.mp4?s=mp4-640x640-is&k=20&c=H6l4YTdos0IilYUdht7ss0XnkZQzIAHPmmfBQWkrsns=",
    tagline: "Fear the unknown",
    sub: "Dare to watch alone."
  }
];

const INTERVAL_MS = 7000;

export default function Header({ theme }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ripples, setRipples] = useState([]);

  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const current = GENRE_VIDEOS[activeIndex];

  // Set per-genre playback speed (default 2x, Action is 0.75x)
  const setPlaybackRate = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = GENRE_VIDEOS[activeIndex].speed ?? 2.0;
    }
  }, [activeIndex]);

  // Animate progress bar
  const startProgress = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startTimeRef.current = Date.now();
    const tick = () => {
      const pct = Math.min(((Date.now() - startTimeRef.current) / INTERVAL_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Switch to genre with cross-fade
  const switchTo = useCallback((idx) => {
    if (idx === activeIndex || transitioning) return;
    clearInterval(timerRef.current);
    setTransitioning(true);
    setPrevIndex(activeIndex);

    setTimeout(() => {
      setActiveIndex(idx);
      setTransitioning(false);
      setPrevIndex(null);
      startProgress();
      // restart auto-rotate
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % GENRE_VIDEOS.length;
          setPrevIndex(prev);
          setTransitioning(true);
          setTimeout(() => { setTransitioning(false); setPrevIndex(null); startProgress(); }, 500);
          return next;
        });
      }, INTERVAL_MS);
    }, 450);
  }, [activeIndex, transitioning, startProgress]);

  // Initial auto-rotate
  useEffect(() => {
    startProgress();
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % GENRE_VIDEOS.length;
        setPrevIndex(prev);
        setTransitioning(true);
        setTimeout(() => { setTransitioning(false); setPrevIndex(null); startProgress(); }, 500);
        return next;
      });
    }, INTERVAL_MS);
    return () => { clearInterval(timerRef.current); cancelAnimationFrame(rafRef.current); };
  }, []);

  // Ripple effect on pill click
  const handlePillClick = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
    switchTo(idx);
  };

  return (
    <section className="header">
      {/* Video Stack — prev fades out, current fades in */}
      <div className="hero-video-wrapper">

        {/* Previous video (fades out during transition) */}
        {prevIndex !== null && (
          <video
            key={`prev-${GENRE_VIDEOS[prevIndex].video}`}
            className="hero-video leaving"
            autoPlay loop muted playsInline
          >
            <source src={GENRE_VIDEOS[prevIndex].video} type="video/mp4" />
          </video>
        )}

        {/* Current video */}
        <video
          ref={videoRef}
          key={`curr-${current.video}`}
          className={`hero-video entering ${transitioning ? "dim" : "bright"}`}
          autoPlay loop muted playsInline
          onLoadedData={setPlaybackRate}
          onCanPlay={setPlaybackRate}
        >
          <source src={current.video} type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="hero-overlay" />
        <div className="hero-wm-cover" />
        <div className="hero-scanlines" />
        <div
          className="hero-color-tint"
          style={{ background: `radial-gradient(ellipse at 30% 60%, ${current.color}22 0%, transparent 70%)` }}
        />

        {/* Spotlight sweep */}
        <div className="hero-spotlight" style={{ '--spot-color': current.color + '18' }} />

        {/* ── Hero Content ── */}
        <div className={`hero-content ${transitioning ? "content-exit" : "content-enter"}`}>
          {/* Genre badge */}
          <div
            className="hero-badge"
            style={{ background: current.grad, boxShadow: `0 4px 28px ${current.color}55` }}
          >
            <span className="badge-emoji">{current.emoji}</span>
            <span className="badge-text">{current.genre}</span>
          </div>

          {/* Main tagline */}
          <h1 className="hero-tagline">{current.tagline}</h1>

          {/* Subtitle */}
          <p className="hero-sub">{current.sub}</p>

          {/* CTA row */}
          <div className="hero-cta-row">
            <div className="hero-live-dot" style={{ background: current.color }} />
            <span className="hero-live-text" style={{ color: current.color }}>Now Streaming</span>
          </div>
        </div>

        {/* Genre Pill Selector */}
        <div className="hero-genre-selector">
          {GENRE_VIDEOS.map((item, idx) => (
            <button
              key={item.genre}
              type="button"
              className={`hero-genre-pill ${idx === activeIndex ? "active" : ""}`}
              style={idx === activeIndex ? {
                borderColor: item.color,
                color: '#fff',
                boxShadow: `0 0 20px ${item.color}66, 0 4px 16px rgba(0,0,0,0.5)`
              } : {}}
              onClick={(e) => handlePillClick(idx, e)}
            >
              {/* Ripple effects */}
              {ripples.filter(r => idx === activeIndex).map(r => (
                <span
                  key={r.id}
                  className="pill-ripple"
                  style={{ left: r.x, top: r.y, background: item.color }}
                />
              ))}

              <span className="pill-emoji">{item.emoji}</span>
              <span className="pill-label">{item.label}</span>

              {/* Active progress bar */}
              {idx === activeIndex && (
                <span
                  className="pill-progress"
                  style={{ width: `${progress}%`, background: item.color }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
