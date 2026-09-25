import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle, Shield, UserPlus } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import RiskBadge from './RiskBadge';

export default function IncidentCard({ incident }) {
  const { resolveIncident, assignTeamToIncident, volunteers } = useSimulation();
  const [selectedTeam, setSelectedTeam] = useState(incident.assignedTeam !== 'Unassigned' ? incident.assignedTeam : 'Volunteer Rapid Team 7');

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  return (
    <div className="card" style={{
      borderLeft: incident.priority === 'CRITICAL' || incident.priority === 'HIGH' ? '4px solid var(--status-critical)' : '4px solid var(--status-medium)',
      opacity: incident.status === 'RESOLVED' ? 0.65 : 1
    }}>
      <div className="card-header" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-saffron)' }}>
            {incident.id}
          </span>
          <span className={`badge ${getPriorityBadge(incident.priority)}`}>{incident.priority}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{incident.type}</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{incident.timeReported}</span>
      </div>

      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>{incident.title}</h4>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <MapPin size={13} style={{ color: 'var(--accent-saffron)' }} />
        <span>{incident.location}</span>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
        {incident.description}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        background: 'var(--bg-secondary)',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '12px'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>ASSIGNED: </span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{incident.assignedTeam}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>ETA: </span>
          <span style={{ fontWeight: 700, color: 'var(--accent-saffron)', fontFamily: 'var(--font-mono)' }}>{incident.responseEta}</span>
        </div>
      </div>

      {incident.status !== 'RESOLVED' && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            style={{ flex: 1, fontSize: '0.75rem', padding: '4px 8px' }}
          >
            <option value="Volunteer Rapid Team 7">Volunteer Team 7</option>
            <option value="Police Patrol Alpha">Police Patrol Alpha</option>
            <option value="Medical HQ Unit 1">Medical HQ Unit 1</option>
            <option value="Traffic Sector 2">Traffic Sector 2</option>
          </select>

          <button
            onClick={() => assignTeamToIncident(incident.id, selectedTeam)}
            className="btn btn-secondary btn-sm"
          >
            <UserPlus size={12} /> Assign
          </button>

          <button
            onClick={() => resolveIncident(incident.id)}
            className="btn btn-primary btn-sm"
            style={{ background: 'var(--status-low)' }}
          >
            <CheckCircle size={12} /> Resolve
          </button>
        </div>
      )}
    </div>
  );
}
