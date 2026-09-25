// Initial mock data for YatraFlow Command Center Simulation

export const INITIAL_EVENT_INFO = {
  id: "evt-2026-01",
  name: "Thiruvizha 2026 — Mahotsavam & Procession",
  subtitle: "Annual Grand Temple Pilgrimage & Festival Gathering",
  location: "Demo Pilgrimage Zone — Sacred Riverfront",
  date: "2026-09-21",
  startTime: "04:00 AM",
  endTime: "11:59 PM",
  expectedAttendance: 184200,
  currentCrowd: 84200,
  peakCrowd: 143000,
  status: "ACTIVE",
  sensorsOnline: 142,
  totalSensors: 144,
  networkStatus: "OPTIMAL",
  emergencyServices: "STANDBY",
  databaseStatus: "SYNCED"
};

export const INITIAL_ZONES = [
  {
    id: "zone-a",
    name: "Zone A — Main Entrance Plaza",
    code: "ZONE_A",
    type: "Entrance & Screening",
    currentCount: 18500,
    capacity: 25000,
    densityPercent: 74,
    flowPerMin: 520,
    waitTimeMinutes: 12,
    riskLevel: "MEDIUM",
    coordinates: { x: 18, y: 35 },
    geo: { lat: 25.4395, lng: 81.8410 },
    description: "Primary screening and security check area.",
    entryGatesCount: 3,
    exitGatesCount: 1,
    facilities: ["Water", "Toilets", "Security Post 1", "First Aid A"]
  },
  {
    id: "zone-b",
    name: "Zone B — Temple Approach Route",
    code: "ZONE_B",
    type: "Processional Corridor",
    currentCount: 17000,
    capacity: 25000,
    densityPercent: 68,
    flowPerMin: 420,
    waitTimeMinutes: 18,
    riskLevel: "MEDIUM",
    coordinates: { x: 42, y: 48 },
    geo: { lat: 25.4370, lng: 81.8445 },
    description: "Narrow heritage corridor leading to main sanctum entrance.",
    entryGatesCount: 2,
    exitGatesCount: 2,
    facilities: ["Water Point 2", "Crowd Control Barrier 4"]
  },
  {
    id: "zone-c",
    name: "Zone C — Central Festival Ground",
    code: "ZONE_C",
    type: "Congregation Arena",
    currentCount: 32400,
    capacity: 50000,
    densityPercent: 65,
    flowPerMin: 850,
    waitTimeMinutes: 8,
    riskLevel: "LOW",
    coordinates: { x: 65, y: 38 },
    geo: { lat: 25.4348, lng: 81.8475 },
    description: "Open festival ground for cultural events and holy discourse.",
    entryGatesCount: 4,
    exitGatesCount: 4,
    facilities: ["Main Stage", "Medical HQ", "Lost & Found Booth", "Sanitation Hub"]
  },
  {
    id: "zone-d",
    name: "Zone D — North Parking & Transport",
    code: "ZONE_D",
    type: "Transit Hub",
    currentCount: 8800,
    capacity: 20000,
    densityPercent: 44,
    flowPerMin: 310,
    waitTimeMinutes: 5,
    riskLevel: "LOW",
    coordinates: { x: 25, y: 80 },
    geo: { lat: 25.4425, lng: 81.8385 },
    description: "Bus terminal, shuttle drop-off, and heavy vehicle parking.",
    entryGatesCount: 2,
    exitGatesCount: 2,
    facilities: ["Shuttle Station", "Traffic Control", "Rest Area"]
  },
  {
    id: "zone-e",
    name: "Zone E — River Ghats & Bathing Area",
    code: "ZONE_E",
    type: "High Risk Riverfront",
    currentCount: 7500,
    capacity: 12000,
    densityPercent: 62,
    flowPerMin: 210,
    waitTimeMinutes: 15,
    riskLevel: "MEDIUM",
    coordinates: { x: 82, y: 72 },
    geo: { lat: 25.4320, lng: 81.8515 },
    description: "Holy river steps. Requires active river police & life-saving boats.",
    entryGatesCount: 2,
    exitGatesCount: 2,
    facilities: ["Life Guard Post", "Emergency Boat 1 & 2", "Medical Aid E"]
  }
];

