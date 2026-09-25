import React, { useState } from 'react';
import { QrCode, CheckCircle, AlertTriangle, ShieldCheck, UserCheck, Plus, Camera, ScanLine, ArrowRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';

export default function YatraPass() {
  const { yatraPasses, scanYatraPass, createYatraPass, pilgrimProfile, gates } = useSimulation();
  const [selectedPass, setSelectedPass] = useState(yatraPasses[0] || null);
  const [scanGateId, setScanGateId] = useState('gate-a');
  const [scanResult, setScanResult] = useState(null);
  const [isNewPassModalOpen, setIsNewPassModalOpen] = useState(false);

  // New Pass state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGroupSize, setNewGroupSize] = useState(2);
  const [newTimeSlot, setNewTimeSlot] = useState('08:00 AM - 10:00 AM');
  const [newGate, setNewGate] = useState('Gate A — North Entry');

  const handleSimulateScan = (passIdToScan) => {
    const result = scanYatraPass(passIdToScan || selectedPass?.yatraId, scanGateId);
    setScanResult(result);
    setTimeout(() => {
      setScanResult(null);
    }, 4500);
  };

  const handleCreateNewPass = (e) => {
    e.preventDefault();
    if (!newName) return;
    const created = createYatraPass({
      name: newName,
      phone: newPhone,
      groupSize: Number(newGroupSize),
      preferredTimeSlot: newTimeSlot,
      entryGate: newGate,
      emergencyContact: "+91 98765 43210",
      accessibilityNeeds: ["Wheelchair Ramp Required"]
    });
    setSelectedPass(created);
    setIsNewPassModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <QrCode size={24} style={{ color: 'var(--accent-saffron)' }} />
            DIGITAL YATRA PASS & QR ENTRY SYSTEM
          </h1>
          <p className="page-subtitle">Generate official digital passes, simulate gate QR scanning, and record live entry flows.</p>
        </div>

        <button onClick={() => setIsNewPassModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={14} /> Issue New Yatra Pass
        </button>
      </div>

      {/* Top Pass Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="TOTAL ISSUED PASSES" value={yatraPasses.length} subtitle="Digital passes active" icon={QrCode} accentColor="var(--accent-saffron)" />
        </div>
        <div className="col-span-3">
          <StatCard title="VALIDATED ENTRIES TODAY" value={yatraPasses.reduce((a, p) => a + p.entriesUsed, 0)} subtitle="Recorded at gates" icon={CheckCircle} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="SCAN VERIFICATION SPEED" value="0.8 sec" subtitle="Per barcode scanner" icon={ScanLine} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="SCANNER STATUS" value="14 Gates Online" subtitle="Synced with Audit Trail" icon={ShieldCheck} accentColor="var(--accent-gold)" />
        </div>
      </div>

      {/* Main Grid: Pass Viewer & QR Scanner Simulator */}
      <div className="grid-cols-12">
        {/* Digital Pass Viewer Card */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">OFFICIAL DIGITAL YATRA PASS</span>
            <span className="badge badge-low">VALID VERIFIED</span>
          </div>

          {selectedPass && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(19, 27, 46, 0.95) 0%, rgba(26, 20, 36, 0.95) 100%)',
              border: '2px solid var(--accent-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: 'var(--devotional-banner-glow)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                🕉️ DEVSTHANAM OFFICIAL YATRA PASS
              </div>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                {selectedPass.name}
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--accent-saffron)', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
                YATRA ID: {selectedPass.yatraId}
              </div>

              {/* Simulated QR Code SVG Graphic */}
              <div style={{
                background: '#ffffff',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                width: '170px',
                height: '170px',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}>
                <svg width="140" height="140" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  {/* Outer corners */}
                  <rect x="5" y="5" width="25" height="25" fill="#000000" />
                  <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
                  <rect x="13" y="13" width="9" height="9" fill="#000000" />

                  <rect x="70" y="5" width="25" height="25" fill="#000000" />
                  <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
                  <rect x="78" y="13" width="9" height="9" fill="#000000" />

                  <rect x="5" y="70" width="25" height="25" fill="#000000" />
                  <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
                  <rect x="13" y="78" width="9" height="9" fill="#000000" />

                  {/* Matrix pattern dots */}
                  <rect x="35" y="10" width="8" height="8" fill="#000" />
                  <rect x="48" y="10" width="12" height="8" fill="#000" />
                  <rect x="10" y="35" width="12" height="8" fill="#000" />
                  <rect x="35" y="35" width="30" height="30" fill="#000" />
                  <rect x="42" y="42" width="16" height="16" fill="#fff" />
                  <rect x="46" y="46" width="8" height="8" fill="#f97316" />
                  <rect x="75" y="40" width="15" height="10" fill="#000" />
                  <rect x="40" y="75" width="20" height="15" fill="#000" />
                  <rect x="70" y="70" width="20" height="20" fill="#000" />
                </svg>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8rem', textAlign: 'left', background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Group Size: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedPass.groupSize} Devotees</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Entry Gate: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedPass.entryGate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Time Slot: </span>
                  <strong style={{ color: 'var(--accent-gold)' }}>{selectedPass.timeSlot}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Entries Recorded: </span>
                  <strong style={{ color: 'var(--status-low)' }}>{selectedPass.entriesUsed} Checks</strong>
                </div>
              </div>
            </div>
          )}

          {/* Pass Selection Pills */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {yatraPasses.map(pass => (
              <button
                key={pass.yatraId}
                onClick={() => setSelectedPass(pass)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  background: selectedPass?.yatraId === pass.yatraId ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                  border: selectedPass?.yatraId === pass.yatraId ? '1px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                  color: selectedPass?.yatraId === pass.yatraId ? 'var(--accent-saffron)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap'
                }}
              >
                {pass.name} ({pass.yatraId})
              </button>
            ))}
          </div>
        </div>

        {/* QR Gate Scanner Simulator */}
        <div className="col-span-6 card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ marginBottom: '14px' }}>
              <span className="card-title">
                <ScanLine size={18} style={{ color: 'var(--accent-saffron)' }} />
                GATE QR SCANNER SIMULATION
              </span>
              <span className="badge badge-low">SIMULATED CAMERA API</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Simulates a physical gate barcode scanner at checkpoint entries. Validating a pass increases gate throughput and updates live zone occupancy.
            </p>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                SELECT GATE CHECKPOINT LOCATION
              </label>
              <select value={scanGateId} onChange={(e) => setScanGateId(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '12px' }}>
                {gates.map(g => (
                  <option key={g.id} value={g.id}>{g.name} (Queue: {g.queueLength})</option>
                ))}
              </select>

              {/* Viewfinder simulation box */}
              <div style={{
                height: '140px',
                background: '#070a12',
                border: '2px stroke var(--accent-saffron)',
                borderRadius: 'var(--radius-sm)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  width: '80%',
                  height: '2px',
                  background: 'var(--status-critical)',
                  boxShadow: '0 0 10px var(--status-critical)',
                  animation: 'slideDown 2s infinite linear'
                }} />
                <Camera size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.7rem', color: 'var(--accent-saffron)', fontFamily: 'var(--font-mono)' }}>
                  ALIGN QR CODE IN FRAME
                </div>
              </div>
            </div>

            {/* Scan Overlay Feedback */}
            {scanResult && (
              <div className="animate-slide-down" style={{
                background: scanResult.success ? 'var(--status-low-bg)' : 'var(--status-critical-bg)',
                border: scanResult.success ? '1px solid var(--status-low-border)' : '1px solid var(--status-critical-border)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {scanResult.success ? <CheckCircle size={24} style={{ color: 'var(--status-low)' }} /> : <AlertTriangle size={24} style={{ color: 'var(--status-critical)' }} />}
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: scanResult.success ? 'var(--status-low)' : 'var(--status-critical)' }}>
                    {scanResult.success ? 'SCAN VERIFIED — ENTRY GRANTED' : 'SCAN FAILED — ACCESS DENIED'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {scanResult.message}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <button onClick={() => handleSimulateScan(selectedPass?.yatraId)} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
              <ScanLine size={16} /> Simulate Pass Scan Check-in
            </button>
            <button onClick={() => handleSimulateScan('YATRA-INVALID-99')} className="btn btn-secondary btn-sm">
              Test Invalid Pass
            </button>
          </div>
        </div>
      </div>

      {/* Modal to Issue New Yatra Pass */}
      <Modal isOpen={isNewPassModalOpen} onClose={() => setIsNewPassModalOpen(false)} title="Issue Digital Yatra Pass">
        <form onSubmit={handleCreateNewPass} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DEVOTEE FULL NAME</label>
            <input type="text" placeholder="e.g. Meena Devi" value={newName} onChange={(e) => setNewName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PHONE NUMBER</label>
              <input type="tel" placeholder="+91 98765 43210" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>GROUP SIZE</label>
              <input type="number" min="1" max="50" value={newGroupSize} onChange={(e) => setNewGroupSize(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ENTRY TIME SLOT</label>
              <select value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="06:00 AM - 08:00 AM">06:00 AM - 08:00 AM</option>
                <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PREFERRED GATE</label>
              <select value={newGate} onChange={(e) => setNewGate(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="Gate A — North Entry">Gate A — North Entry</option>
                <option value="Gate B — East VIP & Main Arch">Gate B — East VIP Arch</option>
                <option value="Gate C — South Temple Pathway">Gate C — South Pathway</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsNewPassModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Generate Pass & QR Code</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
