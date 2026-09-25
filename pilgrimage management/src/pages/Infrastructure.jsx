import React, { useState } from 'react';
import { Building, ShieldCheck, AlertTriangle, CheckCircle, Wrench, Activity } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function Infrastructure() {
  const { infrastructure } = useSimulation();
  const [items, setItems] = useState(infrastructure);

  const totalAssets = items.length;
  const operationalCount = items.filter(i => i.status === 'OPERATIONAL').length;

  const handleInspect = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'OPERATIONAL', notes: 'Inspection completed by engineering patrol.' } : item));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Building size={24} style={{ color: 'var(--accent-saffron)' }} />
            INFRASTRUCTURE & FACILITY TELEMETRY
          </h1>
          <p className="page-subtitle">Footbridge structural sensors, queue barricades, lighting towers, and water supply nodes.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="MONITORED ASSETS" value={totalAssets} subtitle="Sensors linked" icon={Building} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="OPERATIONAL INTEGRITY" value={`${operationalCount} / ${totalAssets}`} subtitle="98.4% Health index" icon={ShieldCheck} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="ATTENTION REQUIRED" value={totalAssets - operationalCount} subtitle="Maintenance flagged" icon={AlertTriangle} accentColor="var(--status-medium)" />
        </div>
        <div className="col-span-3">
          <StatCard title="POWER / GENERATOR" value="100% ONLINE" subtitle="Grid & solar backup" icon={Activity} accentColor="var(--accent-gold)" />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid-cols-12">
        {items.map(asset => (
          <div key={asset.id} className="col-span-6">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header" style={{ marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{asset.name}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{asset.location} • {asset.type}</div>
                  </div>
                  <span className={`badge ${asset.status === 'OPERATIONAL' ? 'badge-low' : 'badge-medium'}`}>
                    {asset.status}
                  </span>
                </div>

                {/* Load Percent Meter */}
                <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>STRUCTURAL LOAD / PRESSURE</span>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{asset.loadPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${asset.loadPercent}%`,
                      background: asset.loadPercent > 85 ? 'var(--status-critical)' : asset.loadPercent > 70 ? 'var(--status-medium)' : 'var(--status-low)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Engineer Notes:</strong> {asset.notes}
                </p>
              </div>

              <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleInspect(asset.id)} className="btn btn-secondary btn-sm">
                  <Wrench size={13} /> Log Inspection Verification
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
