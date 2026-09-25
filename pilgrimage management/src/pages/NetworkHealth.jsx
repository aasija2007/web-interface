import React, { useState } from 'react';
import { Radio, AlertTriangle, ShieldCheck, CheckCircle, Wifi, Server, Database, RefreshCw } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function NetworkHealth() {
  const { networkSensors, setNetworkSensors, logAuditAction, addNotification } = useSimulation();
  const [sensors, setSensors] = useState(networkSensors);

  const onlineCount = sensors.filter(s => s.status === 'ONLINE').length;
  const offlineCount = sensors.filter(s => s.status === 'OFFLINE').length;

  const toggleSensor = (id) => {
    setSensors(prev => prev.map(s => {
      if (s.id === id) {
        const newStatus = s.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        const isStale = newStatus === 'OFFLINE';
        logAuditAction("Network Sensor Status Toggle", `${s.name} (${s.status})`, `${s.name} (${newStatus})`, "Network Diagnostic Simulation", "Network Health");
        if (isStale) {
          addNotification('CRITICAL', `TELEMETRY SIGNAL LOST: ${s.name}`, 'Sensor marked OFFLINE. Last known telemetry cached.');
        } else {
          addNotification('SUCCESS', `TELEMETRY RECOVERED: ${s.name}`, 'Sensor connection restored ONLINE.');
        }
        return { ...s, status: newStatus, stale: isStale, lastPing: isStale ? '18 mins ago' : 'Just now' };
      }
      return s;
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Wifi size={24} style={{ color: 'var(--accent-saffron)' }} />
            OFFLINE & NETWORK HEALTH TELEMETRY
          </h1>
          <p className="page-subtitle">Per-zone IoT sensor mesh health, latency monitoring, and stale telemetry handling.</p>
        </div>
      </div>

      {/* Stale Telemetry Alert Banner */}
      {offlineCount > 0 && (
        <div className="card animate-slide-down" style={{
          background: 'var(--status-critical-bg)',
          borderLeft: '4px solid var(--status-critical)',
          marginBottom: '24px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} style={{ color: 'var(--status-critical)' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--status-critical)' }}>
                🚨 TELEMETRY ALERT: {offlineCount} SENSOR NODE(S) OFFLINE / STALE
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ffffff', marginTop: '2px' }}>
                System operating on cached data for offline zones. Control room notified of degraded precision.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="TOTAL SENSOR NODES" value="144 Sensors" subtitle="across 5 zones" icon={Wifi} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="ONLINE SENSORS" value={`${onlineCount} Nodes`} subtitle="Reporting live" icon={ShieldCheck} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="OFFLINE / DEGRADED" value={`${offlineCount} Nodes`} subtitle="Signal alert" icon={AlertTriangle} accentColor="var(--status-critical)" />
        </div>
        <div className="col-span-3">
          <StatCard title="AVG LATENCY" value="14 ms" subtitle="Encrypted mesh ping" icon={Server} accentColor="var(--accent-gold)" />
        </div>
      </div>

      {/* System Service Health Checks */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header" style={{ marginBottom: '14px' }}>
          <span className="card-title">
            <Server size={18} style={{ color: 'var(--accent-saffron)' }} />
            CORE API & SERVICE INFRASTRUCTURE HEALTH
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CENTRAL SERVER API</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--status-low)', margin: '2px 0' }}>ONLINE (200 OK)</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Uptime: 99.99%</div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CCTV STREAM INGEST</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--status-low)', margin: '2px 0' }}>4/4 FEEDS LIVE</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AI Detection: Active</div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GPS AMBULANCE & POLICE</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--status-low)', margin: '2px 0' }}>SYNCED (12ms)</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>73 Handsets Linked</div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PUSH NOTIFICATION GATEWAY</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--status-low)', margin: '2px 0' }}>OPERATIONAL</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Delivery Rate: 99.8%</div>
          </div>
        </div>
      </div>

      {/* Per Zone Sensor List */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '14px' }}>
          <span className="card-title">ZONE-WISE TELEMETRY MESH SENSORS ({sensors.length})</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sensors.map(sens => (
            <div key={sens.id} style={{
              background: 'var(--bg-secondary)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: sens.status === 'OFFLINE' ? '4px solid var(--status-critical)' : sens.status === 'DEGRADED' ? '4px solid var(--status-medium)' : '4px solid var(--status-low)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sens.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Last Ping: {sens.lastPing} • Latency: {sens.latencyMs} ms {sens.stale && <strong style={{ color: 'var(--status-critical)' }}>(STALE DATA)</strong>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge ${sens.status === 'OFFLINE' ? 'badge-critical' : sens.status === 'DEGRADED' ? 'badge-medium' : 'badge-low'}`}>
                  {sens.status}
                </span>

                <button onClick={() => toggleSensor(sens.id)} className="btn btn-secondary btn-sm">
                  <RefreshCw size={12} /> Toggle Signal ({sens.status === 'ONLINE' ? 'Set Offline' : 'Set Online'})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
