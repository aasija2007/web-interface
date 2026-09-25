import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Zap, ArrowRight, Activity, Sliders } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import RiskBadge from '../components/RiskBadge';
import ChartCard from '../components/ChartCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function RiskIntelligence() {
  const {
    riskAnalysis,
    prediction,
    zones,
    gates,
    routes,
    updateGateStatus,
    updateRouteStatus,
    activateSurgeResponse
  } = useSimulation();

  // Prediction simulation slider state
  const [expectedArrivals, setExpectedArrivals] = useState(15000);
  const [simGateCapacity, setSimGateCapacity] = useState(1200);

  const customPredictedPeak = Math.round(prediction.current + (expectedArrivals * 1.8) - (simGateCapacity * 2));

  const predictionChartData = [
    { time: 'Current', crowd: prediction.current },
    { time: '+15 Min', crowd: Math.round(prediction.current + expectedArrivals * 0.4) },
    { time: '+30 Min', crowd: prediction.min30 },
    { time: '+45 Min', crowd: Math.round(prediction.min30 * 1.1) },
    { time: '+60 Min', crowd: prediction.min60 },
    { time: 'Peak Window', crowd: customPredictedPeak }
  ];

  return (
    <div className="page-container">
      {/* Disclaimer Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 16px',
        marginBottom: '20px',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>⚠️ <strong>NOTICE:</strong> All calculations below represent deterministic frontend prototype simulation logic.</span>
        <span className="badge badge-medium">DECISION SUPPORT — DEMO SIMULATION</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShieldAlert size={24} style={{ color: 'var(--accent-saffron)' }} />
            RISK INTELLIGENCE & DECISION SUPPORT
          </h1>
          <p className="page-subtitle">Multi-parameter risk scoring engine and automated mitigation recommendations.</p>
        </div>
      </div>

      {/* Main Risk Score Card */}
      <div className="grid-cols-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-5 card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <span className="card-title">CALCULATED RISK SCORE</span>
              <RiskBadge level={riskAnalysis.level} />
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{
                fontSize: '4rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: riskAnalysis.level === 'CRITICAL' ? 'var(--status-critical)' : riskAnalysis.level === 'HIGH' ? 'var(--status-high)' : 'var(--status-medium)',
                lineHeight: 1
              }}>
                {riskAnalysis.score} <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                {riskAnalysis.level} RISK ASSESSMENT
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <strong>Primary Factors:</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
                “{riskAnalysis.primaryReason}”
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="col-span-7 card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <span className="card-title">RECOMMENDED MITIGATION ACTIONS</span>
              <span className="badge badge-low">ONE-CLICK EXECUTION</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {riskAnalysis.recommendations.map((rec, idx) => (
                <div key={idx} style={{
                  background: 'var(--bg-secondary)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--accent-saffron)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {idx + 1}. {rec}
                  </div>
                  <button
                    onClick={activateSurgeResponse}
                    className="btn btn-primary btn-sm"
                  >
                    Execute <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WHAT HAPPENS NEXT? Crowd Prediction */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <span className="card-title">WHAT HAPPENS NEXT? (CROWD PREDICTION)</span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Simulated arrival projections based on gate capacity & weather inputs.</p>
          </div>
          <span className="badge badge-medium">SIMULATED PREDICTION</span>
        </div>

        {/* Stat Row */}
        <div className="grid-cols-12" style={{ marginBottom: '20px' }}>
          <div className="col-span-3 card" style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CURRENT POPULATION</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{prediction.current.toLocaleString()}</div>
          </div>
          <div className="col-span-3 card" style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PROJECTED IN 30 MIN</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>{prediction.min30.toLocaleString()}</div>
          </div>
          <div className="col-span-3 card" style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PROJECTED IN 60 MIN</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-saffron)' }}>{prediction.min60.toLocaleString()}</div>
          </div>
          <div className="col-span-3 card" style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PREDICTED PEAK CROWD</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--status-critical)' }}>{customPredictedPeak.toLocaleString()}</div>
          </div>
        </div>

        {/* Simulation Sliders Controls */}
        <div className="grid-cols-12" style={{ marginBottom: '20px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
          <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Expected Hourly Arrivals: {expectedArrivals.toLocaleString()} pilgrims/hr</label>
            <input
              type="range"
              min="5000"
              max="35000"
              step="1000"
              value={expectedArrivals}
              onChange={(e) => setExpectedArrivals(Number(e.target.value))}
            />
          </div>

          <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Gate Throughput Capacity: {simGateCapacity.toLocaleString()} ppl/min</label>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={simGateCapacity}
              onChange={(e) => setSimGateCapacity(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Animated Prediction Chart */}
        <ChartCard title="PREDICTED POPULATION TRAJECTORY" height={240}>
          <LineChart data={predictionChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="time" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="crowd" stroke="var(--accent-saffron)" strokeWidth={3} dot={{ r: 5 }} name="Projected Crowd" />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}
