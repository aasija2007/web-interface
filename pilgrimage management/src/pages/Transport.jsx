import React, { useState } from 'react';
import { Bus, MapPin, AlertTriangle, CheckCircle, Navigation, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function Transport() {
  const { parkingAreas, shuttleBuses, logAuditAction } = useSimulation();
  const [parkings, setParkings] = useState(parkingAreas);
  const [shuttles, setShuttles] = useState(shuttleBuses);

  const totalCapacity = parkings.reduce((a, p) => a + p.capacity, 0);
  const totalOccupied = parkings.reduce((a, p) => a + p.occupied, 0);
  const occupancyPercent = Math.round((totalOccupied / totalCapacity) * 100);

  const handleUpdateOccupancy = (parkingId, delta) => {
    setParkings(prev => prev.map(p => {
      if (p.id === parkingId) {
        const newOcc = Math.max(0, Math.min(p.capacity, p.occupied + delta));
        const newStatus = (newOcc / p.capacity) > 0.85 ? 'CRITICAL' : (newOcc / p.capacity) > 0.7 ? 'HIGH' : 'LOW';
        logAuditAction("Parking Occupancy Updated", `${p.name} (${p.occupied})`, `${p.name} (${newOcc})`, "Traffic controller update", "Transport & Parking");
        return { ...p, occupied: newOcc, status: newStatus };
      }
      return p;
    }));
  };

  const handleUpdateShuttleStatus = (shuttleId, newStatus) => {
    setShuttles(prev => prev.map(s => {
      if (s.id === shuttleId) {
        logAuditAction("Shuttle Status Changed", `${s.code} (${s.status})`, `${s.code} (${newStatus})`, "Transport dispatch update", "Shuttle Fleet");
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Bus size={24} style={{ color: 'var(--accent-saffron)' }} />
            TRANSPORT & PARKING MANAGEMENT
          </h1>
          <p className="page-subtitle">Real-time parking lot occupancy, shuttle bus fleet tracking, and traffic overflow diversions.</p>
        </div>
      </div>

      {/* Overflow Traffic Recommendation Banner */}
      {occupancyPercent > 75 && (
        <div className="card animate-slide-down" style={{
          background: 'var(--status-medium-bg)',
          borderLeft: '4px solid var(--status-medium)',
          marginBottom: '24px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--status-medium)' }}>
              ⚠️ PARKING OVERFLOW WARNING: P1 HIGHWAY HUB IS 85% FULL
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Traffic Control Advisory: Reroute incoming buses and private vehicles to <strong>Parking P3 (South Bypass Reserve — 840 spots available)</strong>.
            </div>
          </div>
          <button onClick={() => handleUpdateOccupancy('p3', -50)} className="btn btn-primary btn-sm">
            Activate P3 Reroute Signal <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="TOTAL PARKING SLOTS" value={totalCapacity} subtitle="Across 4 Transit Hubs" icon={MapPin} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="PARKING OCCUPANCY" value={`${totalOccupied} (${occupancyPercent}%)`} subtitle={`${totalCapacity - totalOccupied} spots available`} icon={AlertTriangle} accentColor={occupancyPercent > 80 ? "var(--status-critical)" : "var(--status-medium)"} />
        </div>
        <div className="col-span-3">
          <StatCard title="ACTIVE SHUTTLE FLEET" value={`${shuttles.length} Buses`} subtitle="Express pilgrim shuttles" icon={Bus} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="AVG SHUTTLE WAIT TIME" value="03 mins" subtitle="Frequency: Every 5 min" icon={ShieldCheck} accentColor="var(--accent-gold)" />
        </div>
      </div>

      {/* Main Grid: Parking Lots & Shuttles */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        {/* Parking Lots Column */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">
              <MapPin size={18} style={{ color: 'var(--accent-saffron)' }} />
              PARKING LOT OCCUPANCY & CAPACITY ({parkings.length} HUBS)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {parkings.map(park => {
              const occPct = Math.round((park.occupied / park.capacity) * 100);
              return (
                <div key={park.id} style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{park.name}</div>
                    <span className={`badge ${park.status === 'HIGH' || park.status === 'CRITICAL' ? 'badge-medium' : 'badge-low'}`}>
                      {park.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Rate: {park.ratePerHr} • Notes: {park.notes}
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>OCCUPANCY</span>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{park.occupied} / {park.capacity} ({occPct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${occPct}%`,
                        background: occPct > 85 ? 'var(--status-critical)' : occPct > 70 ? 'var(--status-medium)' : 'var(--status-low)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleUpdateOccupancy(park.id, -20)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                      -20 Cars
                    </button>
                    <button onClick={() => handleUpdateOccupancy(park.id, +20)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                      +20 Cars
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shuttle Fleet Column */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">
              <Bus size={18} style={{ color: 'var(--accent-blue)' }} />
              PILGRIM SHUTTLE FLEET ({shuttles.length} BUSES)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {shuttles.map(shuttle => (
              <div key={shuttle.id} style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-saffron)' }}>{shuttle.code}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{shuttle.route}</span>
                  </div>
                  <span className={`badge ${shuttle.status === 'FULL' ? 'badge-critical' : shuttle.status === 'BOARDING' ? 'badge-medium' : 'badge-low'}`}>
                    {shuttle.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Location: {shuttle.currentLocation} • ETA: {shuttle.etaMin} mins
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span>Pass Capacity: <strong>{shuttle.passengers} / {shuttle.capacity}</strong></span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleUpdateShuttleStatus(shuttle.id, 'IN_TRANSIT')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.68rem' }}>
                      In Transit
                    </button>
                    <button onClick={() => handleUpdateShuttleStatus(shuttle.id, 'BOARDING')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.68rem' }}>
                      Boarding
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
