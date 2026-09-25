# ⚡ WEATHER PULSE – Real-Time Weather Intelligence

> **“Understand the weather. Predict the impact. Make better decisions.”**

**Weather Pulse** is an ultra-modern, futuristic, real-world meteorological decision intelligence platform built using **React, Vite, HTML, CSS (Glassmorphism Cyber Theme), and JavaScript**.

It combines live meteorological forecasts, interactive Doppler rain radar tiles, Web Push notifications, route weather planning, multi-city comparisons, and rule-based AI recommendation algorithms ("Pulse AI").

---

## 🌟 Key Features Overview

### 🎨 1. Ultra-Futuristic Glassmorphic Interface
- **Dynamic Weather Particles Canvas**: Animated rain, snow, sunlight rays, thunder flashes, and twinkling stars reacting dynamically to live weather.
- **Cyber Glassmorphism Theme**: Cyber cyan (`#06b6d4`), electric purple (`#8b5cf6`), and neon emerald (`#10b981`) glass panels with glowing borders and shimmer loading skeletons.
- **Dark & Light Theme**: Toggleable with local storage persistence.

### 🌧️ 2. Live Rain Radar & Doppler Movement
- **RainViewer Radar Tiles**: Animated frame-by-frame Doppler precipitation radar map overlay via Leaflet.
- **Play/Pause Animation**: Track live rain movement across regions in real-time.

### 🔔 3. Native Web Push Notifications
- Native browser Notification API (`Notification.requestPermission()`) triggering system push alerts for severe thunderstorms, heatwaves, freezing frost, or hazardous AQI.

### 🎙️ 4. Voice & Natural Language Search (Web Speech API)
- Microphone button enabling hands-free speech-to-text city lookup ("Tokyo", "Paris", "New York").

### 🛣️ 5. Smart Travel Route Planner
- Input Origin and Destination cities to analyze route weather conditions.
- Computes **Route Travel Safety Index (0-100)**, hydroplaning risk, fog hazards, and optimal departure windows.

### 🤖 6. Pulse AI & Personalized Recommendations
- **"Should I Go Out?"**: Instant verdict (YES / NO / CAUTION) with confidence rating.
- **"Best Time to Step Outside"**: Scans 24h hourly forecast for lowest UV and zero rain.
- **Smart Outfit Planner**: Top, Bottom, Outerwear, Footwear, and Accessories.
- **Personalized Hobbies Selector**: Tailors recommendations for Running, Cycling, Photography, Flying Drones, Stargazing, and Golfing.
- **Weather Impact Matrix**: Travel, Sports, Energy Usage, Health, and Environment.

### 📊 7. Multi-City Comparison & Charts
- Compare 3 cities side-by-side (Temp, Humidity, AQI, Rain Risk, Comfort Score).
- Interactive Recharts area, bar, and line charts for 24h hourly & 7-day extended forecasts.

### 📱 8. Progressive Web App (PWA) Support
- Offline Service Worker caching (`/sw.js`) and Web Manifest (`manifest.json`) for 1-click desktop and mobile app installation.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 / 19 + Vite |
| **Styling** | Vanilla CSS Variables, Glassmorphism, Google Fonts (`Outfit`, `Inter`) |
| **Icons** | Lucide React |
| **Weather APIs** | Open-Meteo Weather API + Open-Meteo Air Quality API |
| **Geocoding** | Nominatim OpenStreetMap + Open-Meteo Geocoding |
| **Radar Map** | Leaflet + React-Leaflet + RainViewer Radar Tiles API |
| **Data Visualisations** | Recharts |
| **Speech Input** | Web Speech API (`SpeechRecognition`) |
| **Notifications** | Native Browser Web Push Notification API |
| **PWA** | Service Worker + Web App Manifest |

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173/`.

### 3. Build for Production
```bash
npm run build
```

---

## 📦 Deployment (Vercel / Netlify)

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

### Netlify Deployment
1. Build command: `npm run build`
2. Publish directory: `dist`
