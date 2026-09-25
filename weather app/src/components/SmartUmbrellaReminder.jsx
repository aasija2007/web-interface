import React from 'react';
import { Umbrella, CloudRain } from 'lucide-react';

export default function SmartUmbrellaReminder({ hyperlocalRain, pop }) {
  const showReminder = hyperlocalRain?.isRainLikely || pop >= 45;
  if (!showReminder) return null;

  return (
    <div
      className="glass-card"
      style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.2))',
        borderColor: 'rgba(6, 182, 212, 0.35)',
        padding: '0.9rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-cyan)',
          }}
        >
          <Umbrella className="w-5 h-5 text-white" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>SMART UMBRELLA REMINDER</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              Rain Probability: {hyperlocalRain?.probability || pop}%
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {hyperlocalRain?.text || 'High rain likelihood detected. Carry an umbrella before stepping out!'}
          </div>
        </div>
      </div>

      <CloudRain className="w-6 h-6 text-cyan animate-bounce" style={{ color: 'var(--accent-cyan)' }} />
    </div>
  );
}
