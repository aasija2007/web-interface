import React, { useState, useEffect } from 'react';
import { Download, Send, Sparkles, Code, Terminal, Cpu } from 'lucide-react';
import { personalInfo, typingRoles } from '../data/portfolioData';

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = typingRoles[roleIndex];
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === currentRole) {
      typingSpeed = 2000; // Pause at end of text
      const timeout = setTimeout(() => setIsDeleting(true), typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % typingRoles.length);
      typingSpeed = 400;
    }

    const timeout = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentRole.substring(0, displayText.length - 1)
          : currentRole.substring(0, displayText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  const handleScrollToContact = (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        paddingTop: '100px'
      }}
    >
      <div className="section-container" style={{ paddingBottom: '60px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '50px',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          {/* Left Column - Details */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '30px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontWeight: '600',
                fontSize: '0.9rem',
                marginBottom: '20px'
              }}
            >
              <Sparkles size={16} /> Welcome to my Portfolio
            </div>

            <h1
              style={{
                fontSize: '3.2rem',
                lineHeight: 1.15,
                marginBottom: '16px',
                color: 'var(--text-main)'
              }}
            >
              Hi, I'm <span className="gradient-text">{personalInfo.name}</span>
            </h1>

            {/* Animated Typing Text */}
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: '700',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                color: 'var(--text-main)'
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>I am a</span>
              <span
                style={{
                  color: 'var(--primary)',
                  borderRight: '3px solid var(--primary)',
                  paddingRight: '4px',
                  animation: 'typingBlink 0.8s infinite'
                }}
              >
                {displayText}
              </span>
            </div>

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--text-muted)',
                marginBottom: '36px',
                maxWidth: '560px'
              }}
            >
              {personalInfo.bio}
            </p>

            {/* Call to Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <a
                href={personalInfo.resumeUrl}
                download="Aasija_K_Resume.pdf"
                className="btn-primary"
                onClick={(e) => {
                  // Fallback alert for demo download
                  e.preventDefault();
                  alert("Aasija K's Resume download initialized.");
                }}
              >
                <Download size={18} /> Download Resume
              </a>

              <a
                href="#contact"
                onClick={handleScrollToContact}
                className="btn-secondary"
              >
                <Send size={18} /> Contact Me
              </a>
            </div>

            {/* Quick Tech Badges */}
            <div
              style={{
                marginTop: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '600' }}>
                FOCUS AREAS:
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.82rem',
                    fontWeight: '600'
                  }}
                >
                  <Code size={14} color="var(--primary)" /> React & Web
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.82rem',
                    fontWeight: '600'
                  }}
                >
                  <Terminal size={14} color="var(--accent-pink)" /> Python
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.82rem',
                    fontWeight: '600'
                  }}
                >
                  <Cpu size={14} color="var(--accent-blue)" /> Java & SQL
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Image with Glassmorphism Frame */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '320px',
                height: '380px'
              }}
            >
              {/* Outer Glowing Background Backdrop */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-15px',
                  borderRadius: '32px',
                  background: 'var(--primary-gradient)',
                  filter: 'blur(20px)',
                  opacity: 0.4,
                  animation: 'pulseGlow 4s infinite ease-in-out'
                }}
              />

              {/* Glass Image Container */}
              <div
                className="glass-card animate-float"
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '16px',
                  borderRadius: '28px',
                  position: 'relative',
                  zIndex: 2,
                  overflow: 'hidden'
                }}
              >
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '20px'
                  }}
                  onError={(e) => {
                    // Fallback visual avatar if file path varies
                    e.target.style.display = 'none';
                    e.target.parentNode.style.background = 'var(--primary-gradient)';
                    e.target.parentNode.style.display = 'flex';
                    e.target.parentNode.style.alignItems = 'center';
                    e.target.parentNode.style.justifyContent = 'center';
                    e.target.parentNode.innerHTML = '<span style="font-size: 5rem; color: #fff; font-weight:800">AK</span>';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
        @media (max-width: 576px) {
          .hero-grid h1 {
            font-size: 2.2rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