export const INITIAL_GATES = [
  {
    id: "gate-a",
    name: "Gate A — North Entry",
    zoneId: "zone-a",
    peoplePerMin: 220,
    queueLength: 480,
    maxCapacity: 300,
    riskLevel: "MEDIUM",
    status: "OPEN",
    geo: { lat: 25.4400, lng: 81.8405 }
  },
  {
    id: "gate-b",
    name: "Gate B — East VIP & Main Arch",
    zoneId: "zone-a",
    peoplePerMin: 280,
    queueLength: 850,
    maxCapacity: 300,
    riskLevel: "HIGH",
    status: "OPEN",
    geo: { lat: 25.4385, lng: 81.8425 }
  },
  {
    id: "gate-c",
    name: "Gate C — South Temple Pathway",
    zoneId: "zone-b",
    peoplePerMin: 180,
    queueLength: 310,
    maxCapacity: 250,
    riskLevel: "LOW",
    status: "OPEN",
    geo: { lat: 25.4360, lng: 81.8455 }
  },
  {
    id: "gate-d",
    name: "Gate D — West Exit Corridor",
    zoneId: "zone-c",
    peoplePerMin: 340,
    queueLength: 120,
    maxCapacity: 400,
    riskLevel: "LOW",
    status: "OPEN",
    geo: { lat: 25.4340, lng: 81.8485 }
  },
  {
    id: "gate-e",
    name: "Gate E — Riverfront Bypass",
    zoneId: "zone-e",
    peoplePerMin: 110,
    queueLength: 220,
    maxCapacity: 200,
    riskLevel: "MEDIUM",
    status: "OPEN",
    geo: { lat: 25.4315, lng: 81.8505 }
  }
];

export const INITIAL_ROUTES = [
  {
    id: "route-a",
    name: "Route A — Heritage Corridor (Main)",
    path: "Gate A → Zone A → Zone B → Temple Sanctum",
    capacityPercent: 92,
    riskLevel: "HIGH",
    status: "OPEN",
    recommendedAction: "Divert arriving crowd to Route B to relieve Zone B bottleneck.",
    description: "Primary traditional foot procession path. Heavy bottleneck near Sanctum Arch."
  },
  {
    id: "route-b",
    name: "Route B — East Bypass Arterial",
    path: "Gate B → Zone C → Rear Temple Entry",
    capacityPercent: 61,
    riskLevel: "LOW",
    status: "OPEN",
    recommendedAction: "Primary recommended alternative for fast throughput.",
    description: "Wide 12-meter paved corridor with direct access to festival grounds."
  },
  {
    id: "route-c",
    name: "Route C — Riverfront Relief Corridor",
    path: "Zone B → Zone E River Bypass → South Gate",
    capacityPercent: 45,
    riskLevel: "LOW",
    status: "RESTRICTED",
    recommendedAction: "Ready to be opened during Zone B surge emergencies.",
    description: "Emergency relief route designed to bypass central bottleneck."
  },
  {
    id: "route-d",
    name: "Route D — Emergency Evacuation Corridor",
    path: "Zone B / C → North Transit Hub (Zone D)",
    capacityPercent: 20,
    riskLevel: "LOW",
    status: "OPEN",
    recommendedAction: "Reserved exclusively for ambulances, police, and rapid evacuation.",
    description: "Barricaded clear corridor."
  }
];

export const INITIAL_INCIDENTS = [
  {
    id: "INC-108",
    type: "Medical Emergency",
    title: "Heat exhaustion near Zone B Arch",
    location: "Zone B — Temple Route (Marker 14)",
    priority: "HIGH",
    status: "ACTIVE",
    assignedTeam: "Unassigned",
    responseEta: "03:15 min",
    timeReported: "10 mins ago",
    description: "64-year-old pilgrim collapsed due to dehydration. Medical assistance requested."
  },
  {
    id: "INC-107",
    type: "Crowd Congestion",
    title: "Queue overflow at Gate B screening",
    location: "Gate B — East Main Arch",
    priority: "MEDIUM",
    status: "ASSIGNED",
    assignedTeam: "Volunteer Team 4",
    responseEta: "02:00 min",
    timeReported: "18 mins ago",
    description: "Baggage screening delay causing queue spillback onto main approach road."
  },
  {
    id: "INC-105",
    type: "Missing Person",
    title: "Child separated from family",
    location: "Zone C — Near Food Stall 3",
    priority: "HIGH",
    status: "ASSIGNED",
    assignedTeam: "Lost & Found Booth C",
    responseEta: "01:30 min",
    timeReported: "25 mins ago",
    description: "8-year-old boy wearing blue shirt. Announcement broadcast active."
  },
  {
    id: "INC-104",
    type: "Infrastructure Issue",
    title: "Barricade displacement",
    location: "Zone B — East Sector",
    priority: "MEDIUM",
    status: "ACTIVE",
    assignedTeam: "Unassigned",
    responseEta: "05:00 min",
    timeReported: "32 mins ago",
    description: "Crowd pressure displaced temporary aluminum barricade section 12."
  },
  {
    id: "INC-102",
    type: "Vehicle Obstruction",
    title: "Unauthorized vehicle blocking Route D",
    location: "Zone D — Emergency Gate Entrance",
    priority: "LOW",
    status: "RESOLVED",
    assignedTeam: "Traffic Team 2",
    responseEta: "Resolved",
    timeReported: "1 hour ago",
    description: "Parked vehicle towed by traffic patrol."
  }
];

