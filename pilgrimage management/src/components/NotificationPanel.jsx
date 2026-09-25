import React from 'react';
import { X, Bell, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function NotificationPanel({ isOpen, onClose }) {
  const { notifications, markNotificationRead, clearNotifications } = useSimulation();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'CRITICAL': return <AlertTriangle size={16} style={{ color: 'var(--status-critical)' }} />;
      case 'WARNING': return <AlertTriangle size={16} style={{ color: 'var(--status-medium)' }} />;
      case 'SUCCESS': return <CheckCircle2 size={16} style={{ color: 'var(--status-low)' }} />;
      default: return <Info size={16} style={{ color: 'var(--accent-blue)' }} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '380px',
      maxWidth: '90vw',
      background: 'var(--bg-card)',
      borderLeft: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideUp 0.3s ease'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--accent-saffron)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>LIVE NOTIFICATIONS</h3>
        </div>
        <button onClick={onClose} className="btn-icon">
          <X size={18} />
        </button>
      </div>

      {/* Action Bar */}
      <div style={{
        padding: '10px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <span>{notifications.length} Total Alerts</span>
        <button onClick={clearNotifications} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Trash2 size={12} /> Clear All
        </button>
      </div>

      {/* Notification List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No new alerts in queue.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              style={{
                background: n.read ? 'var(--bg-secondary)' : 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getIcon(n.type)}
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '22px' }}>
                {n.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
