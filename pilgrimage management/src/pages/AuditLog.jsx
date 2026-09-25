import React, { useState } from 'react';
import { FileText, Search, Filter, ShieldCheck, Download, History, Clock } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function AuditLog() {
  const { auditLogs, exportReport } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    const matchesRole = roleFilter === 'ALL' || log.role === roleFilter;
    return matchesSearch && matchesModule && matchesRole;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <History size={24} style={{ color: 'var(--accent-saffron)' }} />
            AUDIT LOG & ACTIVITY HISTORY
          </h1>
          <p className="page-subtitle">Immutable operational event trail logging all officer actions, gate updates, and QR entries.</p>
        </div>

        <button onClick={exportReport} className="btn btn-primary btn-sm">
          <Download size={14} /> Export Audit Log File
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="TOTAL AUDITED ACTIONS" value={auditLogs.length} subtitle="Recorded today" icon={History} accentColor="var(--accent-saffron)" />
        </div>
        <div className="col-span-3">
          <StatCard title="SYSTEM MODULES" value="8 Modules" subtitle="Gates, Routes, Incidents, Pass" icon={FileText} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="ACTIVE OFFICERS" value="12 Officers" subtitle="Actions logged" icon={ShieldCheck} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="INTEGRITY STATUS" value="VERIFIED 100%" subtitle="Timestamped & Synced" icon={Clock} accentColor="var(--accent-gold)" />
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="card" style={{ marginBottom: '20px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by action, user, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '32px', width: '100%', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Module:</span>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
              <option value="ALL">All Modules</option>
              <option value="Gate Control">Gate Control</option>
              <option value="Route Intelligence">Route Intelligence</option>
              <option value="Medical">Medical</option>
              <option value="Digital Yatra Pass">Digital Yatra Pass</option>
              <option value="Emergency Response">Emergency Response</option>
              <option value="Lost & Found">Lost & Found</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role:</span>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
              <option value="ALL">All Roles</option>
              <option value="POLICE / SECURITY">POLICE / SECURITY</option>
              <option value="MEDICAL TEAM">MEDICAL TEAM</option>
              <option value="SUPER ADMIN">SUPER ADMIN</option>
              <option value="SYSTEM GATE SCANNER">SYSTEM GATE SCANNER</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Timestamp</th>
              <th style={{ padding: '12px 16px' }}>User / Officer</th>
              <th style={{ padding: '12px 16px' }}>Action & Module</th>
              <th style={{ padding: '12px 16px' }}>Previous → New Value</th>
              <th style={{ padding: '12px 16px' }}>Operational Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-saffron)', whiteSpace: 'nowrap' }}>
                  {log.timestamp}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {log.user}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.role}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.action}</div>
                  <span className="badge badge-low" style={{ fontSize: '0.65rem', padding: '2px 6px', marginTop: '2px' }}>{log.module}</span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{log.prevValue}</span> → <span style={{ color: 'var(--status-low)', fontWeight: 700 }}>{log.newValue}</span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                  “{log.reason}”
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
