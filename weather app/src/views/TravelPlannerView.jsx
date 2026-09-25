import React, { useState } from 'react';
import { Navigation, MapPin, Car, ShieldAlert, Clock, ArrowRight, CheckCircle2, CloudRain } from 'lucide-react';
import { fetchFullWeather, searchCities } from '../services/weatherApi';

export default function TravelPlannerView({ currentCity, convertTemp, unit }) {
  const [origin, setOrigin] = useState(currentCity?.name || 'London');
  const [originCoords, setOriginCoords] = useState({ lat: currentCity?.lat || 51.5074, lon: currentCity?.lon || -0.1278 });
  const [destination, setDestination] = useState('Paris');
  const [destCoords, setDestCoords] = useState({ lat: 48.8566, lon: 2.3522 });

  const [loading, setLoading] = useState(false);
  const [routePlan, setRoutePlan] = useState(null);

  const handleCalculateRoute = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find coordinates if user typed new city names
      let origC = originCoords;
      let destC = destCoords;

      const origRes = await searchCities(origin);
      if (origRes && origRes[0]) {
        origC = { lat: origRes[0].lat, lon: origRes[0].lon };
      }

      const destRes = await searchCities(destination);
      if (destRes && destRes[0]) {
        destC = { lat: destRes[0].lat, lon: destRes[0].lon };
      }

      // Calculate midpoint coordinates
      const midLat = (origC.lat + destC.lat) / 2;
      const midLon = (origC.lon + destC.lon) / 2;

      // Fetch weather for all 3 points
      const [origWeather, midWeather, destWeather] = await Promise.all([
        fetchFullWeather(origC.lat, origC.lon, origin),
        fetchFullWeather(midLat, midLon, 'Mid-Route Waypoint'),
        fetchFullWeather(destC.lat, destC.lon, destination),
      ]);

      // Calculate Route Safety Index
      const maxPop = Math.max(origWeather.daily[0].pop, midWeather.daily[0].pop, destWeather.daily[0].pop);
      const maxWind = Math.max(origWeather.current.windSpeed, midWeather.current.windSpeed, destWeather.current.windSpeed);
      const minVis = Math.min(origWeather.current.visibility, midWeather.current.visibility, destWeather.current.visibility);

      let travelScore = 100;
      if (maxPop > 40) travelScore -= (maxPop - 40) * 0.6;
      if (maxWind > 30) travelScore -= (maxWind - 30) * 1.2;
      if (minVis < 5) travelScore -= (5 - minVis) * 10;
      travelScore = Math.max(20, Math.min(100, Math.round(travelScore)));

      let hazardLevel = 'LOW HAZARD';
      let hazardClass = 'badge-success';
      if (travelScore < 50) {
        hazardLevel = 'HIGH HAZARD — DENSE FOG / HEAVY RAIN';
        hazardClass = 'badge-danger';
      } else if (travelScore < 75) {
        hazardLevel = 'MODERATE CAUTION REQUIRED';
        hazardClass = 'badge-warning';
      }

      setRoutePlan({
        origin: origWeather,
        mid: midWeather,
        destination: destWeather,
        travelScore,
        hazardLevel,
        hazardClass,
        maxPop,
        maxWind,
        minVis,
      });
    } catch (err) {
      console.error('Route calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Navigation className="w-6 h-6 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <span>SMART TRAVEL ROUTE PLANNER & WEATHER MATRIX</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Calculate trip weather conditions, driving risk factors, hydroplaning probability, and optimal travel windows
          </p>
        </div>
        <span className="badge badge-cyan">AI Route Optimizer Active</span>
      </div>

      {/* Input Form */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleCalculateRoute} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block', fontWeight: 600 }}>
              Origin City
            </label>
            <input
              type="text"
              className="search-input"
              style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. London"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block', fontWeight: 600 }}>
              Destination City
            </label>
            <input
              type="text"
              className="search-input"
              style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Paris"
              required
            />
          </div>

          <button type="submit" className="nav-btn active" style={{ height: '44px', justifyContent: 'center', fontWeight: 700 }}>
            {loading ? 'Calculating Route Weather...' : 'Analyze Travel Route Weather →'}
          </button>
        </form>
      </div>

      {/* Route Weather Matrix Results */}
      {routePlan && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary Score Card */}
          <div
            className="glass-panel pulse-glow"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
              borderColor: 'var(--accent-cyan)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Car className="w-6 h-6 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>ROUTE TRAVEL SAFETY INDEX</h3>
                <span className={`badge ${routePlan.hazardClass}`}>{routePlan.hazardLevel}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Max Rain Risk: {routePlan.maxPop}% • Max Wind Speed: {routePlan.maxWind} km/h • Min Visibility: {routePlan.minVis} km
              </div>
            </div>

            <div style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {routePlan.travelScore}<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/100</span>
            </div>
          </div>

          {/* Waypoints Timeline Breakdown */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>WAYPOINT ATMOSPHERIC ANALYSIS</h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Origin Card */}
              <div className="glass-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>DEPARTURE POINT</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>{routePlan.origin.cityName}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                  {convertTemp(routePlan.origin.current.temp)}°{unit}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {routePlan.origin.current.meta.description} • Humidity {routePlan.origin.current.humidity}%
                </div>
              </div>

              {/* Mid-point Card */}
              <div className="glass-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 700, textTransform: 'uppercase' }}>MID-ROUTE WAYPOINT</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>Transit Highway</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                  {convertTemp(routePlan.mid.current.temp)}°{unit}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {routePlan.mid.current.meta.description} • Wind {routePlan.mid.current.windSpeed} km/h
                </div>
              </div>

              {/* Destination Card */}
              <div className="glass-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase' }}>DESTINATION ARRIVAL</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>{routePlan.destination.cityName}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                  {convertTemp(routePlan.destination.current.temp)}°{unit}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {routePlan.destination.current.meta.description} • Rain Chance {routePlan.destination.daily[0].pop}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
