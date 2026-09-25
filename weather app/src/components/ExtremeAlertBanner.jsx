import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

export default function ExtremeAlertBanner({ alerts = [], onDismiss }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {alerts.map((alert, index) => (
        <div
          key={index}
          className="glass-card"
          style={{
            background: alert.severity === 'CRITICAL'
              ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(139, 92, 246, 0.2))'
              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(249, 115, 22, 0.2))',
            borderColor: alert.severity === 'CRITICAL' ? 'var(--accent-rose)' : 'var(--accent-amber)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: alert.severity === 'CRITICAL' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {alert.severity === 'CRITICAL' ? (
                <ShieldAlert className="w-5 h-5 text-rose" style={{ color: 'var(--accent-rose)' }} />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber" style={{ color: 'var(--accent-amber)' }} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                {alert.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {alert.message}
              </div>
            </div>
          </div>

          {onDismiss && (
            <button
              onClick={() => onDismiss(index)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