export const INITIAL_MEDICAL_UNITS = [
  {
    id: "med-1",
    name: "Medical HQ — Zone C Arena",
    location: "Zone C Central",
    availableBeds: 14,
    totalBeds: 25,
    staffAvailable: 12,
    ambulances: 4,
    status: "OPERATIONAL"
  },
  {
    id: "med-2",
    name: "First Aid Station 1 — Gate A",
    location: "Zone A North",
    availableBeds: 6,
    totalBeds: 10,
    staffAvailable: 5,
    ambulances: 2,
    status: "OPERATIONAL"
  },
  {
    id: "med-3",
    name: "Riverfront Mobile Unit 3",
    location: "Zone E River Ghats",
    availableBeds: 3,
    totalBeds: 8,
    staffAvailable: 4,
    ambulances: 2,
    status: "BUSY"
  },
  {
    id: "med-4",
    name: "District Civil Hospital (Offsite)",
    location: "3.2 km North via Route D",
    availableBeds: 45,
    totalBeds: 120,
    staffAvailable: 28,
    ambulances: 8,
    status: "STANDBY"
  }
];

export const INITIAL_VOLUNTEERS = [
  { id: "vol-1", name: "Volunteer Team 1 (Queue Control)", location: "Zone A Gate A", members: 15, status: "BUSY" },
  { id: "vol-2", name: "Volunteer Team 4 (Information & Water)", location: "Gate B Arch", members: 12, status: "BUSY" },
  { id: "vol-7", name: "Volunteer Rapid Team 7 (Surge Relief)", location: "Central Reserve HQ", members: 20, status: "AVAILABLE" },
  { id: "vol-9", name: "Volunteer Team 9 (Lost Person Escort)", location: "Zone C Hub", members: 10, status: "AVAILABLE" },
  { id: "vol-12", name: "Volunteer Team 12 (Route Guidance)", location: "Zone B Entrance", members: 16, status: "AVAILABLE" }
];

export const INITIAL_SECURITY = [
  { id: "sec-1", name: "Police Patrol Alpha", location: "Zone B Temple Route", officers: 18, status: "PATROLLING" },
  { id: "sec-2", name: "Rapid Action Force Bravo", location: "Zone A Plaza", officers: 30, status: "STANDBY" },
  { id: "sec-3", name: "River Police & Lifeguards", location: "Zone E Ghats", officers: 14, status: "ON_WATCH" },
  { id: "sec-4", name: "Traffic Control Sector 2", location: "Zone D Parking", officers: 12, status: "ACTIVE" }
];

export const INITIAL_INFRASTRUCTURE = [
  { id: "inf-1", name: "East Foot Overbridge", location: "Zone B Corridor", type: "Bridge", status: "OPERATIONAL", loadPercent: 68, notes: "Structural vibration sensors normal." },
  { id: "inf-2", name: "Main Entrance Queue Barricades", location: "Zone A Plaza", type: "Barricade", status: "ATTENTION REQUIRED", loadPercent: 88, notes: "High crowd pressure detected at Sector 3." },
  { id: "inf-3", name: "High-Bay Lighting Tower 4", location: "Zone C Grounds", type: "Lighting", status: "OPERATIONAL", loadPercent: 100, notes: "Backup generator online." },
  { id: "inf-4", name: "Sacred Ghat Emergency Steps", location: "Zone E Riverfront", type: "Steps/Ramp", status: "OPERATIONAL", loadPercent: 72, notes: "Anti-slip matting verified." },
  { id: "inf-5", name: "Central Drinking Water Station", location: "Zone C Hub", type: "Water Station", status: "OPERATIONAL", loadPercent: 45, notes: "Supply pressure optimal." }
];

