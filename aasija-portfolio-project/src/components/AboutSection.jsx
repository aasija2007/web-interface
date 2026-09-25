import React, { useState, useEffect, useRef } from 'react';
import { User, GraduationCap, Code2, Award, FolderCheck, BookOpen } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

const CounterCard = ({ label, targetValue, suffix }) => {
  const [count, setCount] = useState(0);
  const cardRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500;
          const stepTime = Math.max(Math.floor(duration / targetValue), 30);

          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= targetValue) {
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [targetValue, hasAnimated]);

  return (
    <div
      ref={cardRef}
      className="glass-card"
      style={{
        padding: '24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}
    >
      <h3
        className="gradient-text"
        style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: 1 }}
      >
        {count}{suffix}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
        {label}
      </p>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="reveal-on-scroll">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Get to know me</p>
          <h2 className="section-title">About Me</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '40px',
            alignItems: 'stretch'
          }}
          className="about-grid"
        >
          {/* Left Side: Key Info Card */}
          <div
            className="glass-card"
            style={{
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px'
            }}
          >
            <div>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <User size={26} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>
                Engineering Aspirant & Web Enthusiast
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.98rem' }}>
                {personalInfo.aboutText}
              </p>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <GraduationCap size={20} color="var(--primary)" />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Degree</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {personalInfo.degree}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Code2 size={20} color="var(--accent-pink)" />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Passionate Domains</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    Web Development, Java, Python & Full Stack
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Summary Paragraph & Animated Counters Grid */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              justifyContent: 'space-between'
            }}
          >
            <div
              className="glass-card"
              style={{
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Professional Summary</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Dedicated Computer Science student with strong problem-solving capabilities and analytical thinking. Proficient in object-oriented programming with Java and Python, relational database design with SQL, and modern web application development with HTML, CSS, JavaScript, and React. Committed to building clean, accessible, and high-performance applications.
              </p>
            </div>

            {/* Animated Counters Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px'
              }}
              className="counters-grid"
            >
              {personalInfo.counters.map((c, i) => (
                <CounterCard key={i} label={c.label} targetValue={c.value} suffix={c.suffix} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .counters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
