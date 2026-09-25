// LocalStorage helper for Weather Pulse

const KEYS = {
  FAVORITES: 'weather_pulse_favorites',
  SEARCH_HISTORY: 'weather_pulse_history',
  COMMUNITY_REPORTS: 'weather_pulse_reports',
  WEATHER_CACHE: 'weather_pulse_cache',
  SETTINGS: 'weather_pulse_settings',
};

// Default Settings
export const DEFAULT_SETTINGS = {
  unit: 'C', // 'C' or 'F'
  windUnit: 'kmh', // 'kmh', 'mph', 'ms'
  theme: 'dark', // 'dark' or 'light'
  defaultCity: 'London',
  defaultCoords: { lat: 51.5074, lon: -0.1278, name: 'London, United Kingdom' },
};

// Favorites
export const getFavorites = () => {
  try {
    const data = localStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [
      { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
      { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
      { id: 'newyork', name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
      { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
    ];
  } catch (e) {
    return [];
  }
};

export const saveFavorite = (city) => {
  try {
    const favorites = getFavorites();
    const exists = favorites.some((f) => f.lat === city.lat && f.lon === city.lon);
    if (!exists) {
      const updated = [city, ...favorites];
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    }
    return favorites;
  } catch (e) {
    return [];
  }
};

export const removeFavorite = (lat, lon) => {
  try {
    const favorites = getFavorites();
    const updated = favorites.filter((f) => f.lat !== lat || f.lon !== lon);
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const isFavorite = (lat, lon) => {
  const favorites = getFavorites();
  return favorites.some((f) => Math.abs(f.lat - lat) < 0.05 && Math.abs(f.lon - lon) < 0.05);
};

// Search History
export const getSearchHistory = () => {
  try {
    const data = localStorage.getItem(KEYS.SEARCH_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const addSearchHistory = (searchItem) => {
  try {
    const history = getSearchHistory();
    // Filter duplicates
    const filtered = history.filter((item) => item.name !== searchItem.name);
    const updated = [{ ...searchItem, timestamp: new Date().toISOString() }, ...filtered].slice(0, 15);
    localStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(KEYS.SEARCH_HISTORY);
    return [];
  } catch (e) {
    return [];
  }
};

// Community Reports
export const getCommunityReports = () => {
  try {
    const data = localStorage.getItem(KEYS.COMMUNITY_REPORTS);
    return data ? JSON.parse(data) : [
      {
        id: '1',
        cityName: 'London',
        lat: 51.5074,
        lon: -0.1278,
        condition: 'Heavy Rain',
        severity: 'Moderate',
        note: 'Puddles forming near Westminster subway exit.',
        user: 'SkyWatcher99',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        upvotes: 12,
      },
      {
        id: '2',
        cityName: 'Tokyo',
        lat: 35.6762,
        lon: 139.6503,
        condition: 'Clear Sky & Cool Wind',
        severity: 'Mild',
        note: 'Great visibility around Shibuya crossing right now!',
        user: 'MetroTraveler',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        upvotes: 24,
      },
      {
        id: '3',
        cityName: 'New York',
        lat: 40.7128,
        lon: -74.0060,
        condition: 'Dense Fog',
        severity: 'Warning',
        note: 'Low visibility on East River Bridges. Drive carefully.',
        user: 'CommuterAlex',
        timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
        upvotes: 18,
      },
    ];
  } catch (e) {
    return [];
  }
};

export const addCommunityReport = (report) => {
  try {
    const reports = getCommunityReports();
    const newReport = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      upvotes: 1,
      ...report,
    };
    const updated = [newReport, ...reports];
    localStorage.setItem(KEYS.COMMUNITY_REPORTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const upvoteReport = (reportId) => {
  try {
    const reports = getCommunityReports();
    const updated = reports.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r));
    localStorage.setItem(KEYS.COMMUNITY_REPORTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

// Weather Cache for offline support
export const getCachedWeather = () => {
  try {
    const data = localStorage.getItem(KEYS.WEATHER_CACHE);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setCachedWeather = (weatherData) => {
  try {
    localStorage.setItem(
      KEYS.WEATHER_CACHE,
      JSON.stringify({
        data: weatherData,
        cachedAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.error('Cache save error', e);
  }
};

// Settings
export const getSettings = () => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (newSettings) => {
  try {
    const current = getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};
