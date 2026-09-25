import React from 'react';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { educationData } from '../data/portfolioData';

const EducationSection = () => {
  return (
    <section id="education" className="reveal-on-scroll">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Academic Journey</p>
          <h2 className="section-title">Education</h2>
        </div>

        {/* Timeline Container */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            paddingLeft: '30px'
          }}
          className="timeline-wrapper"
        >
          {/* Vertical Timeline Line */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              bottom: '10px',
              left: '12px',
              width: '3px',
              background: 'var(--primary-gradient)',
              borderRadius: '2px'
            }}
          />

          {educationData.map((edu, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                marginBottom: '40px'
              }}
            >
              {/* Timeline Node Icon */}
              <div
                style={{
                  position: 'absolute',
                  left: '-38px',
                  top: '0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px var(--glow-color)',
                  zIndex: 2
                }}
              >
                <GraduationCap size={16} />
              </div>

              {/* Glass Content Card */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '10px'
                  }}
                >
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>
                    {edu.degree}
                  </h3>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontSize: '0.82rem',
                      fontWeight: '600'
                    }}
                  >
                    <Calendar size={14} /> {edu.period}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '14px'
                  }}
                >
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                    {edu.institution}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: 'var(--accent-pink)'
                    }}
                  >
                    <Award size={14} /> {edu.score}
                  </span>
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 576px) {
          .timeline-wrapper {
            paddingLeft: 20px !important;
          }
          .timeline-wrapper > div > div:first-child {
            left: -28px !important;
            width: 26px !important;
            height: 26px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default EducationSection;
