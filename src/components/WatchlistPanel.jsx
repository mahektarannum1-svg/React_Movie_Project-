import React from 'react';
import './WatchlistPanel.css';

export default function WatchlistPanel({ watchlist, isOpen, onClose, setSelectedMovie, toggleWatchlist, theme }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="wl-backdrop" onClick={onClose} />}

      {/* Slide-in panel */}
      <aside className={`wl-panel ${isOpen ? 'open' : ''} ${theme}`}>
        <div className="wl-header">
          <span className="wl-title">❤️ My Watchlist</span>
          <span className="wl-count">{watchlist.length}</span>
          <button className="wl-close" onClick={onClose} aria-label="Close watchlist">✕</button>
        </div>

        {watchlist.length === 0 ? (
          <div className="wl-empty">
            <div className="wl-empty-icon">🎬</div>
            <p>Your watchlist is empty.</p>
            <span>Click ❤️ on any movie to save it here.</span>
          </div>
        ) : (
          <ul className="wl-list">
            {watchlist.map((movie) => (
              <li key={movie.id} className="wl-item">
                <img
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                    : 'https://img.icons8.com/ios/100/image--v1.png'}
                  alt={movie.title}
                  className="wl-thumb"
                  onClick={() => { setSelectedMovie(movie); onClose(); }}
                />
                <div className="wl-meta" onClick={() => { setSelectedMovie(movie); onClose(); }}>
                  <span className="wl-movie-title">{movie.title}</span>
                  <span className="wl-movie-year">{movie.release_date?.slice(0, 4)}</span>
                  <span className="wl-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                </div>
                <button
                  className="wl-remove"
                  onClick={() => toggleWatchlist(movie)}
                  title="Remove from watchlist"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
