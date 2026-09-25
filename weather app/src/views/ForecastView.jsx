import React, { useState } from 'react';
import { Calendar, Sun, Wind, Droplets, ArrowUp, ArrowDown, Compass } from 'lucide-react';
import { DailyTempChart } from '../components/WeatherCharts';

export default function ForecastView({ weatherData, unit, convertTemp }) {
  if (!weatherData) return null;

  const { daily, hourly, cityName } = weatherData;
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const selectedDay = daily[selectedDayIdx] || daily[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar className="w-6 h-6 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <span>7-Day Detailed Meteorological Forecast</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Extended atmospheric projection & daily parameter comparison for {cityName}
          </p>
        </div>
        <span className="badge badge-cyan">{daily.length} Days Available</span>
      </div>

      {/* 7-Day Temperature Range Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          7-Day Temperature Range Curve (°{unit})
        </div>
        <DailyTempChart data={daily} unit={unit} />
      </div>

      {/* Daily Selector Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
        {daily.map((d, idx) => {
          const isSelected = idx === selectedDayIdx;
          return (
            <div
              key={idx}
              className="glass-card"
              onClick={() => setSelectedDayIdx(idx)}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-glass)',
                background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-glass-card)',
                boxShadow: isSelected ? 'var(--glow-cyan)' : 'none',
                textAlign: 'center',
                padding: '1rem 0.5rem',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                {d.dayName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{d.fullDate}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {d.meta.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--accent-amber)' }}>{convertTemp(d.maxTemp)}°</span>
                <span style={{ color: 'var(--text-muted)' }}>/ {convertTemp(d.minTemp)}°</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Deep Dive Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Deep Dive: {selectedDay.dayName} ({selectedDay.fullDate})
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {selectedDay.meta.description} • Sunrise {selectedDay.sunrise} • Sunset {selectedDay.sunset}
            </div>
          </div>
          <span className="badge badge-cyan">{selectedDay.meta.category}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Max / Min Temp</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {convertTemp(selectedDay.maxTemp)}° / {convertTemp(selectedDay.minTemp)}°{unit}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Apparent Max: {convertTemp(selectedDay.maxApparentTemp)}°{unit}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Precipitation Risk</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
              {selectedDay.pop}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Total Volume: {selectedDay.precipSum} mm
            </div>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Max UV Index</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedDay.uvMax >= 6 ? 'var(--accent-amber)' : 'var(--accent-cyan)' }}>
              {selectedDay.uvMax} / 11
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {selectedDay.uvMax >= 6 ? 'Sunscreen Required' : 'Moderate Exposure'}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Max Wind Gusts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {selectedDay.windMax} km/h
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Breeze Severity: {selectedDay.windMax > 30 ? 'Strong' : 'Moderate'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
