import React, { useState, useRef } from "react";
import "./NavBar.css";

export default function NavBar({
  theme,
  toggleTheme,
  searchTerm,
  setSearchTerm,
  handleSearch,
  searching,
  clearSearch,
  watchlistCount,
  onOpenWatchlist,
}) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <nav className={`navbar ${theme}`}>
      {/* Brand */}
      <div className="navbar-brand">
        <div className="brand-icon">▶</div>
        <span className="navbar-logo">
          <span className="logo-cine">Cine</span>
          <span className="logo-verse">Verse</span>
        </span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="navbar-search-form">
        <div className={`search-container ${focused ? "focused" : ""} ${theme}`}>
          <svg
            className={`search-icon ${focused ? "icon-active" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ cursor: "pointer" }}
            onClick={() => inputRef.current?.focus()}
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies, genres, actors…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="search-input"
            autoComplete="off"
            spellCheck="false"
          />

          {searchTerm ? (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
              title="Clear"
            >
              ✕
            </button>
          ) : focused ? (
            <span className="search-hint">Press Enter ↵</span>
          ) : null}
        </div>
      </form>

      {/* Right Controls */}
      <div className="navbar-right">
        {/* Watchlist Trigger */}
        <button
          className={`nav-wl-trigger ${theme}`}
          onClick={onOpenWatchlist}
          title="Open Watchlist"
          type="button"
        >
          <span className="wl-trigger-icon">❤️</span>
          {watchlistCount > 0 && (
            <span className="wl-trigger-badge">{watchlistCount}</span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          type="button"
        >
          <span className="toggle-track">
            <span className="toggle-thumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </span>
        </button>
      </div>
    </nav>
  );
}
