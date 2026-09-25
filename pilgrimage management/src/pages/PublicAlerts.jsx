import React, { useState } from 'react';
import { Radio, AlertTriangle, Send, ShieldCheck, CheckCircle, Bell, Volume2, Smartphone } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function PublicAlerts() {
  const { publicAlerts, createPublicAlert, setPublicAlerts, logAuditAction } = useSimulation();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('WARNING');
  const [targetAudience, setTargetAudience] = useState('All Pilgrims');
  const [selectedChannels, setSelectedChannels] = useState(['Mobile App', 'LED Boards', 'PA System']);
  const [sentSuccess, setSentSuccess] = useState(false);

  const toggleChannel = (ch) => {
    setSelectedChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const handleBroadcastAlert = (e) => {
    e.preventDefault();
    if (!title || !message) return;

    createPublicAlert({
      title,
      message,
      category,
      targetAudience,
      channels: selectedChannels
    });

    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  const handleDismissAlert = (id) => {
    setPublicAlerts(prev => prev.filter(a => a.id !== id));
    logAuditAction("Public Alert Dismissed", id, "DISMISSED", "Operator dismissed broadcast", "Public Communication");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Radio size={24} style={{ color: 'var(--accent-saffron)' }} />
            PUBLIC ALERT & COMMUNICATION CENTER
          </h1>
          <p className="page-subtitle">Multi-channel public broadcast center for announcements, warnings, and emergency advisories.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="ACTIVE PUBLIC ALERTS" value={publicAlerts.length} subtitle="Broadcasting now" icon={Bell} accentColor="var(--status-critical)" />
        </div>
        <div className="col-span-3">
          <StatCard title="DELIVERY CHANNELS" value="7 Channels" subtitle="Mobile, LED, PA, SMS, WA" icon={Smartphone} accentColor="var(--accent-saffron)" />
        </div>
        <div className="col-span-3">
          <StatCard title="TARGET REACH" value="1.84M Devotees" subtitle="Pilgrims & field staff" icon={Volume2} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="DELIVERY STATUS" value="99.8% Delivered" subtitle="Network broadcast" icon={ShieldCheck} accentColor="var(--status-low)" />
        </div>
      </div>

      <div className="grid-cols-12">
        {/* Compose New Alert Box */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">
              <Send size={18} style={{ color: 'var(--accent-saffron)' }} />
              COMPOSE MULTI-CHANNEL PUBLIC BROADCAST
            </span>
          </div>

          <form onSubmit={handleBroadcastAlert} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>BROADCAST TITLE</label>
              <input type="text" placeholder="e.g. HEAVY CONGESTION AT GATE B" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SEVERITY CATEGORY</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="INFO">INFO (Announcement)</option>
                  <option value="WARNING">WARNING (Crowd Caution)</option>
                  <option value="EMERGENCY">EMERGENCY (Danger Alert)</option>
                  <option value="EVACUATION">EVACUATION (Evacuate Zone)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TARGET AUDIENCE</label>
                <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="All Pilgrims">All Pilgrims & Public</option>
                  <option value="Zone B Pilgrims">Zone B Devotees Only</option>
                  <option value="Zone E Riverfront">Zone E Ghat Devotees Only</option>
                  <option value="Volunteers">Volunteers Only</option>
                  <option value="Security Officers">Security Officers Only</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MESSAGE TEXT</label>
              <textarea placeholder="Type clear public instructions..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={3} style={{ width: '100%', padding: '8px' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                SIMULATED DELIVERY CHANNELS
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {["Mobile App", "LED Boards", "Public Website", "PA System", "Push Notification", "SMS", "WhatsApp"].map(ch => {
                  const active = selectedChannels.includes(ch);
                  return (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        background: active ? 'var(--accent-saffron)' : 'var(--bg-secondary)',
                        color: active ? '#fff' : 'var(--text-secondary)',
                        border: active ? '1px solid var(--accent-saffron)' : '1px solid var(--border-color)'
                      }}
                    >
                      {active ? '✓ ' : '+ '}{ch}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              {sentSuccess ? (
                <span style={{ color: 'var(--status-low)', fontWeight: 700, fontSize: '0.8rem' }}>
                  ✓ Alert Broadcasted to all channels!
                </span>
              ) : <span />}

              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontWeight: 800 }}>
                <Send size={14} /> Transmit Broadcast
              </button>
            </div>
          </form>
        </div>

        {/* Active Public Broadcasts Column */}
        <div className="col-span-6 card">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <span className="card-title">
              <Bell size={18} style={{ color: 'var(--status-critical)' }} />
              ACTIVE PUBLIC BROADCASTS ({publicAlerts.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {publicAlerts.map(alert => (
              <div key={alert.id} style={{
                background: 'var(--bg-secondary)',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                borderLeft: alert.category === 'EMERGENCY' || alert.category === 'EVACUATION' ? '4px solid var(--status-critical)' : alert.category === 'WARNING' ? '4px solid var(--status-medium)' : '4px solid var(--accent-blue)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {alert.title}
                  </div>
                  <span className={`badge ${alert.category === 'EMERGENCY' ? 'badge-critical' : alert.category === 'WARNING' ? 'badge-medium' : 'badge-low'}`}>
                    {alert.category}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {alert.message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Target: {alert.targetAudience} • Via: {alert.channels?.join(', ')}</span>
                  <button onClick={() => handleDismissAlert(alert.id)} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>
                    Dismiss Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
