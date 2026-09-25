import React from 'react';
import { Users, Clock, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function ZoneCard({ zone, onClose }) {
  if (!zone) return null;

  return (
    <div className="card" style={{ border: '1px solid var(--border-accent)' }}>
      <div className="card-header">
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-saffron)', fontWeight: 700 }}>{zone.code} DETAILS</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px' }}>{zone.name}</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-icon">✕</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: '14px 0' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CURRENT POPULATION</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {zone.currentCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Capacity: {zone.capacity.toLocaleString()}</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DENSITY LEVEL</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {zone.densityPercent}%
          </div>
          <RiskBadge level={zone.riskLevel} />
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FLOW RATE</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            +{zone.flowPerMin} / min
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED WAIT</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {zone.waitTimeMinutes} mins
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <p><strong>Description:</strong> {zone.description}</p>
        {zone.facilities && zone.facilities.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {zone.facilities.map((fac, idx) => (
              <span key={idx} style={{ background: 'var(--bg-elevated)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                ✓ {fac}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
