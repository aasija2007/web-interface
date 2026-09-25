import React, { useEffect, useState } from 'react';
import { Code2, Sparkles } from 'lucide-react';

const Preloader = ({ onLoaded }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        if (onLoaded) onLoaded();
      }, 500);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'var(--bg-gradient-start)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
        opacity: fade ? 0 : 1,
        pointerEvents: fade ? 'none' : 'all'
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: '40px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          borderRadius: '24px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px var(--glow-color)',
              animation: 'pulseGlow 1.5s infinite ease-in-out'
            }}
          >
            <Code2 size={36} color="#ffffff" />
          </div>
          <Sparkles
            size={24}
            color="var(--accent-pink)"
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        </div>
        <h2 className="gradient-text" style={{ fontSize: '1.8rem', letterSpacing: '1px' }}>
          Aasija K
        </h2>
        <div
          style={{
            width: '140px',
            height: '4px',
            background: 'var(--border-color)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '50%',
              height: '100%',
              background: 'var(--primary-gradient)',
              borderRadius: '2px',
              animation: 'loadingBar 1.2s infinite ease-in-out'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
