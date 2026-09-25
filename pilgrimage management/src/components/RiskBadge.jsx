import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export default function RiskBadge({ level, showText = true, className = "" }) {
  const normalized = (level || "LOW").toUpperCase();

  const config = {
    LOW: {
      badgeClass: "badge-low",
      text: "LOW — Low Risk",
      icon: ShieldCheck
    },
    MEDIUM: {
      badgeClass: "badge-medium",
      text: "MEDIUM — Moderate Risk",
      icon: AlertCircle
    },
    HIGH: {
      badgeClass: "badge-high",
      text: "HIGH — High Risk",
      icon: AlertTriangle
    },
    CRITICAL: {
      badgeClass: "badge-critical",
      text: "CRITICAL — Critical Risk",
      icon: ShieldAlert
    }
  };

  const item = config[normalized] || config.LOW;
  const Icon = item.icon;

  return (
    <span className={`badge ${item.badgeClass} ${className}`} aria-label={item.text}>
      <Icon size={13} />
      {showText && <span>{item.text}</span>}
    </span>
  );
}
