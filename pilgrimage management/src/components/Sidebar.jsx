import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Activity,
  ShieldAlert,
  Navigation,
  DoorOpen,
  AlertTriangle,
  UserCheck,
  HeartPulse,
  Radio,
  Building,
  BarChart3,
  Calendar,
  FileText,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Ticket,
  Car,
  Megaphone,
  Wifi,
  TrendingUp,
  History,
  Bot,
  Camera,
  Eye
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import AiCopilot from './AiCopilot';

export default function Sidebar({ isOpen, onClose }) {
  const {
    isSimulating,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    triggerSurgeScenario,
    currentUser,
    userRole,
    hasPermission,
    isReadOnly
  } = useSimulation();

  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);

  const isPilgrim = currentUser?.isPilgrim;

  // Master Navigation Items Definition
  const allNavItems = [
    { label: "Overview Command", path: "/dashboard", icon: LayoutDashboard, permission: "overview", pilgrimAllowed: false },
    { label: "Temple Network", path: "/temples", icon: Building, permission: "temples", pilgrimAllowed: false },
    { label: "Pilgrim Portal", path: "/pilgrim-portal", icon: UserCheck, permission: "pilgrim-portal", pilgrimAllowed: true },
    { label: "Digital Yatra Pass", path: "/yatra-pass", icon: Ticket, permission: "yatra-pass", pilgrimAllowed: true },
    { label: "Live Map Telemetry", path: "/live-map", icon: Compass, permission: "live-map", pilgrimAllowed: true },
    { label: "Crowd Flow Intelligence", path: "/crowd-flow", icon: Activity, permission: "crowd", pilgrimAllowed: false },
    { label: "Risk Intelligence", path: "/risk-intelligence", icon: ShieldAlert, permission: "crowd", pilgrimAllowed: false },
    { label: "Routes & Access", path: "/routes", icon: Navigation, permission: "routes", pilgrimAllowed: true },
    { label: "Gates & Throughput", path: "/gates", icon: DoorOpen, permission: "gates", pilgrimAllowed: true },
    { label: "Emergency & SOS", path: "/emergency", icon: AlertTriangle, permission: "incidents", pilgrimAllowed: true },
    { label: "Lost & Found", path: "/lost-found", icon: UserCheck, permission: "lost-found", pilgrimAllowed: true },
    { label: "Medical & Bed Network", path: "/medical", icon: HeartPulse, permission: "medical", pilgrimAllowed: true },
    { label: "Transport & Parking", path: "/transport", icon: Car, permission: "transport", pilgrimAllowed: true },
    { label: "Public Broadcast", path: "/public-alerts", icon: Megaphone, permission: "public-alerts", pilgrimAllowed: true },
    { label: "Field Operations", path: "/field-operations", icon: Radio, permission: "field-operations", pilgrimAllowed: false },
    { label: "Network Telemetry", path: "/network-health", icon: Wifi, permission: "all", pilgrimAllowed: false },
    { label: "Infrastructure", path: "/infrastructure", icon: Building, permission: "infrastructure", pilgrimAllowed: false },
    { label: "Resource Demand", path: "/resource-prediction", icon: TrendingUp, permission: "all", pilgrimAllowed: false },
    { label: "Audit Log Trail", path: "/audit-log", icon: History, permission: "audit-log", pilgrimAllowed: false },
    { label: "Analytics", path: "/analytics", icon: BarChart3, permission: "analytics", pilgrimAllowed: false },
    { label: "Event Control", path: "/event-control", icon: Calendar, permission: "event-control", pilgrimAllowed: false },
    { label: "Reports & Logs", path: "/reports", icon: FileText, permission: "reports", pilgrimAllowed: false },
    { label: "System Settings", path: "/settings", icon: Settings, permission: "all", pilgrimAllowed: false }
  ];

  // RBAC Filtering according to Pilgrim vs Worker permissions
  const allowedItems = allNavItems.filter(item => {
    if (isPilgrim) return item.pilgrimAllowed;
    if (currentUser?.role === 'govt_admin' || (currentUser?.permissions && currentUser.permissions.includes('all'))) return true;
    return hasPermission(item.permission);
  });

  return (
    <>
      <aside style={{
        width: '260px',
        background: '#060913',
        borderRight: '1px solid #1e293b',
        boxShadow: '10px 0 30px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 40,
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        {/* Navigation Menu */}
        <div style={{ padding: '20px 14px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', padding: '0 12px 12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{isPilgrim ? 'DEVOTEE SERVICES' : 'COMMAND NAVIGATION'}</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--accent-saffron)', textTransform: 'none', fontWeight: 800 }}>
              {currentUser?.roleTitle || userRole?.title}
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {allowedItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    background: isActive ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0.1) 100%)' : 'transparent',
                    boxShadow: isActive ? '0 4px 15px rgba(249, 115, 22, 0.15)' : 'none',
                    transition: 'all 0.2s ease'
                  })}
                >
                  <Icon size={17} style={{ color: 'var(--accent-saffron)' }} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* AI Launcher Dock Button */}
        <div style={{ padding: '12px 14px', display: 'flex', gap: '8px', borderTop: 'none', background: 'rgba(255, 255, 255, 0.02)' }}>
          <button
            onClick={() => setIsAiCopilotOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '0.78rem', color: 'var(--accent-saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px' }}
          >
            <Bot size={15} /> AI Command Assistant
          </button>
        </div>

        {/* Sidebar Footer — Simulation Control Widget & Read-Only Badge */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-primary)'
        }}>
          {isReadOnly && (
            <div style={{
              background: 'var(--status-medium-bg)',
              border: '1px solid var(--status-medium-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px'
            }}>
              <Eye size={14} /> READ-ONLY AUDIT MODE
            </div>
          )}

          {!isPilgrim && (
            <>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-saffron)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={13} /> SIMULATION MODE</span>
                <span style={{ fontSize: '0.65rem', color: isSimulating ? 'var(--status-low)' : 'var(--text-muted)' }}>
                  {isSimulating ? '● RUNNING' : 'PAUSED'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                {isSimulating ? (
                  <button onClick={pauseSimulation} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Pause size={12} /> Pause
                  </button>
                ) : (
                  <button onClick={startSimulation} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Play size={12} /> Start
                  </button>
                )}
                <button onClick={resetSimulation} className="btn btn-secondary btn-sm" title="Reset Simulation">
                  <RotateCcw size={12} />
                </button>
              </div>

              {!isReadOnly && (
                <button
                  onClick={triggerSurgeScenario}
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%', fontSize: '0.7rem', padding: '6px' }}
                >
                  ⚡ TRIGGER ZONE B SURGE
                </button>
              )}
            </>
          )}

          {isPilgrim && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              🙏 Devotee Support Direct: 1800 123 4567
            </div>
          )}
        </div>
      </aside>

      {/* Floating AI Copilot Modal */}
      <AiCopilot isOpen={isAiCopilotOpen} onClose={() => setIsAiCopilotOpen(false)} />
    </>
  );
}
