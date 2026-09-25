import React from 'react';
import { Scale } from 'lucide-react';
import { Unit } from '../types';
import { convertValue, formatNumber } from '../utils/converterEngine';

interface VisualScaleBarProps {
  fromUnit: Unit;
  toUnit: Unit;
  value: number;
}

export const VisualScaleBar: React.FC<VisualScaleBarProps> = ({ fromUnit, toUnit, value }) => {
  if (isNaN(value) || value <= 0 || fromUnit.id === toUnit.id) {
    return null;
  }

  // Calculate comparative ratio: 1 fromUnit = ratio toUnit
  const ratio = convertValue(1, fromUnit, toUnit);
  if (isNaN(ratio) || !isFinite(ratio) || ratio <= 0) return null;

  const logRatio = Math.log10(ratio);
  const widthPercent = Math.min(Math.max(50 + logRatio * 15, 5), 95);

  const formattedRatio = formatNumber(ratio, 'auto', 4);

  return (
    <div className="w-full glass-panel p-6 md:p-8 border-2 border-[#D8C9A3] mb-10 bg-[#FBF7EC]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3 text-base sm:text-lg font-black font-serif-map text-[#2B4570]">
          <Scale className="w-6 h-6 text-[#B5442E]" />
          <span>Spatial Scale Visualizer</span>
        </div>
        <span className="text-sm sm:text-base font-mono text-[#241F16] font-bold bg-[#F1E9D8] border border-[#D8C9A3] px-4 py-1.5 rounded-xl">
          1 {fromUnit.symbol} = {formattedRatio} {toUnit.symbol}
        </span>
      </div>

      {/* Visual Bar Comparison */}
      <div className="space-y-4">
        {/* From Unit Scale Bar */}
        <div className="flex items-center gap-5">
          <span className="w-28 text-sm sm:text-base text-right font-bold text-[#241F16] truncate">
            {fromUnit.name}
          </span>
          <div className="flex-1 bg-[#F1E9D8] h-6 rounded-full overflow-hidden relative border-2 border-[#D8C9A3]">
            <div
              className="bg-[#2B4570] h-full rounded-full transition-all duration-500 shadow-md"
              style={{ width: '100%' }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-black text-white drop-shadow">
              1 {fromUnit.symbol}
            </span>
          </div>
        </div>

        {/* To Unit Scale Bar */}
        <div className="flex items-center gap-5">
          <span className="w-28 text-sm sm:text-base text-right font-bold text-[#7A8B69] truncate">
            {toUnit.name}
          </span>
          <div className="flex-1 bg-[#F1E9D8] h-6 rounded-full overflow-hidden relative border-2 border-[#D8C9A3]">
            <div
              className="bg-[#7A8B69] h-full rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${widthPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-black text-white drop-shadow">
              {formattedRatio} {toUnit.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
