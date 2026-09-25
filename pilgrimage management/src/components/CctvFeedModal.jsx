import React, { useState } from 'react';
import { Camera, Eye, RefreshCw, X, ShieldAlert, Activity, Cpu, Layers } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function CctvFeedModal({ isOpen, onClose }) {
  const { cctvFeeds } = useSimulation();
  const [selectedCamId, setSelectedCamId] = useState('cctv-04');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  if (!isOpen) return null;

  const currentCam = cctvFeeds.find(c => c.id === selectedCamId) || cctvFeeds[0];

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="card animate-scale-up" style={{
        width: '1000px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        border: '1px solid var(--accent-saffron)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 0 30px rgba(255,153,51,0.2)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-saffron-glow)',
              color: 'var(--accent-saffron)'
            }}>
              <Camera size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                AI CCTV PEOPLE-COUNTING INGEST
                <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>● LIVE FEED</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Computer Vision Telemetry Ingest & Real-Time Density Model Analysis
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" aria-label="Close CCTV Modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Camera Selector Tabs */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {cctvFeeds.map(cam => (
              <button
                key={cam.id}
                onClick={() => setSelectedCamId(cam.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: cam.id === selectedCamId ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                  border: cam.id === selectedCamId ? '2px solid var(--accent-saffron)' : '1px solid var(--border-color)',
                  color: cam.id === selectedCamId ? 'var(--accent-saffron)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                <Camera size={16} />
                <div style={{ textAlign: 'left' }}>
                  <div>{cam.code}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{cam.zone}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Main Video Viewer Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px'
          }} className="responsive-grid">
            {/* Camera Simulated Video Feed Viewfinder */}
            <div style={{
              position: 'relative',
              background: '#090d14',
              borderRadius: 'var(--radius-md)',
              height: '380px',
              border: '1px solid var(--border-color-hover)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Camera Background Image / Simulation Graphic */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle at center, rgba(255,153,51,0.08) 0%, transparent 70%), linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Layers size={48} style={{ color: 'var(--accent-saffron)', opacity: 0.3, marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{currentCam.name} ({currentCam.code})</div>
                  <div style={{ fontSize: '0.75rem' }}>SIMULATED CCTV VISION STREAM — 1080P H.265</div>
                </div>
              </div>

              {/* Simulated Computer Vision Detection Bounding Boxes Overlay */}
              {showBoundingBoxes && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {/* Bounding box 1 */}
                  <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '20%',
                    width: '120px',
                    height: '140px',
                    border: '1.5px dashed var(--status-critical)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    fontSize: '0.65rem',
                    color: 'var(--status-critical)',
                    fontWeight: 800
                  }}>
                    CLUSTER 01 (DENSE: 92%)
                  </div>

                  {/* Bounding box 2 */}
                  <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '55%',
                    width: '160px',
                    height: '110px',
                    border: '1.5px solid var(--accent-saffron)',
                    background: 'rgba(255, 153, 51, 0.1)',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    fontSize: '0.65rem',
                    color: 'var(--accent-saffron)',
                    fontWeight: 800
                  }}>
                    CORRIDOR FLOW (+18 p/m)
                  </div>

                  {/* Bounding box 3 */}
                  <div style={{
                    position: 'absolute',
                    top: '60%',
                    left: '30%',
                    width: '90px',
                    height: '80px',
                    border: '1.5px solid var(--status-low)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    fontSize: '0.65rem',
                    color: 'var(--status-low)',
                    fontWeight: 800
                  }}>
                    CLEAR EXIT WAY
                  </div>
                </div>
              )}

              {/* Viewfinder Telemetry Overlay (Top Left & Top Right) */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.7)',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="live-dot" /> {currentCam.code} — LIVE INGEST
              </div>

              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.7)',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: 'var(--accent-gold)',
                fontFamily: 'var(--font-mono)'
              }}>
                FPS: {currentCam.fps} | RES: 1920x1080
              </div>

              {/* Bottom Telemetry Bar */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#fff',
                fontSize: '0.8rem'
              }}>
                <div>
                  <strong>Location:</strong> {currentCam.name} ({currentCam.zone})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={14} style={{ color: 'var(--accent-saffron)' }} />
                  <span>CV Model: YATRA-YOLO-V8</span>
                </div>
              </div>
            </div>

            {/* AI Real-Time Analysis Metrics Panel */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-saffron)', marginBottom: '12px' }}>
                  REAL-TIME DETECTED METRICS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="card" style={{ padding: '10px 14px', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>People Detected</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {currentCam.peopleCount.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>pilgrims</span>
                    </div>
                  </div>

                  <div className="card" style={{ padding: '10px 14px', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Zone Capacity Load</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: currentCam.occupancyPercent > 80 ? 'var(--status-critical)' : 'var(--accent-saffron)' }}>
                      {currentCam.occupancyPercent}% <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>of {currentCam.zoneCapacity.toLocaleString()} max</span>
                    </div>
                  </div>

                  <div className="card" style={{ padding: '10px 14px', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Flow Movement Speed</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--status-low)' }}>
                      +{currentCam.flowRate} pilgrims/min
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evaluated Risk:</span>
                    <span className={`badge ${currentCam.risk === 'CRITICAL' ? 'badge-critical' : currentCam.risk === 'HIGH' ? 'badge-high' : 'badge-medium'}`}>
                      {currentCam.risk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Viewfinder Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Eye size={14} /> {showBoundingBoxes ? 'Hide Bounding Boxes' : 'Show AI Bounding Boxes'}
                </button>
                <button
                  onClick={onClose}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Close CCTV Stream
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
