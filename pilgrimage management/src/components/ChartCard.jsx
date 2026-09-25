import React from 'react';
import { ResponsiveContainer } from 'recharts';

export default function ChartCard({ title, subtitle, icon: Icon, children, height = 280, action }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header" style={{ marginBottom: '16px' }}>
        <div>
          <span className="card-title">
            {Icon && <Icon size={16} style={{ color: 'var(--accent-saffron)' }} />}
            {title}
          </span>
          {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div style={{ flex: 1, width: '100%', minHeight: `${height}px` }}>
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
