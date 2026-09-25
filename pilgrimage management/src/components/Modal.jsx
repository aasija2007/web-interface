import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="animate-slide-down" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0f172a',
        border: '1.5px solid #334155',
        borderRadius: '16px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          {children}
        </div>

        {footer && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
