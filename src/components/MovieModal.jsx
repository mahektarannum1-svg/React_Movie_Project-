import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import "./MovieModal.css";

const TMDB_API_KEY = "35a0084418ddb155aede7f9c0c9ad86f";

export default function MovieModal({ selectedMovie, setSelectedMovie, theme, toggleWatchlist, isInWatchlist }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(true);
  const [activeTab, setActiveTab] = useState("info"); // "info" | "trailer"
  const [inList, setInList] = useState(false);

  useEffect(() => {
    setInList(isInWatchlist(selectedMovie.id));
  }, [selectedMovie.id, isInWatchlist]);

  useEffect(() => {
    setTrailerKey(null);
    setLoadingTrailer(true);
    setActiveTab("info");

    fetch(`https://api.themoviedb.org/3/movie/${selectedMovie.id}/videos?api_key=${TMDB_API_KEY}`)
      .then((r) => r.json())
      .then((data) => {
        const trailer = (data.results || []).find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        );
        setTrailerKey(trailer?.key || null);
      })
      .catch(() => setTrailerKey(null))
      .finally(() => setLoadingTrailer(false));
  }, [selectedMovie.id]);

  const handleToggleWatchlist = () => {
    toggleWatchlist(selectedMovie);
    setInList((p) => !p);
  };

  const backdrop = selectedMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}`
    : null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
      <div className={`modal-content ${theme}`} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="modal-close" onClick={() => setSelectedMovie(null)} aria-label="Close">✕</button>

        {/* Backdrop image */}
        {backdrop && activeTab === "info" && (
          <div className="modal-backdrop" style={{ backgroundImage: `url(${backdrop})` }}>
            <div className="modal-backdrop-overlay" />
          </div>
        )}

        {/* Tab bar */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >🎬 Info</button>
          <button
            className={`modal-tab ${activeTab === "trailer" ? "active" : ""} ${!trailerKey && !loadingTrailer ? "disabled" : ""}`}
            onClick={() => trailerKey && setActiveTab("trailer")}
            disabled={!trailerKey && !loadingTrailer}
            title={!trailerKey && !loadingTrailer ? "No trailer available" : "Watch trailer"}
          >
            {loadingTrailer ? "⏳ Trailer" : trailerKey ? "▶ Trailer" : "🚫 No Trailer"}
          </button>
        </div>

        {/* Trailer */}
        {activeTab === "trailer" && trailerKey && (
          <div className="modal-trailer-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={`${selectedMovie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="modal-trailer-iframe"
            />
          </div>
        )}

        {/* Info */}
        {activeTab === "info" && (
          <div className="modal-body">
            <div className="modal-top-row">
              <img
                src={`https://image.tmdb.org/t/p/w342${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="modal-poster"
              />
              <div className="modal-details">
                <h2 className="modal-title">{selectedMovie.title}</h2>
                <StarRating rating={selectedMovie.vote_average} />
                <p className="modal-meta">
                  <span className="modal-label">Released</span>
                  <span>{selectedMovie.release_date || "N/A"}</span>
                </p>
                <p className="modal-meta">
                  <span className="modal-label">Rating</span>
                  <span>{selectedMovie.vote_average?.toFixed(1)} / 10</span>
                </p>
                <p className="modal-meta">
                  <span className="modal-label">Votes</span>
                  <span>{selectedMovie.vote_count?.toLocaleString()}</span>
                </p>

                {/* Watchlist button */}
                <button
                  className={`modal-wl-btn ${inList ? "in-list" : ""}`}
                  onClick={handleToggleWatchlist}
                >
                  {inList ? "❤️ In Watchlist" : "🤍 Add to Watchlist"}
                </button>
              </div>
            </div>

            <div className="modal-overview">
              {selectedMovie.overview || "No overview available."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
