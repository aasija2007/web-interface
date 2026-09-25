import React from 'react';
import { Activity, TrendingUp, HeartPulse, Droplets, Users, Bus, ShieldAlert, ArrowRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';

export default function ResourcePrediction() {
  const { activateSurgeResponse, logAuditAction, addNotification } = useSimulation();

  const predictions = [
    { name: 'Medical Cases', current: 8, predicted15m: 12, predicted30m: 16, unit: 'cases', icon: HeartPulse, color: 'var(--status-critical)', rec: 'Pre-position Ambulance A-01 near Zone B Arch.' },
    { name: 'Drinking Water', current: 45, predicted15m: 68, predicted30m: 86, unit: '% demand', icon: Droplets, color: 'var(--accent-cyan)', rec: 'Open backup water tank 2 in Zone C Arena.' },
    { name: 'Volunteers Needed', current: 42, predicted15m: 65, predicted30m: 80, unit: 'staff', icon: Users, color: 'var(--accent-saffron)', rec: 'Mobilize Reserve Volunteer Team 7 to Zone B.' },
    { name: 'Parking Pressure', current: 78, predicted15m: 88, predicted30m: 95, unit: '% full', icon: Bus, color: 'var(--accent-gold)', rec: 'Divert incoming buses from P1 to Overflow P3.' }
  ];

  const chartData = [
    { time: 'Now', medical: 8, water: 45, volunteers: 42, parking: 78 },
    { time: '+10 Min', medical: 10, water: 58, volunteers: 55, parking: 84 },
    { time: '+20 Min', medical: 14, water: 74, volunteers: 70, parking: 90 },
    { time: '+30 Min', medical: 16, water: 86, volunteers: 80, parking: 95 }
  ];

  const handlePrepositionResource = (recName) => {
    logAuditAction("Resource Pre-positioned", "Baseline", recName, "Predictive analytics recommendation executed", "Resource Analytics");
    addNotification('SUCCESS', 'Resource Mobilized', `Executed: ${recName}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <TrendingUp size={24} style={{ color: 'var(--accent-saffron)' }} />
            PREDICTIVE RESOURCE DEMAND ANALYTICS
          </h1>
          <p className="page-subtitle">15 to 30-minute forward demand forecasting for medical teams, water, volunteers, and parking.</p>
        </div>

        <button onClick={activateSurgeResponse} className="btn btn-primary btn-sm">
          Execute Surge Pre-positioning
        </button>
      </div>

      {/* Resource Prediction Cards Grid */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        {predictions.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="col-span-3 card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={18} style={{ color: p.color }} />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{p.name}</h4>
                  </div>
                  <span className="badge badge-medium">+30 MIN PREDICT</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px', background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CURRENT</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{p.current} {p.unit}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PREDICTED (30m)</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: p.color }}>{p.predicted30m} {p.unit}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>Recommendation:</strong> {p.rec}
                </p>
              </div>

              <button onClick={() => handlePrepositionResource(p.rec)} className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
                Pre-position Resource <ArrowRight size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Prediction Trajectory Line Chart */}
      <div className="grid-cols-12">
        <div className="col-span-12">
          <ChartCard title="30-MINUTE FORWARD DEMAND TRAJECTORY" subtitle="Predicted increase across key operational resources" icon={Activity} height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="medical" stroke="var(--status-critical)" strokeWidth={3} name="Medical Cases" />
              <Line type="monotone" dataKey="water" stroke="var(--accent-cyan)" strokeWidth={2} name="Water Demand %" />
              <Line type="monotone" dataKey="volunteers" stroke="var(--accent-saffron)" strokeWidth={2} name="Volunteers Needed" />
              <Line type="monotone" dataKey="parking" stroke="var(--accent-gold)" strokeWidth={2} name="Parking Pressure %" />
            </LineChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
