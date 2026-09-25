// Risk Calculator & Crowd Pulse Intelligence Utility (Simulated Frontend Algorithms)

/**
 * Calculates overall Risk Score (0 - 100) from simulated operational state
 */
export function calculateRiskScore(zones = [], gates = [], routes = [], weather = {}, incidents = []) {
  if (!zones.length) return { score: 45, level: "LOW", primaryReason: "Normal operations", recommendations: [] };

  // 1. Average Zone Density & Peak Zone Density
  const zoneDensities = zones.map(z => z.densityPercent);
  const avgDensity = zoneDensities.reduce((a, b) => a + b, 0) / zoneDensities.length;
  const maxDensity = Math.max(...zoneDensities);
  const maxDensityZone = zones.find(z => z.densityPercent === maxDensity);

  // 2. Inflow / Outflow balance from gates
  const openGates = gates.filter(g => g.status === "OPEN" || g.status === "LIMITED");
  const totalInflow = openGates.reduce((acc, g) => acc + g.peoplePerMin, 0);
  const totalQueue = openGates.reduce((acc, g) => acc + g.queueLength, 0);

  // 3. Incidents count & severity
  const activeIncidents = incidents.filter(i => i.status !== "RESOLVED");
  const highPriorityIncidents = activeIncidents.filter(i => i.priority === "HIGH" || i.priority === "CRITICAL").length;

  // 4. Route Headroom
  const highRiskRoutes = routes.filter(r => r.capacityPercent > 85 || r.status === "CLOSED").length;

  // Multi-factor weighted formula
  let rawScore = (avgDensity * 0.35) + (maxDensity * 0.35) + (highPriorityIncidents * 8) + (highRiskRoutes * 5);

  if (totalQueue > 1500) rawScore += 10;
  if (weather.rainProb && parseInt(weather.rainProb) > 70) rawScore += 5;

  const score = Math.min(99, Math.max(10, Math.round(rawScore)));

  let level = "LOW";
  if (score >= 85) level = "CRITICAL";
  else if (score >= 70) level = "HIGH";
  else if (score >= 50) level = "MEDIUM";

  // Formulate primary reason & recommendations
  let primaryReason = "Normal crowd distribution across all sectors.";
  if (maxDensity >= 88) {
    primaryReason = `Crowd density in ${maxDensityZone ? maxDensityZone.name : 'Zone B'} is at ${maxDensity}%, exceeding safe throughput threshold.`;
  } else if (highPriorityIncidents > 0) {
    primaryReason = `${highPriorityIncidents} high-priority incident(s) require immediate field resolution.`;
  } else if (score >= 65) {
    primaryReason = "Cumulative entry pressure and route congestion in central corridors.";
  }

  const recommendations = [];
  if (maxDensity >= 80) {
    recommendations.push(`Throttle Gate inflow near ${maxDensityZone ? maxDensityZone.name : 'Zone B'}`);
    recommendations.push("Open emergency bypass Route C to relieve central corridor");
    recommendations.push("Deploy Volunteer Rapid Team 7 to manage queue head");
  }
  if (highPriorityIncidents > 0) {
    recommendations.push("Alert Medical HQ and dispatch closest field team");
  }
  if (recommendations.length === 0) {
    recommendations.push("Maintain standard gate screening pace");
    recommendations.push("Keep emergency bypass routes on standby");
  }

  return {
    score,
    level,
    primaryReason,
    recommendations,
    maxDensity,
    maxDensityZoneName: maxDensityZone ? maxDensityZone.name : "Zone B"
  };
}

/**
 * Calculates Crowd Pulse Composite Metric (0 - 100) & Sub-breakdowns
 */
export function calculateCrowdPulse(zones = [], gates = [], weather = {}, incidents = []) {
  const zoneDensities = zones.map(z => z.densityPercent);
  const avgDensity = zoneDensities.length ? Math.round(zoneDensities.reduce((a, b) => a + b, 0) / zoneDensities.length) : 60;
  const maxDensity = zoneDensities.length ? Math.max(...zoneDensities) : 75;

  const activeIncidentsCount = incidents.filter(i => i.status !== "RESOLVED").length;
  const entryPressure = Math.min(95, Math.round((gates.reduce((a, g) => a + g.queueLength, 0) / 2000) * 100));
  const exitPressure = Math.round(avgDensity * 0.8);
  const movementIndex = Math.max(30, 100 - Math.round((maxDensity * 0.7) + (entryPressure * 0.3)));
  const incidentImpact = Math.min(95, activeIncidentsCount * 18 + 20);
  const weatherImpact = parseInt(weather.rainProb || "50");

  const pulseScore = Math.min(99, Math.max(15, Math.round(
    (maxDensity * 0.35) +
    (entryPressure * 0.25) +
    (incidentImpact * 0.20) +
    (weatherImpact * 0.10) +
    (exitPressure * 0.10)
  )));

  let statusLabel = "NORMAL";
  if (pulseScore >= 88) statusLabel = "CRITICAL PRESSURE";
  else if (pulseScore >= 72) statusLabel = "HIGH PRESSURE";
  else if (pulseScore >= 52) statusLabel = "MODERATE PRESSURE";

  return {
    pulseScore,
    statusLabel,
    breakdown: {
      density: maxDensity,
      movement: movementIndex,
      entryPressure,
      exitPressure,
      incidents: incidentImpact,
      weather: weatherImpact
    }
  };
}

/**
 * Calculates dynamic crowd predictions for next 30m, 60m, and Peak
 */
export function calculatePrediction(currentCrowd, zones = [], gates = [], surgeActive = false) {
  const factor = surgeActive ? 1.25 : 1.05;
  const c30 = Math.round(currentCrowd * factor);
  const c60 = Math.round(currentCrowd * factor * 1.18);
  const peak = Math.max(143000, Math.round(currentCrowd * 1.6));

  return {
    current: currentCrowd,
    min30: c30,
    min60: c60,
    predictedPeak: peak,
    peakTimeWindow: "18:30 – 19:45 PM"
  };
}

/**
 * Calculates optimal Safe Exit Window & Route recommendation
 */
export function calculateSafeExitWindow(zones = [], routes = []) {
  const openRoutes = routes.filter(r => r.status === "OPEN");
  const bestRoute = openRoutes.sort((a, b) => a.capacityPercent - b.capacityPercent)[0] || routes[1] || routes[0];

  const now = new Date();
  const startMinutes = now.getMinutes() + 20;
  const endMinutes = startMinutes + 25;
  
  const formatTime = (addMins) => {
    const d = new Date(now.getTime() + addMins * 60000);
    let hh = d.getHours();
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${String(hh).padStart(2, '0')}:${mm}`;
  };

  return {
    windowText: `${formatTime(25)} – ${formatTime(50)}`,
    recommendedRoute: bestRoute ? bestRoute.name : "Route B — East Bypass Arterial",
    reason: `Lower density corridor (${bestRoute ? bestRoute.capacityPercent : 61}% capacity) with low incident activity.`
  };
}
