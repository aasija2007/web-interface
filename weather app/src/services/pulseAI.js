// Pulse AI Engine - Smart Weather Intelligence Algorithms

export function generatePulseAI(weatherData) {
  if (!weatherData || !weatherData.current) {
    return null;
  }

  const { current, hourly, daily, airQuality, anomaly, hyperlocalRain } = weatherData;
  const temp = current.temp;
  const humidity = current.humidity;
  const windSpeed = current.windSpeed;
  const uvIndex = current.uvIndex;
  const pop = daily[0] ? daily[0].pop : 0;
  const precip = current.precipitation;
  const aqi = airQuality.usAqi;
  const weatherCode = current.weatherCode;

  // 1. Quick Recommendations List
  const recommendations = [];

  if (hyperlocalRain.isRainLikely || pop >= 50 || precip > 0.3) {
    recommendations.push({
      type: 'warning',
      icon: 'Umbrella',
      title: 'Umbrella Recommended',
      text: 'High rain probability detected today. Don’t forget your umbrella!',
    });
  }

  if (uvIndex >= 6) {
    recommendations.push({
      type: 'warning',
      icon: 'Sun',
      title: 'High UV Radiation',
      text: `UV Index is ${uvIndex} (High). Apply SPF 30+ sunscreen and wear sunglasses outdoor.`,
    });
  }

  if (aqi > 100) {
    recommendations.push({
      type: 'danger',
      icon: 'AlertTriangle',
      title: 'Unhealthy Air Quality',
      text: `AQI is ${aqi} (${airQuality.status}). Limit prolonged outdoor exertion or use an N95 mask.`,
    });
  } else if (aqi <= 50 && temp >= 18 && temp <= 26 && pop < 20 && windSpeed < 20) {
    recommendations.push({
      type: 'success',
      icon: 'Smile',
      title: 'Prime Outdoor Weather',
      text: 'Ideal temperature and crisp air quality today. Perfect for parks, walks, and sports!',
    });
  }

  if (windSpeed > 35) {
    recommendations.push({
      type: 'warning',
      icon: 'Wind',
      title: 'Strong Gusty Winds',
      text: `Wind speeds reaching ${windSpeed} km/h. Secure loose outdoor objects.`,
    });
  }

  if (current.visibility < 3) {
    recommendations.push({
      type: 'danger',
      icon: 'EyeOff',
      title: 'Low Visibility Warning',
      text: `Visibility reduced to ${current.visibility} km due to fog/mist. Drive with headlights on.`,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'info',
      icon: 'CheckCircle',
      title: 'Stable Weather Conditions',
      text: 'No major weather hazards expected today. Enjoy your day!',
    });
  }

  // 2. Weather Comfort Score (0 - 100)
  // Optimal temp: 21°C, Optimal humidity: 45%, Wind: 10km/h
  let comfortScore = 100;
  const tempDiff = Math.abs(temp - 21);
  comfortScore -= tempDiff * 2.8;

  const humidityDiff = Math.abs(humidity - 45);
  comfortScore -= humidityDiff * 0.4;

  if (windSpeed > 20) comfortScore -= (windSpeed - 20) * 1.2;
  if (pop > 30) comfortScore -= pop * 0.35;
  if (aqi > 50) comfortScore -= (aqi - 50) * 0.25;

  comfortScore = Math.max(10, Math.min(100, Math.round(comfortScore)));

  let comfortRating = 'Optimal Comfort';
  if (comfortScore < 40) comfortRating = 'Uncomfortable / Harsh';
  else if (comfortScore < 65) comfortRating = 'Moderate Comfort';
  else if (comfortScore < 85) comfortRating = 'Very Pleasant';

  // 3. Should I Go Out?
  let shouldGoOut = 'YES';
  let goOutBadgeClass = 'badge-success';
  let goOutReason = 'Weather conditions are clear and favorable for outdoor travel.';
  let confidence = 92;

  if (pop >= 70 || weatherCode >= 80 || aqi > 150 || windSpeed > 45) {
    shouldGoOut = 'NO';
    goOutBadgeClass = 'badge-danger';
    goOutReason = 'Severe rain, storm, or hazardous air quality predicted. Stay indoors if possible.';
    confidence = 88;
  } else if (pop >= 40 || aqi > 100 || temp > 35 || temp < 0) {
    shouldGoOut = 'CAUTION';
    goOutBadgeClass = 'badge-warning';
    goOutReason = 'Mixed weather conditions. Dress appropriately and keep an umbrella handy.';
    confidence = 82;
  }

  // 4. Best Time to Go Outside (Scans hourly next 24h)
  let bestHour = null;
  let bestScore = -999;

  hourly.slice(0, 18).forEach((h) => {
    let hourScore = 100;
    hourScore -= Math.abs(h.temp - 22) * 3;
    hourScore -= h.pop * 1.2;
    if (h.uv > 6) hourScore -= (h.uv - 6) * 5;
    if (h.windSpeed > 25) hourScore -= (h.windSpeed - 25) * 1.5;

    if (hourScore > bestScore) {
      bestScore = hourScore;
      bestHour = h;
    }
  });

  const bestTimeText = bestHour
    ? `${bestHour.label} (${bestHour.temp}°C, ${bestHour.pop}% rain chance)`
    : 'Later in the afternoon';

  // 5. Smart Outfit Recommendation
  let outfit = {
    top: 'Breathable Cotton T-Shirt / Shirt',
    bottom: 'Light Trousers or Shorts',
    footwear: 'Comfortable Sneakers',
    outerwear: 'None needed',
    accessories: ['Sunglasses', 'Cap'],
  };

  if (temp < 5) {
    outfit = {
      top: 'Thermal Base Layer + Wool Sweater',
      bottom: 'Insulated Winter Pants',
      footwear: 'Warm Waterproof Boots',
      outerwear: 'Heavy Puffer Winter Jacket',
      accessories: ['Beanie Hat', 'Wool Gloves', 'Scarf'],
    };
  } else if (temp < 15) {
    outfit = {
      top: 'Long Sleeve Shirt / Hoodie',
      bottom: 'Jeans or Chinos',
      footwear: 'Casual Shoes / Boots',
      outerwear: 'Light Windbreaker or Denim Jacket',
      accessories: ['Light Scarf / Cap'],
    };
  } else if (temp > 30) {
    outfit = {
      top: 'Ultra-light Linen or Athletic Tee',
      bottom: 'Breathable Shorts',
      footwear: 'Ventilated Trainers / Sandals',
      outerwear: 'None',
      accessories: ['UV Sunglasses', 'Sunhat', 'Hydration Bottle'],
    };
  }

  if (pop > 40 || precip > 0.2) {
    outfit.outerwear = outfit.outerwear === 'None' ? 'Waterproof Rain Jacket' : `${outfit.outerwear} + Waterproof Coat`;
    outfit.footwear = 'Water-resistant Shoes';
    outfit.accessories.push('Compact Umbrella');
  }

  // 6. Outdoor Activity Scores
  const activityScores = {
    running: Math.max(10, Math.min(100, Math.round(100 - Math.abs(temp - 16) * 3 - pop * 1.0 - (aqi > 50 ? (aqi - 50) * 0.5 : 0)))),
    cycling: Math.max(10, Math.min(100, Math.round(100 - Math.abs(temp - 18) * 2.5 - windSpeed * 1.5 - pop * 1.0))),
    picnic: Math.max(10, Math.min(100, Math.round(100 - Math.abs(temp - 23) * 3 - pop * 1.5 - (uvIndex > 7 ? 15 : 0)))),
    stargazing: Math.max(10, Math.min(100, Math.round(100 - current.cloudCover * 0.8 - pop * 1.0))),
    swimming: Math.max(10, Math.min(100, Math.round(temp > 24 ? 90 - pop * 1.0 : (temp / 24) * 60))),
  };

  // 7. Travel / Commute Weather Score
  let commuteScore = 100;
  if (current.visibility < 5) commuteScore -= (5 - current.visibility) * 12;
  if (pop > 30) commuteScore -= pop * 0.4;
  if (windSpeed > 30) commuteScore -= (windSpeed - 30) * 1.2;
  commuteScore = Math.max(15, Math.min(100, Math.round(commuteScore)));

  let commuteHazard = 'Low Hazard';
  if (commuteScore < 50) commuteHazard = 'High Hazard (Rain/Fog/Wind)';
  else if (commuteScore < 75) commuteHazard = 'Moderate Hazard';

  // 8. Weather Impact Matrix
  const impactMatrix = [
    {
      domain: 'Travel & Commute',
      score: commuteScore,
      icon: 'Car',
      impactText: commuteScore > 75 ? 'Optimal road traction & clear visibility.' : 'Reduced road traction. Moderate braking delays.',
      level: commuteScore > 75 ? 'Low Impact' : 'Moderate Impact',
    },
    {
      domain: 'Outdoor Sports',
      score: activityScores.running,
      icon: 'Activity',
      impactText: activityScores.running > 70 ? 'Excellent oxygen efficiency & thermoregulation.' : 'High sweat rate or rain disruption likely.',
      level: activityScores.running > 70 ? 'Favorable' : 'Challenging',
    },
    {
      domain: 'Energy Consumption',
      score: Math.max(20, Math.min(100, 100 - Math.abs(temp - 21) * 3.5)),
      icon: 'Zap',
      impactText: Math.abs(temp - 21) > 8 ? 'High HVAC heating/cooling electricity load required.' : 'Moderate, ambient energy usage.',
      level: Math.abs(temp - 21) > 8 ? 'High Energy Use' : 'Efficient',
    },
    {
      domain: 'Health & Respiratory',
      score: Math.max(10, Math.min(100, 100 - (aqi > 50 ? (aqi - 50) * 0.8 : 0) - (uvIndex > 6 ? (uvIndex - 6) * 5 : 0))),
      icon: 'HeartPulse',
      impactText: aqi <= 50 ? 'Clean air with minimal respiratory distress.' : 'Elevated pollutants may affect asthmatics or elderly.',
      level: aqi <= 50 ? 'Healthy' : 'Attention Needed',
    },
    {
      domain: 'Environmental Index',
      score: Math.max(30, Math.min(100, 95 - (aqi > 100 ? 40 : 0) - (precip > 5 ? 20 : 0))),
      icon: 'Trees',
      impactText: 'Balanced ecological index with normal atmospheric dispersion.',
      level: 'Stable',
    },
  ];

  // 9. Extreme Weather Alerts
  const alerts = [];
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
    alerts.push({
      title: 'SEVERE THUNDERSTORM ALERT',
      severity: 'CRITICAL',
      message: 'Active thunderstorm detected in the region with potential lightning and heavy downdrafts.',
    });
  }
  if (temp >= 38) {
    alerts.push({
      title: 'HEATWAVE WARNING',
      severity: 'WARNING',
      message: 'Dangerous heat levels reaching 38°C+. Stay hydrated and avoid sun exposure between 11 AM - 4 PM.',
    });
  }
  if (temp <= 0) {
    alerts.push({
      title: 'FREEZING FROST ALERT',
      severity: 'WARNING',
      message: 'Sub-zero temperatures detected. Watch for icy patches on roads and footpaths.',
    });
  }
  if (aqi >= 151) {
    alerts.push({
      title: 'HAZARDOUS AIR QUALITY ADVISORY',
      severity: 'CRITICAL',
      message: `Air Quality Index is ${aqi}. Sensitive groups and general public should avoid outdoor activities.`,
    });
  }
  if (windSpeed >= 50) {
    alerts.push({
      title: 'GALE WIND WARNING',
      severity: 'WARNING',
      message: `Extreme wind gusts exceeding ${windSpeed} km/h reported. Take precaution near trees and structures.`,
    });
  }

  return {
    recommendations,
    comfortScore,
    comfortRating,
    shouldGoOut,
    goOutBadgeClass,
    goOutReason,
    confidence,
    bestTimeText,
    outfit,
    activityScores,
    commuteScore,
    commuteHazard,
    impactMatrix,
    alerts,
  };
}
