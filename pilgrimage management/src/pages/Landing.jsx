import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldAlert, Activity, Navigation, Radio, Users, CheckCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [pilgrimCount, setPilgrimCount] = useState(1842000);

  useEffect(() => {
    const timer = setInterval(() => {
      setPilgrimCount(prev => prev + Math.floor(Math.random() * 12) + 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Sticky Header */}
      <nav className="bg-glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.25rem',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            🪔
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              YATRAFLOW <span style={{ fontSize: '0.8rem', color: 'var(--accent-saffron)', fontWeight: 700 }}>🕉️ DEVSTHANAM</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="hide-mobile">
          <a href="#story" style={{ transition: 'color 0.2s' }}>Sacred Story</a>
          <a href="#gallery" style={{ transition: 'color 0.2s' }}>Devotional Gallery</a>
          <a href="#features" style={{ transition: 'color 0.2s' }}>Capabilities</a>
          <a href="#workflow" style={{ transition: 'color 0.2s' }}>Workflow</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/login')} className="btn btn-secondary btn-sm">
            Sign In
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm">
            Command Center <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Devotional Hero Section with High-Res Temple Hero Backdrop */}
      <section style={{
        position: 'relative',
        padding: '120px 24px 90px',
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Divine Halo */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, rgba(251, 191, 36, 0.08) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        {/* Live Pilgrim Telemetry Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(19, 27, 46, 0.85)',
          border: '1px solid var(--accent-gold-glow)',
          padding: '8px 20px',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '28px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <span className="live-dot" />
          <span style={{ color: '#fff' }}>🚩 SACRED YATRA TELEMETRY ACTIVE</span>
          <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>
            {(pilgrimCount / 1000000).toFixed(2)}M DEVOTEES MONITORED
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          marginBottom: '20px'
        }}>
          🪔 SAFEGUARDING SACRED GATHERINGS<br />
          <span style={{
            background: 'linear-gradient(135deg, #ffffff 20%, var(--accent-gold) 60%, var(--accent-saffron) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Move Millions with Divine Precision & Care.
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
          color: 'var(--text-secondary)',
          maxWidth: '720px',
          margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          “AI-powered real-time crowd dynamics, predictive flow control, and rapid emergency response tailored for Mahakumbh, Temple Festivals, & Sacred Yatra Corridors.”
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.02em' }}>
            ENTER COMMAND CENTER 🚩 <ArrowRight size={18} />
          </button>
          <a href="#gallery" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            🪔 EXPLORE DEVOTIONAL GALLERY
          </a>
        </div>

        {/* Hero Image Showcase Card */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '2px solid var(--accent-saffron)',
          boxShadow: 'var(--devotional-banner-glow)',
          maxHeight: '520px'
        }}>
          <img
            src="/images/temple_hero.jpg"
            alt="Devotional Temple Festival"
            style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
          />

          {/* Devotional Overlay Content */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(7, 10, 18, 0.95) 0%, rgba(7, 10, 18, 0.5) 60%, transparent 100%)',
            padding: '30px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                🕉️ MAHOTSAVAM LIVE COMMAND VIEW
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                Sacred Sanctum & Riverfront Corridor Monitoring
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Simulating gate throughput, pilgrim crowd density, and emergency response across 5 sectors.
              </div>
            </div>

            <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm" style={{ padding: '10px 20px' }}>
              Launch Operational Map
            </button>
          </div>
        </div>
      </section>

      {/* Devotional Gallery Section */}
      <section id="gallery" style={{ padding: '90px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
              🪔 SACRED PILGRIMAGE CORRIDORS
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>
              Safeguarding Faith Across Sacred Spheres
            </h2>
          </div>

          <div className="grid-cols-12">
            <div className="col-span-4 card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color-hover)' }}>
              <img src="/images/sacred_ghats.jpg" alt="Sacred River Ghats Aarti" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-saffron)', marginBottom: '4px' }}>ZONE E — RIVER GHATS</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Holy Dip & Ghat Consecration</h3>
                <p style={{ fontSize: '0.82rem' }}>Continuous riverfront monitoring with life-saving boat patrols and bathing step crowd density tracking.</p>
              </div>
            </div>

            <div className="col-span-4 card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color-hover)' }}>
              <img src="/images/holy_procession.jpg" alt="Grand Ratha Yatra Procession" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '4px' }}>ZONE A & B — PROCESSIONAL CORRIDOR</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Ratha Yatra Chariot Movement</h3>
                <p style={{ fontSize: '0.82rem' }}>Real-time vector flow control to prevent bottleneck pinches during major chariot processions.</p>
              </div>
            </div>

            <div className="col-span-4 card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color-hover)' }}>
              <img src="/images/sacred_sanctum.jpg" alt="Inner Temple Sanctum Corridor" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-vermilion)', marginBottom: '4px' }}>ZONE B — DEVSTHANAM SANCTUM</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Inner Sanctum Queue Management</h3>
                <p style={{ fontSize: '0.82rem' }}>Automatic queue throttling to preserve serene devotional atmosphere while ensuring swift darshan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Core Workflow */}
      <section id="workflow" style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-saffron)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Operational Engine
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>MONITOR → PREDICT → DECIDE → RESPOND</h2>
        </div>

        <div className="grid-cols-12">
          <div className="col-span-3 card" style={{ background: 'var(--devotional-card-bg)', borderTop: '3px solid var(--accent-saffron)' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-elevated)', color: 'var(--accent-saffron)', width: 'max-content', marginBottom: '16px' }}>
              <Compass size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STEP 1</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 10px' }}>1. MONITOR</h3>
            <p style={{ fontSize: '0.85rem' }}>Track live pilgrim movement across entry gates, processional corridors, and sacred riverfront ghats.</p>
          </div>

          <div className="col-span-3 card" style={{ background: 'var(--devotional-card-bg)', borderTop: '3px solid var(--accent-gold)' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-elevated)', color: 'var(--accent-gold)', width: 'max-content', marginBottom: '16px' }}>
              <Activity size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STEP 2</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 10px' }}>2. PREDICT</h3>
            <p style={{ fontSize: '0.85rem' }}>Calculate 30-min and 60-min crowd projections using flow algorithms to anticipate peak pressure windows.</p>
          </div>

          <div className="col-span-3 card" style={{ background: 'var(--devotional-card-bg)', borderTop: '3px solid var(--accent-blue)' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-elevated)', color: 'var(--accent-blue)', width: 'max-content', marginBottom: '16px' }}>
              <ShieldAlert size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STEP 3</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 10px' }}>3. DECIDE</h3>
            <p style={{ fontSize: '0.85rem' }}>Receive decision-support recommendations to throttle gate inflow and open relief bypass routes.</p>
          </div>

          <div className="col-span-3 card" style={{ background: 'var(--devotional-card-bg)', borderTop: '3px solid var(--status-low)' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-elevated)', color: 'var(--status-low)', width: 'max-content', marginBottom: '16px' }}>
              <Radio size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STEP 4</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 10px' }}>4. RESPOND</h3>
            <p style={{ fontSize: '0.85rem' }}>Dispatch police, volunteer teams, and medical units instantly to clear bottlenecks and assist pilgrims.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '90px 24px', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '32px' }}>
          🪔 Ready to Launch Devsthanam Command Center?
        </h2>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem', fontWeight: 800 }}>
          ENTER COMMAND CENTER 🚩 <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}
