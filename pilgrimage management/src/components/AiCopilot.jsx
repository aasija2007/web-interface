import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X, ChevronRight, RefreshCw, AlertTriangle, ShieldCheck, MapPin, Activity } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function AiCopilot({ isOpen, onClose }) {
  const {
    zones,
    gates,
    incidents,
    medicalCenters,
    weather,
    resourceDemand,
    surgeTriggered,
    surgeResponseActivated,
    auditLogs
  } = useSimulation();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Namaste Officer. I am **YatraFlow AI Copilot** — your real-time crowd intelligence assistant. Ask me about zone congestion, emergency risks, gate inflows, medical capacities, or volunteer deployment recommendations."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  // Pre-configured suggested operational queries
  const suggestedQuestions = [
    "What is the biggest risk right now?",
    "Which gate is most crowded?",
    "Where should I deploy volunteers?",
    "Which medical center has highest capacity?",
    "What to do if Zone B reaches critical density?",
    "Summarize today's incidents"
  ];

  // Intelligence Engine: evaluates active context state to answer queries intelligently
  const generateAiAnswer = (query) => {
    const q = query.toLowerCase();

    // 1. Biggest Risk
    if (q.includes('risk') || q.includes('danger') || q.includes('critical')) {
      const highestRiskZone = [...zones].sort((a, b) => b.densityPercent - a.densityPercent)[0];
      const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
      const criticalIncidents = activeIncidents.filter(i => i.severity === 'CRITICAL');

      return `### 🚨 Current Major Operational Risk
**Primary Bottleneck:** ${highestRiskZone.name} is currently at **${highestRiskZone.densityPercent}% density** (${highestRiskZone.occupancy.toLocaleString()} / ${highestRiskZone.capacity.toLocaleString()} pilgrims).
${surgeTriggered ? '⚠️ **SURGE ALERT ACTIVE:** Zone B rapid crowd spike detected.' : ''}

**Key Risk Factors:**
1. High inflow rate of +${highestRiskZone.inflowRate} pilgrims/min from ${highestRiskZone.name} entry corridors.
2. ${criticalIncidents.length} active CRITICAL incidents pending full resolution.
3. ${weather.condition} condition (Rain probability ${weather.rainProbability}%).

**Recommended Immediate Actions:**
* Throttle entry at Gate ${highestRiskZone.id === 'zone-b' ? 'B' : 'A'} to limit inflow.
* Open alternate bypass corridor towards ${highestRiskZone.recommendedGate}.
* Pre-position Volunteer Team 07 and Mobile Medical Unit near ${highestRiskZone.name}.`;
    }

    // 2. Most Crowded Gate
    if (q.includes('gate') || q.includes('crowded')) {
      const sortedGates = [...gates].sort((a, b) => b.occupancyPercent - a.occupancyPercent);
      const busiest = sortedGates[0];

      return `### 🚪 Gate Occupancy Analysis
**Most Crowded Gate:** ${busiest.name} (${busiest.code})
* **Current Throughput:** ${busiest.currentRate} pilgrims/min
* **Occupancy:** ${busiest.occupancyPercent}% (${busiest.status})
* **Queue Waiting Time:** ~${busiest.avgWaitMinutes} minutes

**Gate Status Overview:**
${gates.map(g => `• **${g.code} (${g.name}):** ${g.occupancyPercent}% capacity | Status: ${g.status} | Wait: ${g.avgWaitMinutes}m`).join('\n')}

**Recommendation:** Redirect incoming pilgrim traffic from ${busiest.code} to ${sortedGates[sortedGates.length - 1].code} (${sortedGates[sortedGates.length - 1].name}) which has only ${sortedGates[sortedGates.length - 1].occupancyPercent}% load.`;
    }

    // 3. Volunteer Deployment
    if (q.includes('volunteer') || q.includes('deploy')) {
      const targetZone = [...zones].sort((a, b) => b.densityPercent - a.densityPercent)[0];

      return `### 👷 Volunteer Deployment Strategy
**Recommended Primary Target:** ${targetZone.name}
* **Current Density:** ${targetZone.densityPercent}%
* **Reason:** Highest crowd accumulation and narrow corridor friction.

**Suggested Team Allocations:**
1. **Team 03 & 04:** Position at Gate B holding area to guide pilgrims to alternate bypass routes.
2. **Team 07:** Deploy to ${targetZone.name} for queue management & barrier stabilization.
3. **Team 09 (Lost & Found Specialists):** Station at Gate D checkpoint for missing children screening.`;
    }

    // 4. Medical Capacity
    if (q.includes('medical') || q.includes('bed') || q.includes('hospital')) {
      const availableBeds = medicalCenters.reduce((sum, m) => sum + m.availableBeds, 0);
      const busiestMed = [...medicalCenters].sort((a, b) => b.loadPercent - a.loadPercent)[0];
      const quietestMed = [...medicalCenters].sort((a, b) => a.loadPercent - b.loadPercent)[0];

      return `### 🏥 Medical System Status & Capacity
* **Total Available Beds Across Precinct:** **${availableBeds} beds**
* **Highest Load Center:** ${busiestMed.name} (${busiestMed.loadPercent}% occupied, ${busiestMed.availableBeds} beds remaining)
* **Best Capacity Center:** ${quietestMed.name} (${quietestMed.availableBeds} beds free, load ${quietestMed.loadPercent}%)

**Ambulance Readiness:** 6 Ambulances active (Average precinct ETA: 3.8 minutes).
**Recommendation:** Route incoming heat stroke and exhaustion cases to ${quietestMed.name} to avoid choking ${busiestMed.name}.`;
    }

    // 5. Zone B Critical Action
    if (q.includes('zone b') || q.includes('critical density')) {
      return `### ⚠️ Protocol for Zone B Critical Congestion
When Zone B reaches >85% density, execute the following **Standard Operating Protocol (SOP-04)**:

1. **Gate Flow Throttling:** Change Gate B status from OPEN to **LIMITED (Max 150 p/min)**.
2. **Dynamic Rerouting:** Broadcast Public Alert directing pilgrims to Corridor 4 & Gate C.
3. **Public Announcement:** Trigger PA System audio message: *"Zone B temporarily held. Proceed via Temple Ghat bypass."*
4. **Deploy Rapid Response:** Dispatch Security Squad Alpha & Medical Unit A-02 to Zone B choke point.
5. **Scenario Mitigation:** Click **"ACTIVATE EMERGENCY RESPONSE"** in the command header to instantly execute automated cooling.`;
    }

    // 6. Today's Incidents Summary
    if (q.includes('summarize') || q.includes('incident') || q.includes('today')) {
      const active = incidents.filter(i => i.status !== 'RESOLVED');
      const resolved = incidents.filter(i => i.status === 'RESOLVED');

      return `### 📋 Summary of Operations & Incidents Today
* **Total Logged Incidents:** ${incidents.length}
* **Active Incidents:** ${active.length} (${active.filter(i => i.severity === 'CRITICAL').length} Critical, ${active.filter(i => i.severity === 'HIGH').length} High)
* **Resolved Incidents:** ${resolved.length}
* **Recent System Actions:** ${auditLogs.length} logged actions in immutable audit trail.

**Latest Active Incidents:**
${active.slice(0, 3).map(inc => `• **${inc.id}:** ${inc.type} in ${inc.zone} (Severity: ${inc.severity}) — Status: ${inc.status}`).join('\n') || '• No active critical incidents at this time.'}`;
    }

    // Generic contextual AI response
    return `### 🧠 YatraFlow Intelligence Insight
Regarding **"${query}"**:

* **Current Precinct Status:** ${zones.reduce((sum, z) => sum + z.occupancy, 0).toLocaleString()} active pilgrims monitored.
* **Peak Congestion Zone:** ${[...zones].sort((a, b) => b.densityPercent - a.densityPercent)[0].name} (${[...zones].sort((a, b) => b.densityPercent - a.densityPercent)[0].densityPercent}% density).
* **Weather Alert:** ${weather.condition} (${weather.temperature}°C).
* **Actionable Advice:** Monitor Gate B throughput and ensure medical center bed availability remains above 20%.

Need specific stats? Ask about **gates**, **medical beds**, **volunteers**, or **surge mitigation**.`;
  };

  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    // Simulate AI inference delay
    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: generateAiAnswer(textToSend)
      };
      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="card animate-fade-in" style={{
      position: 'fixed',
      right: '24px',
      bottom: '24px',
      width: '420px',
      height: '580px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255, 153, 51, 0.2)',
      border: '1px solid var(--accent-saffron)',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.15), rgba(20, 24, 33, 0.95))',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--accent-saffron)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 10px rgba(255, 153, 51, 0.5)'
          }}>
            <Bot size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              YatraFlow AI Copilot <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--status-low)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-low)' }} /> Real-Time Telemetry Connected
            </div>
          </div>
        </div>

        <button onClick={onClose} className="btn-icon btn-sm" aria-label="Close AI Copilot">
          <X size={18} />
        </button>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div style={{
        padding: '10px 14px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              padding: '4px 10px',
              fontSize: '0.7rem',
              fontWeight: 600,
              borderRadius: '12px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-saffron)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{q}</span>
            <ChevronRight size={10} />
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'var(--bg-primary)'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{
              padding: '10px 14px',
              borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              background: msg.sender === 'user' ? 'var(--accent-saffron)' : 'var(--bg-card)',
              color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
              fontSize: '0.82rem',
              lineHeight: '1.45',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {msg.text.split('\n').map((line, lIdx) => {
                if (line.startsWith('### ')) return <h4 key={lIdx} style={{ margin: '4px 0 6px', color: msg.sender === 'user' ? '#fff' : 'var(--accent-saffron)', fontSize: '0.88rem' }}>{line.replace('### ', '')}</h4>;
                if (line.startsWith('* ')) return <div key={lIdx} style={{ paddingLeft: '8px', marginBottom: '3px' }}>• {line.replace('* ', '')}</div>;
                return <div key={lIdx}>{line}</div>;
              })}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              padding: '0 4px'
            }}>
              {msg.timestamp}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '8px 12px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <RefreshCw size={12} className="animate-spin" /> YatraFlow AI computing recommendation...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{
          padding: '12px',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '8px'
        }}
      >
        <input
          type="text"
          placeholder="Ask AI Copilot (e.g., Gate congestion, SOS advice)..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="form-control"
          style={{ flex: 1, fontSize: '0.8rem' }}
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Send size={14} /> Send
        </button>
      </form>
    </div>
  );
}
