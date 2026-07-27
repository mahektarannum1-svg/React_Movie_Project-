import React, { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';
import SkeletonCard from './SkeletonCard';
import useScrollReveal from '../hooks/useScrollReveal';
import './Explore.css';

const TMDB_API_KEY = "35a0084418ddb155aede7f9c0c9ad86f";

const GENRES = [
  { id: '', name: 'All' },
  { id: 28, name: '🎬 Action' },
  { id: 35, name: '😂 Comedy' },
  { id: 18, name: '🎭 Drama' },
  { id: 27, name: '👻 Horror' },
  { id: 10749, name: '💕 Romance' },
  { id: 878, name: '🚀 Sci-Fi' },
  { id: 53, name: '🔪 Thriller' },
  { id: 16, name: '🎨 Animation' },
  { id: 12, name: '🌍 Adventure' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: '🔥 Most Popular' },
  { value: 'vote_average.desc', label: '⭐ Top Rated' },
  { value: 'release_date.desc', label: '🆕 Newest' },
  { value: 'revenue.desc', label: '💰 Highest Grossing' },
];

export default function ExplorerSection({
  mainMovies,
  loading,
  searching,
  searchTerm,
  theme,
  setSelectedMovie,
  toggleWatchlist,
  isInWatchlist,
}) {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allMovies, setAllMovies] = useState([]);
  const loaderRef = useRef(null);
  const [sectionRef, sectionVisible] = useScrollReveal(0.05);

  // When genre/sort changes (not searching), fetch from TMDB
  useEffect(() => {
    if (searchTerm.trim()) return;
    setPage(1);
    setAllMovies([]);
    setHasMore(true);
    fetchFiltered(1, true);
  }, [selectedGenre, sortBy, searchTerm]);

  // When search results come in, use them directly
  useEffect(() => {
    if (searchTerm.trim()) {
      setAllMovies(mainMovies);
      setHasMore(false);
    }
  }, [mainMovies, searchTerm]);

  const fetchFiltered = async (pg, reset = false) => {
    setFilterLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=${sortBy}&page=${pg}&vote_count.gte=100`;
      if (selectedGenre) url += `&with_genres=${selectedGenre}`;
      const res = await fetch(url);
      const data = await res.json();
      const results = data.results || [];
      setAllMovies((prev) => {
        const combined = reset ? results : [...prev, ...results];
        const seen = new Set();
        return combined.filter((movie) => {
          if (seen.has(movie.id)) return false;
          seen.add(movie.id);
          return true;
        });
      });
      setHasMore(pg < (data.total_pages || 1) && pg < 10);
    } catch (e) {
      console.error(e);
    } finally {
      setFilterLoading(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    if (searching || searchTerm.trim()) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !filterLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchFiltered(nextPage);
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, filterLoading, page, searching, searchTerm]);

  const isLoading = loading || filterLoading;
  const displayMoviesRaw = searchTerm.trim() ? mainMovies : allMovies;
  const seenIds = new Set();
  const displayMovies = displayMoviesRaw.filter((movie) => {
    if (!movie.id || seenIds.has(movie.id)) return false;
    seenIds.add(movie.id);
    return true;
  });

  return (
    <section
      ref={sectionRef}
      className={`explorer-section ${sectionVisible ? 'reveal' : ''}`}
    >
      {/* ── Section header ── */}
      <div className="explorer-header">
        <h2 className="explorer-title">
          {searchTerm.trim()
            ? <>Search Results {mainMovies.length > 0
                ? <span className="results-for">for "{searchTerm}"</span>
                : <span className="results-for">(0 results for "{searchTerm}")</span>}
              </>
            : 'Explore'}
        </h2>

        {/* Sort dropdown — only when not searching */}
        {!searchTerm.trim() && (
          <div className="sort-wrapper">
            <select
              className={`sort-select ${theme}`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Genre filter chips ── */}
      {!searchTerm.trim() && (
        <div className="genre-chips">
          {GENRES.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`genre-chip ${theme} ${selectedGenre === g.id ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Skeleton loading ── */}
      {isLoading && allMovies.length === 0 && (
        <div className="explorer-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Movie grid ── */}
      <div className="explorer-grid">
        {!isLoading && displayMovies.length === 0 && (
          <p className={`no-results ${theme}`}>
            {searching ? 'No results found.' : 'No movies found.'}
          </p>
        )}

        {displayMovies.map((movie, idx) => (
          <MovieCard
            key={`${movie.id}-${idx}`}
            movie={movie}
            theme={theme}
            setSelectedMovie={setSelectedMovie}
            toggleWatchlist={toggleWatchlist}
            isInWatchlist={isInWatchlist}
          />
        ))}

        {/* Skeleton rows for loading more */}
        {filterLoading && allMovies.length > 0 &&
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)
        }
      </div>

      {/* ── Infinite scroll sentinel ── */}
      {!searchTerm.trim() && hasMore && (
        <div ref={loaderRef} className="scroll-sentinel" />
      )}
    </section>
  );
}

/* ── Movie Card with hover reveal + watchlist ── */
function MovieCard({ movie, theme, setSelectedMovie, toggleWatchlist, isInWatchlist }) {
  const inList = isInWatchlist(movie.id);
  const [cardRef, cardVisible] = useScrollReveal(0.05);

  return (
    <div
      ref={cardRef}
      className={`movie-card ${cardVisible ? 'card-visible' : ''}`}
      onClick={() => setSelectedMovie(movie)}
      title={movie.title}
    >
      <img
        src={movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://img.icons8.com/ios/200/image--v1.png'}
        alt={movie.title}
        className="movie-poster"
        loading="lazy"
        draggable="false"
      />

      {/* Watchlist heart */}
      <button
        className={`card-wl-btn ${inList ? 'in-list' : ''}`}
        onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie); }}
        title={inList ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {inList ? '❤️' : '🤍'}
      </button>

      {/* Hover reveal overlay */}
      <div className="movie-hover-reveal">
        <h3 className="movie-title">{movie.title}</h3>
        <StarRating rating={movie.vote_average} />
        <p className="movie-overview">{movie.overview?.slice(0, 120)}{movie.overview?.length > 120 ? '…' : ''}</p>
        <span className="movie-date">{movie.release_date?.slice(0, 4)}</span>
      </div>

      {/* Always-visible bottom bar */}
      <div className="movie-info">
        <h2 className="movie-title-bar">{movie.title}</h2>
      </div>
    </div>
  );
}
