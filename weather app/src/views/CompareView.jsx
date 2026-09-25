import React, { useState, useEffect } from 'react';
import { GitCompare, MapPin, TrendingUp, BarChart2 } from 'lucide-react';
import { fetchFullWeather, searchCities } from '../services/weatherApi';
import { generatePulseAI } from '../services/pulseAI';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function CompareView({ currentCity, convertTemp, unit }) {
  const [city1Name, setCity1Name] = useState(currentCity?.name || 'London');
  const [city2Name, setCity2Name] = useState('Tokyo');
  const [city3Name, setCity3Name] = useState('New York');

  const [loading, setLoading] = useState(false);
  const [comparedData, setComparedData] = useState([]);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const citiesToFetch = [
        { name: city1Name, defaultCoords: { lat: currentCity?.lat || 51.5074, lon: currentCity?.lon || -0.1278 } },
        { name: city2Name, defaultCoords: { lat: 35.6762, lon: 139.6503 } },
        { name: city3Name, defaultCoords: { lat: 40.7128, lon: -74.006 } },
      ];

      const results = await Promise.all(
        citiesToFetch.map(async (item) => {
          let coords = item.defaultCoords;
          const searchRes = await searchCities(item.name);
          if (searchRes && searchRes[0]) {
            coords = { lat: searchRes[0].lat, lon: searchRes[0].lon };
          }
          const weather = await fetchFullWeather(coords.lat, coords.lon, item.name);
          const ai = generatePulseAI(weather);
          return { weather, ai };
        })
      );

      setComparedData(results);
    } catch (e) {
      console.error('Comparison fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCompare();
  }, []);

  const chartData = comparedData.map((item) => ({
    name: item.weather.cityName,
    Temp: convertTemp(item.weather.current.temp),
    FeelsLike: convertTemp(item.weather.current.feelsLike),
    Humidity: item.weather.current.humidity,
    Wind: item.weather.current.windSpeed,
    RainChance: item.weather.daily[0].pop,
    ComfortScore: item.ai.comfortScore,
    AQI: item.weather.airQuality.usAqi,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GitCompare className="w-6 h-6 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <span>MULTI-CITY METEOROLOGICAL COMPARISON MATRIX</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Compare live temperature, atmospheric pressure, AQI, rain risk, and comfort scores side-by-side
          </p>
        </div>
      </div>

      {/* Selectors Form */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block', fontWeight: 600 }}>
              City 1
            </label>
            <input
              type="text"
              className="search-input"
              style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}
              value={city1Name}
              onChange={(e) => setCity1Name(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block', fontWeight: 600 }}>
              City 2
            </label>
            <input
              type="text"
              className="search-input"
              style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}
              value={city2Name}
              onChange={(e) => setCity2Name(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block', fontWeight: 600 }}>
              City 3
            </label>
            <input
              type="text"
              className="search-input"
              style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}
              value={city3Name}
              onChange={(e) => setCity3Name(e.target.value)}
            />
          </div>

          <button onClick={handleCompare} className="nav-btn active" style={{ height: '42px', justifyContent: 'center', fontWeight: 700 }}>
            {loading ? 'Comparing...' : 'Compare 3 Cities →'}
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards Grid */}
      {comparedData.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {comparedData.map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin className="w-5 h-5 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{item.weather.cityName}</h3>
                  </div>
                  <span className="badge badge-cyan">{item.weather.current.meta.category}</span>
                </div>

                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {convertTemp(item.weather.current.temp)}°{unit}
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {item.weather.current.meta.description} • Feels like {convertTemp(item.weather.current.feelsLike)}°{unit}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span>Comfort Score</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>{item.ai.comfortScore}/100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span>Rain Risk Today</span>
                    <strong style={{ color: 'var(--accent-cyan)' }}>{item.weather.daily[0].pop}%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span>Air Quality Index</span>
                    <strong style={{ color: item.weather.airQuality.color }}>{item.weather.airQuality.usAqi} ({item.weather.airQuality.status})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span>Wind Speed</span>
                    <strong>{item.weather.current.windSpeed} km/h</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Recharts Bar Comparison */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem' }}>TEMPERATURE & COMFORT COMPARISON CHART</div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="Temp" name={`Temperature (°${unit})`} fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="FeelsLike" name={`Feels Like (°${unit})`} fill="var(--accent-indigo)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ComfortScore" name="Comfort Score (0-100)" fill="var(--accent-emerald)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
