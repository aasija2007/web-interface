import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationPanel from './components/NotificationPanel';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import CrowdFlow from './pages/CrowdFlow';
import RiskIntelligence from './pages/RiskIntelligence';
import RoutesPage from './pages/Routes';
import Gates from './pages/Gates';
import Emergency from './pages/Emergency';
import LostFound from './pages/LostFound';
import Medical from './pages/Medical';
import FieldOperations from './pages/FieldOperations';
import Infrastructure from './pages/Infrastructure';
import Analytics from './pages/Analytics';
import EventControl from './pages/EventControl';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// REVOLUTIONARY YATRAFLOW PLATFORM MODULES
import PilgrimPortal from './pages/PilgrimPortal';
import YatraPass from './pages/YatraPass';
import Transport from './pages/Transport';
import PublicAlerts from './pages/PublicAlerts';
import NetworkHealth from './pages/NetworkHealth';
import ResourcePrediction from './pages/ResourcePrediction';
import AuditLog from './pages/AuditLog';
import TempleManagement from './pages/TempleManagement';

function CommandLayout() {
  const { notifications } = useSimulation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar
          onToggleNotifications={() => setIsNotifOpen(!isNotifOpen)}
          unreadNotifCount={unreadNotifCount}
        />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <NotificationPanel
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Login */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Command Center & Pilgrim Routes */}
          <Route element={<CommandLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="temples" />}>
              <Route path="/temples" element={<TempleManagement />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="pilgrim-portal" />}>
              <Route path="/pilgrim-portal" element={<PilgrimPortal />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="yatra-pass" />}>
              <Route path="/yatra-pass" element={<YatraPass />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="live-map" />}>
              <Route path="/live-map" element={<LiveMap />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="crowd" />}>
              <Route path="/crowd-flow" element={<CrowdFlow />} />
              <Route path="/risk-intelligence" element={<RiskIntelligence />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="routes" />}>
              <Route path="/routes" element={<RoutesPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="gates" />}>
              <Route path="/gates" element={<Gates />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="incidents" />}>
              <Route path="/emergency" element={<Emergency />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="lost-found" />}>
              <Route path="/lost-found" element={<LostFound />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="medical" />}>
              <Route path="/medical" element={<Medical />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="transport" />}>
              <Route path="/transport" element={<Transport />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="public-alerts" />}>
              <Route path="/public-alerts" element={<PublicAlerts />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="field-operations" />}>
              <Route path="/field-operations" element={<FieldOperations />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="infrastructure" />}>
              <Route path="/infrastructure" element={<Infrastructure />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="audit-log" />}>
              <Route path="/audit-log" element={<AuditLog />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="analytics" />}>
              <Route path="/analytics" element={<Analytics />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="event-control" />}>
              <Route path="/event-control" element={<EventControl />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="reports" />}>
              <Route path="/reports" element={<Reports />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="all" />}>
              <Route path="/network-health" element={<NetworkHealth />} />
              <Route path="/resource-prediction" element={<ResourcePrediction />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SimulationProvider>
  );
}
