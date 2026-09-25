import React from 'react';
import { BarChart3, TrendingUp, Activity, Users, Clock, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import { INITIAL_HOURLY_CROWD_DATA } from '../data/mockData';

export default function Analytics() {
  const { eventInfo, zones, exportReport } = useSimulation();

  const zoneDensityData = zones.map(z => ({
    name: z.code,
    density: z.densityPercent,
    current: z.currentCount,
    capacity: z.capacity
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BarChart3 size={24} style={{ color: 'var(--accent-saffron)' }} />
            ADVANCED CROWD DYNAMICS ANALYTICS
          </h1>
          <p className="page-subtitle">Historical trends, predictive throughput models, and post-event intelligence data.</p>
        </div>

        <button onClick={exportReport} className="btn btn-primary btn-sm">
          Export Full Analytics Report (TXT)
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="PEAK EXPECTED CROWD" value={`${(eventInfo.expectedAttendance / 1000).toFixed(0)}K`} subtitle="Total daily footfall" icon={Users} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="CONGESTION RISK INDEX" value="68 / 100" subtitle="Optimal threshold: <75" icon={Activity} accentColor="var(--accent-saffron)" />
        </div>
        <div className="col-span-3">
          <StatCard title="PEAK ARRIVAL HOUR" value="18:00 PM" subtitle="124,000 active pilgrims" icon={Clock} accentColor="var(--status-medium)" />
        </div>
        <div className="col-span-3">
          <StatCard title="SYSTEM EFFICIENCY" value="94.2%" subtitle="Flow vs bottleneck ratio" icon={TrendingUp} accentColor="var(--status-low)" />
        </div>
      </div>

      {/* Main Analytics Charts */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-6">
          <ChartCard title="HOURLY CROWD GROWTH & OUTFLOW (FILLED AREA)" subtitle="24-hour diurnal pattern comparison" icon={TrendingUp} height={260}>
            <AreaChart data={INITIAL_HOURLY_CROWD_DATA}>
              <defs>
                <linearGradient id="areaCrowd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-saffron)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-saffron)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="crowd" stroke="var(--accent-saffron)" fillOpacity={1} fill="url(#areaCrowd)" name="Active Population" />
            </AreaChart>
          </ChartCard>
        </div>

        <div className="col-span-6">
          <ChartCard title="SECTOR DENSITY PERCENTAGE COMPARISON (%)" subtitle="Current zone load vs 85% safety threshold" icon={BarChart3} height={260}>
            <BarChart data={zoneDensityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Bar dataKey="density" fill="#3b82f6" name="Density %" />
            </BarChart>
          </ChartCard>
        </div>
      </div>

      <div className="grid-cols-12">
        <div className="col-span-12">
          <ChartCard title="CROWD DENSITY TREND (%) VS INFLOW RATE" subtitle="Safety limit threshold monitoring" icon={Activity} height={240}>
            <LineChart data={INITIAL_HOURLY_CROWD_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="density" stroke="#ef4444" strokeWidth={3} name="Density %" />
              <Line type="monotone" dataKey="entry" stroke="#10b981" strokeWidth={2} name="Entry Flow Rate" />
            </LineChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
