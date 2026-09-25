import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { ShieldAlert, ArrowLeft, Building, Lock } from 'lucide-react';

export default function ProtectedRoute({ requiredPermission }) {
  const { currentUser, hasPermission, templesList } = useSimulation();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Unauthenticated -> Redirect to Login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Pilgrim Route Guard -> Pilgrims trying to access operational dashboards are redirected to Pilgrim Portal
  const workerOnlyPaths = [
    '/dashboard', '/analytics', '/admin', '/audit-log', '/event-control',
    '/temples', '/field-operations', '/network-health', '/infrastructure',
    '/resource-prediction', '/risk-intelligence'
  ];

  if (currentUser.isPilgrim && workerOnlyPaths.includes(location.pathname)) {
    return <Navigate to="/pilgrim-portal" replace />;
  }

  // 3. Permission Authorization Check
  if (requiredPermission && !hasPermission(requiredPermission)) {
    const userTemple = templesList.find(t => t.id === currentUser.assignedTempleId)?.name || currentUser.assignedTempleId || 'All Temples';

    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div className="card animate-slide-up" style={{
          maxWidth: '540px',
          width: '100%',
          border: '1px solid var(--status-critical-border)',
          background: 'var(--devotional-card-bg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '36px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--status-critical-bg)',
            border: '2px solid var(--status-critical)',
            color: 'var(--status-critical)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
          }}>
            <Lock size={32} />
          </div>

          <span className="badge badge-critical" style={{ marginBottom: '12px' }}>
            RESTRICTED ACCESS AREA
          </span>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
            ACCESS DENIED
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            You do not have permission to access this section of the YatraFlow platform.
          </p>

          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            border: '1px solid var(--border-color)',
            marginBottom: '28px',
            textAlign: 'left',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Account:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{currentUser.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Role:</span>
              <span style={{ color: 'var(--accent-saffron)', fontWeight: 700 }}>{currentUser.roleTitle}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Precinct:</span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{userTemple}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(currentUser.isPilgrim ? '/pilgrim-portal' : '/dashboard')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontWeight: 700 }}
          >
            <ArrowLeft size={16} /> Return to Authorized Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
