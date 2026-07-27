import React from 'react';
import './Trending.css';

export default function TrendingSection({ trending, theme, setSelectedMovie }) {
    return (
        <section className="trending-section">
            <h2 className={`trending-title ${theme}`}>
                Trending Now
            </h2>
            <div className="trending-container">
                {trending.map((movie, idx) => (
                    <div key={movie.id} className="trending-item">
                        <div className={`trending-number ${theme}`}>
                            {idx + 1}
                        </div>
                        <div className="trending-poster-container">
                            <img
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : "https://img.icons8.com/ios/200/image--v1.png"}
                                alt={movie.title}
                                className="trending-poster"
                                draggable="false"
                                onClick={() => setSelectedMovie(movie)}
                                title={movie.title}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
