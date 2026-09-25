import React from 'react';
import { X, Award, Download, CheckCircle, ExternalLink } from 'lucide-react';

const CertificateModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          borderRadius: '24px',
          position: 'relative',
          background: 'var(--bg-color)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span
            style={{
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.82rem',
              fontWeight: '700',
              display: 'inline-block',
              marginBottom: '10px'
            }}
          >
            {certificate.badge}
          </span>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '4px' }}>
            {certificate.title}
          </h3>
          <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.92rem' }}>
            Issued by {certificate.issuer} • {certificate.date}
          </p>
        </div>

        {/* Certificate Real Image Preview */}
        {certificate.image && (
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              background: '#ffffff'
            }}
          >
            <img
              src={certificate.image}
              alt={certificate.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        )}

        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
          {certificate.description}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <a
            href={certificate.downloadLink}
            download
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
          >
            <Download size={18} /> Download Official PDF
          </a>

          <a
            href={certificate.downloadLink}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={18} /> Open PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