export const INITIAL_WEATHER = {
  temperature: "32°C",
  rainProb: "72%",
  humidity: "78%",
  windSpeed: "14 km/h",
  heatIndex: "36°C",
  condition: "Humid / Evening Rain Forecast",
  insight: "Simulated Weather Intelligence: High rain probability (72%) may trigger sudden movement toward covered pandals in Zone C & bottleneck Route C."
};

export const INITIAL_LOST_PERSONS = [
  {
    id: "LP-2026-01",
    name: "Aarav Sharma",
    age: 8,
    gender: "Male",
    clothing: "Blue striped T-shirt, dark shorts",
    lastSeenLocation: "Zone C — Food Court Pandal",
    lastSeenTime: "10:15 AM",
    contactName: "Ramesh Sharma (Father)",
    contactPhone: "+91 98765 43210",
    status: "SEARCHING",
    matchedCheckpoint: "Nearby Guard Post 4 checking CCTV footage",
    photoUrl: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "LP-2026-02",
    name: "Kamla Devi",
    age: 68,
    gender: "Female",
    clothing: "Red saree with gold border",
    lastSeenLocation: "Zone B — Temple Route Entrance",
    lastSeenTime: "09:40 AM",
    contactName: "Sunita Devi (Daughter)",
    contactPhone: "+91 98123 45678",
    status: "MATCH FOUND",
    matchedCheckpoint: "Reunited at Medical HQ Zone C",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  }
];

export const INITIAL_HOURLY_CROWD_DATA = [
  { time: "04:00", crowd: 12000, entry: 4000, exit: 800, density: 20 },
  { time: "06:00", crowd: 28000, entry: 9000, exit: 1200, density: 35 },
  { time: "08:00", crowd: 54000, entry: 15000, exit: 2400, density: 52 },
  { time: "10:00", crowd: 76000, entry: 18000, exit: 7000, density: 68 },
  { time: "12:00", crowd: 84200, entry: 14000, exit: 8500, density: 72 },
  { time: "14:00", crowd: 91000, entry: 16000, exit: 9200, density: 79 },
  { time: "16:00", crowd: 108000, entry: 21000, exit: 11000, density: 85 },
  { time: "18:00", crowd: 124000, entry: 25000, exit: 14000, density: 91 },
  { time: "20:00", crowd: 110000, entry: 12000, exit: 26000, density: 78 },
  { time: "22:00", crowd: 62000, entry: 4000, exit: 42000, density: 48 }
];

export const WORKER_ROLES = [
  {
    id: "govt_admin",
    title: "Government Admin",
    name: "Full System Command & Administrative Control",
    icon: "ShieldCheck",
    accessScope: "Full System Command (All Temples, All Events, User Management)",
    permissions: ["all"],
    defaultAssignedTemple: "all"
  },
  {
    id: "ops_officer",
    title: "Operations Officer",
    name: "Ground Telemetry & Crowd Flow Command",
    icon: "Activity",
    accessScope: "Crowd Flow, Routes, Gates, Incidents & Ground Operations",
    permissions: ["crowd", "routes", "gates", "incidents", "live-map", "overview", "temples"],
    defaultAssignedTemple: "kashi-vishwanath"
  },
  {
    id: "viewer_auditor",
    title: "Viewer / Auditor",
    name: "Compliance & Inspection Auditor",
    icon: "FileText",
    accessScope: "Read-Only Inspection (Analytics, Audit Logs & Reports)",
    permissions: ["reports", "analytics", "audit-log", "overview", "live-map"],
    isReadOnly: true,
    defaultAssignedTemple: "all"
  }
];

export const ROLES = WORKER_ROLES;

