import React, { useState } from 'react';
import {
  Ruler,
  Weight,
  Thermometer,
  Droplet,
  Maximize2,
  Zap,
  Clock,
  HardDrive,
  Gauge,
  Activity,
  Sun,
  Compass,
  CircleDot,
  Radio,
  Fuel,
  Coins,
  Search
} from 'lucide-react';
import { Category, CategoryId } from '../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-4 h-4" />,
  Weight: <Weight className="w-4 h-4" />,
  Thermometer: <Thermometer className="w-4 h-4" />,
  Droplet: <Droplet className="w-4 h-4" />,
  Maximize2: <Maximize2 className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  HardDrive: <HardDrive className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  CircleDot: <CircleDot className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  Fuel: <Fuel className="w-4 h-4" />,
  Coins: <Coins className="w-4 h-4" />
};

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory
}) => {
  const [filterText, setFilterText] = useState('');

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(filterText.toLowerCase()) ||
      c.description.toLowerCase().includes(filterText.toLowerCase()) ||
      c.units.some((u) => u.name.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="w-full mb-6">
      {/* Category Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 px-1">
        <h2 className="text-sm font-bold font-serif-map uppercase tracking-wider text-[var(--ink-blue)] flex items-center gap-2">
          <span>Dimensions & Domains</span>
          <span className="text-xs font-mono text-[var(--sage-green)] font-bold bg-[var(--sage-green-bg)] border border-[var(--border-cartographer)] px-2 py-0.5 rounded-lg">
            ({categories.length})
          </span>
        </h2>

        {/* Category Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--ink-blue)]" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter domain or unit..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[var(--card-bg)] border border-[var(--border-cartographer)] text-[var(--text-dark)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--ink-blue)] font-semibold shadow-inner"
          />
          {filterText && (
            <button
              onClick={() => setFilterText('')}
              className="absolute right-2 top-1.5 text-xs text-[var(--text-dim)] hover:text-[var(--text-dark)] font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filteredCategories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          const icon = ICON_MAP[cat.iconName] || <Ruler className="w-4 h-4" />;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-[var(--ink-blue)] border-[var(--ink-blue)] text-white shadow-md scale-[1.02]'
                  : 'bg-[var(--card-bg)] border-[var(--border-cartographer)] text-[var(--ink-blue)] hover:bg-[var(--ink-blue-bg)]'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-[var(--sage-green)]'}>{icon}</span>
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--sage-green-bg)] text-[var(--sage-green)]'
                }`}
              >
                {cat.units.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
