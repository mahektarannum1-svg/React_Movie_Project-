import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'cineverse_watchlist';

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist((prev) =>
      prev.find((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  }, []);

  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const toggleWatchlist = useCallback((movie) => {
    setWatchlist((prev) =>
      prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  }, []);

  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  return { watchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist, isInWatchlist };
}