export const MOCK_USERS = [
  {
    userId: "usr-admin-01",
    username: "admin",
    password: "password123",
    name: "Dr. Rajesh Sharma",
    role: "govt_admin",
    roleTitle: "Government Admin",
    assignedTempleId: "all",
    assignedEventId: "evt-2026-01",
    assignedArea: "All Temple Precincts",
    phone: "+91 98765 48210",
    status: "ACTIVE"
  },
  {
    userId: "usr-ops-02",
    username: "ops_officer",
    password: "password123",
    name: "Aasija Kumar",
    role: "ops_officer",
    roleTitle: "Operations Officer",
    assignedTempleId: "kashi-vishwanath",
    assignedEventId: "evt-2026-01",
    assignedArea: "Kashi Vishwanath Corridor",
    phone: "+91 98765 48211",
    status: "ACTIVE"
  },
  {
    userId: "usr-audit-07",
    username: "viewer_auditor",
    password: "password123",
    name: "Ramesh Narayan",
    role: "viewer_auditor",
    roleTitle: "Viewer / Auditor",
    assignedTempleId: "all",
    assignedEventId: "evt-2026-01",
    assignedArea: "System Audit & Analytics",
    phone: "+91 98765 48216",
    status: "ACTIVE"
  }
];

export const INITIAL_PARKING = [
  { id: "p1", name: "Parking P1 — North Highway Hub", zoneId: "zone-d", capacity: 500, occupied: 425, status: "HIGH", ratePerHr: "₹30", notes: "Heavy bus arrival." },
  { id: "p2", name: "Parking P2 — East Riverside Ground", zoneId: "zone-d", capacity: 800, occupied: 410, status: "MEDIUM", ratePerHr: "₹20", notes: "Shuttle terminal connected." },
  { id: "p3", name: "Parking P3 — South Bypass Reserve", zoneId: "zone-d", capacity: 1200, occupied: 360, status: "LOW", ratePerHr: "Free", notes: "Recommended overflow parking." },
  { id: "p4", name: "VIP & Official Vehicles P4", zoneId: "zone-a", capacity: 150, occupied: 90, status: "MEDIUM", ratePerHr: "Pass Only", notes: "Permit required." }
];

export const INITIAL_SHUTTLES = [
  { id: "shuttle-101", code: "BUS-101", route: "P1 North Hub ↔ Zone A Gate A", capacity: 60, passengers: 52, status: "IN_TRANSIT", currentLocation: "Approach Road Marker 4", etaMin: 4 },
  { id: "shuttle-102", code: "BUS-102", route: "P2 East Ground ↔ Zone C Arena", capacity: 60, passengers: 58, status: "BOARDING", currentLocation: "P2 Terminal", etaMin: 1 },
  { id: "shuttle-103", code: "BUS-103", route: "P3 South Overflow ↔ Zone D Hub", capacity: 80, passengers: 22, status: "IN_TRANSIT", currentLocation: "Arterial Bypass B", etaMin: 7 },
  { id: "shuttle-104", code: "BUS-104", route: "Express Ghat Shuttle (P3 ↔ Zone E)", capacity: 60, passengers: 60, status: "FULL", currentLocation: "Riverfront Gate E", etaMin: 2 }
];

export const INITIAL_PUBLIC_ALERTS = [
  {
    id: "alert-901",
    title: "HEAVY CONGESTION AT GATE B",
    message: "Heavy crowd queue detected at Gate B East Arch. Devotees are advised to proceed to Gate C South Pathway.",
    category: "WARNING",
    targetAudience: "All Pilgrims",
    channels: ["Mobile App", "LED Boards", "PA System", "Push Notification"],
    timestamp: "10:40 AM",
    active: true
  },
  {
    id: "alert-902",
    title: "EVENING MAHA AARTI SCHEDULE UPDATE",
    message: "Sacred Riverfront Aarti will commence at 06:30 PM. Please proceed to Zone E Bathing Steps via Route C.",
    category: "INFO",
    targetAudience: "All Pilgrims",
    channels: ["Public Website", "LED Boards", "WhatsApp"],
    timestamp: "09:15 AM",
    active: true
  }
];

