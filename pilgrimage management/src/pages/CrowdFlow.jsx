import React from 'react';
import { Activity, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import { INITIAL_HOURLY_CROWD_DATA } from '../data/mockData';

export default function CrowdFlow() {
  const { eventInfo, zones, gates, prediction } = useSimulation();

  const totalInflow = gates.reduce((a, g) => a + g.peoplePerMin, 0);
  const totalQueue = gates.reduce((a, g) => a + g.queueLength, 0);

  const zoneComparisonData = zones.map(z => ({
    name: z.code,
    current: z.currentCount,
    capacity: z.capacity,
    density: z.densityPercent
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity size={24} style={{ color: 'var(--accent-saffron)' }} />
            CROWD FLOW & DYNAMICS ANALYTICS
          </h1>
          <p className="page-subtitle">Real-time movement velocity, entry vs exit rates, and queue growth models.</p>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard title="TOTAL INFLOW RATE" value={`${totalInflow} / min`} subtitle="Combined entry gates" icon={ArrowUpRight} accentColor="var(--status-low)" />
        </div>
        <div className="col-span-3">
          <StatCard title="TOTAL OUTFLOW RATE" value="1,120 / min" subtitle="Combined exit gates" icon={ArrowDownRight} accentColor="var(--accent-blue)" />
        </div>
        <div className="col-span-3">
          <StatCard title="SYSTEM QUEUE LENGTH" value={`${totalQueue} ppl`} subtitle="Screening checkpoint queues" icon={Users} accentColor="var(--status-medium)" />
        </div>
        <div className="col-span-3">
          <StatCard title="AVG MOVEMENT SPEED" value="1.2 m/s" subtitle="Corridor flow velocity" icon={Clock} accentColor="var(--accent-gold)" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        {/* Crowd Population Over Time */}
        <div className="col-span-6">
          <ChartCard title="CROWD POPULATION TREND OVER TIME" subtitle="Hourly active crowd count vs arrival throughput" icon={TrendingUp} height={260}>
            <AreaChart data={INITIAL_HOURLY_CROWD_DATA}>
              <defs>
                <linearGradient id="colorCrowd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-saffron)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-saffron)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="crowd" stroke="var(--accent-saffron)" fillOpacity={1} fill="url(#colorCrowd)" name="Active Crowd" />
            </AreaChart>
          </ChartCard>
        </div>

        {/* Entry vs Exit Rate */}
        <div className="col-span-6">
          <ChartCard title="ENTRY RATE VS EXIT RATE" subtitle="Pilgrim throughput balance (per hour)" icon={Activity} height={260}>
            <BarChart data={INITIAL_HOURLY_CROWD_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="entry" fill="#10b981" name="Inflow Rate" />
              <Bar dataKey="exit" fill="#3b82f6" name="Outflow Rate" />
            </BarChart>
          </ChartCard>
        </div>
      </div>

      <div className="grid-cols-12">
        {/* Density Over Time */}
        <div className="col-span-6">
          <ChartCard title="DENSITY PERCENTAGE OVER TIME (%)" subtitle="Threshold ceiling: 85% Critical" icon={TrendingUp} height={260}>
            <LineChart data={INITIAL_HOURLY_CROWD_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="density" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Density %" />
            </LineChart>
          </ChartCard>
        </div>

        {/* Sector Comparison */}
        <div className="col-span-6">
          <ChartCard title="SECTOR POPULATION VS CAPACITY" subtitle="Current count against maximum design threshold" icon={Users} height={260}>
            <BarChart data={zoneComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="current" fill="var(--accent-saffron)" name="Current Pilgrims" />
              <Bar dataKey="capacity" fill="var(--bg-elevated)" name="Max Capacity" />
            </BarChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
