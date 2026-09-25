import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DynamicBackground from './components/DynamicBackground';
import DashboardSkeleton from './components/LoadingSkeleton';

import DashboardView from './views/DashboardView';
import ForecastView from './views/ForecastView';
import IntelligenceView from './views/IntelligenceView';
import MapView from './views/MapView';
import TravelPlannerView from './views/TravelPlannerView';
import CompareView from './views/CompareView';
import HistoryView from './views/HistoryView';
import FavoritesView from './views/FavoritesView';
import CommunityView from './views/CommunityView';
import SettingsView from './views/SettingsView';

import { fetchFullWeather, getCityByCoords } from './services/weatherApi';
import { generatePulseAI } from './services/pulseAI';
import { checkAndTriggerSevereAlerts } from './services/notifications';
import {
  getSettings,
  saveSettings,
  isFavorite,
  saveFavorite,
  removeFavorite,
  addSearchHistory,
  getCachedWeather,
  setCachedWeather,
} from './services/storage';

export default function App() {
  const settings = getSettings();
  const [activeView, setActiveView] = useState('dashboard');
  const [unit, setUnit] = useState(settings.unit || 'C');
  const [theme, setTheme] = useState(settings.theme || 'dark');

  // Location & Weather State
  const [currentCity, setCurrentCity] = useState({
    name: 'London',
    lat: 51.5074,
    lon: -0.1278,
  });

  const [weatherData, setWeatherData] = useState(null);
  const [pulseAI, setPulseAI] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('ServiceWorker registered:', reg.scope))
        .catch((err) => console.error('ServiceWorker error:', err));
    }
  }, []);

  // Sync Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveSettings({ theme });
  }, [theme]);

  // Load weather when city changes
  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFullWeather(currentCity.lat, currentCity.lon, currentCity.name);
        if (!isMounted) return;

        setWeatherData(data);
        const aiResults = generatePulseAI(data);
        setPulseAI(aiResults);
        setCachedWeather(data);

        // Check severe weather for native Web Push Notifications
        if (aiResults && aiResults.alerts) {
          checkAndTriggerSevereAlerts(aiResults.alerts);
        }

        // Record in search history
        addSearchHistory({
          name: data.cityName,
          lat: data.lat,
          lon: data.lon,
        });

        setIsFav(isFavorite(data.lat, data.lon));
      } catch (err) {
        console.error('Weather load error:', err);
        if (!isMounted) return;

        // Try loading from offline cache if available
        const cached = getCachedWeather();
        if (cached && cached.data) {
          setWeatherData(cached.data);
          setPulseAI(generatePulseAI(cached.data));
          setError('Network disconnected. Displaying cached weather snapshot.');
        } else {
          setError('Unable to fetch weather data. Please check connection and try again.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [currentCity]);

  // Toggle Favorite
  const handleToggleFavoriteCurrent = () => {
    if (!weatherData) return;
    if (isFav) {
      removeFavorite(weatherData.lat, weatherData.lon);
      setIsFav(false);
    } else {
      saveFavorite({
        id: `${weatherData.lat}-${weatherData.lon}`,
        name: weatherData.cityName,
        country: '',
        lat: weatherData.lat,
        lon: weatherData.lon,
      });
      setIsFav(true);
    }
  };

  // Unit Convert Helper
  const convertTemp = (tempC) => {
    if (tempC === null || tempC === undefined) return 0;
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const toggleUnit = () => {
    const nextUnit = unit === 'C' ? 'F' : 'C';
    setUnit(nextUnit);
    saveSettings({ unit: nextUnit });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Browser Geolocation
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const locMeta = await getCityByCoords(latitude, longitude);
        setCurrentCity({
          name: locMeta.name,
          lat: latitude,
          lon: longitude,
        });
      },
      (err) => {
        setLoading(false);
        alert('Could not access current location. Please allow geolocation permission.');
      }
    );
  };

  const handleSelectCity = (cityItem) => {
    setCurrentCity({
      name: cityItem.name,
      lat: cityItem.lat,
      lon: cityItem.lon,
    });
  };

  // Dynamic Background Type based on weather code & day/night
  const bgType = weatherData?.current?.meta?.bg || 'sunny';

  return (
    <div className="app-container">
      {/* Animated Dynamic Weather Background */}
      <DynamicBackground bgType={bgType} />

      {/* Top Navbar Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        unit={unit}
        toggleUnit={toggleUnit}
        theme={theme}
        toggleTheme={toggleTheme}
        onSelectCity={handleSelectCity}
        onCurrentLocation={handleCurrentLocation}
        isFavoriteCurrent={isFav}
        onToggleFavoriteCurrent={handleToggleFavoriteCurrent}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {error && (
              <div
                className="glass-card"
                style={{
                  background: 'rgba(244, 63, 94, 0.2)',
                  borderColor: 'var(--accent-rose)',
                  color: 'var(--accent-rose)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>⚠️ {error}</span>
                <button className="nav-btn" onClick={() => setCurrentCity({ ...currentCity })}>
                  Retry
                </button>
              </div>
            )}

            {activeView === 'dashboard' && (
              <DashboardView
                weatherData={weatherData}
                pulseAI={pulseAI}
                unit={unit}
                convertTemp={convertTemp}
                setActiveView={setActiveView}
              />
            )}

            {activeView === 'forecast' && (
              <ForecastView weatherData={weatherData} unit={unit} convertTemp={convertTemp} />
            )}

            {activeView === 'intelligence' && (
              <IntelligenceView
                weatherData={weatherData}
                pulseAI={pulseAI}
                unit={unit}
                convertTemp={convertTemp}
              />
            )}

            {activeView === 'map' && (
              <MapView weatherData={weatherData} unit={unit} convertTemp={convertTemp} />
            )}

            {activeView === 'travel' && (
              <TravelPlannerView currentCity={currentCity} convertTemp={convertTemp} unit={unit} />
            )}

            {activeView === 'compare' && (
              <CompareView currentCity={currentCity} convertTemp={convertTemp} unit={unit} />
            )}

            {activeView === 'history' && (
              <HistoryView onSelectCity={handleSelectCity} />
            )}

            {activeView === 'favorites' && (
              <FavoritesView onSelectCity={handleSelectCity} />
            )}

            {activeView === 'community' && (
              <CommunityView weatherData={weatherData} />
            )}

            {activeView === 'settings' && (
              <SettingsView
                unit={unit}
                toggleUnit={toggleUnit}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
