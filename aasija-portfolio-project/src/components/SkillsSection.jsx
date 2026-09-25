import React, { useState, useEffect, useRef } from 'react';
import { Code, Wrench, Users, CheckCircle2 } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

const SkillBar = ({ name, level }) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const barRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimatedWidth(level);
        }
      },
      { threshold: 0.2 }
    );

    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [level]);

  return (
    <div ref={barRef} style={{ marginBottom: '18px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '0.92rem',
          fontWeight: '600'
        }}
      >
        <span>{name}</span>
        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{animatedWidth}%</span>
      </div>

      <div
        style={{
          width: '100%',
          height: '10px',
          borderRadius: '5px',
          background: 'var(--border-color)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${animatedWidth}%`,
            background: 'var(--primary-gradient)',
            borderRadius: '5px',
            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="reveal-on-scroll">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Technical Proficiency</p>
          <h2 className="section-title">Skills & Expertise</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '30px'
          }}
          className="skills-grid"
        >
          {/* Programming Languages - Animated Progress Bars */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Code size={22} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Programming Languages</h3>
            </div>

            <div>
              {skillsData.programming.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>

          {/* Right Column: Tools & Soft Skills Stacked */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px'
            }}
          >
            {/* Tools Section */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--primary-light)',
                    color: 'var(--accent-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Wrench size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem' }}>Development Tools</h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px'
                }}
              >
                {skillsData.tools.map((tool) => (
                  <div
                    key={tool.name}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--primary)" />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{tool.name}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tool.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills Section */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--primary-light)',
                    color: 'var(--accent-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Users size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem' }}>Soft Skills</h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px'
                }}
              >
                {skillsData.softSkills.map((soft) => (
                  <div
                    key={soft.name}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--accent-pink)" />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{soft.name}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{soft.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SkillsSection;
