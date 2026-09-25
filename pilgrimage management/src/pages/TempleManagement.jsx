import React, { useState } from 'react';
import { Building2, MapPin, Users, Shield, Plus, CheckCircle, Clock, PhoneCall, Sparkles, Layers, ArrowRight, Activity, DoorOpen } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';

export default function TempleManagement() {
  const {
    templesList,
    activeTempleId,
    activeTemple,
    switchActiveTemple,
    addNewTemple
  } = useSimulation();

  const [isNewTempleModalOpen, setIsNewTempleModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [deity, setDeity] = useState('');
  const [location, setLocation] = useState('');
  const [expectedAttendance, setExpectedAttendance] = useState('150000');
  const [totalGates, setTotalGates] = useState('4');
  const [trustContact, setTrustContact] = useState('');
  const [securityChief, setSecurityChief] = useState('');

  const handleRegisterTemple = (e) => {
    e.preventDefault();
    if (!name || !location) return;

    addNewTemple({
      name,
      deity,
      location,
      expectedAttendance,
      totalGates,
      trustContact,
      securityChief
    });

    setName('');
    setDeity('');
    setLocation('');
    setIsNewTempleModalOpen(false);
  };

  const totalMonitoredDevotees = templesList.reduce((sum, t) => sum + t.currentCrowd, 0);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            🕉️ DEVSTHANAM MULTI-SHRINE NETWORK
          </div>
          <h1 className="page-title">
            <Building2 size={24} style={{ color: 'var(--accent-saffron)' }} />
            MULTI-TEMPLE SHRINE MANAGEMENT & SWITCHER
          </h1>
          <p className="page-subtitle">Centralized crowd management, darshan slot allocation, and operational control for multiple sacred temples.</p>
        </div>

        <button onClick={() => setIsNewTempleModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Register New Temple Precinct
        </button>
      </div>

      {/* Top Network Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="MANAGED SHRINE COMPLEXES" value={templesList.length} subtitle="Active temple precincts" icon={Building2} accentColor="var(--accent-saffron)" />
        </div>
        <div className="col-span-3">
          <StatCard title="TOTAL DEVOTEES MONITORED" value={totalMonitoredDevotees.toLocaleString()} subtitle="Across all shrines" icon={Users} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="ACTIVE COMMAND PRECINCT" value={activeTemple.name.split(' ')[0]} subtitle={activeTemple.location} icon={Sparkles} accentColor="var(--accent-gold)" />
        </div>
        <div className="col-span-3">
          <StatCard title="TOTAL OPERATIONAL GATES" value={templesList.reduce((a, t) => a + t.totalGates, 0)} subtitle="Screening gates active" icon={DoorOpen} accentColor="var(--accent-blue)" />
        </div>
      </div>

      {/* Active Temple Spotlight Section */}
      <div className="card" style={{
        marginBottom: '28px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(19, 27, 46, 0.95) 0%, rgba(26, 20, 36, 0.95) 100%)',
        border: '2px solid var(--accent-saffron)',
        boxShadow: 'var(--devotional-banner-glow)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px' }} className="responsive-grid">
          {/* Temple Photograph & Main Info */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: '260px', border: '1px solid var(--border-color)' }}>
            <img src={activeTemple.image} alt={activeTemple.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(7, 10, 18, 0.95) 0%, rgba(7, 10, 18, 0.3) 100%)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              <span className="badge badge-low" style={{ width: 'fit-content', marginBottom: '6px' }}>● ACTIVE COMMAND SPOTLIGHT</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>{activeTemple.name}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <MapPin size={14} /> {activeTemple.location}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Deity: <strong>{activeTemple.deity}</strong>
              </div>
            </div>
          </div>

          {/* Operational Metrics & Darshan Slots */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precinct Status</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--status-low)' }}>{activeTemple.status}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live Footfall</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-saffron)' }}>
                    {activeTemple.currentCrowd.toLocaleString()} / {activeTemple.expectedAttendance.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>devotees</span>
                  </div>
                </div>
              </div>

              {/* Darshan & Aarti Time Slots List */}
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                🪔 DARSHAN & AARTI TIMELINE SLOTS
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {activeTemple.darshanSlots.map((slot, idx) => (
                  <div key={idx} style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Clock size={14} style={{ color: 'var(--accent-saffron)' }} />
                      <div>
                        <strong>{slot.name}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({slot.time})</span>
                      </div>
                    </div>
                    <span className={`badge ${slot.status === 'OPEN' ? 'badge-low' : slot.status === 'COMPLETED' ? 'badge-medium' : 'badge-high'}`} style={{ fontSize: '0.65rem' }}>
                      {slot.status} ({slot.capacity.toLocaleString()} seats)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Hotline & Security Info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div><strong>Trust Helpline:</strong> {activeTemple.trustContact}</div>
              <div><strong>Security Chief:</strong> {activeTemple.securityChief}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Temple Directory Cards Grid */}
      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={18} style={{ color: 'var(--accent-gold)' }} />
        REGISTERED TEMPLE SHRINE NETWORK DIRECTORY ({templesList.length} TEMPLES)
      </div>

      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        {templesList.map((temple) => {
          const isActive = temple.id === activeTempleId;
          const density = Math.round((temple.currentCrowd / temple.expectedAttendance) * 100);

          return (
            <div key={temple.id} className="col-span-4 card" style={{
              padding: 0,
              overflow: 'hidden',
              border: isActive ? '2px solid var(--accent-saffron)' : '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 0 15px rgba(255, 153, 51, 0.2)' : 'none'
            }}>
              {/* Image Header */}
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                <img src={temple.image} alt={temple.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(7, 10, 18, 0.9) 0%, transparent 60%)',
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${isActive ? 'badge-low' : 'badge-medium'}`} style={{ fontSize: '0.65rem' }}>
                      {isActive ? '● CURRENT ACTIVE' : temple.status}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 700, background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                      {temple.totalGates} Gates
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>{temple.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {temple.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body Metrics */}
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Deity: <strong style={{ color: 'var(--text-primary)' }}>{temple.deity}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Footfall Capacity Load</span>
                  <span style={{ fontWeight: 800, color: density > 75 ? 'var(--status-critical)' : 'var(--accent-saffron)' }}>{density}%</span>
                </div>

                <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{
                    width: `${density}%`,
                    height: '100%',
                    background: density > 75 ? 'var(--status-critical)' : 'linear-gradient(90deg, var(--accent-saffron), var(--accent-gold))',
                    borderRadius: '3px'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <span>Live Crowd: <strong>{temple.currentCrowd.toLocaleString()}</strong></span>
                  <span>Max Expected: <strong>{(temple.expectedAttendance / 1000).toFixed(0)}k</strong></span>
                </div>

                {/* Switch Button */}
                {isActive ? (
                  <button className="btn btn-secondary btn-sm" disabled style={{ width: '100%', justifyContent: 'center', opacity: 0.8 }}>
                    <CheckCircle size={14} style={{ color: 'var(--status-low)' }} /> Currently Managing
                  </button>
                ) : (
                  <button
                    onClick={() => switchActiveTemple(temple.id)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    SWITCH TO THIS MANDIR <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Register New Temple Modal */}
      <Modal isOpen={isNewTempleModalOpen} onClose={() => setIsNewTempleModalOpen(false)} title="Register New Temple Shrine Complex">
        <form onSubmit={handleRegisterTemple} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TEMPLE NAME</label>
            <input
              type="text"
              placeholder="e.g. Somnath Temple Shrine"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DEITY / SHINE NAME</label>
              <input
                type="text"
                placeholder="e.g. Lord Shiva"
                value={deity}
                onChange={(e) => setDeity(e.target.value)}
                className="form-control"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>LOCATION (CITY, STATE)</label>
              <input
                type="text"
                placeholder="e.g. Prabhas Patan, Gujarat"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>EXPECTED DAILY ATTENDANCE</label>
              <input
                type="number"
                placeholder="150000"
                value={expectedAttendance}
                onChange={(e) => setExpectedAttendance(e.target.value)}
                className="form-control"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL ENTRY GATES</label>
              <input
                type="number"
                placeholder="4"
                value={totalGates}
                onChange={(e) => setTotalGates(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TRUST HELPLINE</label>
              <input
                type="text"
                placeholder="+91 2876 231 212"
                value={trustContact}
                onChange={(e) => setTrustContact(e.target.value)}
                className="form-control"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SECURITY CHIEF</label>
              <input
                type="text"
                placeholder="Command Officer Gujarat Police"
                value={securityChief}
                onChange={(e) => setSecurityChief(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsNewTempleModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Temple Complex
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
