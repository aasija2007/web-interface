import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  INITIAL_EVENT_INFO,
  INITIAL_ZONES,
  INITIAL_GATES,
  INITIAL_ROUTES,
  INITIAL_INCIDENTS,
  INITIAL_MEDICAL_UNITS,
  INITIAL_VOLUNTEERS,
  INITIAL_SECURITY,
  INITIAL_INFRASTRUCTURE,
  INITIAL_WEATHER,
  INITIAL_LOST_PERSONS,
  INITIAL_PARKING,
  INITIAL_SHUTTLES,
  INITIAL_PUBLIC_ALERTS,
  INITIAL_NETWORK_SENSORS,
  INITIAL_CCTV_FEEDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_YATRA_PASSES,
  INITIAL_TEMPLES,
  WORKER_ROLES,
  MOCK_USERS,
  ROLES
} from '../data/mockData';
import { calculateRiskScore, calculateCrowdPulse, calculatePrediction, calculateSafeExitWindow } from '../utils/riskCalculator';

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  // Demo State
  const [eventInfo, setEventInfo] = useState(INITIAL_EVENT_INFO);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [gates, setGates] = useState(INITIAL_GATES);
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [medicalUnits, setMedicalUnits] = useState(INITIAL_MEDICAL_UNITS);
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS);
  const [security, setSecurity] = useState(INITIAL_SECURITY);
  const [infrastructure, setInfrastructure] = useState(INITIAL_INFRASTRUCTURE);
  const [weather, setWeather] = useState(INITIAL_WEATHER);
  const [lostPersons, setLostPersons] = useState(INITIAL_LOST_PERSONS);
  const [parkingAreas, setParkingAreas] = useState(INITIAL_PARKING);
  const [shuttleBuses, setShuttleBuses] = useState(INITIAL_SHUTTLES);
  const [publicAlerts, setPublicAlerts] = useState(INITIAL_PUBLIC_ALERTS);
  const [networkSensors, setNetworkSensors] = useState(INITIAL_NETWORK_SENSORS);
  const [cctvFeeds, setCctvFeeds] = useState(INITIAL_CCTV_FEEDS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [yatraPasses, setYatraPasses] = useState(INITIAL_YATRA_PASSES);
  const [templesList, setTemplesList] = useState(INITIAL_TEMPLES);
  const [activeTempleId, setActiveTempleId] = useState('kashi-vishwanath');

  // Authenticated User State (Loaded from localStorage or initialized)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('yatraflow_active_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default Admin User for instant preview
    return MOCK_USERS[0];
  });

  // Theme State ('dark' or 'light')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('yatraflow_theme');
      if (saved) return saved;
    } catch (e) {}
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('yatraflow_theme', nextTheme);
      return nextTheme;
    });
  }, []);

  const [accessibilityMode, setAccessibilityMode] = useState(false);

  // Active Pilgrim Profile (for Pilgrim Portal)
  const [pilgrimProfile, setPilgrimProfile] = useState({
    name: "Suresh Kumar",
    phone: "+91 98765 12345",
    groupSize: 4,
    preferredTimeSlot: "08:00 AM - 10:00 AM",
    accessibilityNeeds: ["Wheelchair Ramp Required", "Elderly Pilgrim"],
    currentZone: "Zone A — Main Entrance Plaza",
    activePassId: "YATRA-2026-8842"
  });

  // Simulation Controls
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [surgeTriggered, setSurgeTriggered] = useState(false);
  const [surgeResponseActivated, setSurgeResponseActivated] = useState(false);

  // Notification Feed
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'INFO',
      title: 'Command Center Online',
      message: 'Monitoring active for Thiruvizha 2026. 142 sensors reporting nominal telemetry.',
      timestamp: 'Just now',
      read: false
    }
  ]);

  // Sync user role structure for backwards compatibility
  const userRole = useMemo(() => {
    if (!currentUser) return WORKER_ROLES[0];
    if (currentUser.isPilgrim) {
      return { id: 'pilgrim', title: 'Pilgrim Access', name: currentUser.email || 'Devotee', permissions: currentUser.permissions || ['pilgrim'] };
    }
    const matchingRole = WORKER_ROLES.find(r => r.id === currentUser.role);
    return matchingRole || { id: currentUser.role, title: currentUser.roleTitle || 'Authorized Staff', name: currentUser.name, permissions: currentUser.permissions || ['all'] };
  }, [currentUser]);

  const isReadOnly = useMemo(() => currentUser?.role === 'viewer_auditor', [currentUser]);

  // Helper to append audit log
  const logAuditAction = useCallback((action, prevValue, newValue, reason, moduleName) => {
    const entry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'System',
      role: currentUser ? currentUser.roleTitle : 'System',
      action,
      prevValue,
      newValue,
      reason,
      module: moduleName
    };
    setAuditLogs(prev => [entry, ...prev]);
  }, [currentUser]);

  // Helper to append notifications
  const addNotification = useCallback((type, title, message) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  // Direct Role Login Handler (Instant authentication by selecting role)
  const loginByRole = useCallback((roleId) => {
    if (roleId === 'pilgrim') {
      const pilgrimUser = {
        userId: `usr-pilgrim-${Date.now()}`,
        name: "Devotee Pilgrim",
        username: "pilgrim@yatra.dev",
        email: "pilgrim@yatra.dev",
        role: "pilgrim",
        roleTitle: "Pilgrim Access",
        assignedTempleId: activeTempleId || "kashi-vishwanath",
        assignedEventId: "evt-2026-01",
        assignedArea: "Devotee Services",
        permissions: ["pilgrim-portal", "yatra-pass", "live-map", "public-alerts", "transport", "lost-found", "medical", "routes", "gates"],
        status: "ACTIVE",
        isPilgrim: true,
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCurrentUser(pilgrimUser);
      localStorage.setItem('yatraflow_active_user', JSON.stringify(pilgrimUser));
      logAuditAction("Devotee Role Login Granted", "Unauthenticated", pilgrimUser.name, "Role-Based Authentication", "Authentication System");
      addNotification('SUCCESS', 'Pilgrim Access Unlocked', `Welcome Devotee! Pilgrim portal active.`);
      return { success: true, user: pilgrimUser };
    }

    const foundMockUser = MOCK_USERS.find(u => u.role === roleId);
    const roleObj = WORKER_ROLES.find(r => r.id === roleId);

    const fullUser = foundMockUser ? {
      ...foundMockUser,
      isPilgrim: false,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : {
      userId: `usr-${roleId}-${Date.now()}`,
      name: roleObj?.title ? `${roleObj.title} Officer` : 'Authorized Staff',
      username: roleId,
      role: roleId,
      roleTitle: roleObj?.title || 'Operational Staff',
      assignedTempleId: roleObj?.defaultAssignedTemple || 'kashi-vishwanath',
      assignedEventId: 'evt-2026-01',
      assignedArea: roleObj?.name || 'Precinct Command',
      permissions: roleObj?.permissions || ['all'],
      status: 'ACTIVE',
      isPilgrim: false,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCurrentUser(fullUser);
    localStorage.setItem('yatraflow_active_user', JSON.stringify(fullUser));

    if (fullUser.assignedTempleId && fullUser.assignedTempleId !== 'all') {
      setActiveTempleId(fullUser.assignedTempleId);
    }

    logAuditAction("Role Authorization Granted", "Unauthenticated", `${fullUser.name} (${fullUser.roleTitle})`, "Direct Role Login", "Authentication System");
    addNotification('SUCCESS', 'Operational Role Verified', `Access granted for ${fullUser.roleTitle}. Welcome, ${fullUser.name}.`);

    return { success: true, user: fullUser };
  }, [activeTempleId, logAuditAction, addNotification]);

  // Worker Credentials Login Handler (Async API to Express Server)
  const loginWorker = useCallback(async (selectedRoleId, identifier, password) => {
    let targetUser = null;
    try {
      const response = await fetch('/api/auth/login-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, selectedRoleId })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          mismatch: data.mismatch || false,
          selectedRoleTitle: data.selectedRoleTitle,
          assignedRoleTitle: data.assignedRoleTitle,
          assignedUser: data.assignedUser,
          error: data.error || 'Authentication failed. Please check credentials.'
        };
      }
      targetUser = data.user;
    } catch (err) {
      // Local fallback if Express server is offline
      const trimmedUser = (identifier || '').trim();
      const foundUser = MOCK_USERS.find(u =>
        u.username.toLowerCase() === trimmedUser.toLowerCase() ||
        (u.phone && u.phone.includes(trimmedUser))
      ) || MOCK_USERS.find(u => u.username.toLowerCase() === trimmedUser.toLowerCase() && u.password === password);

      if (!foundUser || foundUser.password !== password) {
        return { success: false, error: 'Invalid username/phone or password.' };
      }

      if (foundUser.role !== selectedRoleId) {
        const selectedRoleObj = WORKER_ROLES.find(r => r.id === selectedRoleId);
        const assignedRoleObj = WORKER_ROLES.find(r => r.id === foundUser.role);
        return {
          success: false,
          mismatch: true,
          selectedRoleTitle: selectedRoleObj?.title || selectedRoleId,
          assignedRoleTitle: assignedRoleObj?.title || foundUser.roleTitle,
          assignedUser: foundUser,
          error: `ACCESS DENIED\n\nThis account is not authorized for ${selectedRoleObj?.title || selectedRoleId} access.\n\nYour assigned role:\n${assignedRoleObj?.title || foundUser.roleTitle}`
        };
      }
      targetUser = foundUser;
    }

    const fullUser = {
      ...targetUser,
      isPilgrim: false,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCurrentUser(fullUser);
    localStorage.setItem('yatraflow_active_user', JSON.stringify(fullUser));

    if (fullUser.assignedTempleId && fullUser.assignedTempleId !== 'all') {
      setActiveTempleId(fullUser.assignedTempleId);
    }

    logAuditAction("Worker Credentials Authenticated", "Unauthenticated", `${fullUser.name} (${fullUser.roleTitle})`, "Direct Role Authentication", "Authentication System");
    addNotification('SUCCESS', 'Role Authentication Granted', `Welcome back ${fullUser.name}. Access unlocked for ${fullUser.roleTitle}.`);

    return { success: true, user: fullUser };
  }, [logAuditAction, addNotification]);

  // Send OTP API Dispatch (Legacy Helper kept for backwards compatibility)
  const sendOtpApi = useCallback(async (phone) => {
    return { success: true, message: 'OTP bypass active.' };
  }, []);

  // Save SMS Gateway Credentials Configuration
  const saveSmsConfig = useCallback(async (configPayload) => {
    return { success: true, message: 'SMS config updated.' };
  }, []);

  // Fetch Current SMS Configuration Status
  const getSmsConfig = useCallback(async () => {
    return { success: true, activeProviderCount: 0 };
  }, []);

  // OTP Verification Handler (Kept for compatibility)
  const verifyOtp = useCallback(async (userCandidate, inputOtp) => {
    const fullUser = {
      ...userCandidate,
      isPilgrim: !!userCandidate?.isPilgrim,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCurrentUser(fullUser);
    localStorage.setItem('yatraflow_active_user', JSON.stringify(fullUser));
    return { success: true, user: fullUser };
  }, []);

  // Pilgrim Login Handler (Async API to Express Server)
  const loginPilgrim = useCallback(async (emailOrPhone) => {
    const trimmed = (emailOrPhone || '').trim();
    if (!trimmed) {
      return { success: false, error: 'Please enter a valid mobile number or email address.' };
    }

    try {
      const response = await fetch('/api/auth/login-pilgrim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmed })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Pilgrim authentication failed.' };
      }

      const pilgrimUser = data.user || {
        userId: `usr-pilgrim-${Date.now()}`,
        name: trimmed.split('@')[0],
        username: trimmed,
        email: trimmed,
        role: "pilgrim",
        roleTitle: "Pilgrim Access",
        assignedTempleId: activeTempleId || "kashi-vishwanath",
        assignedEventId: "evt-2026-01",
        assignedArea: "Devotee Services",
        permissions: ["pilgrim-portal", "yatra-pass", "live-map", "public-alerts", "transport", "lost-found", "medical", "routes", "gates"],
        status: "ACTIVE",
        isPilgrim: true,
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setCurrentUser(pilgrimUser);
      localStorage.setItem('yatraflow_active_user', JSON.stringify(pilgrimUser));
      addNotification('INFO', 'Devotee Access Granted', `Welcome ${pilgrimUser.name}! Pilgrim services active.`);
      return { success: true, user: pilgrimUser };
    } catch (err) {
      const pilgrimUser = {
        userId: `usr-pilgrim-${Date.now()}`,
        name: trimmed.split('@')[0],
        username: trimmed,
        email: trimmed,
        role: "pilgrim",
        roleTitle: "Pilgrim Access",
        assignedTempleId: activeTempleId || "kashi-vishwanath",
        assignedEventId: "evt-2026-01",
        assignedArea: "Devotee Services",
        permissions: ["pilgrim-portal", "yatra-pass", "live-map", "public-alerts", "transport", "lost-found", "medical", "routes", "gates"],
        status: "ACTIVE",
        isPilgrim: true,
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCurrentUser(pilgrimUser);
      localStorage.setItem('yatraflow_active_user', JSON.stringify(pilgrimUser));
      addNotification('INFO', 'Devotee Access Granted', `Welcome ${pilgrimUser.name}! Pilgrim services active.`);
      return { success: true, user: pilgrimUser };
    }
  }, [activeTempleId, addNotification]);

  // Logout Handler
  const logoutUser = useCallback(() => {
    if (currentUser) {
      logAuditAction("Session Terminated", currentUser.name, "LOGGED OUT", "User initiated logout", "Authentication System");
    }
    setCurrentUser(null);
    localStorage.removeItem('yatraflow_active_user');
  }, [currentUser, logAuditAction]);

  // Permission Verification Helper
  const hasPermission = useCallback((permissionKey) => {
    if (!currentUser) return false;
    if (currentUser.role === 'govt_admin' || (currentUser.permissions && currentUser.permissions.includes('all'))) return true;
    return currentUser.permissions && currentUser.permissions.includes(permissionKey);
  }, [currentUser]);

  // Compute calculated metrics
  const riskAnalysis = useMemo(() => {
    return calculateRiskScore(zones, gates, routes, weather, incidents);
  }, [zones, gates, routes, weather, incidents]);

  const crowdPulse = useMemo(() => {
    return calculateCrowdPulse(zones, gates, weather, incidents);
  }, [zones, gates, weather, incidents]);

  const prediction = useMemo(() => {
    return calculatePrediction(eventInfo.currentCrowd, zones, gates, surgeTriggered && !surgeResponseActivated);
  }, [eventInfo.currentCrowd, zones, gates, surgeTriggered, surgeResponseActivated]);

  const safeExitWindow = useMemo(() => {
    return calculateSafeExitWindow(zones, routes);
  }, [zones, routes]);

  // Main Simulation Interval Loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = 2000 / simulationSpeed;
    const timer = setInterval(() => {
      setZones(prevZones => {
        return prevZones.map(zone => {
          if (surgeTriggered && !surgeResponseActivated && zone.code === 'ZONE_B') {
            const newCount = Math.min(24500, zone.currentCount + Math.floor(Math.random() * 250) + 150);
            const newDensity = Math.min(98, Math.round((newCount / zone.capacity) * 100));
            return {
              ...zone,
              currentCount: newCount,
              densityPercent: newDensity,
              riskLevel: newDensity >= 85 ? 'HIGH' : 'MEDIUM',
              waitTimeMinutes: Math.min(45, zone.waitTimeMinutes + 2)
            };
          }

          if (surgeResponseActivated && zone.code === 'ZONE_B') {
            const newCount = Math.max(16000, zone.currentCount - Math.floor(Math.random() * 300) - 100);
            const newDensity = Math.round((newCount / zone.capacity) * 100);
            return {
              ...zone,
              currentCount: newCount,
              densityPercent: newDensity,
              riskLevel: newDensity >= 75 ? 'MEDIUM' : 'LOW',
              waitTimeMinutes: Math.max(10, zone.waitTimeMinutes - 1)
            };
          }

          const delta = Math.floor(Math.random() * 80) - 35;
          const newCount = Math.max(1000, Math.min(zone.capacity, zone.currentCount + delta));
          const newDensity = Math.round((newCount / zone.capacity) * 100);
          return {
            ...zone,
            currentCount: newCount,
            densityPercent: newDensity,
            riskLevel: newDensity >= 85 ? 'CRITICAL' : newDensity >= 75 ? 'HIGH' : newDensity >= 55 ? 'MEDIUM' : 'LOW'
          };
        });
      });

      setEventInfo(prev => ({
        ...prev,
        currentCrowd: Math.max(50000, prev.currentCrowd + (Math.floor(Math.random() * 40) - 15))
      }));

    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulating, simulationSpeed, surgeTriggered, surgeResponseActivated]);

  // Interconnected Yatra Pass QR Scanner Handler
  const scanYatraPass = useCallback((yatraId, gateId = 'gate-a') => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return { success: false, message: 'Read-only mode enabled. Pass scanning disabled.' };
    }

    const targetPass = yatraPasses.find(p => p.yatraId === yatraId);
    if (!targetPass) {
      logAuditAction("Pass Scan Attempt Failed", yatraId, "INVALID", "Unrecognized Yatra ID scanned", "Digital Yatra Pass");
      return { success: false, message: "Invalid Yatra ID. Pass not found in system registry." };
    }

    const groupSize = targetPass.groupSize || 1;
    setGates(prev => prev.map(g => g.id === gateId ? { ...g, peoplePerMin: g.peoplePerMin + groupSize, queueLength: Math.max(0, g.queueLength - 1) } : g));
    setZones(prev => prev.map(z => z.code === 'ZONE_A' ? { ...z, currentCount: z.currentCount + groupSize } : z));
    setEventInfo(prev => ({ ...prev, currentCrowd: prev.currentCrowd + groupSize }));

    setYatraPasses(prev => prev.map(p => p.yatraId === yatraId ? { ...p, entriesUsed: p.entriesUsed + 1 } : p));

    logAuditAction("QR Pass Scan Validated", `${targetPass.name} (${groupSize} pilgrims)`, "ENTRY GRANTED", `Scanned at ${gateId.toUpperCase()}`, "Digital Yatra Pass");
    addNotification('SUCCESS', 'Pass Validated & Entry Logged', `${targetPass.name} (Group of ${groupSize}) checked in at ${gateId.toUpperCase()}. Zone A updated.`);

    return { success: true, message: `Pass Verified! Welcome ${targetPass.name}. Group of ${groupSize} granted entry.`, pass: targetPass };
  }, [yatraPasses, logAuditAction, addNotification, isReadOnly]);

  // Create new Yatra Pass
  const createYatraPass = useCallback((passData) => {
    const newPass = {
      yatraId: `YATRA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      eventDate: "2026-09-21",
      status: "VALID",
      entriesUsed: 0,
      ...passData
    };
    setYatraPasses(prev => [newPass, ...prev]);
    setPilgrimProfile(prev => ({ ...prev, activePassId: newPass.yatraId }));
    logAuditAction("New Yatra Pass Generated", "-", newPass.yatraId, `Registered for ${newPass.name} (Group of ${newPass.groupSize})`, "Digital Yatra Pass");
    addNotification('SUCCESS', 'Yatra Digital Pass Issued', `Pass ${newPass.yatraId} issued for ${newPass.name}. QR code ready.`);
    return newPass;
  }, [logAuditAction, addNotification]);

  // Create Public Alert
  const createPublicAlert = useCallback((alertData) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    const alertObj = {
      id: `alert-${Math.floor(900 + Math.random() * 99)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      active: true,
      ...alertData
    };
    setPublicAlerts(prev => [alertObj, ...prev]);
    addNotification('WARNING', `Public Broadcast: ${alertObj.category}`, alertObj.title);
    logAuditAction("Public Alert Broadcasted", "-", alertObj.title, `Target: ${alertObj.targetAudience} via ${alertObj.channels.join(', ')}`, "Public Communication");
  }, [addNotification, logAuditAction, isReadOnly]);

  // Trigger Sudden Crowd Surge Demo Scenario
  const triggerSurgeScenario = useCallback(() => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    setSurgeTriggered(true);
    setSurgeResponseActivated(false);
    setIsSimulating(true);

    setZones(prev => prev.map(z => z.code === 'ZONE_B' ? {
      ...z,
      currentCount: 22800,
      densityPercent: 91,
      flowPerMin: 780,
      waitTimeMinutes: 32,
      riskLevel: 'HIGH'
    } : z));

    logAuditAction("DEMO SCENARIO: Crowd Surge Triggered", "Baseline", "Zone B Density 91%", "Manual scenario execution", "Scenario Simulation");
    addNotification(
      'CRITICAL',
      'RED ALERT: Sudden Crowd Surge Detected in Zone B',
      'Zone B density reached 91% (+38% flow imbalance). Rapid congestion detected near Temple Approach Corridor.'
    );
  }, [addNotification, logAuditAction, isReadOnly]);

  // Activate Emergency Response for Surge Scenario
  const activateSurgeResponse = useCallback(() => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    setSurgeResponseActivated(true);

    setGates(prev => prev.map(g => g.id === 'gate-b' ? { ...g, status: 'LIMITED', peoplePerMin: 120 } : g));
    setRoutes(prev => prev.map(r => r.id === 'route-c' ? { ...r, status: 'OPEN', capacityPercent: 30 } : r));
    setVolunteers(prev => prev.map(v => v.id === 'vol-7' ? { ...v, status: 'BUSY', location: 'Zone B Bottleneck' } : v));
    setMedicalUnits(prev => prev.map(m => m.id === 'med-1' ? { ...m, status: 'STANDBY_ALERT' } : m));

    logAuditAction("Mitigation Response Activated", "Gate B Open", "Gate B Limited, Route C Open", "Surge mitigation execution", "Emergency Response");
    addNotification(
      'SUCCESS',
      'MITIGATION RESPONSE ACTIVATED',
      'Gate B limited (120/min), Relief Route C OPENED, Rapid Volunteer Team 7 deployed to Zone B. Density cooling down.'
    );
  }, [addNotification, logAuditAction, isReadOnly]);

  // Trigger E2E Scenarios (Scenarios 1 - 5)
  const triggerScenario = useCallback((scenarioId) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    switch (scenarioId) {
      case 'surge':
        triggerSurgeScenario();
        break;

      case 'rain':
        setWeather(prev => ({
          ...prev,
          condition: "Heavy Downpour / Thunderstorm Active",
          rainProb: "95%",
          insight: "CRITICAL RAIN ALERT: Devotees rushing to Zone C covered pandals. Route C bypass recommended."
        }));
        setZones(prev => prev.map(z => z.code === 'ZONE_C' ? { ...z, densityPercent: 88, riskLevel: 'HIGH' } : z));
        logAuditAction("DEMO SCENARIO: Heavy Rain Triggered", "72% Rain", "95% Rain, Zone C Covered Surge", "Weather alert scenario", "Scenario Simulation");
        addNotification('CRITICAL', 'HEAVY RAIN WARNING', 'Torrential downpour started. 95% rain. Pilgrim influx into Zone C covered structures.');
        break;

      case 'medical':
        const newMedInc = {
          id: `INC-${Math.floor(100 + Math.random() * 900)}`,
          title: "Dehydration Collapse near Sanctum Arch",
          type: "Medical Emergency",
          location: "Zone B — Marker 14",
          priority: "CRITICAL",
          status: "ACTIVE",
          assignedTeam: "Unassigned",
          responseEta: "03:00 min",
          timeReported: "Just now",
          description: "68-year-old pilgrim collapsed. Ambulance A-01 requested."
        };
        setIncidents(prev => [newMedInc, ...prev]);
        setMedicalUnits(prev => prev.map(m => m.id === 'med-1' ? { ...m, availableBeds: Math.max(0, m.availableBeds - 1) } : m));
        logAuditAction("DEMO SCENARIO: Medical Emergency Logged", "-", newMedInc.id, "Dehydration collapse logged", "Medical Response");
        addNotification('CRITICAL', 'CRITICAL MEDICAL SOS', `Incident ${newMedInc.id}: Collapse reported near Zone B Arch. Medical HQ notified.`);
        break;

      case 'lost_child':
        const childCase = {
          id: `LP-2026-0${lostPersons.length + 1}`,
          name: "Rohan Varma",
          age: 6,
          gender: "Male",
          clothing: "Red T-shirt, denim shorts",
          lastSeenLocation: "Zone C — Food Stall 2",
          lastSeenTime: "Just now",
          contactName: "Sunil Varma (Father)",
          contactPhone: "+91 99887 76655",
          status: "POSSIBLE MATCH",
          matchedCheckpoint: "Gate D Camera C-04 — 87% Match Confidence",
          photoUrl: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=150&q=80"
        };
        setLostPersons(prev => [childCase, ...prev]);
        logAuditAction("DEMO SCENARIO: Missing Child Registered", "-", childCase.id, "CCTV match 87% at Gate D", "Lost & Found");
        addNotification('WARNING', 'MISSING CHILD ALERT', `Case ${childCase.id}: Rohan Varma (age 6). Possible CCTV Match at Gate D (87% confidence).`);
        break;

      case 'network_offline':
        setNetworkSensors(prev => prev.map(s => s.zoneId === 'zone-d' ? { ...s, status: 'OFFLINE', stale: true, lastPing: '15 mins ago' } : s));
        logAuditAction("DEMO SCENARIO: Network Telemetry Lost", "Zone D Online", "Zone D OFFLINE", "Sensor signal loss", "Network Health");
        addNotification('CRITICAL', 'ZONE D SENSORS OFFLINE', 'Zone D transit hub telemetry connection lost. Stale data warning issued to control room.');
        break;

      default:
        break;
    }
  }, [triggerSurgeScenario, lostPersons.length, addNotification, logAuditAction, isReadOnly]);

  // Interactive Action Handlers
  const startSimulation = () => setIsSimulating(true);
  const pauseSimulation = () => setIsSimulating(false);
  const resetSimulation = () => {
    setIsSimulating(false);
    setSurgeTriggered(false);
    setSurgeResponseActivated(false);
    setZones(INITIAL_ZONES);
    setGates(INITIAL_GATES);
    setRoutes(INITIAL_ROUTES);
    setIncidents(INITIAL_INCIDENTS);
    setEventInfo(INITIAL_EVENT_INFO);
    setNetworkSensors(INITIAL_NETWORK_SENSORS);
    setWeather(INITIAL_WEATHER);
    setParkingAreas(INITIAL_PARKING);
    addNotification('INFO', 'System Reset', 'All telemetry, zones, gates, and routes restored to baseline initial state.');
    logAuditAction("System Baseline Reset", "Modified State", "Initial State", "Manual reset command executed", "System Configuration");
  };

  const updateGateStatus = (gateId, newStatus) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    setGates(prev => prev.map(g => {
      if (g.id === gateId) {
        logAuditAction("Gate Status Updated", `${g.name} (${g.status})`, `${g.name} (${newStatus})`, "Operator manual change", "Gate Control");
        addNotification('INFO', `Gate Update`, `${g.name} status changed to ${newStatus}`);
        return { ...g, status: newStatus };
      }
      return g;
    }));
  };

  const updateRouteStatus = (routeId, newStatus) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    setRoutes(prev => prev.map(r => {
      if (r.id === routeId) {
        logAuditAction("Route Redirection Updated", `${r.name} (${r.status})`, `${r.name} (${newStatus})`, "Operator flow diversion", "Route Intelligence");
        addNotification('INFO', `Route Update`, `${r.name} status changed to ${newStatus}`);
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  const resolveIncident = (incidentId) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        logAuditAction("Incident Marked Resolved", `${inc.id} (${inc.status})`, "RESOLVED", "Field responder team resolved issue", "Emergency Triage");
        addNotification('SUCCESS', 'Incident Resolved', `Incident ${inc.id} (${inc.title}) marked as RESOLVED.`);
        return { ...inc, status: 'RESOLVED', responseEta: 'Resolved' };
      }
      return inc;
    }));
  };

  const assignTeamToIncident = (incidentId, teamName) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        logAuditAction("Team Assigned to Incident", `${inc.id} (Unassigned)`, `${inc.id} (${teamName})`, "Rapid dispatch command", "Emergency Triage");
        addNotification('INFO', 'Team Dispatched', `Assigned ${teamName} to incident ${inc.id}.`);
        return { ...inc, status: 'ASSIGNED', assignedTeam: teamName, responseEta: '02:00 min' };
      }
      return inc;
    }));
  };

  const addIncident = (newIncident) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    const inc = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      timeReported: 'Just now',
      status: 'ACTIVE',
      assignedTeam: 'Unassigned',
      responseEta: '04:00 min',
      ...newIncident
    };
    setIncidents(prev => [inc, ...prev]);
    logAuditAction("New Emergency SOS Logged", "-", inc.id, `${inc.priority}: ${inc.title} at ${inc.location}`, "Emergency Triage");
    addNotification('CRITICAL', 'New Incident Logged', `${inc.priority} Priority: ${inc.title} at ${inc.location}`);
  };

  const addLostPerson = (newPerson) => {
    const person = {
      id: `LP-2026-0${lostPersons.length + 1}`,
      status: 'SEARCHING',
      matchedCheckpoint: 'Transmitted to Command Center & Checkpoint CCTV',
      ...newPerson
    };
    setLostPersons(prev => [person, ...prev]);
    logAuditAction("Missing Person Registered", "-", person.id, `Case ${person.name}, age ${person.age}`, "Lost & Found");
    addNotification('WARNING', 'Missing Person Registered', `Case ${person.id}: ${person.name}, age ${person.age}. Checkpoints notified.`);
  };

  const markLostPersonReunited = (personId) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    setLostPersons(prev => prev.map(p => {
      if (p.id === personId) {
        logAuditAction("Lost Person Reunited", `${p.id} (${p.status})`, "REUNITED", "Family reunion confirmed", "Lost & Found");
        addNotification('SUCCESS', 'Pilgrim Reunited', `Case ${p.id} (${p.name}) marked as REUNITED.`);
        return { ...p, status: 'REUNITED', matchedCheckpoint: 'Reunited with family' };
      }
      return p;
    }));
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Export Simulated Intelligence Report
  const exportReport = () => {
    const reportText = `
===================================================================
YATRAFLOW — FESTIVAL INTELLIGENCE REPORT (SIMULATED DEMO EXPORT)
===================================================================
Event Name: ${eventInfo.name}
Location: ${eventInfo.location}
Date & Time Generated: ${new Date().toLocaleString()}

SUMMARY METRICS:
- Total Monitored Pilgrims: ${eventInfo.expectedAttendance.toLocaleString()}
- Current Active Crowd: ${eventInfo.currentCrowd.toLocaleString()}
- Calculated Risk Score: ${riskAnalysis.score} / 100 (${riskAnalysis.level})
- Crowd Pulse Score: ${crowdPulse.pulseScore} (${crowdPulse.statusLabel})
- Active Incidents: ${incidents.filter(i => i.status !== 'RESOLVED').length}
- Recommended Safe Exit Window: ${safeExitWindow.windowText} via ${safeExitWindow.recommendedRoute}

OPERATIONAL ZONES STATUS:
${zones.map(z => `- ${z.name}: ${z.currentCount.toLocaleString()} / ${z.capacity.toLocaleString()} (${z.densityPercent}% Density) - Risk: ${z.riskLevel}`).join('\n')}

ACTIVE INCIDENTS:
${incidents.map(i => `- [${i.id}] [${i.priority}] ${i.title} (${i.location}) - Status: ${i.status}`).join('\n')}

RECENT AUDIT TRAIL:
${auditLogs.slice(0, 5).map(a => `- [${a.timestamp}] [${a.role}] ${a.action}: ${a.newValue} (Reason: ${a.reason})`).join('\n')}

RECOMMENDATIONS:
1. Maintain bottleneck monitoring near Zone B Temple Corridor.
2. Route C relief bypass reduces peak corridor density by up to 22%.
3. Pre-position Volunteer Rapid Team 7 at central reserve for rapid deployment.
===================================================================
`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YatraFlow_Intelligence_Report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification('SUCCESS', 'Report Exported', 'Downloaded YatraFlow Festival Intelligence Report file.');
  };

  // Multi-Temple Management Actions
  const switchActiveTemple = useCallback((templeId) => {
    const targetTemple = templesList.find(t => t.id === templeId);
    if (!targetTemple) return;

    setActiveTempleId(templeId);
    setEventInfo(prev => ({
      ...prev,
      name: `${targetTemple.name} — Live Operations`,
      subtitle: `${targetTemple.deity} Precinct Management`,
      location: targetTemple.location,
      expectedAttendance: targetTemple.expectedAttendance,
      currentCrowd: targetTemple.currentCrowd,
      status: targetTemple.status
    }));

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        assignedTempleId: templeId
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('yatraflow_active_user', JSON.stringify(updatedUser));
    }

    logAuditAction(
      `Switched Active Managed Temple Precinct`,
      eventInfo.name,
      targetTemple.name,
      `User shifted active shrine precinct to ${targetTemple.name} (${targetTemple.location})`,
      'Temple Management'
    );

    addNotification('INFO', 'Active Temple Switched', `Now active at ${targetTemple.name} (${targetTemple.location})`);
  }, [templesList, eventInfo.name, currentUser, logAuditAction, addNotification]);

  const addNewTemple = (newTemple) => {
    if (isReadOnly) {
      addNotification('WARNING', 'Action Restricted', 'Viewer/Auditor role is in Read-Only mode.');
      return;
    }
    const templeObj = {
      id: `temple-${Date.now()}`,
      name: newTemple.name,
      deity: newTemple.deity || 'Devsthanam Deity',
      location: newTemple.location,
      geo: newTemple.geo || { lat: 25.3109, lng: 83.0107 },
      image: newTemple.image || '/images/temple_hero.jpg',
      expectedAttendance: Number(newTemple.expectedAttendance) || 100000,
      currentCrowd: Math.floor((Number(newTemple.expectedAttendance) || 100000) * 0.4),
      status: 'ACTIVE OPERATIONAL',
      trustContact: newTemple.trustContact || '+91 1800 123 4567',
      securityChief: newTemple.securityChief || 'Command Officer',
      totalGates: Number(newTemple.totalGates) || 4,
      zonesCount: 4,
      medicalPosts: 3,
      darshanSlots: [
        { name: "Morning Mangala Aarti", time: "05:00 AM - 06:30 AM", status: "COMPLETED", capacity: 5000 },
        { name: "General Sugam Darshan", time: "07:00 AM - 04:00 PM", status: "OPEN", capacity: 60000 },
        { name: "Evening Sandhya Aarti", time: "06:30 PM - 08:30 PM", status: "OPEN", capacity: 25000 }
      ],
      zones: [
        { name: "Main Gateway Plaza", capacity: 30000, density: 60 },
        { name: "Sanctum Queue Corridor", capacity: 15000, density: 75 },
        { name: "Holding Courtyard", capacity: 25000, density: 50 }
      ]
    };

    setTemplesList(prev => [templeObj, ...prev]);
    logAuditAction(
      'Registered New Temple Precinct',
      'N/A',
      templeObj.name,
      `New temple shrine complex registered: ${templeObj.name} in ${templeObj.location}`,
      'Temple Management'
    );
    addNotification('SUCCESS', 'Temple Shrine Registered', `Successfully added ${templeObj.name} to multi-temple management network.`);
  };

  const activeTemple = templesList.find(t => t.id === activeTempleId) || templesList[0];

  return (
    <SimulationContext.Provider value={{
      theme,
      toggleTheme,
      currentUser,
      setCurrentUser,
      loginWorker,
      loginByRole,
      verifyOtp,
      saveSmsConfig,
      getSmsConfig,
      loginPilgrim,
      logoutUser,
      hasPermission,
      isReadOnly,
      eventInfo,
      zones,
      gates,
      routes,
      incidents,
      medicalUnits,
      volunteers,
      security,
      infrastructure,
      weather,
      lostPersons,
      parkingAreas,
      shuttleBuses,
      publicAlerts,
      networkSensors,
      cctvFeeds,
      auditLogs,
      yatraPasses,
      templesList,
      activeTempleId,
      activeTemple,
      switchActiveTemple,
      addNewTemple,
      pilgrimProfile,
      setPilgrimProfile,
      userRole,
      setUserRole: (roleObj) => {
        const matchedUser = MOCK_USERS.find(u => u.role === roleObj.id) || {
          userId: `usr-${roleObj.id}`,
          name: roleObj.name || roleObj.title,
          username: roleObj.id,
          role: roleObj.id,
          roleTitle: roleObj.title,
          permissions: roleObj.permissions || ['all'],
          assignedTempleId: roleObj.defaultAssignedTemple || 'all',
          assignedEventId: 'evt-2026-01',
          assignedArea: roleObj.title,
          status: 'ACTIVE',
          isPilgrim: roleObj.id === 'pilgrim'
        };
        setCurrentUser(matchedUser);
        localStorage.setItem('yatraflow_active_user', JSON.stringify(matchedUser));
      },
      accessibilityMode,
      setAccessibilityMode,
      isSimulating,
      simulationSpeed,
      setSimulationSpeed,
      surgeTriggered,
      surgeResponseActivated,
      notifications,
      riskAnalysis,
      crowdPulse,
      prediction,
      safeExitWindow,
      startSimulation,
      pauseSimulation,
      resetSimulation,
      triggerSurgeScenario,
      activateSurgeResponse,
      triggerScenario,
      scanYatraPass,
      createYatraPass,
      createPublicAlert,
      updateGateStatus,
      updateRouteStatus,
      resolveIncident,
      assignTeamToIncident,
      addIncident,
      addLostPerson,
      markLostPersonReunited,
      markNotificationRead,
      clearNotifications,
      logAuditAction,
      exportReport
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
