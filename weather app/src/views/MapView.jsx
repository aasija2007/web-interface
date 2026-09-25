import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers, CloudRain, Play, Pause, RefreshCw, MapPin } from 'lucide-react';
import { getCommunityReports } from '../services/storage';

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 9);
    }
  }, [lat, lon, map]);
  return null;
}

export default function MapView({ weatherData, unit, convertTemp }) {
  if (!weatherData) return null;

  const { lat, lon, cityName, current } = weatherData;
  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar', 'clouds', 'temp'
  const [radarTimestamps, setRadarTimestamps] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const reports = getCommunityReports();

  // Fetch RainViewer Doppler Radar Timestamps
  useEffect(() => {
    async function fetchRadarData() {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (res.ok) {
          const data = await res.json();
          if (data.radar && data.radar.past) {
            const pastFrames = data.radar.past.map((f) => f.time);
            setRadarTimestamps(pastFrames);
            setCurrentFrameIdx(pastFrames.length - 1);
          }
        }
      } catch (e) {
        console.error('Failed to load RainViewer radar frames:', e);
      }
    }
    fetchRadarData();
  }, []);

  // Radar Animation Loop
  useEffect(() => {
    let interval;
    if (isPlaying && radarTimestamps.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % radarTimestamps.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, radarTimestamps]);

  const activeTimestamp = radarTimestamps[currentFrameIdx];
  const radarTileUrl = activeTimestamp
    ? `https://tilecache.rainviewer.com/v2/radar/${activeTimestamp}/256/{z}/{x}/{y}/2/1_1.png`
    : null;

  const createCustomIcon = (color = '#06B6D4', label = '') => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          background: ${color};
          color: white;
          padding: 6px 10px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          border: 2px solid white;
          white-space: nowrap;
        ">
          ${label}
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Controls */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CloudRain className="w-6 h-6 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <span>LIVE RAIN RADAR & ATMOSPHERIC MAP</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time Doppler precipitation movement, satellite clouds, and community weather pins
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {activeLayer === 'radar' && radarTimestamps.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '10px' }}>
              <button
                className="icon-btn"
                style={{ width: 32, height: 32 }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-cyan" /> : <Play className="w-4 h-4 text-cyan" />}
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Frame {currentFrameIdx + 1}/{radarTimestamps.length} ({activeTimestamp ? new Date(activeTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''})
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
            <button
              className={`nav-btn ${activeLayer === 'radar' ? 'active' : ''}`}
              onClick={() => setActiveLayer('radar')}
            >
              <CloudRain className="w-4 h-4" />
              <span>Live Doppler Radar</span>
            </button>
            <button
              className={`nav-btn ${activeLayer === 'clouds' ? 'active' : ''}`}
              onClick={() => setActiveLayer('clouds')}
            >
              <Layers className="w-4 h-4" />
              <span>Clouds</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="glass-panel" style={{ height: '620px', padding: '0.75rem', position: 'relative', overflow: 'hidden' }}>
        <MapContainer center={[lat, lon]} zoom={9} style={{ height: '100%', width: '100%', borderRadius: '14px' }}>
          {/* Base OpenStreetMap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Live Doppler Radar Overlay Tile from RainViewer */}
          {activeLayer === 'radar' && radarTileUrl && (
            <TileLayer
              key={activeTimestamp}
              url={radarTileUrl}
              opacity={0.7}
              zIndex={10}
            />
          )}

          <RecenterMap lat={lat} lon={lon} />

          {/* Active Location Marker */}
          <Marker
            position={[lat, lon]}
            icon={createCustomIcon('#06B6D4', `${cityName}: ${convertTemp(current.temp)}°${unit}`)}
          >
            <Popup>
              <div style={{ color: '#0f172a', padding: '4px' }}>
                <strong style={{ fontSize: '14px' }}>{cityName}</strong>
                <div>Temp: {convertTemp(current.temp)}°{unit} ({current.meta.description})</div>
                <div>Humidity: {current.humidity}% | Wind: {current.windSpeed} km/h</div>
              </div>
            </Popup>
          </Marker>

          {/* Community Report Pins */}
          {reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lon]}
              icon={createCustomIcon('#8B5CF6', `📌 ${report.condition}`)}
            >
              <Popup>
                <div style={{ color: '#0f172a', padding: '4px' }}>
                  <strong style={{ fontSize: '13px', color: '#8B5CF6' }}>COMMUNITY REPORT</strong>
                  <div><strong>{report.cityName}</strong> - {report.condition}</div>
                  <div style={{ fontStyle: 'italic', marginTop: '4px' }}>"{report.note}"</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    By @{report.user} • 👍 {report.upvotes} upvotes
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
