import React, { useState } from 'react';
import { Users, AlertTriangle, ShieldAlert, Activity, HeartPulse, Clock, ArrowUpRight, Compass, ShieldCheck, DoorOpen, ExternalLink, Sparkles } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';
import CrowdPulse from '../components/CrowdPulse';
import CrowdMap from '../components/CrowdMap';
import ZoneCard from '../components/ZoneCard';
import SimulationControls from '../components/SimulationControls';
import IncidentCard from '../components/IncidentCard';
import GateCard from '../components/GateCard';
import RiskBadge from '../components/RiskBadge';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const {
    eventInfo,
    zones,
    gates,
    incidents,
    medicalUnits,
    riskAnalysis,
    safeExitWindow,
    surgeTriggered,
    surgeResponseActivated,
    activateSurgeResponse
  } = useSimulation();

  const [selectedZone, setSelectedZone] = useState(zones[1]); // Zone B default

  const highRiskZonesCount = zones.filter(z => z.riskLevel === 'HIGH' || z.riskLevel === 'CRITICAL').length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  return (
    <div className="page-container">
      {/* Devotional Sacred Banner */}
      <div className="card" style={{
        marginBottom: '20px',
        padding: 0,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--accent-gold-glow)',
        background: 'var(--devotional-card-bg)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          padding: '20px 24px',
          gap: '16px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: 'var(--shadow-glow)',
              flexShrink: 0
            }}>
              🪔
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                🕉️ DEVSTHANAM COMMAND CENTRE • SACRED YATRA TELEMETRY
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '2px 0 4px' }}>
                {eventInfo.name}
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                🚩 {eventInfo.location} • Monitored Attendance: <strong>{eventInfo.expectedAttendance.toLocaleString()} Devotees</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-low" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
              <span className="live-dot" /> 142 SENSORS ONLINE
            </span>
            <Link to="/event-control" className="btn btn-secondary btn-sm">
              <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} /> Ritual Schedule
            </Link>
          </div>
        </div>

        {/* Decorative background image overlay */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '350px',
          backgroundImage: 'url(/images/sacred_sanctum.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Simulation Controls Banner */}
      <SimulationControls />

      {/* RED ALERT Banner when Sudden Surge Triggered */}
      {surgeTriggered && !surgeResponseActivated && (
        <div className="card animate-slide-down" style={{
          background: 'var(--status-critical-bg)',
          border: '2px solid var(--status-critical)',
          marginBottom: '24px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AlertTriangle size={32} style={{ color: 'var(--status-critical)' }} className="animate-pulse" />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--status-critical)' }}>
                🚨 RED ALERT: SUDDEN CROWD SURGE IN ZONE B (TEMPLE APPROACH)
              </div>
              <p style={{ color: '#ffffff', fontSize: '0.85rem', marginTop: '2px' }}>
                Zone B density increased to 91% (+38% flow imbalance). Recommended actions ready for deployment.
              </p>
            </div>
          </div>

          <button
            onClick={activateSurgeResponse}
            className="btn btn-primary animate-pulse"
            style={{ background: 'var(--status-low)', fontSize: '0.95rem', padding: '12px 24px', fontWeight: 800 }}
          >
            🛡️ ACTIVATE RESPONSE NOW
          </button>
        </div>
      )}

      {/* Dashboard Top Stats Grid */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-2">
          <StatCard
            title="TOTAL DEVOTEES"
            value={eventInfo.expectedAttendance}
            subtitle="Monitored overall"
            icon={Users}
            accentColor="var(--accent-blue)"
          />
        </div>
        <div className="col-span-2">
          <StatCard
            title="CURRENT CROWD"
            value={eventInfo.currentCrowd}
            subtitle="Active on ground"
            icon={Activity}
            accentColor="var(--accent-saffron)"
            trend="+4.2%"
            trendType="warning"
          />
        </div>
        <div className="col-span-2">
          <StatCard
            title="HIGH-RISK ZONES"
            value={highRiskZonesCount}
            subtitle="Require attention"
            icon={ShieldAlert}
            accentColor="var(--status-critical)"
            trend={highRiskZonesCount > 0 ? "ACTION REQUIRED" : "SAFE"}
            trendType={highRiskZonesCount > 0 ? "danger" : "success"}
          />
        </div>
        <div className="col-span-2">
          <StatCard
            title="ACTIVE INCIDENTS"
            value={activeIncidentsCount}
            subtitle="In progress"
            icon={AlertTriangle}
            accentColor="var(--status-medium)"
          />
        </div>
        <div className="col-span-2">
          <StatCard
            title="MEDICAL UNITS"
            value={medicalUnits.length}
            subtitle="Available on ground"
            icon={HeartPulse}
            accentColor="var(--status-low)"
          />
        </div>
        <div className="col-span-2">
          <StatCard
            title="AVG RESPONSE TIME"
            value="04:32"
            subtitle="Target: <05:00 min"
            icon={Clock}
            accentColor="var(--accent-gold)"
            trend="Nominal"
            trendType="success"
          />
        </div>
      </div>

      {/* Main Command View Grid */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        {/* Left: Crowd Pulse Intelligence */}
        <div className="col-span-4">
          <CrowdPulse />
        </div>

        {/* Center/Right: Interactive Live Telemetry Map */}
        <div className="col-span-8">
          <CrowdMap onSelectZone={setSelectedZone} selectedZoneId={selectedZone?.id} />
        </div>
      </div>

      {/* Secondary Operational Row */}
      <div className="grid-cols-12">
        {/* Selected Zone Inspector Card */}
        <div className="col-span-4">
          <ZoneCard zone={selectedZone} />
        </div>

        {/* Safe Exit Window Recommendation Widget */}
        <div className="col-span-4 card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <span className="card-title">
                <Compass size={18} style={{ color: 'var(--accent-saffron)' }} />
                SAFE EXIT WINDOW RECOMMENDATION
              </span>
              <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>SIMULATED DECISION SUPPORT</span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>RECOMMENDED DEPARTURE WINDOW</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--status-low)', margin: '4px 0' }}>
                {safeExitWindow.windowText}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-saffron)' }}>
                {safeExitWindow.recommendedRoute}
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Insight:</strong> {safeExitWindow.reason}
            </p>
          </div>

          <Link to="/routes" className="btn btn-secondary btn-sm" style={{ marginTop: '14px', alignSelf: 'flex-start' }}>
            Manage Route Redirections <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Active Incidents Quick List */}
        <div className="col-span-4 card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <span className="card-title">
                <AlertTriangle size={18} style={{ color: 'var(--status-medium)' }} />
                HIGH PRIORITY INCIDENTS ({activeIncidentsCount})
              </span>
              <Link to="/emergency" style={{ fontSize: '0.75rem', color: 'var(--accent-saffron)' }}>View All</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {incidents.filter(i => i.status !== 'RESOLVED').slice(0, 2).map(inc => (
                <div key={inc.id} style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--status-critical)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                    <span>{inc.id} — {inc.title}</span>
                    <span className="text-saffron">{inc.responseEta}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {inc.location} • Team: {inc.assignedTeam}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/emergency" className="btn btn-secondary btn-sm" style={{ marginTop: '14px', alignSelf: 'flex-start' }}>
            Dispatch Rapid Field Response <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
