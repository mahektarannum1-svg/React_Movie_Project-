export default function SearchBar({ searchQuery, onSearchChange, placeholder = 'Search movies, actors, genres...' }) {
  const handleClear = () => {
    onSearchChange('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className="search-bar-container">
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search movies"
      />
      {searchQuery && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search query"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}
