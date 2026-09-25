import React, { useState } from 'react';
import { DoorOpen, Users, AlertTriangle, ShieldCheck, Activity, Lock, Unlock } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import GateCard from '../components/GateCard';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Gates() {
  const { gates, updateGateStatus } = useSimulation();
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredGates = gates.filter(g => {
    if (filterStatus === 'ALL') return true;
    return g.status === filterStatus;
  });

  const totalInflow = gates.reduce((a, g) => a + g.peoplePerMin, 0);
  const totalQueue = gates.reduce((a, g) => a + g.queueLength, 0);
  const openGates = gates.filter(g => g.status === 'OPEN').length;

  const chartData = gates.map(g => ({
    name: g.name.split('—')[0].trim(),
    flow: g.peoplePerMin,
    queue: g.queueLength,
    capacity: g.maxCapacity
  }));

  const setAllGatesStatus = (newStatus) => {
    gates.forEach(g => updateGateStatus(g.id, newStatus));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <DoorOpen size={24} style={{ color: 'var(--accent-saffron)' }} />
            GATE CONTROL & ENTRY THROUGHPUT
          </h1>
          <p className="page-subtitle">Real-time gate screening rate, queue length monitoring, and entry flow throttling.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <option value="ALL">All Gates ({gates.length})</option>
            <option value="OPEN">Open ({openGates})</option>
            <option value="LIMITED">Limited</option>
            <option value="PAUSED">Paused</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Quick Master Gate Actions */}
      <div className="card" style={{
        background: 'var(--bg-secondary)',
        marginBottom: '24px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
          ⚡ MASTER GATE OVERRIDE CONTROLS:
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setAllGatesStatus('OPEN')} className="btn btn-secondary btn-sm" style={{ color: 'var(--status-low)' }}>
            <Unlock size={14} /> Open All Gates
          </button>
          <button onClick={() => setAllGatesStatus('LIMITED')} className="btn btn-secondary btn-sm" style={{ color: 'var(--status-medium)' }}>
            Throttle All (50%)
          </button>
          <button onClick={() => setAllGatesStatus('CLOSED')} className="btn btn-danger btn-sm">
            <Lock size={14} /> Emergency Closure
          </button>
        </div>
      </div>

      {/* Top Gate Metrics */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="TOTAL ENTRY THROUGHPUT" value={`${totalInflow} / min`} subtitle="Combined screening speed" icon={Activity} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="TOTAL WAITING QUEUE" value={`${totalQueue} ppl`} subtitle="Screening checkpoint queues" icon={Users} accentColor="var(--status-medium)" />
        </div>
        <div className="col-span-3">
          <StatCard title="ACTIVE GATES" value={`${openGates} / ${gates.length}`} subtitle="Operational portals" icon={ShieldCheck} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="AVG WAIT TIME" value="14 min" subtitle="Target threshold: <20 min" icon={DoorOpen} accentColor="var(--accent-gold)" />
        </div>
      </div>

      {/* Throughput vs Queue Comparison Chart */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-12">
          <ChartCard title="GATE THROUGHPUT VS QUEUE LENGTH" subtitle="Flow rate per minute against active waiting queue" icon={Activity} height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="flow" fill="#10b981" name="Flow Rate (ppl/min)" />
              <Bar dataKey="queue" fill="#f59e0b" name="Queue Length (ppl)" />
              <Bar dataKey="capacity" fill="var(--bg-elevated)" name="Max Capacity" />
            </BarChart>
          </ChartCard>
        </div>
      </div>

      {/* Gate Cards Grid */}
      <div className="grid-cols-12">
        {filteredGates.map(gate => (
          <div key={gate.id} className="col-span-6">
            <GateCard gate={gate} />
          </div>
        ))}
      </div>
    </div>
  );
}
