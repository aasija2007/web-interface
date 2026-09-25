import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Sun,
  Moon,
  Star,
  Activity,
  Calendar,
  Map as MapIcon,
  Cpu,
  History,
  Settings as SettingsIcon,
  Users,
  Compass,
  Mic,
  MicOff,
  Bell,
  Navigation,
  GitCompare,
  Download,
} from 'lucide-react';
import { searchCities } from '../services/weatherApi';
import { requestNotificationPermission } from '../services/notifications';

export default function Header({
  activeView,
  setActiveView,
  unit,
  toggleUnit,
  theme,
  toggleTheme,
  onSelectCity,
  onCurrentLocation,
  isFavoriteCurrent,
  onToggleFavoriteCurrent,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [notifGranted, setNotifGranted] = useState(
    'Notification' in window ? Notification.permission === 'granted' : false
  );
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);

  const searchRef = useRef(null);

  // Catch PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Autocomplete debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchCities(query);
        setSuggestions(results);
        setIsSearching(false);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Web Speech Voice Search API
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice Speech Recognition is not supported by your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (err) => {
      console.error('Speech error:', err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleRequestNotif = async () => {
    const result = await requestNotificationPermission();
    if (result === 'granted') {
      setNotifGranted(true);
      alert('✅ Real-time severe weather push notifications enabled!');
    } else {
      alert('Notification permission denied or unavailable.');
    }
  };

  const handleInstallPwa = () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredInstallPrompt(null);
        }
      });
    }
  };

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setShowDropdown(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'forecast', label: 'Forecast', icon: Calendar },
    { id: 'intelligence', label: 'Pulse AI', icon: Cpu },
    { id: 'map', label: 'Rain Radar', icon: MapIcon },
    { id: 'travel', label: 'Travel Planner', icon: Navigation },
    { id: 'compare', label: 'Compare Cities', icon: GitCompare },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'history', label: 'History', icon: History },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="navbar glass-panel">
      {/* Brand */}
      <div className="brand" onClick={() => setActiveView('dashboard')}>
        <div className="brand-icon">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <div className="brand-text">
          <span className="brand-title">WEATHER PULSE</span>
          <span className="brand-tagline">Real-Time Intelligence</span>
        </div>
      </div>

      {/* Expanded Search Input with Voice Search & Autocomplete */}
      <div className="search-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <Search className="w-5 h-5 text-secondary" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="search-input"
            placeholder={isListening ? 'Listening... Speak a city name...' : 'Search city or ask (e.g. Tokyo, Paris, New York)...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
          />
          {/* Voice Search Mic Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            title="Search by Voice (Web Speech API)"
            style={{
              background: 'transparent',
              border: 'none',
              color: isListening ? 'var(--accent-rose)' : 'var(--accent-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 animate-pulse text-rose" />
            ) : (
              <Mic className="w-5 h-5 text-cyan" />
            )}
          </button>

          {isSearching && <span className="text-xs text-secondary animate-pulse">Searching...</span>}
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((item) => (
              <div key={item.id} className="suggestion-item" onClick={() => handleSelect(item)}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {item.admin1 ? `${item.admin1}, ` : ''}
                    {item.country}
                  </div>
                </div>
                <MapPin className="w-4 h-4 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <IconComponent className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Actions (Notifications, PWA Install, Geolocation, Favorites, Units, Theme) */}
      <div className="nav-actions">
        {deferredInstallPrompt && (
          <button
            className="icon-btn"
            title="Install Weather Pulse App (PWA)"
            onClick={handleInstallPwa}
            style={{ borderColor: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.2)' }}
          >
            <Download className="w-4 h-4 text-cyan animate-bounce" style={{ color: 'var(--accent-cyan)' }} />
          </button>
        )}

        <button
          className="icon-btn"
          title={notifGranted ? 'Push Notifications Enabled' : 'Enable Severe Weather Notifications'}
          onClick={handleRequestNotif}
        >
          <Bell
            className="w-4 h-4"
            style={{
              color: notifGranted ? 'var(--accent-emerald)' : 'var(--text-secondary)',
              fill: notifGranted ? 'var(--accent-emerald)' : 'none',
            }}
          />
        </button>

        <button
          className="icon-btn"
          title="Detect Current Location"
          onClick={onCurrentLocation}
        >
          <MapPin className="w-4 h-4 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
        </button>

        <button
          className="icon-btn"
          title={isFavoriteCurrent ? 'Remove from favorites' : 'Add to favorites'}
          onClick={onToggleFavoriteCurrent}
        >
          <Star
            className="w-4 h-4"
            style={{
              color: isFavoriteCurrent ? 'var(--accent-amber)' : 'var(--text-secondary)',
              fill: isFavoriteCurrent ? 'var(--accent-amber)' : 'none',
            }}
          />
        </button>

        <div className="unit-toggle">
          <button
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => unit !== 'C' && toggleUnit()}
          >
            °C
          </button>
          <button
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => unit !== 'F' && toggleUnit()}
          >
            °F
          </button>
        </div>

        <button
          className="icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} />
          ) : (
            <Moon className="w-4 h-4" style={{ color: 'var(--accent-indigo)' }} />
          )}
        </button>
      </div>
    </header>
  );
}
