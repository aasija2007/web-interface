import React, { useState } from 'react';
import { Users, ThumbsUp, Send, AlertTriangle, CloudRain, MapPin, CheckCircle2 } from 'lucide-react';
import { getCommunityReports, addCommunityReport, upvoteReport } from '../services/storage';

export default function CommunityView({ weatherData }) {
  const [reports, setReports] = useState(getCommunityReports());
  const [condition, setCondition] = useState('Heavy Rain');
  const [severity, setSeverity] = useState('Mild');
  const [note, setNote] = useState('');
  const [user, setUser] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    const newReport = {
      cityName: weatherData?.cityName || 'Local Region',
      lat: weatherData?.lat || 51.5074,
      lon: weatherData?.lon || -0.1278,
      condition,
      severity,
      note,
      user: user.trim() || 'AnonymousWatcher',
    };

    const updated = addCommunityReport(newReport);
    setReports(updated);
    setNote('');
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const handleUpvote = (id) => {
    const updated = upvoteReport(id);
    setReports(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users className="w-6 h-6 text-purple" style={{ color: 'var(--accent-purple)' }} />
            <span>Community Live Weather Network</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Crowd-sourced real-time weather reports, localized flooding warnings, fog, and road hazard observations
          </p>
        </div>
        <span className="badge badge-cyan">{reports.length} Active Reports</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Submit Report Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send className="w-5 h-5 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <span>SUBMIT LOCAL WEATHER REPORT</span>
          </div>

          {submittedSuccess && (
            <div
              className="glass-card"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                borderColor: 'var(--accent-emerald)',
                color: 'var(--accent-emerald)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Report posted to live map & network!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>
                Observed Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
              >
                <option value="Heavy Rain">Heavy Rain / Downpour</option>
                <option value="Street Flooding">Street Flooding / Waterlogging</option>
                <option value="Dense Fog">Dense Fog / Low Visibility</option>
                <option value="Hailstorm">Sudden Hailstorm</option>
                <option value="Strong Gusts">Strong Gale Gusts</option>
                <option value="Clear & Sun">Clear Sky & Sunny</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>
                Severity Rating
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
              >
                <option value="Mild">Mild / Normal</option>
                <option value="Moderate">Moderate Precaution Needed</option>
                <option value="Warning">Warning / Travel Hazard</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>
                Observation Notes & Landmarks
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Heavy puddles near downtown station, drive slowly..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>
                Your Handle / Name
              </label>
              <input
                type="text"
                placeholder="e.g. RainWatcher"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button type="submit" className="nav-btn active" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              Publish Report to Community Map
            </button>
          </form>
        </div>

        {/* Live Community Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>LIVE COMMUNITY FEED</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: 440, overflowY: 'auto', paddingRight: '0.25rem' }}>
            {reports.map((rep) => (
              <div key={rep.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                    <MapPin className="w-4 h-4 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
                    <span>{rep.cityName}</span>
                  </div>
                  <span className={`badge ${rep.severity === 'Warning' ? 'badge-danger' : 'badge-cyan'}`}>
                    {rep.condition}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>"{rep.note}"</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Posted by @{rep.user}</span>
                  <button
                    onClick={() => handleUpvote(rep.id)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '0.25rem 0.6rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <ThumbsUp className="w-3 h-3 text-cyan" />
                    <span>{rep.upvotes}</span>
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
