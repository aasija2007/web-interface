import React, { useState, useEffect } from 'react';
import { Mail, ArrowUp, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolioData';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(16px)',
        padding: '50px 24px 30px'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          textAlign: 'center'
        }}
      >
        {/* Logo Title */}
        <h3
          className="gradient-text"
          style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: '800' }}
        >
          Aasija K
        </h3>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
          Computer Science Engineering Student • Aspiring Full Stack Developer passionate about crafting clean, modern web applications.
        </p>

        {/* Social Icons Row */}
        <div style={{ display: 'flex', gap: '16px', margin: '8px 0' }}>
          <a
            href={personalInfo.contact.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <GithubIcon size={20} />
          </a>

          <a
            href={personalInfo.contact.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <LinkedinIcon size={20} />
          </a>

          <a
            href={personalInfo.contact.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.color = 'var(--accent-pink)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <InstagramIcon size={20} />
          </a>

          <a
            href={`mailto:${personalInfo.contact.email}`}
            aria-label="Gmail"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.color = 'var(--accent-blue)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            width: '100%',
            paddingTop: '20px',
            fontSize: '0.85rem',
            color: 'var(--text-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          © {new Date().getFullYear()} Aasija K. Designed & Built with <Heart size={14} color="var(--accent-pink)" fill="var(--accent-pink)" />
        </div>
      </div>

      {/* Floating Back-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px var(--glow-color)',
            zIndex: 99,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <ArrowUp size={22} />
        </button>
      )}
    </footer>
  );
};

export default Footer;
