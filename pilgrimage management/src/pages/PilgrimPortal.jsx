import React, { useState } from 'react';
import { UserCheck, QrCode, AlertTriangle, Compass, HeartPulse, Droplets, MapPin, Clock, ShieldCheck, Phone, CheckCircle, Navigation, Radio, Accessibility, Building, ChevronRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';

export default function PilgrimPortal() {
  const {
    pilgrimProfile,
    setPilgrimProfile,
    zones,
    routes,
    safeExitWindow,
    publicAlerts,
    accessibilityMode,
    setAccessibilityMode,
    addIncident,
    addLostPerson,
    templesList,
    activeTempleId,
    activeTemple,
    switchActiveTemple
  } = useSimulation();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isHazardModalOpen, setIsHazardModalOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);

  // Profile Form state
  const [name, setName] = useState(pilgrimProfile.name);
  const [phone, setPhone] = useState(pilgrimProfile.phone);
  const [groupSize, setGroupSize] = useState(pilgrimProfile.groupSize);
  const [timeSlot, setTimeSlot] = useState(pilgrimProfile.preferredTimeSlot);
  const [selectedNeeds, setSelectedNeeds] = useState(pilgrimProfile.accessibilityNeeds || []);

  // SOS Form
  const [sosCategory, setSosCategory] = useState('Medical emergency');
  const [sosLocation, setSosLocation] = useState('Zone B — Temple Approach Route');
  const [sosDetails, setSosDetails] = useState('');

  // Hazard Form
  const [hazardLocation, setHazardLocation] = useState('Zone C Arena');
  const [hazardDetails, setHazardDetails] = useState('');

  // Lost Person Form
  const [lostName, setLostName] = useState('');
  const [lostAge, setLostAge] = useState('');
  const [lostClothing, setLostClothing] = useState('');

  const currentZoneObj = zones.find(z => z.name.includes(pilgrimProfile.currentZone.split('—')[0].trim())) || zones[0];

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setPilgrimProfile(prev => ({
      ...prev,
      name,
      phone,
      groupSize: Number(groupSize),
      preferredTimeSlot: timeSlot,
      accessibilityNeeds: selectedNeeds
    }));
    setIsProfileModalOpen(false);
  };

  const toggleAccessibilityNeed = (need) => {
    setSelectedNeeds(prev => prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]);
  };

  const handleSendSos = (e) => {
    e.preventDefault();
    addIncident({
      title: `PILGRIM SOS: ${sosCategory}`,
      type: sosCategory,
      location: sosLocation,
      priority: 'CRITICAL',
      description: `Reported by pilgrim ${pilgrimProfile.name} (${pilgrimProfile.phone}). Details: ${sosDetails || 'Urgent assistance requested'}`
    });
    setIsSosModalOpen(false);
  };

  const handleReportHazard = (e) => {
    e.preventDefault();
    addIncident({
      title: `PILGRIM HAZARD REPORT: Obstruction/Hazard`,
      type: 'Infrastructure Issue',
      location: hazardLocation,
      priority: 'HIGH',
      description: `Pilgrim hazard report: ${hazardDetails}`
    });
    setIsHazardModalOpen(false);
  };

  const handleReportMissing = (e) => {
    e.preventDefault();
    if (!lostName) return;
    addLostPerson({
      name: lostName,
      age: Number(lostAge) || 8,
      gender: 'Child',
      clothing: lostClothing || 'Not specified',
      lastSeenLocation: pilgrimProfile.currentZone,
      lastSeenTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: pilgrimProfile.name,
      contactPhone: pilgrimProfile.phone,
      photoUrl: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=150&q=80"
    });
    setIsLostModalOpen(false);
  };

  // Filter routes by accessibility mode
  const recommendedRouteObj = accessibilityMode
    ? routes.find(r => r.id === 'route-b') || routes[0]
    : routes.find(r => r.id === 'route-a') || routes[0];

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="card" style={{
        marginBottom: '24px',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(19, 27, 46, 0.95) 100%)',
        border: '1px solid var(--accent-saffron-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)',
            flexShrink: 0
          }}>
            🪔
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
              DEVOTEE COMPANION PORTAL
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>
              Welcome, {pilgrimProfile.name} (Group of {pilgrimProfile.groupSize})
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Pass ID: <strong style={{ color: 'var(--accent-saffron)', fontFamily: 'var(--font-mono)' }}>{pilgrimProfile.activePassId}</strong> • Slot: {pilgrimProfile.preferredTimeSlot}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setIsSosModalOpen(true)} className="btn btn-danger" style={{ fontWeight: 800, padding: '10px 18px' }}>
            🚨 EMERGENCY SOS
          </button>
          <Link to="/yatra-pass" className="btn btn-primary">
            <QrCode size={16} /> Digital Yatra Pass
          </Link>
          <button onClick={() => setIsProfileModalOpen(true)} className="btn btn-secondary">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Active Temple Shrine Switcher Card for Pilgrims */}
      <div className="card" style={{
        marginBottom: '24px',
        padding: '20px',
        background: '#0f172a',
        border: '1.5px solid var(--accent-gold)',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ⛩️ PILGRIMAGE SHRINE SELECTION
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>
              Currently Visiting: <span style={{ color: 'var(--accent-saffron)' }}>{activeTemple?.name}</span> ({activeTemple?.location})
            </h3>
          </div>
          <span className="badge badge-medium" style={{ fontSize: '0.72rem', padding: '6px 12px' }}>
            {activeTemple?.currentCrowd.toLocaleString()} Devotees Currently Live
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Select a temple shrine below to shift your active pilgrimage companion portal, passes, maps, and queue telemetry:
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px'
        }}>
          {templesList.map(t => {
            const isCurrent = activeTempleId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => switchActiveTemple(t.id)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isCurrent ? '#1e293b' : '#141e33',
                  border: isCurrent ? '2px solid var(--accent-saffron)' : '1px solid #334155',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isCurrent ? '0 4px 16px rgba(249, 115, 22, 0.3)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: isCurrent ? 'var(--accent-saffron)' : '#ffffff' }}>
                    {t.name.split(' ')[0]} {t.name.split(' ')[1] || ''}
                  </span>
                  {isCurrent && <span className="badge badge-high" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>ACTIVE</span>}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {t.location}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{isCurrent ? '● Active Precinct' : 'Shift Shrine'}</span> <ChevronRight size={12} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Devotional Sanctuary Visual Banner */}
      <div className="card" style={{
        marginBottom: '24px',
        padding: 0,
        overflow: 'hidden',
        border: '1px solid var(--accent-gold-glow)',
        position: 'relative'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }} className="responsive-grid">
          <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
            <img src="/images/holy_procession.jpg" alt="Sacred Holy Procession" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(7,10,18,0.2) 0%, rgba(7,10,18,0.85) 100%)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <span className="badge badge-low" style={{ width: 'fit-content', marginBottom: '4px' }}>🕉️ SACRED YATRA CORRIDOR</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Grand Processional Pathway</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Zone A & B — Live Crowds: Normal Flow</div>
            </div>
          </div>

          <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
            <img src="/images/sacred_ghats.jpg" alt="Sacred River Ghats Aarti" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(7,10,18,0.2) 0%, rgba(7,10,18,0.85) 100%)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <span className="badge badge-low" style={{ width: 'fit-content', marginBottom: '4px', background: 'var(--accent-gold)', color: '#000' }}>🪔 EVENING AARTI GHATS</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Holy Dip & Sanctified Ghats</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Zone E Riverfront — Serene Atmosphere</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Public Alerts */}
      {publicAlerts.filter(a => a.active).length > 0 && (
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {publicAlerts.filter(a => a.active).map(alert => (
            <div key={alert.id} className="card animate-slide-down" style={{
              background: alert.category === 'WARNING' || alert.category === 'EMERGENCY' ? 'var(--status-critical-bg)' : 'var(--bg-secondary)',
              borderLeft: alert.category === 'WARNING' || alert.category === 'EMERGENCY' ? '4px solid var(--status-critical)' : '4px solid var(--accent-blue)',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertTriangle size={20} style={{ color: alert.category === 'WARNING' ? 'var(--status-critical)' : 'var(--accent-blue)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    📢 EVENT ALERT: {alert.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {alert.message}
                  </div>
                </div>
              </div>
              <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>{alert.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {/* Top Live Pilgrim Metrics */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="CURRENT LOCATION" value={currentZoneObj.code} subtitle={currentZoneObj.name.split('—')[1] || currentZoneObj.name} icon={MapPin} accentColor="var(--accent-saffron)" />
        </div>
        <div className="col-span-3">
          <StatCard title="CROWD LEVEL" value={`${currentZoneObj.densityPercent}%`} subtitle={`${currentZoneObj.riskLevel} Density`} icon={Compass} accentColor={currentZoneObj.densityPercent > 80 ? "var(--status-critical)" : "var(--status-medium)"} />
        </div>
        <div className="col-span-3">
          <StatCard title="EST. WAITING TIME" value={`${currentZoneObj.waitTimeMinutes} mins`} subtitle="Screening & Darshan" icon={Clock} accentColor="var(--accent-gold)" />
        </div>
        <div className="col-span-3">
          <StatCard title="RECOMMENDED GATE" value="Gate C" subtitle="Lowest queue time (8 min)" icon={CheckCircle} accentColor="var(--status-low)" />
        </div>
      </div>

      {/* Accessibility Mode Toggle Box */}
      <div className="card" style={{
        marginBottom: '24px',
        padding: '14px 20px',
        background: accessibilityMode ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
        border: accessibilityMode ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Accessibility size={24} style={{ color: 'var(--accent-gold)' }} />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              ACCESSIBILITY & VULNERABLE PILGRIM MODE: {accessibilityMode ? 'ACTIVE ♿' : 'OFF'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Avoids stairs, prioritizes smooth ramps, wide corridors, and accessible medical/toilet facilities.
            </div>
          </div>
        </div>

        <button
          onClick={() => setAccessibilityMode(!accessibilityMode)}
          className={`btn ${accessibilityMode ? 'btn-primary' : 'btn-secondary'}`}
          style={{ background: accessibilityMode ? 'var(--accent-gold)' : undefined, color: accessibilityMode ? '#000' : undefined }}
        >
          {accessibilityMode ? 'Disable Accessibility Mode' : 'Enable Wheelchair / Ramp Mode'}
        </button>
      </div>

      {/* Main Grid: Recommended Route & Nearby Facilities */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        {/* Recommended Route Card */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">
              <Navigation size={18} style={{ color: 'var(--accent-saffron)' }} />
              PERSONALIZED RECOMMENDED ROUTE
            </span>
            <span className={`badge ${accessibilityMode ? 'badge-medium' : 'badge-low'}`}>
              {accessibilityMode ? 'ACCESSIBLE RAMP ROUTE' : 'FASTEST ROUTE'}
            </span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-saffron)', marginBottom: '6px' }}>
              {recommendedRouteObj.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              <strong>Path:</strong> {recommendedRouteObj.path}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {recommendedRouteObj.description}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.8rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>DISTANCE</div>
              <div style={{ fontWeight: 800 }}>650 meters</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>WALKING TIME</div>
              <div style={{ fontWeight: 800, color: 'var(--status-low)' }}>8 minutes</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SAFETY INDEX</div>
              <div style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>NORMAL</div>
            </div>
          </div>
        </div>

        {/* Nearby Facilities Locator */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">
              <Compass size={18} style={{ color: 'var(--accent-blue)' }} />
              NEARBY ESSENTIAL FACILITIES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Droplets size={18} style={{ color: 'var(--accent-cyan)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Central Drinking Water Station</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Zone C Hub — 120m away</div>
                </div>
              </div>
              <span className="badge badge-low">OPEN</span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HeartPulse size={18} style={{ color: 'var(--status-critical)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>First Aid Post 1 (Gate A)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Zone A North — 180m away</div>
                </div>
              </div>
              <span className="badge badge-low">DOCTOR ON DUTY</span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserCheck size={18} style={{ color: 'var(--accent-gold)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Sanitation & Accessible Toilets</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Zone C Arena — 250m away</div>
                </div>
              </div>
              <span className="badge badge-low">ACCESSIBLE RAMP</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button onClick={() => setIsHazardModalOpen(true)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Report Hazard
            </button>
            <button onClick={() => setIsLostModalOpen(true)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Report Missing Person
            </button>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Update Pilgrim Profile & Special Needs">
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>FULL NAME</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PHONE NUMBER</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>GROUP SIZE</label>
              <input type="number" min="1" max="50" value={groupSize} onChange={(e) => setGroupSize(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PREFERRED TIME SLOT</label>
            <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="06:00 AM - 08:00 AM">06:00 AM - 08:00 AM (Aarti)</option>
              <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Morning)</option>
              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
              <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              ACCESSIBILITY & ASSISTANCE REQUIREMENTS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {["Wheelchair Ramp Required", "Elderly Pilgrim", "Child in Group", "Pregnant Pilgrim", "Visually Impaired", "Medical Assistance Required"].map(need => {
                const active = selectedNeeds.includes(need);
                return (
                  <button
                    type="button"
                    key={need}
                    onClick={() => toggleAccessibilityNeed(need)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      background: active ? 'var(--accent-saffron)' : 'var(--bg-secondary)',
                      color: active ? '#fff' : 'var(--text-secondary)',
                      border: active ? '1px solid var(--accent-saffron)' : '1px solid var(--border-color)'
                    }}
                  >
                    {active ? '✓ ' : '+ '}{need}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsProfileModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Profile Changes</button>
          </div>
        </form>
      </Modal>

      {/* SOS Trigger Modal */}
      <Modal isOpen={isSosModalOpen} onClose={() => setIsSosModalOpen(false)} title="🚨 Send Immediate Pilgrim Emergency SOS">
        <form onSubmit={handleSendSos} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>EMERGENCY CATEGORY</label>
            <select value={sosCategory} onChange={(e) => setSosCategory(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="Medical emergency">Medical emergency</option>
              <option value="Lost person">Lost person</option>
              <option value="Fire">Fire</option>
              <option value="Crowd danger">Crowd danger / Stampede Risk</option>
              <option value="Security issue">Security issue</option>
              <option value="Accident">Accident</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>YOUR LOCATION / SECTOR</label>
            <input type="text" value={sosLocation} onChange={(e) => setSosLocation(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DETAILS & SITUATION</label>
            <textarea placeholder="Describe immediate situation for emergency control room..." value={sosDetails} onChange={(e) => setSosDetails(e.target.value)} rows={3} style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsSosModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-danger" style={{ fontWeight: 800 }}>TRANSMIT CRITICAL SOS NOW</button>
          </div>
        </form>
      </Modal>

      {/* Hazard Modal */}
      <Modal isOpen={isHazardModalOpen} onClose={() => setIsHazardModalOpen(false)} title="Report Field Hazard or Obstruction">
        <form onSubmit={handleReportHazard} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>HAZARD LOCATION</label>
            <input type="text" value={hazardLocation} onChange={(e) => setHazardLocation(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>HAZARD DETAILS</label>
            <textarea placeholder="Describe damaged barricade, water leakage, broken steps..." value={hazardDetails} onChange={(e) => setHazardDetails(e.target.value)} required rows={3} style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsHazardModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Hazard Report</button>
          </div>
        </form>
      </Modal>

      {/* Missing Modal */}
      <Modal isOpen={isLostModalOpen} onClose={() => setIsLostModalOpen(false)} title="Report Missing Family Member">
        <form onSubmit={handleReportMissing} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MISSING PERSON NAME</label>
            <input type="text" placeholder="e.g. Aarav Sharma" value={lostName} onChange={(e) => setLostName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>AGE</label>
              <input type="number" placeholder="8" value={lostAge} onChange={(e) => setLostAge(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CLOTHING</label>
              <input type="text" placeholder="Red shirt, black pants" value={lostClothing} onChange={(e) => setLostClothing(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsLostModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Missing Person Alert</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
