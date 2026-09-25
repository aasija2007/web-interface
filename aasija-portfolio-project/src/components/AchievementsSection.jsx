import React from 'react';
import { Trophy, Code, Award, BookOpen, Star, Calendar } from 'lucide-react';
import { achievementsData } from '../data/portfolioData';

const iconMap = {
  Trophy: Trophy,
  Code: Code,
  Award: Award,
  BookOpen: BookOpen,
  Star: Star
};

const AchievementsSection = () => {
  return (
    <section id="achievements" className="reveal-on-scroll">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Milestones & Honors</p>
          <h2 className="section-title">Achievements</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {achievementsData.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Trophy;

            return (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderRadius: '24px',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 15px var(--glow-color)'
                    }}
                  >
                    <IconComponent size={24} />
                  </div>

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'var(--text-light)'
                    }}
                  >
                    <Calendar size={13} /> {item.date}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                    {item.title}
                  </h3>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '10px' }}>
                    {item.subtitle}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
