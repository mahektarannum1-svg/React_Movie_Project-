import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Header from './components/Header';
import TrendingSection from './components/Trending';
import ExplorerSection from './components/Explore';
import MovieModal from './components/MovieModal';
import WatchlistPanel from './components/WatchlistPanel';
import Footer from './components/Footer';
import useTheme from './hooks/useTheme';
import useWatchlist from './hooks/useWatchlist';
import './App.css';

const TMDB_API_KEY = "35a0084418ddb155aede7f9c0c9ad86f";

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlist();
  const [trending, setTrending] = useState([]);
  const [mainMovies, setMainMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => setTrending(data.results ? data.results.slice(0, 10) : []))
      .catch(err => console.error("Error fetching trending movies:", err));
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const query = searchTerm.trim();

    if (!query) {
      fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${TMDB_API_KEY}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setMainMovies(data.results || []);
            setSearching(false);
          }
        })
        .catch(err => console.error("Error fetching discover movies:", err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setSearching(true);
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setMainMovies(data.results || []);
          }
        })
        .catch(err => console.error("Error searching movies:", err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm.trim());
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearching(false);
  };

  return (
    <div className={`app ${theme}`}>
      <NavBar
        theme={theme}
        toggleTheme={toggleTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        searching={searching}
        clearSearch={clearSearch}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setWatchlistOpen(true)}
      />

      <Header theme={theme} />

      <TrendingSection
        trending={trending}
        theme={theme}
        setSelectedMovie={setSelectedMovie}
      />

      <ExplorerSection
        mainMovies={mainMovies}
        loading={loading}
        searching={searching}
        searchTerm={searchTerm}
        theme={theme}
        setSelectedMovie={setSelectedMovie}
        toggleWatchlist={toggleWatchlist}
        isInWatchlist={isInWatchlist}
      />

      {selectedMovie && (
        <MovieModal
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          theme={theme}
          toggleWatchlist={toggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      <WatchlistPanel
        watchlist={watchlist}
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        setSelectedMovie={setSelectedMovie}
        toggleWatchlist={toggleWatchlist}
        theme={theme}
      />

      <Footer theme={theme} />
    </div>
  );
}
