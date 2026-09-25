import React from 'react';
import { Star, MapPin, Trash2, ArrowUpRight } from 'lucide-react';
import { getFavorites, removeFavorite } from '../services/storage';

export default function FavoritesView({ onSelectCity, onFavoritesChange }) {
  const favorites = getFavorites();

  const handleRemove = (e, lat, lon) => {
    e.stopPropagation();
    const updated = removeFavorite(lat, lon);
    if (onFavoritesChange) onFavoritesChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Star className="w-6 h-6 text-amber" style={{ color: 'var(--accent-amber)', fill: 'var(--accent-amber)' }} />
            <span>Favourite Cities & Saved Hubs</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Quickly monitor meteorological conditions across your favorite locations worldwide
          </p>
        </div>
        <span className="badge badge-warning">{favorites.length} Cities Saved</span>
      </div>

      {/* Grid of Favorites */}
      {favorites.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No favorite cities saved yet. Click the star icon on any city header to bookmark it here!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {favorites.map((city, idx) => (
            <div
              key={idx}
              className="glass-card"
              onClick={() => onSelectCity(city)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                minHeight: 160,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin className="w-5 h-5 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{city.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{city.country}</div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleRemove(e, city.lat, city.lon)}
                  title="Remove from favorites"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  View Live Dashboard <ArrowUpRight className="w-4 h-4" />
                </span>
                <span className="badge badge-cyan">Saved</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
