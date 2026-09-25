import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storage';

export default function SettingsView({ unit, toggleUnit, theme, toggleTheme }) {
  const [settings, setLocalSettings] = useState(getSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  const handleWindUnitChange = (windUnit) => {
    const updated = saveSettings({ windUnit });
    setLocalSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleClearCache = () => {
    localStorage.removeItem('weather_pulse_cache');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
      {/* Title */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SettingsIcon className="w-6 h-6 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <span>Weather Pulse Configuration & Preferences</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Customize temperature units, wind metrics, system theme, and local cache management
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 className="w-5 h-5" />
          <span>Preferences updated and saved!</span>
        </div>
      )}

      {/* Preferences Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Temperature Unit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Temperature Unit</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Celsius (°C) or Fahrenheit (°F)</div>
          </div>
          <div className="unit-toggle">
            <button className={`unit-btn ${unit === 'C' ? 'active' : ''}`} onClick={() => unit !== 'C' && toggleUnit()}>
              Celsius (°C)
            </button>
            <button className={`unit-btn ${unit === 'F' ? 'active' : ''}`} onClick={() => unit !== 'F' && toggleUnit()}>
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-glass)' }} />

        {/* Theme Preference */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Interface Theme Mode</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cyber Dark Futuristic or Clean Light</div>
          </div>
          <button className="nav-btn active" onClick={toggleTheme}>
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>{theme === 'dark' ? 'Dark Futuristic' : 'Clean Light'}</span>
          </button>
        </div>

        <hr style={{ borderColor: 'var(--border-glass)' }} />

        {/* Wind Speed Units */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Wind Speed Display Metric</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Kilometers per hour (km/h) or Miles per hour (mph)</div>
          </div>
          <div className="unit-toggle">
            <button
              className={`unit-btn ${settings.windUnit === 'kmh' ? 'active' : ''}`}
              onClick={() => handleWindUnitChange('kmh')}
            >
              km/h
            </button>
            <button
              className={`unit-btn ${settings.windUnit === 'mph' ? 'active' : ''}`}
              onClick={() => handleWindUnitChange('mph')}
            >
              mph
            </button>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-glass)' }} />

        {/* Clear Local Cache */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Local Data & Offline Cache</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Clear stored offline weather snapshots and history</div>
          </div>
          <button className="nav-btn" style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }} onClick={handleClearCache}>
            <Trash2 className="w-4 h-4" />
            <span>Purge Offline Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
}
