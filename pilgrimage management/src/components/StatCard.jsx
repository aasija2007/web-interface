import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendType = "neutral", accentColor, riskLevel }) {
  const getTrendClass = () => {
    if (trendType === "danger") return "text-red-400 style-danger";
    if (trendType === "success") return "text-emerald-400 style-success";
    if (trendType === "warning") return "text-amber-400 style-warning";
    return "text-slate-400";
  };

  return (
    <div className="card stat-card" style={{ position: 'relative' }}>
      {/* Sleek Glowing Accent Indicator Line */}
      {accentColor && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '15%',
          bottom: '15%',
          width: '4px',
          borderRadius: '0 4px 4px 0',
          background: accentColor,
          boxShadow: `0 0 12px ${accentColor}`
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingLeft: accentColor ? '8px' : 0 }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            {title}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>

        {Icon && (
          <div style={{
            padding: '12px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: accentColor || 'var(--accent-saffron)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: accentColor ? `0 0 15px ${accentColor}25` : undefined
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', paddingLeft: accentColor ? '8px' : 0 }}>
        {subtitle && <span style={{ color: 'var(--text-secondary)' }}>{subtitle}</span>}
        {trend && <span className={getTrendClass()} style={{ fontWeight: 600 }}>{trend}</span>}
      </div>
    </div>
  );
}
