import React, { useState } from 'react';
import { Navigation, AlertTriangle, ShieldCheck, ArrowRight, Activity, Filter } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import RouteCard from '../components/RouteCard';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Routes() {
  const { routes, updateRouteStatus, activateSurgeResponse, safeExitWindow } = useSimulation();
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredRoutes = routes.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const openRoutesCount = routes.filter(r => r.status === 'OPEN').length;
  const redirectedRoutesCount = routes.filter(r => r.status === 'REDIRECTED' || r.status === 'RESTRICTED').length;

  const chartData = routes.map(r => ({
    name: r.name.split('—')[0].trim(),
    utilization: r.capacityPercent,
    status: r.status
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Navigation size={24} style={{ color: 'var(--accent-saffron)' }} />
            ROUTE INTELLIGENCE & REDIRECTION CONTROL
          </h1>
          <p className="page-subtitle">Monitor processional corridors, arterial bypasses, and trigger emergency diversions.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <option value="ALL">All Routes ({routes.length})</option>
            <option value="OPEN">Open Only ({openRoutesCount})</option>
            <option value="RESTRICTED">Restricted</option>
            <option value="REDIRECTED">Redirected</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Recommended Exit Window Alert Banner */}
      <div className="card" style={{
        background: 'var(--bg-secondary)',
        borderLeft: '4px solid var(--accent-saffron)',
        marginBottom: '24px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-saffron)', textTransform: 'uppercase' }}>
            RECOMMENDED DIVERSIFIED CORRIDOR
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {safeExitWindow.recommendedRoute} ({safeExitWindow.windowText})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {safeExitWindow.reason}
          </div>
        </div>

        <button onClick={activateSurgeResponse} className="btn btn-primary btn-sm">
          Activate Relief Bypass (Route C) <ArrowRight size={14} />
        </button>
      </div>

      {/* Top Route Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="MONITORED CORRIDORS" value={routes.length} subtitle="Active arterial paths" icon={Navigation} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="OPEN ROUTES" value={openRoutesCount} subtitle="Unrestricted flow" icon={ShieldCheck} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="DIVERTS & RESTRICTED" value={redirectedRoutesCount} subtitle="Active flow control" icon={AlertTriangle} accentColor="var(--status-medium)" />
        </div>
        <div className="col-span-3">
          <StatCard title="AVG ROUTE UTILIZATION" value={`${Math.round(routes.reduce((a, r) => a + r.capacityPercent, 0) / routes.length)}%`} subtitle="Design capacity load" icon={Activity} accentColor="var(--accent-saffron)" />
        </div>
      </div>

      {/* Capacity Utilization Chart & Route List */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-12">
          <ChartCard title="CORRIDOR UTILIZATION CAPACITY (%)" subtitle="Current pilgrim load per arterial route" icon={Activity} height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Bar dataKey="utilization" fill="var(--accent-saffron)" name="Utilization %" />
            </BarChart>
          </ChartCard>
        </div>
      </div>

      {/* Route Cards Grid */}
      <div className="grid-cols-12">
        {filteredRoutes.map(route => (
          <div key={route.id} className="col-span-6">
            <RouteCard route={route} />
          </div>
        ))}
      </div>
    </div>
  );
}
