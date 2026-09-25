import React, { useState } from 'react';
import { Layers, Copy, Check, Search } from 'lucide-react';
import { Category, Unit } from '../types';
import { convertValue, formatNumber } from '../utils/converterEngine';

interface MultiUnitGridProps {
  category: Category;
  fromUnit: Unit;
  value: number;
}

export const MultiUnitGrid: React.FC<MultiUnitGridProps> = ({ category, fromUnit, value }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isValidNumber = !isNaN(value);

  const filteredUnits = category.units.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopySingle = (u: Unit, formattedVal: string) => {
    const text = `${formattedVal} ${u.symbol}`;
    navigator.clipboard.writeText(text);
    setCopiedId(u.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="w-full glass-panel border-2 border-[#D8C9A3] p-8 md:p-10 mb-10 bg-[#FBF7EC]">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg sm:text-xl font-black font-serif-map text-[#2B4570] flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#2B4570]" />
            <span>Simultaneous Domain Grid</span>
          </h3>
          <p className="text-sm sm:text-base text-[#8C7F63] font-bold mt-1">
            Translating <span className="font-mono text-[#2B4570] font-black">{isValidNumber ? value : 0} {fromUnit.symbol}</span> across all {category.name} units:
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-[#2B4570]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units..."
            className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-2xl bg-[#FFFDF7] border-2 border-[#D8C9A3] text-[#241F16] placeholder-[#8C7F63] focus:outline-none focus:border-[#2B4570] font-bold"
          />
        </div>
      </div>

      {/* Grid of All Units */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredUnits.map((u) => {
          const raw = isValidNumber ? convertValue(value, fromUnit, u) : 0;
          const formatted = isValidNumber ? formatNumber(raw, 'auto', 5) : '0';
          const isSelected = u.id === fromUnit.id;

          return (
            <div
              key={u.id}
              onClick={() => handleCopySingle(u, formatted)}
              className={`group glass-card p-5 border-2 transition cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-[#2B4570] bg-[#F1E9D8] shadow-lg shadow-[#2B4570]/15'
                  : 'border-[#D8C9A3] bg-[#FFFDF7] hover:bg-[#FBF7EC] hover:border-[#2B4570]'
              }`}
            >
              <div className="flex items-center justify-between text-sm sm:text-base mb-2">
                <span className={`font-black ${isSelected ? 'text-[#2B4570]' : 'text-[#241F16]'}`}>
                  {u.name}
                </span>
                <span className="font-mono text-xs text-[#7A8B69] font-black bg-[#7A8B69]/15 px-2.5 py-1 rounded-md">
                  {u.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-xl sm:text-2xl font-black text-[#2B4570] tracking-tight overflow-x-auto scrollbar-none py-1">
                <span className={isSelected ? 'text-[#2B4570]' : 'text-[#241F16]'}>{formatted}</span>
                <button
                  className="opacity-0 group-hover:opacity-100 p-2 text-[#8C7F63] hover:text-[#B5442E] transition"
                  title="Copy value"
                >
                  {copiedId === u.id ? (
                    <Check className="w-5 h-5 text-[#7A8B69]" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
