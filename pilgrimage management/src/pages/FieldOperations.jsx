import React, { useState } from 'react';
import { Radio, Users, Shield, MapPin, CheckCircle, Clock, Zap } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function FieldOperations() {
  const { volunteers, security, activateSurgeResponse } = useSimulation();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sentBroadcast, setSentBroadcast] = useState(false);

  const totalVolunteers = volunteers.reduce((a, v) => a + v.members, 0);
  const totalOfficers = security.reduce((a, s) => a + s.officers, 0);

  const handleSendRadioBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    setSentBroadcast(true);
    setTimeout(() => {
      setSentBroadcast(false);
      setBroadcastMessage('');
    }, 4000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Radio size={24} style={{ color: 'var(--accent-saffron)' }} />
            FIELD OPERATIONS & VOLUNTEER DISPATCH
          </h1>
          <p className="page-subtitle">Real-time deployment of police units, volunteer groups, and sector radio communications.</p>
        </div>

        <button onClick={activateSurgeResponse} className="btn btn-primary btn-sm">
          <Zap size={14} /> Deploy Rapid Volunteer Team 7
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="VOLUNTEERS MONITORED" value={`${totalVolunteers} Members`} subtitle="5 Deployable Teams" icon={Users} accentColor="var(--accent-saffron)" />
        </div>
        <div className="col-span-3">
          <StatCard title="POLICE OFFICERS" value={`${totalOfficers} Officers`} subtitle="4 Sectors Patrolling" icon={Shield} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="RADIO LINK LATENCY" value="12 ms" subtitle="Encrypted Frequency 4" icon={Radio} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="ACTIVE DISPATCHES" value="8 Teams" subtitle="Assigned on field" icon={Clock} accentColor="var(--status-medium)" />
        </div>
      </div>

      {/* Sector Radio Broadcast Console */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header" style={{ marginBottom: '12px' }}>
          <span className="card-title">
            <Radio size={18} style={{ color: 'var(--status-critical)' }} />
            SECTOR-WIDE ENCRYPTED RADIO BROADCAST
          </span>
          <span className="badge badge-low">FREQUENCY CH-4 ONLINE</span>
        </div>

        <form onSubmit={handleSendRadioBroadcast} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Type priority radio voice/text instruction to field units..."
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn btn-primary">
            Transmit Broadcast
          </button>
        </form>

        {sentBroadcast && (
          <div style={{ marginTop: '10px', color: 'var(--status-low)', fontSize: '0.8rem', fontWeight: 700 }}>
            ✓ Transmitted to all 73 radio handsets across Sectors A, B, C, D & E.
          </div>
        )}
      </div>

      <div className="grid-cols-12">
        {/* Volunteer Teams Column */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">
              <Users size={18} style={{ color: 'var(--accent-saffron)' }} />
              VOLUNTEER CORPS DEPLOYMENT ({volunteers.length} TEAMS)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {volunteers.map(vol => (
              <div key={vol.id} style={{
                background: 'var(--bg-secondary)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{vol.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {vol.location} • {vol.members} Members
                  </div>
                </div>
                <span className={`badge ${vol.status === 'AVAILABLE' ? 'badge-low' : 'badge-medium'}`}>
                  {vol.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Police Units Column */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">
              <Shield size={18} style={{ color: 'var(--accent-blue)' }} />
              POLICE & SECURITY SECTORS ({security.length} UNITS)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {security.map(sec => (
              <div key={sec.id} style={{
                background: 'var(--bg-secondary)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{sec.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {sec.location} • {sec.officers} Officers
                  </div>
                </div>
                <span className="badge badge-low">
                  {sec.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
