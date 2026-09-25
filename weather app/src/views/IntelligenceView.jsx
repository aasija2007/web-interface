import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Shirt,
  Activity,
  Car,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function IntelligenceView({ weatherData, pulseAI, unit, convertTemp }) {
  if (!weatherData || !pulseAI) return null;

  const { cityName } = weatherData;
  const {
    recommendations,
    comfortScore,
    comfortRating,
    shouldGoOut,
    goOutBadgeClass,
    goOutReason,
    confidence,
    bestTimeText,
    outfit,
    activityScores,
    commuteScore,
    commuteHazard,
    impactMatrix,
  } = pulseAI;

  const [selectedActivities, setSelectedActivities] = useState(['running', 'photography', 'cycling']);

  const activitiesList = [
    { id: 'running', name: '🏃 Running / Jogging' },
    { id: 'cycling', name: '🚴 Cycling & Biking' },
    { id: 'photography', name: '📸 Outdoor Photography' },
    { id: 'drones', name: '🛸 Flying Drones / UAVs' },
    { id: 'stargazing', name: '🔭 Stargazing & Astronomy' },
    { id: 'golf', name: '🏌️ Golfing' },
    { id: 'beach', name: '🏖️ Beach & Swimming' },
  ];

  const toggleActivity = (id) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== id));
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title Header */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu className="w-6 h-6 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
            <span>PULSE AI — Personalized Weather Intelligence Engine</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Customized activity advice, clothing layers, commute safety index, and decision engine for {cityName}
          </p>
        </div>
        <span className="badge badge-cyan">Neural Rules Engine Active</span>
      </div>

      {/* Top 2 Primary Cards: "Should I Go Out?" & "Best Time to Step Out" */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Should I Go Out Card */}
        <div
          className="glass-panel pulse-glow"
          style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.12))',
            borderColor: 'var(--accent-cyan)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
              <Sparkles className="w-5 h-5 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
              <span>SHOULD I GO OUT TODAY?</span>
            </div>
            <span className={`badge ${goOutBadgeClass}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              {shouldGoOut}
            </span>
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            {goOutReason}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Model Confidence: <strong style={{ color: 'var(--accent-cyan)' }}>{confidence}%</strong></span>
            <span>Comfort Index: <strong style={{ color: 'var(--accent-emerald)' }}>{comfortScore}/100</strong></span>
          </div>
        </div>

        {/* Best Time Outside Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              <Clock className="w-5 h-5 text-amber" style={{ color: 'var(--accent-amber)' }} />
              <span>OPTIMAL TIME TO GO OUTSIDE</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
              {bestTimeText}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Selected by Pulse AI by calculating lowest UV radiation index, zero precipitation chance, and comfortable wind conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Personalized Activity Preferences Selection */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem' }}>
          <UserCheck className="w-5 h-5 text-cyan" style={{ color: 'var(--accent-cyan)' }} />
          <span>PERSONAL ACTIVITY PREFERENCES (SELECT YOUR HOBBIES)</span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {activitiesList.map((act) => {
            const active = selectedActivities.includes(act.id);
            return (
              <button
                key={act.id}
                onClick={() => toggleActivity(act.id)}
                className={`nav-btn ${active ? 'active' : ''}`}
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              >
                <span>{act.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic AI Suitability breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {selectedActivities.map((actId) => {
            const actInfo = activitiesList.find((a) => a.id === actId);
            const rawScore = activityScores[actId] || Math.round(comfortScore * 0.9);
            return (
              <div key={actId} className="glass-card">
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{actInfo?.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: rawScore > 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                    {rawScore}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ 100 Suitability</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  {rawScore > 70 ? 'Favorable conditions! Enjoy your outing.' : 'Exercise caution. High humidity/wind expected.'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Outfit Recommendation */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.25rem' }}>
          <Shirt className="w-6 h-6 text-indigo" style={{ color: 'var(--accent-indigo)' }} />
          <span>SMART OUTFIT RECOMMENDATION</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top Layer</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {outfit.top}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bottom Layer</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {outfit.bottom}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Outerwear</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
              {outfit.outerwear}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recommended Footwear</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {outfit.footwear}
            </div>
          </div>

          <div className="glass-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Essential Gear & Accessories</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {outfit.accessories.map((acc, idx) => (
                <span key={idx} className="badge badge-cyan">
                  {acc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Impact Matrix */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '1rem' }}>WEATHER IMPACT MATRIX</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {impactMatrix.map((item, idx) => (
            <div key={idx} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.domain}</span>
                <span className="badge badge-cyan">{item.level}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.impactText}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
