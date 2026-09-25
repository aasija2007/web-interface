import React from 'react';
import { DoorOpen, Users, AlertCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import RiskBadge from './RiskBadge';

export default function GateCard({ gate }) {
  const { updateGateStatus } = useSimulation();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return 'badge-low';
      case 'LIMITED': return 'badge-medium';
      case 'PAUSED': return 'badge-high';
      case 'CLOSED': return 'badge-critical';
      default: return 'badge-low';
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DoorOpen size={18} style={{ color: 'var(--accent-saffron)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{gate.name}</h4>
          </div>
          <span className={`badge ${getStatusBadge(gate.status)}`}>{gate.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.035)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>THROUGHPUT</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {gate.peoplePerMin} / min
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.035)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>QUEUE LENGTH</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {gate.queueLength} ppl
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '14px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Max Capacity: {gate.maxCapacity}/min</span>
          <RiskBadge level={gate.riskLevel} showText={false} />
        </div>
      </div>

      {/* Action Buttons strictly modifying React State */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', paddingTop: '12px' }}>
        <button
          onClick={() => updateGateStatus(gate.id, 'OPEN')}
          className={`btn btn-sm ${gate.status === 'OPEN' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 6px', fontSize: '0.7rem' }}
        >
          OPEN
        </button>
        <button
          onClick={() => updateGateStatus(gate.id, 'LIMITED')}
          className={`btn btn-sm ${gate.status === 'LIMITED' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 6px', fontSize: '0.7rem' }}
        >
          LIMITED
        </button>
        <button
          onClick={() => updateGateStatus(gate.id, 'PAUSED')}
          className={`btn btn-sm ${gate.status === 'PAUSED' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 6px', fontSize: '0.7rem' }}
        >
          PAUSE
        </button>
        <button
          onClick={() => updateGateStatus(gate.id, 'CLOSED')}
          className={`btn btn-sm ${gate.status === 'CLOSED' ? 'btn-danger' : 'btn-secondary'}`}
          style={{ padding: '4px 6px', fontSize: '0.7rem' }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
