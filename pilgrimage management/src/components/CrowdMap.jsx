import React, { useState, useEffect } from 'react';
import { Map, Layers, Navigation, Shield, HeartPulse, Droplets, Compass, Maximize2, AlertTriangle, Globe } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { useSimulation } from '../context/SimulationContext';
import RiskBadge from './RiskBadge';

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function CrowdMap({ onSelectZone, selectedZoneId }) {
  const { zones, gates, routes, medicalUnits, incidents, surgeTriggered, surgeResponseActivated, activeTemple, currentUser } = useSimulation();
  const [viewMode, setViewMode] = useState('GIS_LEAFLET'); // 'GIS_LEAFLET' | 'TACTICAL_SVG'
  const [tileProvider, setTileProvider] = useState('osm'); // 'osm' | 'carto_dark' | 'satellite'
  const [activeLayer, setActiveLayer] = useState('density'); // 'density' | 'facilities' | 'routes'
  const [hoveredZone, setHoveredZone] = useState(null);

  const isPilgrim = currentUser?.isPilgrim;
  const templeCenter = activeTemple?.geo ? [activeTemple.geo.lat, activeTemple.geo.lng] : [25.4365, 81.8450];

  const getZoneColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getTileUrl = () => {
    switch (tileProvider) {
      case 'carto_dark': return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'satellite': return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      default: return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  return (
    <div className="card" style={{ padding: '0', position: 'relative', overflow: 'hidden', minHeight: '540px', display: 'flex', flexDirection: 'column' }}>
      {/* Map Header & Toolbar */}
      <div style={{
        padding: '12px 18px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass size={18} style={{ color: 'var(--accent-saffron)' }} />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            {activeTemple ? activeTemple.name.toUpperCase() : 'LIVE TEMPLE'} TELEMETRY MAP
          </span>
          <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>● LIVE GIS SENSORS</span>
        </div>

        {/* View Mode Switcher & Tile Layer Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {viewMode === 'GIS_LEAFLET' && (
            <select
              value={tileProvider}
              onChange={(e) => setTileProvider(e.target.value)}
              style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-primary)' }}
            >
              <option value="osm">🗺️ OpenStreetMap Standard</option>
              <option value="carto_dark">🌙 Carto Dark Mode</option>
              <option value="satellite">🛰️ Esri Satellite View</option>
            </select>
          )}

          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('GIS_LEAFLET')}
              className={`btn btn-sm ${viewMode === 'GIS_LEAFLET' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              <Globe size={13} /> Real GIS Map
            </button>
            <button
              onClick={() => setViewMode('TACTICAL_SVG')}
              className={`btn btn-sm ${viewMode === 'TACTICAL_SVG' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              <Layers size={13} /> Vector Mesh
            </button>
          </div>

          <button
            onClick={() => setActiveLayer(activeLayer === 'facilities' ? 'density' : 'facilities')}
            className={`btn btn-sm ${activeLayer === 'facilities' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            <HeartPulse size={13} /> {isPilgrim ? 'Devotee Facilities' : 'Field Assets'}
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div style={{ flex: 1, position: 'relative', background: '#090d16', height: '480px', minHeight: '480px' }}>
        {viewMode === 'GIS_LEAFLET' ? (
          /* Real GIS Interactive Map via Leaflet */
          <div style={{ width: '100%', height: '480px', position: 'relative' }}>
            <MapContainer
              key={`${activeTemple?.id || 'map'}-${tileProvider}`}
              center={templeCenter}
              zoom={15}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '480px', minHeight: '480px', background: '#090d16' }}
            >
              <MapResizer />
              <MapResizer />

              <TileLayer
                key={tileProvider}
                attribution='&copy; OpenStreetMap contributors'
                url={getTileUrl()}
              />

              {/* Zones Overlay Circles */}
              {zones.map(zone => {
                const isSelected = selectedZoneId === zone.id;
                const color = getZoneColor(zone.riskLevel);
                const radius = Math.max(26, Math.min(52, Math.round(zone.densityPercent * 0.48)));

                return (
                  <CircleMarker
                    key={zone.id}
                    center={[zone.geo?.lat || 25.4365, zone.geo?.lng || 81.8450]}
                    radius={radius}
                    pathOptions={{
                      color: isSelected ? '#ffffff' : color,
                      fillColor: color,
                      fillOpacity: zone.densityPercent / 140,
                      weight: isSelected ? 4 : 2
                    }}
                    eventHandlers={{
                      click: () => onSelectZone && onSelectZone(zone)
                    }}
                  >
                    <Tooltip permanent direction="center" className="custom-leaflet-tooltip">
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
                        {zone.code}<br />{zone.densityPercent}%
                      </div>
                    </Tooltip>

                    <Popup>
                      <div style={{ color: '#0f172a', padding: '4px' }}>
                        <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800 }}>{zone.name}</h4>
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                          <strong>Current Crowd:</strong> {zone.currentCount.toLocaleString()} / {zone.capacity.toLocaleString()} PPL
                        </div>
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                          <strong>Density:</strong> {zone.densityPercent}% | <strong>Wait Time:</strong> {zone.waitTimeMinutes} mins
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {zone.description}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* Gate Markers on GIS Map */}
              {gates.map(gate => (
                <CircleMarker
                  key={gate.id}
                  center={[gate.geo?.lat || 25.4380, gate.geo?.lng || 81.8420]}
                  radius={9}
                  pathOptions={{ color: '#ffffff', fillColor: '#3b82f6', fillOpacity: 0.95, weight: 2 }}
                >
                  <Popup>
                    <div style={{ color: '#0f172a' }}>
                      <strong style={{ display: 'block', fontSize: '13px' }}>{gate.name}</strong>
                      <div style={{ fontSize: '11px' }}>Throughput: {gate.peoplePerMin} ppl/min</div>
                      <div style={{ fontSize: '11px' }}>Queue: {gate.queueLength} ppl</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: gate.status === 'OPEN' ? '#10b981' : '#ef4444' }}>Status: {gate.status}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Field Assets Markers */}
              {activeLayer === 'facilities' && (
                <>
                  <CircleMarker
                    center={[25.4350, 81.8470]}
                    radius={11}
                    pathOptions={{ color: '#ffffff', fillColor: '#ef4444', fillOpacity: 0.95, weight: 2 }}
                  >
                    <Popup>
                      <div style={{ color: '#0f172a' }}>
                        <strong>🚨 Central Medical HQ</strong>
                        <div>14 Beds Available | 4 Ambulances</div>
                      </div>
                    </Popup>
                  </CircleMarker>

                  <CircleMarker
                    center={[25.4365, 81.8440]}
                    radius={11}
                    pathOptions={{ color: '#ffffff', fillColor: '#eab308', fillOpacity: 0.95, weight: 2 }}
                  >
                    <Popup>
                      <div style={{ color: '#0f172a' }}>
                        <strong>🚓 Police Command Post Alpha</strong>
                        <div>18 Officers Patrol Active</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </>
              )}
            </MapContainer>
          </div>
        ) : (
          /* Tactical SVG Visualizer Canvas */
          <>
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.15 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <svg width="100%" height="100%" viewBox="0 0 1000 600" style={{ display: 'block', minHeight: '480px' }}>
              <defs>
                <filter id="glow-high" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="15" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-saffron)" />
                </marker>
              </defs>

              <g stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" strokeDasharray="6 6">
                <path d="M 180 200 L 420 280 L 650 220" />
                <path d="M 220 120 L 650 220" />
                <path d="M 420 280 L 820 430" stroke={routes.find(r => r.id === 'route-c')?.status === 'OPEN' ? '#10b981' : 'rgba(239, 68, 68, 0.4)'} strokeWidth="6" />
              </g>

              {zones.map(zone => {
                const isSelected = selectedZoneId === zone.id;
                const isHovered = hoveredZone === zone.id;
                const color = getZoneColor(zone.riskLevel);
                let cx = 200, cy = 200, rx = 100, ry = 70;

                if (zone.code === 'ZONE_A') { cx = 180; cy = 200; rx = 90; ry = 65; }
                if (zone.code === 'ZONE_B') { cx = 420; cy = 280; rx = 80; ry = 55; }
                if (zone.code === 'ZONE_C') { cx = 650; cy = 220; rx = 130; ry = 90; }
                if (zone.code === 'ZONE_D') { cx = 250; cy = 460; rx = 100; ry = 65; }
                if (zone.code === 'ZONE_E') { cx = 820; cy = 430; rx = 95; ry = 65; }

                return (
                  <g
                    key={zone.id}
                    onClick={() => onSelectZone && onSelectZone(zone)}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    <ellipse cx={cx} cy={cy} rx={rx + 15} ry={ry + 15} fill={color} opacity={zone.densityPercent / 300} filter="url(#glow-high)" />
                    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="var(--bg-card)" stroke={isSelected || isHovered ? '#ffffff' : color} strokeWidth={isSelected ? 3 : 2} />
                    {zone.riskLevel === 'HIGH' || zone.riskLevel === 'CRITICAL' ? (
                      <circle cx={cx} cy={cy} r="25" fill={color} opacity="0.4">
                        <animate attributeName="r" values="15;35;15" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                    ) : null}
                    <text x={cx} y={cy - 12} textAnchor="middle" fill="#ffffff" fontWeight="800" fontSize="13">{zone.code}</text>
                    <text x={cx} y={cy + 8} textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontWeight="600">{zone.densityPercent}% Density</text>
                    <text x={cx} y={cy + 24} textAnchor="middle" fill={color} fontSize="10" fontWeight="700">{zone.currentCount.toLocaleString()} PPL</text>
                  </g>
                );
              })}
            </svg>
          </>
        )}

        {/* Map Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          background: 'rgba(13, 18, 31, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          fontSize: '0.75rem',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <span>Low (&lt;60%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span>Medium (60-75%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316' }} />
            <span>High (75-88%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span>Critical (&gt;88%)</span>
          </div>
        </div>

        {/* Sudden Surge Alert Badge on Map */}
        {surgeTriggered && !surgeResponseActivated && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--status-critical-bg)',
            border: '1px solid var(--status-critical-border)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'pulseGlow 1.5s infinite ease-in-out',
            zIndex: 1000
          }}>
            <AlertTriangle size={18} style={{ color: 'var(--status-critical)' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--status-critical)' }}>CROWD SURGE DETECTED</div>
              <div style={{ fontSize: '0.75rem', color: '#ffffff' }}>Zone B density at 91% — Action Required</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
