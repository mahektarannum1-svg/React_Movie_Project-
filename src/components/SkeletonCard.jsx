import React from 'react';
import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster shimmer" />
      <div className="skeleton-info">
        <div className="skeleton-line long shimmer" />
        <div className="skeleton-line short shimmer" />
        <div className="skeleton-line medium shimmer" />
      </div>
    </div>
  );
}
