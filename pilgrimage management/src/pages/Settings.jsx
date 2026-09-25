import React, { useState } from 'react';
import { Settings, Sliders, Shield, RotateCcw, Save, CheckCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function SettingsPage() {
  const {
    isSimulating,
    simulationSpeed,
    setSimulationSpeed,
    resetSimulation,
    userRole,
    setUserRole
  } = useSimulation();

  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [warningThreshold, setWarningThreshold] = useState(70);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Settings size={24} style={{ color: 'var(--accent-saffron)' }} />
            SYSTEM CONFIGURATION & THRESHOLDS
          </h1>
          <p className="page-subtitle">Adjust telemetry sensitivity thresholds, simulation speeds, and system resets.</p>
        </div>
      </div>

      <div className="grid-cols-12">
        <div className="col-span-8 card">
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <span className="card-title">
              <Sliders size={18} style={{ color: 'var(--accent-saffron)' }} />
              SAFETY THRESHOLDS & ALARM CONTROLS
            </span>
          </div>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Critical Density Alarm Ceiling: <span style={{ color: 'var(--status-critical)', fontFamily: 'var(--font-mono)' }}>{criticalThreshold}%</span>
              </label>
              <input
                type="range"
                min="75"
                max="95"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                When any zone density exceeds {criticalThreshold}%, RED ALERT alarms will auto-trigger on Command Center.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Warning Density Caution Level: <span style={{ color: 'var(--status-medium)', fontFamily: 'var(--font-mono)' }}>{warningThreshold}%</span>
              </label>
              <input
                type="range"
                min="50"
                max="75"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Simulation Speed Multiplier: {simulationSpeed}x
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 5, 10].map(spd => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSimulationSpeed(spd)}
                    className={`btn btn-sm ${simulationSpeed === spd ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {spd}x Realtime
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              {savedSuccess ? (
                <span style={{ color: 'var(--status-low)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} /> Configuration saved!
                </span>
              ) : <span />}

              <button type="submit" className="btn btn-primary">
                <Save size={14} /> Save Configuration
              </button>
            </div>
          </form>
        </div>

        {/* System Reset & Danger Zone */}
        <div className="col-span-4 card" style={{ border: '1px solid var(--status-critical-border)' }}>
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <span className="card-title" style={{ color: 'var(--status-critical)' }}>SYSTEM RESET ZONE</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Reset all simulated crowd densities, gates status, route diverts, and active incident logs back to baseline event state.
          </p>

          <button onClick={resetSimulation} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
            <RotateCcw size={14} /> Reset Simulation Baseline
          </button>
        </div>
      </div>
    </div>
  );
}
