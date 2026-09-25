import React from 'react';
import { Activity, Gauge, Thermometer, Wind, AlertCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function CrowdPulse() {
  const { crowdPulse } = useSimulation();
  const { pulseScore, statusLabel, breakdown } = crowdPulse;

  // Calculate SVG circular stroke offset
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pulseScore / 100) * circumference;

  let color = 'var(--status-low)';
  if (pulseScore >= 88) color = 'var(--status-critical)';
  else if (pulseScore >= 72) color = 'var(--status-high)';
  else if (pulseScore >= 52) color = 'var(--status-medium)';

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="card-header" style={{ marginBottom: '12px' }}>
        <span className="card-title">
          <Activity size={18} style={{ color }} />
          CROWD PULSE INTELLIGENCE
        </span>
        <span className="live-dot" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      </div>

      {/* Circular Radial Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0', position: 'relative' }}>
        <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="transparent"
            stroke="var(--bg-elevated)"
            strokeWidth="12"
          />
          {/* Progress Arc */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
          />
        </svg>

        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color }}>
            {pulseScore}
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '14px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.035)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Density Index</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{breakdown.density}%</div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.035)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Movement Speed</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{breakdown.movement} pts</div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.035)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Entry Pressure</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{breakdown.entryPressure}%</div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.035)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Exit Throughput</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{breakdown.exitPressure}%</div>
        </div>
      </div>
    </div>
  );
}
