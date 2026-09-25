import React, { useState } from 'react';
import { HeartPulse, Activity, Navigation, PhoneCall, Plus, ShieldCheck, Ambulance } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';

export default function Medical() {
  const { medicalUnits, addIncident } = useSimulation();
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalBeds = medicalUnits.reduce((a, u) => a + u.totalBeds, 0);
  const availableBeds = medicalUnits.reduce((a, u) => a + u.availableBeds, 0);
  const totalAmbulances = medicalUnits.reduce((a, u) => a + u.ambulances, 0);

  const handleDispatchAmbulance = (unit) => {
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  const confirmDispatch = () => {
    if (selectedUnit) {
      addIncident({
        title: `Ambulance Dispatched from ${selectedUnit.name}`,
        type: 'Medical Emergency',
        location: selectedUnit.location,
        priority: 'HIGH',
        description: `Rapid responder unit mobilized. Hospital bed reserved.`
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <HeartPulse size={24} style={{ color: 'var(--status-critical)' }} />
            MEDICAL DISPATCH & AMBULANCE TRACKER
          </h1>
          <p className="page-subtitle">On-ground field medical posts, bed capacity tracking, and rapid ambulance dispatch.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="FIELD MEDICAL UNITS" value={medicalUnits.length} subtitle="Operational centers" icon={HeartPulse} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="AVAILABLE TRIAGE BEDS" value={`${availableBeds} / ${totalBeds}`} subtitle="Ready for admission" icon={Activity} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="ACTIVE AMBULANCES" value={totalAmbulances} subtitle="GPS tracked on ground" icon={Ambulance} accentColor="var(--accent-gold)" />
        </div>
        <div className="col-span-3">
          <StatCard title="MEDICAL RESPONDERS" value="49 Doctors & Paramedics" subtitle="On duty" icon={ShieldCheck} accentColor="var(--status-medium)" />
        </div>
      </div>

      {/* Medical Units List Grid */}
      <div className="grid-cols-12">
        {medicalUnits.map(unit => {
          const bedOccupancyPercent = Math.round(((unit.totalBeds - unit.availableBeds) / unit.totalBeds) * 100);

          return (
            <div key={unit.id} className="col-span-6">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-header" style={{ marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{unit.name}</h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unit.location}</div>
                    </div>
                    <span className={`badge ${unit.status === 'OPERATIONAL' ? 'badge-low' : 'badge-medium'}`}>
                      {unit.status}
                    </span>
                  </div>

                  {/* Bed Occupancy Progress */}
                  <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>BED OCCUPANCY</span>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {unit.totalBeds - unit.availableBeds} / {unit.totalBeds} Beds Used ({bedOccupancyPercent}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${bedOccupancyPercent}%`,
                        background: bedOccupancyPercent > 80 ? 'var(--status-critical)' : bedOccupancyPercent > 50 ? 'var(--status-medium)' : 'var(--status-low)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8rem', marginBottom: '14px' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STAFF ON DUTY: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{unit.staffAvailable} Medics</strong>
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AMBULANCES: </span>
                      <strong style={{ color: 'var(--accent-saffron)' }}>{unit.ambulances} Standby</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <button onClick={() => handleDispatchAmbulance(unit)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Ambulance size={14} /> Dispatch Ambulance Unit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dispatch Rapid Ambulance Team">
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Dispatching ambulance from <strong>{selectedUnit?.name}</strong>. Clear priority corridor will be automatically broadcast to traffic sector officers.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDispatch} className="btn btn-primary">Confirm Emergency Dispatch</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
