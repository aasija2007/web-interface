import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { Category, CategoryId, CustomUnit } from '../types';

interface CustomUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSaveCustomUnit: (unit: CustomUnit) => void;
}

export const CustomUnitModal: React.FC<CustomUnitModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCustomUnit
}) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('length');
  const [factor, setFactor] = useState<string>('1');

  if (!isOpen) return null;

  const selectedCat = categories.find((c) => c.id === categoryId) || categories[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFactor = parseFloat(factor);
    if (!name.trim() || !symbol.trim() || isNaN(parsedFactor) || parsedFactor <= 0) return;

    const newUnit: CustomUnit = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      symbol: symbol.trim(),
      categoryId,
      baseUnitId: selectedCat.baseUnit,
      factor: parsedFactor
    };

    onSaveCustomUnit(newUnit);
    setName('');
    setSymbol('');
    setFactor('1');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel border border-white/15 p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Create Custom Unit</h3>
            <p className="text-xs text-gray-400">Define your own niche unit for any category</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Category:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as CategoryId)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Unit Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Standard Brick Length, Custom Cup"
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Unit Symbol / Abbreviation:</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. brk, ccup"
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Ratio relative to Base Unit ({selectedCat.baseUnit}):
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-mono">1 {symbol || 'Unit'} =</span>
              <input
                type="text"
                value={factor}
                onChange={(e) => setFactor(e.target.value)}
                placeholder="1.0"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                required
              />
              <span className="text-indigo-400 font-mono font-bold">{selectedCat.baseUnit}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Example: 1 Brick = 0.215 meters. So enter 0.215.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25"
            >
              Save Custom Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
