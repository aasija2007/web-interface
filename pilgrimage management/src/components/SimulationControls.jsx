import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Zap, AlertTriangle, ShieldCheck, CloudRain, HeartPulse, Search, WifiOff, ChevronDown } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function SimulationControls() {
  const {
    isSimulating,
    simulationSpeed,
    setSimulationSpeed,
    surgeTriggered,
    surgeResponseActivated,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    triggerSurgeScenario,
    activateSurgeResponse,
    triggerScenario,
    activeScenario
  } = useSimulation();

  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  const scenarios = [
    { key: 'surge', name: 'Scenario 1: Sudden Crowd Surge (Zone B)', icon: AlertTriangle, color: 'var(--status-critical)' },
    { key: 'rain', name: 'Scenario 2: Heavy Rain Downpour', icon: CloudRain, color: 'var(--accent-saffron)' },
    { key: 'medical', name: 'Scenario 3: Mass Heatstroke Emergency', icon: HeartPulse, color: 'var(--status-critical)' },
    { key: 'lost_child', name: 'Scenario 4: Missing Child Alert', icon: Search, color: 'var(--accent-gold)' },
    { key: 'network_fail', name: 'Scenario 5: Zone C Network Failure', icon: WifiOff, color: '#f59e0b' }
  ];

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-accent)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Status Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent-saffron-glow)',
          color: 'var(--accent-saffron)'
        }}>
          <Zap size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-saffron)' }}>
            OPERATIONAL SIMULATION ENGINE
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Status: {isSimulating ? '● Running Real-Time Physics Tick Engine' : 'Paused — Baseline Data Frozen'}
            {activeScenario && <span style={{ color: 'var(--status-critical)', fontWeight: 700, marginLeft: '8px' }}>[Active: {activeScenario}]</span>}
          </div>
        </div>
      </div>

      {/* Main Controls Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Play/Pause */}
        {isSimulating ? (
          <button onClick={pauseSimulation} className="btn btn-secondary">
            <Pause size={15} /> Pause
          </button>
        ) : (
          <button onClick={startSimulation} className="btn btn-primary">
            <Play size={15} /> Start Simulation
          </button>
        )}

        {/* Reset */}
        <button onClick={resetSimulation} className="btn btn-secondary" title="Reset all state to baseline">
          <RotateCcw size={15} /> Reset Baseline
        </button>

        {/* Speed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-color)' }}>
          {[1, 2, 5].map(spd => (
            <button
              key={spd}
              onClick={() => setSimulationSpeed(spd)}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '4px',
                background: simulationSpeed === spd ? 'var(--accent-saffron)' : 'transparent',
                color: simulationSpeed === spd ? '#fff' : 'var(--text-secondary)'
              }}
            >
              {spd}×
            </button>
          ))}
        </div>
      </div>

      {/* Evaluation Demo Scenarios Dropdown & Emergency Response */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <button
          onClick={() => setShowScenarioMenu(!showScenarioMenu)}
          className="btn btn-danger"
          style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <AlertTriangle size={15} /> ⚡ DEMO SCENARIOS <ChevronDown size={14} />
        </button>

        {surgeTriggered && !surgeResponseActivated && (
          <button
            onClick={activateSurgeResponse}
            className="btn btn-primary animate-pulse"
            style={{ background: 'var(--status-low)', color: '#fff', fontWeight: 800 }}
          >
            <ShieldCheck size={16} /> 🛡️ ACTIVATE EMERGENCY RESPONSE
          </button>
        )}

        {showScenarioMenu && (
          <div className="card animate-slide-down" style={{
            position: 'absolute',
            right: 0,
            top: '44px',
            width: '310px',
            zIndex: 100,
            padding: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-accent)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '6px 8px', textTransform: 'uppercase' }}>
              Select Operational Demo Scenario
            </div>
            {scenarios.map(sc => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.key}
                  onClick={() => {
                    triggerScenario(sc.key);
                    setShowScenarioMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: activeScenario === sc.name ? 'var(--bg-elevated)' : 'transparent',
                    color: sc.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={14} />
                  <span>{sc.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
