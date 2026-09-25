import React, { useState } from 'react';
import { FileText, Download, CheckCircle, ShieldCheck, Printer, Calendar } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import StatCard from '../components/StatCard';

export default function Reports() {
  const { exportReport, eventInfo, riskAnalysis, crowdPulse, zones, incidents } = useSimulation();
  const [selectedReport, setSelectedReport] = useState('FULL_EXECUTIVE');

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText size={24} style={{ color: 'var(--accent-saffron)' }} />
            FESTIVAL INTELLIGENCE REPORTS & EXPORTS
          </h1>
          <p className="page-subtitle">Generate post-event situation reports, incident audit logs, and density assessments.</p>
        </div>

        <button onClick={exportReport} className="btn btn-primary btn-sm">
          <Download size={14} /> Export Executive Report (TXT)
        </button>
      </div>

      {/* Report Selector Grid */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-4 card">
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <span className="card-title">AVAILABLE REPORT TEMPLATES</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setSelectedReport('FULL_EXECUTIVE')}
              style={{
                textAlign: 'left',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: selectedReport === 'FULL_EXECUTIVE' ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                border: selectedReport === 'FULL_EXECUTIVE' ? '1px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                color: selectedReport === 'FULL_EXECUTIVE' ? 'var(--accent-saffron)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              📋 Executive Operational Daily Summary
            </button>

            <button
              onClick={() => setSelectedReport('INCIDENTS_AUDIT')}
              style={{
                textAlign: 'left',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: selectedReport === 'INCIDENTS_AUDIT' ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                border: selectedReport === 'INCIDENTS_AUDIT' ? '1px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                color: selectedReport === 'INCIDENTS_AUDIT' ? 'var(--accent-saffron)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              🚨 Incident & Response Dispatch Audit Log
            </button>

            <button
              onClick={() => setSelectedReport('ZONES_CAPACITY')}
              style={{
                textAlign: 'left',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: selectedReport === 'ZONES_CAPACITY' ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                border: selectedReport === 'ZONES_CAPACITY' ? '1px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                color: selectedReport === 'ZONES_CAPACITY' ? 'var(--accent-saffron)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              📊 Sector Capacity & Bottleneck Analysis
            </button>
          </div>
        </div>

        {/* Live Report Preview Window */}
        <div className="col-span-8 card" style={{ background: '#0b0f19', border: '1px solid var(--border-color-hover)' }}>
          <div className="card-header" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <span className="card-title" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              DOCUMENT PREVIEW — {selectedReport}
            </span>
            <button onClick={exportReport} className="btn btn-secondary btn-sm">
              <Download size={13} /> Download File
            </button>
          </div>

          <pre style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap',
            background: 'var(--bg-secondary)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
{`YATRAFLOW INTELLIGENCE REPORT
===================================================
Event Name: ${eventInfo.name}
Date: ${eventInfo.date} | Location: ${eventInfo.location}
Generated: ${new Date().toLocaleString()}

KEY METRICS OVERVIEW:
- Expected Attendance: ${eventInfo.expectedAttendance.toLocaleString()}
- Active Crowd on Ground: ${eventInfo.currentCrowd.toLocaleString()}
- Calculated Risk Index: ${riskAnalysis.score} / 100 (${riskAnalysis.level})
- Crowd Pulse Level: ${crowdPulse.pulseScore} (${crowdPulse.statusLabel})

SECTOR DENSITY BREAKDOWN:
${zones.map(z => `- [${z.code}] ${z.name}: ${z.currentCount.toLocaleString()} / ${z.capacity.toLocaleString()} (${z.densityPercent}% Density)`).join('\n')}

ACTIVE & RESOLVED INCIDENTS LOG (${incidents.length} TOTAL):
${incidents.map(i => `- [${i.id}] [${i.priority}] ${i.title} @ ${i.location} | Assigned: ${i.assignedTeam} (${i.status})`).join('\n')}

END OF REPORT`}
          </pre>
        </div>
      </div>
    </div>
  );
}
