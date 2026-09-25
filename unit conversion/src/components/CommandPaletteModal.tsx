import React, { useState, useEffect } from 'react';
import { Search, Command, ArrowRight, Zap, RefreshCw, X } from 'lucide-react';
import { Category, Unit, CategoryId } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSelectUnitPair: (catId: CategoryId, fromId: string, toId: string, val?: number) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSelectUnitPair
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent listener
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build command suggestions
  const items: Array<{
    id: string;
    title: string;
    sub: string;
    catId: CategoryId;
    fromId: string;
    toId: string;
  }> = [];

  categories.forEach((cat) => {
    cat.units.forEach((u1) => {
      cat.units.slice(0, 4).forEach((u2) => {
        if (u1.id !== u2.id) {
          items.push({
            id: `${cat.id}_${u1.id}_${u2.id}`,
            title: `${u1.name} to ${u2.name}`,
            sub: `${u1.symbol} → ${u2.symbol} (${cat.name})`,
            catId: cat.id,
            fromId: u1.id,
            toId: u2.id
          });
        }
      });
    });
  });

  const filteredItems = items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.sub.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8);

  const handleSelect = (item: typeof items[0]) => {
    onSelectUnitPair(item.catId, item.fromId, item.toId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel border border-white/20 overflow-hidden shadow-2xl">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-slate-900/90">
          <Search className="w-4 h-4 text-indigo-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a conversion command or unit (e.g. cm to inches)..."
            className="w-full bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-gray-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto scrollbar-thin divide-y divide-white/5">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              No matching conversions found for "{query}".
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-3 rounded-xl hover:bg-indigo-600/20 hover:border hover:border-indigo-500/30 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300">
                    {item.title}
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">{item.sub}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition transform group-hover:translate-x-1" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
          <span>Use ↑ ↓ arrow keys to navigate</span>
          <span className="font-mono text-indigo-400">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
