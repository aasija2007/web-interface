import React from 'react';
import {
  MapPin,
  Clock,
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Sparkles,
  CloudRain,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import ExtremeAlertBanner from '../components/ExtremeAlertBanner';
import SmartUmbrellaReminder from '../components/SmartUmbrellaReminder';
import { QuickStatCard, AqiCard, SunScheduleCard } from '../components/WeatherCard';
import { HourlyTempChart, PrecipitationChart } from '../components/WeatherCharts';

export default function DashboardView({ weatherData, pulseAI, unit, convertTemp, setActiveView }) {
  if (!weatherData) return null;

  const { current, hourly, daily, airQuality, anomaly, hyperlocalRain, cityName } = weatherData;
  const displayTemp = convertTemp(current.temp);
  const displayFeels = convertTemp(current.feelsLike);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexFlow: 'column', gap: '1.25rem' }}>
      {/* Severe Weather Alerts if any */}
      {pulseAI?.alerts && <ExtremeAlertBanner alerts={pulseAI.alerts} />}

      {/* Smart Umbrella Reminder */}
      <SmartUmbrellaReminder hyperlocalRain={hyperlocalRain} pop={daily[0]?.pop || 0} />

      {/* Weather Anomaly Detection Bar if significant */}
      {anomaly?.isAnomaly && (
        <div
          className="glass-card"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
            borderColor: 'var(--accent-indigo)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
          }}
        >
          <Sparkles className="w-5 h-5 text-indigo animate-pulse" style={{ color: 'var(--accent-indigo)' }} />
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-indigo)', letterSpacing: '0.5px' }}>
              WEATHER ANOMALY DETECTED:{' '}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{anomaly.text}</span>
          </div>
        </div>
      )}

      {/* Main Hero Card */}
      <div className="hero-weather-card">
        <div style={{ display: 'flex', flexFlow: 'column', gap: '0.75rem', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin className="w-5 h-5 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.5px' }}>{cityName}</h1>
            <span className="badge badge-cyan">{current.meta.category}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <Clock className="w-4 h-4" />
            <span>{currentDate} • Updated {weatherData.lastUpdated}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', marginTop: '0.5rem' }}>
            <span className="hero-temp-large">
              {displayTemp}°{unit}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {current.meta.description}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Feels like {displayFeels}°{unit}
              </span>
            </div>
          </div>
        </div>

        {/* Pulse AI Quick Verdict Box */}
        {pulseAI && (
          <div
            className="glass-card"
            style={{
              minWidth: 280,
              maxWidth: 340,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                <Sparkles className="w-4 h-4" />
                <span>PULSE AI DECISION</span>
              </div>
              <span className={`badge ${pulseAI.goOutBadgeClass}`}>{pulseAI.shouldGoOut}</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.6rem', fontWeight: 500 }}>
              {pulseAI.goOutReason}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Comfort Score: <strong style={{ color: 'var(--accent-cyan)' }}>{pulseAI.comfortScore}/100</strong></span>
              <button
                onClick={() => setActiveView('intelligence')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-blue)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                Full AI Report <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hyperlocal Rain Outlook */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: hyperlocalRain.isRainLikely
            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15))'
            : 'rgba(255, 255, 255, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <CloudRain className="w-5 h-5 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>HYPERLOCAL RAIN OUTLOOK (30–60 MINS)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{hyperlocalRain.text}</div>
          </div>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
          {hyperlocalRain.probability}% Chance
        </span>
      </div>

      {/* Main Grid: Metrics & Charts */}
      <div className="dashboard-grid">
        {/* Key Weather Metrics Cards (Col 8) */}
        <div className="col-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <QuickStatCard
            title="Humidity"
            value={`${current.humidity}%`}
            subtext={current.humidity > 70 ? 'High Humidity' : 'Comfortable Moisture'}
            icon={Droplets}
          />
          <QuickStatCard
            title="Wind Speed"
            value={`${current.windSpeed} km/h`}
            subtext={`Direction: ${current.windDirection}° (Gusts: ${current.windGusts} km/h)`}
            icon={Wind}
          />
          <QuickStatCard
            title="UV Index"
            value={`${current.uvIndex} / 11`}
            subtext={current.uvIndex >= 6 ? 'High Radiation - Use SPF' : 'Moderate UV Risk'}
            icon={Sun}
            badgeText={current.uvIndex >= 6 ? 'High' : 'Moderate'}
            badgeColor={current.uvIndex >= 6 ? 'amber' : 'cyan'}
          />
          <QuickStatCard
            title="Pressure"
            value={`${current.pressure} hPa`}
            subtext="Barometric Surface Pressure"
            icon={Gauge}
          />
          <QuickStatCard
            title="Visibility"
            value={`${current.visibility} km`}
            subtext={current.visibility >= 10 ? 'Optimal Clear Vision' : 'Reduced Fog / Haze'}
            icon={Eye}
          />
          <QuickStatCard
            title="Cloud Cover"
            value={`${current.cloudCover}%`}
            subtext="Atmospheric Sky Coverage"
            icon={Sun}
          />
        </div>

        {/* Air Quality & Sun Schedule (Col 4) */}
        <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AqiCard aqiData={airQuality} />
          <SunScheduleCard sunrise={current.sunrise} sunset={current.sunset} />
        </div>

        {/* 24-Hour Temperature Chart (Col 8) */}
        <div className="col-8 glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
              <TrendingUp className="w-4 h-4 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
              <span>24-Hour Temperature Forecast Trend</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>°{unit} hourly curve</span>
          </div>
          <HourlyTempChart data={hourly} unit={unit} />
        </div>

        {/* Hourly Forecast Carousel List (Col 4) */}
        <div className="col-4 glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Hourly Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 220, overflowY: 'auto', paddingRight: '0.25rem' }}>
            {hourly.slice(0, 12).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)', minWidth: 50 }}>{item.label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.meta.description}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.pop > 20 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{item.pop}%</span>
                  )}
                  <span style={{ fontWeight: 700 }}>{convertTemp(item.temp)}°{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rain Probability Chart (Col 6) */}
        <div className="col-6 glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Precipitation Chance (%)</div>
          <PrecipitationChart data={hourly.slice(0, 16)} />
        </div>

        {/* 7-Day Forecast Quick Preview (Col 6) */}
        <div className="col-6 glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>7-Day Forecast Overview</span>
            <button
              onClick={() => setActiveView('forecast')}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Full Forecast →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {daily.map((d, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: 130 }}>
                  <span style={{ fontWeight: 700, width: 50 }}>{d.dayName}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.fullDate}</span>
                </div>

                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{d.meta.description}</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {d.pop > 20 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>💧 {d.pop}%</span>
                  )}
                  <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{convertTemp(d.maxTemp)}°</span>
                  <span style={{ color: 'var(--text-muted)' }}>/ {convertTemp(d.minTemp)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
