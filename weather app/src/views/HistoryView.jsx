import React from 'react';
import { History, Trash2, MapPin, Clock, HardDrive } from 'lucide-react';
import { getSearchHistory, clearSearchHistory, getCachedWeather } from '../services/storage';

export default function HistoryView({ onSelectCity, setHistoryState }) {
  const history = getSearchHistory();
  const cached = getCachedWeather();

  const handleClear = () => {
    clearSearchHistory();
    if (setHistoryState) setHistoryState([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History className="w-6 h-6 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <span>Weather Search History & Offline Cache Log</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track previous city lookups, access cached snapshots offline, and audit weather history
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="nav-btn"
            style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Offline Cached Weather Snapshot Card */}
      {cached && cached.data && (
        <div className="glass-panel" style={{ padding: '1.5rem', borderColor: 'var(--accent-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            <HardDrive className="w-5 h-5 text-blue" style={{ color: 'var(--accent-blue)' }} />
            <span>LAST CACHED OFFLINE SNAPSHOT</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Cached at: {new Date(cached.cachedAt).toLocaleString()}
          </div>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{cached.data.cityName}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {cached.data.current.temp}°C • {cached.data.current.meta.description}
              </div>
            </div>
            <button
              className="nav-btn active"
              onClick={() => onSelectCity({ name: cached.data.cityName, lat: cached.data.lat, lon: cached.data.lon })}
            >
              Load Cached Snapshot
            </button>
          </div>
        </div>
      )}

      {/* Search History List */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem' }}>REVIEWS & SEARCH LOGS</div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No recent search history stored. Search cities using the top bar to build your lookup history!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {history.map((item, idx) => (
              <div
                key={idx}
                className="glass-card"
                onClick={() => onSelectCity(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin className="w-5 h-5 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Lat: {item.lat.toFixed(2)}, Lon: {item.lon.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="nav-btn" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Switch →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