export const INITIAL_NETWORK_SENSORS = [
  { id: "sens-a", zoneId: "zone-a", name: "Zone A Entrance LiDAR Mesh", status: "ONLINE", lastPing: "Just now", latencyMs: 12, stale: false },
  { id: "sens-b", zoneId: "zone-b", name: "Zone B Temple Approach AI Feed", status: "ONLINE", lastPing: "Just now", latencyMs: 16, stale: false },
  { id: "sens-c", zoneId: "zone-c", name: "Zone C Arena Optical Scanner", status: "DEGRADED", lastPing: "2 mins ago", latencyMs: 142, stale: false },
  { id: "sens-d", zoneId: "zone-d", name: "Zone D Transit Wireless Node", status: "ONLINE", lastPing: "Just now", latencyMs: 18, stale: false },
  { id: "sens-e", zoneId: "zone-e", name: "Zone E Ghat Thermal Camera 4", status: "ONLINE", lastPing: "Just now", latencyMs: 22, stale: false }
];

export const INITIAL_CCTV_FEEDS = [
  { id: "cam-101", code: "CAM C-01", location: "Gate A North Entrance", detectedCount: 480, capacity: 600, occupancyPercent: 80, flowRateMin: 52, risk: "MEDIUM", status: "LIVE STREAMING" },
  { id: "cam-104", code: "CAM C-04", location: "Zone B Temple Approach Corridor", detectedCount: 1284, capacity: 2000, occupancyPercent: 64.2, flowRateMin: 18, risk: "MEDIUM", status: "LIVE STREAMING" },
  { id: "cam-107", code: "CAM C-07", location: "Zone C Central Arena Stage", detectedCount: 2150, capacity: 5000, occupancyPercent: 43.0, flowRateMin: 85, risk: "LOW", status: "LIVE STREAMING" },
  { id: "cam-110", code: "CAM C-10", location: "Zone E Sacred River Ghat Steps", detectedCount: 790, capacity: 1000, occupancyPercent: 79.0, flowRateMin: 34, risk: "HIGH", status: "LIVE STREAMING" }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "aud-101",
    timestamp: "10:42:17 AM",
    user: "SEC-204 (Inspector Rajesh)",
    role: "POLICE / SECURITY",
    action: "Gate B Status Modified",
    prevValue: "OPEN",
    newValue: "LIMITED",
    reason: "Zone B density exceeded 85% safety threshold",
    module: "Gate Control"
  },
  {
    id: "aud-102",
    timestamp: "10:43:02 AM",
    user: "MED-017 (Dr. Meena)",
    role: "MEDICAL TEAM",
    action: "Ambulance A-04 Dispatched",
    prevValue: "STANDBY",
    newValue: "DISPATCHED",
    reason: "Incident INC-108 Heat exhaustion collapsed near Marker 14",
    module: "Medical"
  },
  {
    id: "aud-103",
    timestamp: "10:48:55 AM",
    user: "YATRA-PASS SYSTEM",
    role: "SYSTEM GATE SCANNER",
    action: "QR Pass Validated & Entry Recorded",
    prevValue: "Gate A Queue: 481",
    newValue: "Gate A Queue: 480, Zone A Count +1",
    reason: "Devotee Suresh Kumar checked in at Gate A",
    module: "Digital Yatra Pass"
  }
];

export const INITIAL_YATRA_PASSES = [
  {
    yatraId: "YATRA-2026-8842",
    name: "Suresh Kumar",
    phone: "+91 98765 12345",
    groupSize: 4,
    eventDate: "2026-09-21",
    timeSlot: "08:00 AM - 10:00 AM",
    entryGate: "Gate A — North Entry",
    emergencyContact: "+91 98123 99887",
    accessibilityNeeds: ["Wheelchair Ramp Required", "Elderly Pilgrim"],
    status: "VALID",
    entriesUsed: 1
  },
  {
    yatraId: "YATRA-2026-9915",
    name: "Pooja Verma",
    phone: "+91 98987 65432",
    groupSize: 2,
    eventDate: "2026-09-21",
    timeSlot: "10:00 AM - 12:00 PM",
    entryGate: "Gate B — East VIP & Main Arch",
    emergencyContact: "+91 97766 55443",
    accessibilityNeeds: ["None"],
    status: "VALID",
    entriesUsed: 0
  }
];

