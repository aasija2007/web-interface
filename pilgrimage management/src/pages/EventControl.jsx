import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, CloudRain, Sun, Activity, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function EventControl() {
  const { eventInfo, weather } = useSimulation();

  const scheduleItems = [
    { time: '04:00 AM', event: 'Sacred Sanctum Mahamangal Aarti', location: 'Zone B Sanctum', status: 'COMPLETED', expected: '45,000 Pilgrims' },
    { time: '08:30 AM', event: 'Holy Dip & Ghat Consecration', location: 'Zone E River Ghats', status: 'COMPLETED', expected: '65,000 Pilgrims' },
    { time: '02:00 PM', event: 'Grand Processional Ratha Yatra', location: 'Zone A -> Zone B -> Zone C', status: 'IN PROGRESS', expected: '110,000 Pilgrims' },
    { time: '06:30 PM', event: 'Evening Maha Deeparadhana & Light Fest', location: 'Zone C Main Arena', status: 'UPCOMING', expected: '140,000 Pilgrims' },
    { time: '09:30 PM', event: 'Night Shayan Aarti & Gradual Egress', location: 'Zone B & Zone D Transit', status: 'UPCOMING', expected: '80,000 Pilgrims' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Calendar size={24} style={{ color: 'var(--accent-saffron)' }} />
            EVENT SCHEDULE & PROCESSIONAL TIMELINE
          </h1>
          <p className="page-subtitle">Ritual schedule synchronization, crowd surge forecast windows, and weather intelligence.</p>
        </div>
      </div>

      {/* Weather & Event Info Banner */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-8 card">
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <span className="card-title">
              <Sparkles size={18} style={{ color: 'var(--accent-gold)' }} />
              {eventInfo.name}
            </span>
            <span className="badge badge-low">STATUS: {eventInfo.status}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Location: </span>
              <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{eventInfo.location}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Expected Attendance: </span>
              <strong style={{ display: 'block', color: 'var(--accent-saffron)' }}>{eventInfo.expectedAttendance.toLocaleString()} Pilgrims</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Event Window: </span>
              <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{eventInfo.startTime} - {eventInfo.endTime}</strong>
            </div>
          </div>
        </div>

        {/* Weather Intelligence Card */}
        <div className="col-span-4 card" style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-blue)' }}>
          <div className="card-header" style={{ marginBottom: '8px' }}>
            <span className="card-title" style={{ fontSize: '0.85rem' }}>
              <CloudRain size={16} style={{ color: 'var(--accent-blue)' }} />
              WEATHER ADVISORY
            </span>
            <span className="badge badge-medium">{weather.temperature}</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div><strong>Condition:</strong> {weather.condition}</div>
            <div><strong>Rain Probability:</strong> {weather.rainProb} | <strong>Humidity:</strong> {weather.humidity}</div>
            <p style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
              ⚠️ {weather.insight}
            </p>
          </div>
        </div>
      </div>

      {/* Processional Timeline Schedule */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <span className="card-title">RITUAL TIMELINE & CROWD WINDOWS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scheduleItems.map((item, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-secondary)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: item.status === 'IN PROGRESS' ? '4px solid var(--accent-saffron)' : item.status === 'COMPLETED' ? '4px solid var(--status-low)' : '4px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-saffron)', width: '90px' }}>
                  {item.time}
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.event}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.location} • Peak Expected: {item.expected}
                  </div>
                </div>
              </div>

              <span className={`badge ${item.status === 'IN PROGRESS' ? 'badge-critical' : item.status === 'COMPLETED' ? 'badge-low' : 'badge-medium'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
