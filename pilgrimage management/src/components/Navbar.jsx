import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Radio,
  Shield,
  Clock,
  MapPin,
  User,
  ChevronDown,
  Building,
  LogOut,
  Lock,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function Navbar({ onToggleNotifications, unreadNotifCount }) {
  const navigate = useNavigate();
  const {
    eventInfo,
    currentUser,
    userRole,
    logoutUser,
    templesList,
    activeTemple,
    activeTempleId,
    switchActiveTemple,
    theme,
    toggleTheme
  } = useSimulation();

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTempleMenu, setShowTempleMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setShowProfileMenu(false);
    navigate('/login');
  };

  // Determine if temple switching is allowed for this user
  const isGovtAdmin = currentUser?.role === 'govt_admin';
  const isPilgrim = currentUser?.isPilgrim;
  const assignedTempleName = templesList.find(t => t.id === currentUser?.assignedTempleId)?.name || currentUser?.assignedTempleId || activeTemple?.name;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: '#0b101d',
      borderBottom: '1px solid #1e293b',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Brand & Live Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate(isPilgrim ? '/pilgrim-portal' : '/dashboard')}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1rem',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            🪔
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              YATRAFLOW
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--accent-saffron)', letterSpacing: '0.08em' }}>
              {isPilgrim ? 'DEVOTEE PILGRIM PORTAL' : 'INTELLIGENT CROWD COMMAND'}
            </div>
          </div>
        </div>

        <span className="badge badge-low" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="live-dot" /> LIVE TELEMETRY
        </span>
      </div>

      {/* Center Event & Location Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }} className="hide-mobile">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={14} style={{ color: 'var(--accent-saffron)' }} />
          <span><strong>Precinct:</strong> {activeTemple?.name || 'Sanctum Ground'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={14} style={{ color: 'var(--accent-gold)' }} />
          <span>{activeTemple?.location || eventInfo.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{time}</span>
        </div>
      </div>

      {/* System Controls & Profile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Theme Toggle (Light / Dark Mode) */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle Theme"
          style={{ color: theme === 'dark' ? 'var(--accent-gold)' : 'var(--accent-saffron)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          className="btn-icon"
          style={{ position: 'relative' }}
          aria-label="Toggle Notification Drawer"
        >
          <Bell size={18} />
          {unreadNotifCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--status-critical)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadNotifCount}
            </span>
          )}
        </button>

        {/* Temple Precinct Selector (Switch shrine complex for all users & pilgrims) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowTempleMenu(!showTempleMenu); setShowProfileMenu(false); }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid var(--accent-gold)', color: 'var(--accent-gold)', background: '#1e293b' }}
            title="Click to shift to another Temple Shrine"
          >
            <Building size={14} />
            <span style={{ fontWeight: 800 }}>{activeTemple ? activeTemple.name.split(' ')[0] : 'Temple'}</span>
            <ChevronDown size={13} />
          </button>

          {showTempleMenu && (
            <div className="animate-slide-down" style={{
              position: 'absolute',
              right: 0,
              top: '42px',
              width: '280px',
              zIndex: 99999,
              padding: '10px',
              background: '#0f172a',
              border: '1.5px solid var(--accent-gold)',
              borderRadius: '14px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-gold)', padding: '6px 8px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', marginBottom: '8px' }}>
                <span>Select Temple Shrine</span>
                <span style={{ color: 'var(--accent-saffron)' }}>{templesList.length} Shrines Available</span>
              </div>
              {templesList.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    switchActiveTemple(t.id);
                    setShowTempleMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    background: activeTempleId === t.id ? '#1e293b' : 'transparent',
                    border: activeTempleId === t.id ? '1px solid var(--accent-saffron)' : '1px solid transparent',
                    color: activeTempleId === t.id ? 'var(--accent-saffron)' : 'var(--text-primary)',
                    display: 'block',
                    marginBottom: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{t.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.location} • {t.currentCrowd.toLocaleString()} Devotees Live</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Badge & Drawer Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowTempleMenu(false); }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#1e293b', border: '1px solid #334155' }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: isPilgrim ? 'var(--accent-saffron-glow)' : 'var(--accent-gold-glow)',
              color: isPilgrim ? 'var(--accent-saffron)' : 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem'
            }}>
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {currentUser?.name || 'User'}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--accent-saffron)', fontWeight: 600 }}>
                {currentUser?.roleTitle || userRole.title}
              </span>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </button>

          {/* User Profile Modal / Drawer */}
          {showProfileMenu && (
            <div className="animate-slide-down" style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '310px',
              zIndex: 99999,
              padding: '18px',
              background: '#0f172a',
              border: '1.5px solid var(--accent-gold)',
              borderRadius: '16px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #1e293b' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-gold))',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.2rem'
                }}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                    {currentUser?.name || 'Authenticated User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    {currentUser?.roleTitle}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {currentUser?.email || currentUser?.username}
                  </div>
                </div>
              </div>

              {/* User Details Grid */}
              <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Temple:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{assignedTempleName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Event:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{currentUser?.assignedEventId || 'Mahotsavam 2026'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Access Level:</span>
                  <span className="badge badge-low" style={{ fontSize: '0.62rem' }}>
                    {isPilgrim ? 'PILGRIM SERVICES' : (isGovtAdmin ? 'FULL SYSTEM COMMAND' : 'OPERATIONAL CLEARANCE')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <span style={{ color: 'var(--status-low)', fontWeight: 800 }}>● Active Session</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Authentication:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {currentUser?.lastLogin || 'Today'}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: 800 }}
              >
                <LogOut size={16} /> LOGOUT / EXIT SESSION
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