export const INITIAL_TEMPLES = [
  {
    id: "kashi-vishwanath",
    name: "Kashi Vishwanath Dham",
    deity: "Lord Shiva (Jyotirlinga)",
    location: "Varanasi, Uttar Pradesh",
    geo: { lat: 25.3109, lng: 83.0107 },
    image: "/images/sacred_ghats.jpg",
    expectedAttendance: 250000,
    currentCrowd: 112400,
    status: "ACTIVE OPERATIONAL",
    trustContact: "+91 542 239 2629",
    securityChief: "DGP Varanasi Range",
    totalGates: 4,
    zonesCount: 5,
    medicalPosts: 4,
    darshanSlots: [
      { name: "Mangala Aarti", time: "03:00 AM - 04:00 AM", status: "COMPLETED", capacity: 5000 },
      { name: "General Sugam Darshan", time: "06:00 AM - 11:30 AM", status: "OPEN", capacity: 85000 },
      { name: "Bhog Aarti & Break", time: "11:30 AM - 12:00 PM", status: "PAUSED", capacity: 0 },
      { name: "Evening Saptarishi Aarti", time: "07:00 PM - 08:30 PM", status: "BOOKING OPEN", capacity: 35000 }
    ],
    zones: [
      { name: "Ganga Ghat Corridor", capacity: 60000, density: 72 },
      { name: "Ganga Dwar Screening", capacity: 40000, density: 65 },
      { name: "Mandir Chowk Precinct", capacity: 50000, density: 84 },
      { name: "Inner Sanctum Queue", capacity: 15000, density: 91 },
      { name: "Godowlia Gate Entry", capacity: 85000, density: 58 }
    ]
  },
  {
    id: "tirumala-tirupati",
    name: "Tirumala Venkateswara Temple",
    deity: "Lord Sri Venkateswara Swamy",
    location: "Tirupati, Andhra Pradesh",
    geo: { lat: 13.6833, lng: 79.3472 },
    image: "/images/temple_hero.jpg",
    expectedAttendance: 180000,
    currentCrowd: 84200,
    status: "ACTIVE OPERATIONAL",
    trustContact: "+91 877 227 7777",
    securityChief: "CVSO TTD Tirumala",
    totalGates: 6,
    zonesCount: 5,
    medicalPosts: 6,
    darshanSlots: [
      { name: "Suprabhatam Seva", time: "03:00 AM - 03:30 AM", status: "COMPLETED", capacity: 3000 },
      { name: "Sarvadarsanam (Free Queue)", time: "06:00 AM - 09:00 PM", status: "OPEN", capacity: 120000 },
      { name: "Special Entry Darshan (₹300)", time: "09:00 AM - 06:00 PM", status: "SLOTS FULL", capacity: 45000 }
    ],
    zones: [
      { name: "Vaikuntam Queue Complex 1", capacity: 45000, density: 78 },
      { name: "Vaikuntam Queue Complex 2", capacity: 55000, density: 82 },
      { name: "Ananda Nilayam Precinct", capacity: 20000, density: 64 },
      { name: "Laddu Counter Complex", capacity: 35000, density: 55 },
      { name: "Alipiri Footpath Gate", capacity: 25000, density: 42 }
    ]
  },
  {
    id: "kedarnath-dham",
    name: "Kedarnath Shrine Sanctuary",
    deity: "Lord Shiva (Himalayan Jyotirlinga)",
    location: "Rudraprayag, Uttarakhand",
    geo: { lat: 30.7346, lng: 79.0669 },
    image: "/images/sacred_sanctum.jpg",
    expectedAttendance: 45000,
    currentCrowd: 22100,
    status: "WEATHER ALERT — HIGH ALTITUDE",
    trustContact: "+91 1374 222 129",
    securityChief: "SDRF Commander Kedarnath",
    totalGates: 3,
    zonesCount: 4,
    medicalPosts: 3,
    darshanSlots: [
      { name: "Morning Maha Aarti", time: "05:00 AM - 06:30 AM", status: "COMPLETED", capacity: 8000 },
      { name: "General Yatra Darshan", time: "07:00 AM - 03:00 PM", status: "OPEN", capacity: 25000 },
      { name: "Evening Shayan Aarti", time: "06:30 PM - 07:30 PM", status: "OPEN", capacity: 12000 }
    ],
    zones: [
      { name: "Gaurikund Base Camp", capacity: 15000, density: 60 },
      { name: "Bhimbali Trek Point", capacity: 8000, density: 45 },
      { name: "Kedarnath Temple Plaza", capacity: 12000, density: 78 },
      { name: "Helipad Landing Bay", capacity: 3000, density: 30 }
    ]
  },
  {
    id: "jagannath-puri",
    name: "Shree Jagannath Temple Complex",
    deity: "Lord Jagannath, Balabhadra & Subhadra",
    location: "Puri, Odisha",
    geo: { lat: 19.8135, lng: 85.8312 },
    image: "/images/holy_procession.jpg",
    expectedAttendance: 300000,
    currentCrowd: 145000,
    status: "HIGH INFLOW — RATHA YATRA",
    trustContact: "+91 6752 222 002",
    securityChief: "SP Puri District",
    totalGates: 4,
    zonesCount: 5,
    medicalPosts: 5,
    darshanSlots: [
      { name: "Dwara Phita & Mangala Aarti", time: "05:00 AM - 06:00 AM", status: "COMPLETED", capacity: 20000 },
      { name: "General Pahandi Darshan", time: "08:00 AM - 05:00 PM", status: "OPEN", capacity: 200000 },
      { name: "Sandhya Dhupa & Aarti", time: "07:00 PM - 09:00 PM", status: "OPEN", capacity: 80000 }
    ],
    zones: [
      { name: "Singhadwara (Lion Gate)", capacity: 70000, density: 88 },
      { name: "Bada Danda Grand Road", capacity: 120000, density: 76 },
      { name: "Ananda Bazar Dining Precinct", capacity: 40000, density: 62 },
      { name: "Inner Temple Bedha", capacity: 30000, density: 85 },
      { name: "Gundicha Temple Holding", capacity: 40000, density: 50 }
    ]
  },
  {
    id: "sabarimala-sannidhanam",
    name: "Sabarimala Sannidhanam",
    deity: "Lord Ayyappa",
    location: "Pathanamthitta, Kerala",
    geo: { lat: 9.4357, lng: 77.0815 },
    image: "/images/temple_hero.jpg",
    expectedAttendance: 120000,
    currentCrowd: 68000,
    status: "VIRTUAL Q REGULATED",
    trustContact: "+91 4735 202 028",
    securityChief: "Special Officer Kerala Police",
    totalGates: 3,
    zonesCount: 4,
    medicalPosts: 4,
    darshanSlots: [
      { name: "Nirmalya Darshanam", time: "03:00 AM - 03:30 AM", status: "COMPLETED", capacity: 5000 },
      { name: "Virtual Queue Entry Slot", time: "04:00 AM - 01:00 PM", status: "OPEN", capacity: 75000 },
      { name: "Padi Pooja & Harivarasanam", time: "09:00 PM - 11:00 PM", status: "BOOKED", capacity: 40000 }
    ],
    zones: [
      { name: "Pamba River Base Camp", capacity: 35000, density: 55 },
      { name: "Marakkoottam Trek Choke", capacity: 20000, density: 82 },
      { name: "18 Holy Steps (Pathinettam Padi)", capacity: 15000, density: 89 },
      { name: "Sannidhanam Courtyard", capacity: 30000, density: 70 }
    ]
  },
  {
    id: "mahakaleshwar-ujjain",
    name: "Mahakaleshwar Jyotirlinga",
    deity: "Lord Shiva (Bhasma Aarti Sanctuary)",
    location: "Ujjain, Madhya Pradesh",
    geo: { lat: 23.1827, lng: 75.7719 },
    image: "/images/sacred_sanctum.jpg",
    expectedAttendance: 210000,
    currentCrowd: 98000,
    status: "ACTIVE OPERATIONAL",
    trustContact: "+91 734 255 0563",
    securityChief: "SP Ujjain Range",
    totalGates: 5,
    zonesCount: 5,
    medicalPosts: 4,
    darshanSlots: [
      { name: "Bhasma Aarti (Pre-Booked)", time: "04:00 AM - 06:00 AM", status: "COMPLETED", capacity: 2500 },
      { name: "General Sheesh Darshan", time: "06:30 AM - 04:00 PM", status: "OPEN", capacity: 140000 },
      { name: "Sandhya Aarti & Shringar", time: "07:00 PM - 08:30 PM", status: "OPEN", capacity: 67500 }
    ],
    zones: [
      { name: "Mahakal Lok Corridor", capacity: 80000, density: 64 },
      { name: "Nandi Hall Holding Area", capacity: 25000, density: 85 },
      { name: "Garbhagriha Inner Queue", capacity: 10000, density: 92 },
      { name: "Char Dham Temple Entry", capacity: 55000, density: 58 },
      { name: "Triveni Museum Parking Bay", capacity: 40000, density: 48 }
    ]
  }
];



