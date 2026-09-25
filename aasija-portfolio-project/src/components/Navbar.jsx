import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Code2 } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Education', href: '#education' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = ({ activeSection, theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '12px 24px' : '20px 24px',
        transition: 'all 0.3s ease',
        background: scrolled ? 'var(--bg-nav)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--glass-shadow)' : 'none'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px var(--glow-color)'
            }}
          >
            <Code2 size={22} color="#ffffff" />
          </div>
          <span
            className="gradient-text"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.4rem',
              fontWeight: '800',
              letterSpacing: '-0.5px'
            }}
          >
            Aasija K
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.name.toLowerCase();
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  position: 'relative',
                  padding: '6px 0',
                  transition: 'color 0.2s ease'
                }}
              >
                {link.name}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2.5px',
                      background: 'var(--primary-gradient)',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </a>
            );
          })}

          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              transition: 'all 0.3s ease',
              marginLeft: '8px'
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Mobile Actions Container */}
        <div style={{ display: 'none' }} className="mobile-controls">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginRight: '8px'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Menu"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            top: '100%',
            left: '16px',
            right: '16px',
            marginTop: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.name.toLowerCase();
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontSize: '1rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  display: 'block'
                }}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-controls {
            display: flex !important;
            alignItems: center;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
