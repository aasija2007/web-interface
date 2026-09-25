import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Activity,
  HeartPulse,
  Compass,
} from 'lucide-react';

export function QuickStatCard({ title, value, subtext, icon: Icon, badgeText, badgeColor = 'cyan' }) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
          {Icon && <Icon className="w-4 h-4" style={{ color: 'var(--accent-cyan)' }} />}
          <span>{title}</span>
        </div>
        {badgeText && <span className={`badge badge-${badgeColor}`}>{badgeText}</span>}
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
        {value}
      </div>

      {subtext && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtext}</div>}
    </div>
  );
}

// AQI Meter Component
export function AqiCard({ aqiData }) {
  if (!aqiData) return null;
  const { usAqi, status, color, pm2_5, pm10 } = aqiData;
  const progressPercent = Math.min(100, Math.round((usAqi / 300) * 100));

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
          <HeartPulse className="w-4 h-4 text-emerald" style={{ color: 'var(--accent-emerald)' }} />
          <span>Air Quality Index (AQI)</span>
        </div>
        <span
          className="badge"
          style={{ background: `${color}20`, color: color, borderColor: `${color}50` }}
        >
          {status}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: color }}>{usAqi}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>US AQI</span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: 8,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: color,
            borderRadius: 4,
            transition: 'width 0.6s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>PM2.5: {pm2_5} µg/m³</span>
        <span>PM10: {pm10} µg/m³</span>
      </div>
    </div>
  );
}

// Sun Schedule Timeline Component
export function SunScheduleCard({ sunrise, sunset }) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
        <Sun className="w-4 h-4 text-amber" style={{ color: 'var(--accent-amber)' }} />
        <span>Sun Schedule</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sunrise className="w-5 h-5 text-amber" style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sunrise</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sunrise}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sunset className="w-5 h-5 text-indigo" style={{ color: 'var(--accent-indigo)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sunset</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sunset}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
