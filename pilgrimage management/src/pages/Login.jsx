import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  UserCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  KeyRound,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { WORKER_ROLES, MOCK_USERS } from '../data/mockData';

export default function Login() {
  const navigate = useNavigate();
  const { loginWorker, loginPilgrim } = useSimulation();

  // Mode Selection: 'credentials' (Staff Login) vs 'pilgrim' (Devotee Portal)
  const [accessMode, setAccessMode] = useState('credentials');

  // Active Role Selection
  const [selectedRole, setSelectedRole] = useState(WORKER_ROLES[0]);

  // Credentials Form State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [mismatchData, setMismatchData] = useState(null);

  // Pilgrim Access State
  const [pilgrimEmail, setPilgrimEmail] = useState('');
  const [pilgrimError, setPilgrimError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Staff Credentials Login Handler
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setMismatchData(null);
    setIsLoading(true);

    const res = await loginWorker(selectedRole.id, username, password);
    setIsLoading(false);

    if (!res.success) {
      if (res.mismatch) {
        setMismatchData(res);
      } else {
        setLoginError(res.error || 'Invalid username or password.');
      }
      return;
    }

    if (res.user?.isPilgrim) {
      navigate('/pilgrim-portal');
    } else {
      navigate('/dashboard');
    }
  };

  // 2. Devotee / Pilgrim Portal Access Handler
  const handlePilgrimSubmit = async (e) => {
    e.preventDefault();
    setPilgrimError('');
    setIsLoading(true);

    const res = await loginPilgrim(pilgrimEmail || 'devotee@yatra.dev');
    setIsLoading(false);

    if (res.success) {
      navigate('/pilgrim-portal');
    } else {
      setPilgrimError(res.error || 'Failed to authenticate pilgrim access.');
    }
  };

  // Quick Demo Account Autofill Helper
  const quickFillCredentials = (demoUser) => {
    const roleObj = WORKER_ROLES.find(r => r.id === demoUser.role) || WORKER_ROLES[0];
    setSelectedRole(roleObj);
    setUsername(demoUser.username);
    setPassword(demoUser.password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#060913',
      padding: '32px 16px'
    }}>
      <div className="animate-slide-up" style={{
        maxWidth: '560px',
        width: '100%',
        border: '1.5px solid #334155',
        background: '#0f172a',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
        borderRadius: '24px',
        padding: '36px 32px'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            color: '#fff',
            margin: '0 auto 12px',
            boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)'
          }}>
            🪔
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
            🕉️ DEVSTHANAM COMMAND CENTRE
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '6px' }}>
            YATRAFLOW LOGIN
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Official Authentication System for Pilgrimage Management
          </p>
        </div>

        {/* Access Mode Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: '#0b101d',
          padding: '6px',
          borderRadius: '14px',
          marginBottom: '28px',
          border: '1px solid #1e293b'
        }}>
          <button
            type="button"
            onClick={() => { setAccessMode('credentials'); setMismatchData(null); }}
            style={{
              padding: '12px 10px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: accessMode === 'credentials' ? '#ffffff' : 'var(--text-secondary)',
              background: accessMode === 'credentials' ? 'linear-gradient(135deg, var(--accent-saffron) 0%, #ea580c 100%)' : 'transparent',
              boxShadow: accessMode === 'credentials' ? '0 4px 16px rgba(249, 115, 22, 0.4)' : 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            <Shield size={16} /> Official Staff Login
          </button>

          <button
            type="button"
            onClick={() => { setAccessMode('pilgrim'); setMismatchData(null); }}
            style={{
              padding: '12px 10px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: accessMode === 'pilgrim' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: accessMode === 'pilgrim' ? '#1e293b' : 'transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            <UserCheck size={16} /> Devotee Access
          </button>
        </div>

        {/* ========================================================================
            MODE 1: OFFICIAL STAFF CREDENTIALS LOGIN
            ======================================================================== */}
        {accessMode === 'credentials' && (
          <div>
            {mismatchData ? (
              /* Role Mismatch Error View */
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--status-critical-bg)',
                  border: '2px solid var(--status-critical)',
                  color: 'var(--status-critical)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <AlertTriangle size={30} />
                </div>

                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--status-critical)', marginBottom: '8px' }}>
                  ROLE AUTHORIZATION MISMATCH
                </h2>

                <p style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600, marginBottom: '20px' }}>
                  This account is assigned to <strong>{mismatchData.assignedRoleTitle}</strong>.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const correctRole = WORKER_ROLES.find(r => r.id === mismatchData.assignedUser.role) || WORKER_ROLES[0];
                    setSelectedRole(correctRole);
                    setMismatchData(null);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontWeight: 800 }}
                >
                  Switch to Assigned Role ({mismatchData.assignedRoleTitle})
                </button>
              </div>
            ) : (
              /* Credentials Form */
              <form onSubmit={handleCredentialsSubmit} className="animate-fade-in">
                {/* Role Selector */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Select Operational Role
                  </label>
                  <select
                    value={selectedRole.id}
                    onChange={(e) => {
                      const r = WORKER_ROLES.find(item => item.id === e.target.value);
                      if (r) setSelectedRole(r);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#141e33',
                      border: '1.5px solid #334155',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      fontWeight: 700
                    }}
                  >
                    {WORKER_ROLES.map(role => (
                      <option key={role.id} value={role.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                        {role.title} — {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Username / Official ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter username (e.g. admin or ops_officer)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', fontSize: '0.9rem', background: '#141e33', border: '1.5px solid #334155', borderRadius: '10px' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '12px 40px 12px 14px', fontSize: '0.9rem', background: '#141e33', border: '1.5px solid #334155', borderRadius: '10px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div style={{
                    background: 'var(--status-critical-bg)',
                    border: '1px solid var(--status-critical-border)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: 'var(--status-critical)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '20px'
                  }}>
                    ⚠️ {loginError}
                  </div>
                )}

                {/* Quick Demo Credentials Fill */}
                <div style={{
                  background: '#0b101d',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    ⚡ QUICK DEMO LOGIN (ONE-CLICK FILL):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {MOCK_USERS.map(u => (
                      <button
                        key={u.userId}
                        type="button"
                        onClick={() => quickFillCredentials(u)}
                        style={{
                          fontSize: '0.72rem',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: '#1e293b',
                          border: '1px solid #334155',
                          color: 'var(--text-primary)',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {u.roleTitle}: <span style={{ color: 'var(--accent-saffron)' }}>{u.username}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800, borderRadius: '12px' }}
                >
                  {isLoading ? 'AUTHENTICATING...' : `LOGIN TO COMMAND DASHBOARD`} <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================
            MODE 2: DEVOTEE / PILGRIM PORTAL ACCESS
            ======================================================================== */}
        {accessMode === 'pilgrim' && (
          <form onSubmit={handlePilgrimSubmit} className="animate-fade-in">
            <div style={{
              background: '#0b101d',
              borderRadius: '16px',
              padding: '22px',
              border: '1px solid #1e293b',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={18} /> Devotee Portal Entry
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Email Address or Mobile Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. pilgrim@example.com"
                  value={pilgrimEmail}
                  onChange={(e) => setPilgrimEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', fontSize: '0.95rem', background: '#141e33', border: '1.5px solid #334155', borderRadius: '10px' }}
                />
              </div>

              {pilgrimError && (
                <div style={{ color: 'var(--status-critical)', fontSize: '0.8rem', fontWeight: 600, marginTop: '8px' }}>
                  ⚠️ {pilgrimError}
                </div>
              )}
            </div>

            <div style={{
              background: 'rgba(6, 182, 212, 0.05)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '24px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                Included Devotee Services:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
                <span>• Digital Yatra Pass</span>
                <span>• Live Sanctum Map</span>
                <span>• Estimated Wait Times</span>
                <span>• Public Safety Alerts</span>
                <span>• Transport & Shuttles</span>
                <span>• Lost & Found Desk</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--accent-cyan), #0891b2)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px'
              }}
            >
              {isLoading ? 'ENTERING PORTAL...' : 'ENTER DEVOTEE PORTAL'} <ArrowRight size={18} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
