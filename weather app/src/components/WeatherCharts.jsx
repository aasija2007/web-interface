import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function HourlyTempChart({ data, unit }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 220, marginTop: '0.5rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--card-shadow)',
              fontSize: '12px',
            }}
            formatter={(val) => [`${val}°${unit}`, 'Temperature']}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="var(--accent-cyan)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#tempGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PrecipitationChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 200, marginTop: '0.5rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--card-shadow)',
              fontSize: '12px',
            }}
            formatter={(val) => [`${val}%`, 'Rain Probability']}
          />
          <Bar dataKey="pop" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyTempChart({ data, unit }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 220, marginTop: '0.5rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis dataKey="dayName" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--card-shadow)',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="maxTemp"
            name={`High (°${unit})`}
            stroke="var(--accent-amber)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--accent-amber)' }}
          />
          <Line
            type="monotone"
            dataKey="minTemp"
            name={`Low (°${unit})`}
            stroke="var(--accent-cyan)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--accent-cyan)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
