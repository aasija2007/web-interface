import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Plus, CheckCircle, Radio, Clock, UserPlus, Filter } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import IncidentCard from '../components/IncidentCard';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';

export default function Emergency() {
  const { incidents, addIncident, triggerSurgeScenario } = useSimulation();
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New incident form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Medical Emergency');
  const [location, setLocation] = useState('Zone B — Temple Route');
  const [priority, setPriority] = useState('HIGH');
  const [description, setDescription] = useState('');

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;

  const filteredIncidents = incidents.filter(i => {
    if (filterPriority === 'ALL') return true;
    return i.priority === filterPriority;
  });

  const handleSubmitNewIncident = (e) => {
    e.preventDefault();
    if (!title || !location) return;
    addIncident({
      title,
      type,
      location,
      priority,
      description
    });
    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <AlertTriangle size={24} style={{ color: 'var(--status-critical)' }} />
            EMERGENCY INCIDENT COMMAND & RAPID DISPATCH
          </h1>
          <p className="page-subtitle">Real-time emergency incident triage, response team assignment, and field alerts.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Log New Incident
          </button>
          <button onClick={triggerSurgeScenario} className="btn btn-danger btn-sm">
            ⚡ Trigger Surge Scenario
          </button>
        </div>
      </div>

      {/* Top Emergency Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="ACTIVE INCIDENTS" value={activeIncidents.length} subtitle="Requires resolution" icon={AlertTriangle} accentColor="var(--status-critical)" />
        </div>
        <div className="col-span-3">
          <StatCard title="CRITICAL ALARMS" value={criticalCount} subtitle="High priority triage" icon={ShieldAlert} accentColor="var(--status-high)" />
        </div>
        <div className="col-span-3">
          <StatCard title="AVG RESPONSE ETA" value="03:15 min" subtitle="Target: <05:00 min" icon={Clock} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="DISPATCHED TEAMS" value="6 Teams" subtitle="Medical & Security active" icon={Radio} accentColor="var(--accent-blue)" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
          ACTIVE INCIDENTS LOG ({filteredIncidents.length})
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority Filter:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Incidents List Grid */}
      <div className="grid-cols-12">
        {filteredIncidents.map(incident => (
          <div key={incident.id} className="col-span-6">
            <IncidentCard incident={incident} />
          </div>
        ))}
      </div>

      {/* Modal to log new incident */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log New Field Incident"
      >
        <form onSubmit={handleSubmitNewIncident} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              INCIDENT TITLE
            </label>
            <input
              type="text"
              placeholder="e.g. Dehydration collapse near Gate C"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                INCIDENT TYPE
              </label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '8px 12px' }}>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Crowd Congestion">Crowd Congestion</option>
                <option value="Missing Person">Missing Person</option>
                <option value="Infrastructure Issue">Infrastructure Issue</option>
                <option value="Security Alert">Security Alert</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                PRIORITY LEVEL
              </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: '8px 12px' }}>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              LOCATION / SECTOR
            </label>
            <input
              type="text"
              placeholder="e.g. Zone B — Marker 14"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              DESCRIPTION & NOTES
            </label>
            <textarea
              placeholder="Provide field details for rapid response teams..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Log Incident & Alert Teams
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
