import React, { useState } from 'react';
import { Award, Eye, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { certificatesData } from '../data/portfolioData';
import CertificateModal from './CertificateModal';

const INITIAL_CERTIFICATE_COUNT = 6;

const CertificatesSection = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleCertificates = showAll
    ? certificatesData
    : certificatesData.slice(0, INITIAL_CERTIFICATE_COUNT);

  return (
    <section id="certificates" className="reveal-on-scroll">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Verified Accomplishments</p>
          <h2 className="section-title">Certificates</h2>
        </div>

        {/* Certificates Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '36px'
          }}
        >
          {visibleCertificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '20px',
                overflow: 'hidden'
              }}
            >
              {/* Image Preview Thumbnail */}
              {cert.image && (
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'var(--primary-light)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedCert(cert)}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff'
                    }}
                  >
                    {cert.badge}
                  </span>
                </div>
              )}

              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                    {cert.title}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '10px' }}>
                    {cert.issuer}
                  </p>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      marginBottom: '18px'
                    }}
                  >
                    {cert.description}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '14px'
                  }}
                >
                  <button
                    onClick={() => setSelectedCert(cert)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'var(--primary-gradient)',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Eye size={15} /> Preview
                  </button>

                  <a
                    href={cert.downloadLink}
                    download
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <Download size={15} /> PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All / Show Less Toggle Button */}
        {certificatesData.length > INITIAL_CERTIFICATE_COUNT && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="btn-secondary"
              style={{
                padding: '14px 32px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '30px'
              }}
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp size={18} />
                </>
              ) : (
                <>
                  View All Certificates ({certificatesData.length}) <ChevronDown size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal View */}
      <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
    </section>
  );
};

export default CertificatesSection;
