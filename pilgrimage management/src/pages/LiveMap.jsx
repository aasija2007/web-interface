import React, { useState } from 'react';
import { Compass, Search, Filter, Layers, Navigation, Shield, HeartPulse } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import CrowdMap from '../components/CrowdMap';
import ZoneCard from '../components/ZoneCard';

export default function LiveMap() {
  const { zones, gates } = useSimulation();
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredZones = zones.filter(z =>
    z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Compass size={24} style={{ color: 'var(--accent-saffron)' }} />
            LIVE TELEMETRY CROWD MAP
          </h1>
          <p className="page-subtitle">Real-time spatial visualization, zone heat maps, and field asset deployment.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search zones or gates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.8rem', width: '220px' }}
            />
          </div>
        </div>
      </div>

      <div className="grid-cols-12">
        <div className="col-span-8">
          <CrowdMap onSelectZone={setSelectedZone} selectedZoneId={selectedZone?.id} />
        </div>

        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ZoneCard zone={selectedZone} />

          {/* Quick Zone Selector List */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '10px' }}>
              <span className="card-title">ALL MONITORED SECTORS ({filteredZones.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
              {filteredZones.map(z => (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedZone?.id === z.id ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                    border: selectedZone?.id === z.id ? '1px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{z.code} — {z.name.split('—')[1] || z.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{z.currentCount.toLocaleString()} Pilgrims</div>
                  </div>
                  <span className={`badge ${z.riskLevel === 'CRITICAL' ? 'badge-critical' : z.riskLevel === 'HIGH' ? 'badge-high' : z.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low'}`}>
                    {z.densityPercent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
