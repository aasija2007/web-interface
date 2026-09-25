import React, { useState } from 'react';
import { Navigation, AlertTriangle, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import RiskBadge from './RiskBadge';
import Modal from './Modal';

export default function RouteCard({ route }) {
  const { updateRouteStatus } = useSimulation();
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActionClick = (targetStatus) => {
    if (targetStatus === 'CLOSED' || targetStatus === 'REDIRECTED') {
      setPendingStatus(targetStatus);
      setIsModalOpen(true);
    } else {
      updateRouteStatus(route.id, targetStatus);
    }
  };

  const confirmAction = () => {
    if (pendingStatus) {
      updateRouteStatus(route.id, pendingStatus);
      setPendingStatus(null);
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return 'badge-low';
      case 'RESTRICTED': return 'badge-medium';
      case 'REDIRECTED': return 'badge-high';
      case 'CLOSED': return 'badge-critical';
      default: return 'badge-low';
    }
  };

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="card-header" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={18} style={{ color: 'var(--accent-saffron)' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{route.name}</h4>
            </div>
            <span className={`badge ${getStatusBadge(route.status)}`}>{route.status}</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {route.description}
          </p>

          <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>CAPACITY UTILIZATION</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{route.capacityPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, route.capacityPercent)}%`,
                background: route.capacityPercent > 85 ? 'var(--status-critical)' : route.capacityPercent > 70 ? 'var(--status-high)' : 'var(--status-low)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>PATH: {route.path}</span>
            <RiskBadge level={route.riskLevel} showText={false} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
          <button
            onClick={() => handleActionClick('OPEN')}
            className={`btn btn-sm ${route.status === 'OPEN' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 6px', fontSize: '0.7rem' }}
          >
            OPEN
          </button>
          <button
            onClick={() => handleActionClick('RESTRICTED')}
            className={`btn btn-sm ${route.status === 'RESTRICTED' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 6px', fontSize: '0.7rem' }}
          >
            RESTRICT
          </button>
          <button
            onClick={() => handleActionClick('REDIRECTED')}
            className={`btn btn-sm ${route.status === 'REDIRECTED' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 6px', fontSize: '0.7rem' }}
          >
            REDIRECT
          </button>
          <button
            onClick={() => handleActionClick('CLOSED')}
            className={`btn btn-sm ${route.status === 'CLOSED' ? 'btn-danger' : 'btn-secondary'}`}
            style={{ padding: '4px 6px', fontSize: '0.7rem' }}
          >
            CLOSE
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Critical Route Action"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmAction} className="btn btn-danger">Confirm Action</button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <AlertTriangle size={32} style={{ color: 'var(--status-critical)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Change {route.name} to {pendingStatus}?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              This will update crowd redirection parameters across Command Center telemetry and alert field officers assigned to {route.path}.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
