import React from 'react';
import { X, History as HistoryIcon, Star, Trash2, ArrowRight } from 'lucide-react';
import { Category, CategoryId, FavoriteItem, HistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  favorites: FavoriteItem[];
  categories: Category[];
  onSelectConversion: (catId: CategoryId, fromId: string, toId: string, val?: number) => void;
  onClearHistory: () => void;
  onRemoveFavorite: (favId: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  history,
  favorites,
  categories,
  onSelectConversion,
  onClearHistory,
  onRemoveFavorite
}) => {
  if (!isOpen) return null;

  const getUnitSymbol = (catId: CategoryId, unitId: string): string => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return unitId;
    const unit = cat.units.find((u) => u.id === unitId);
    return unit ? unit.symbol : unitId;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md h-full glass-panel border-l border-white/15 p-6 flex flex-col justify-between shadow-2xl relative">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">History & Favorites</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Favorited Conversions ({favorites.length})</span>
              </h4>
              <div className="space-y-2">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs hover:border-amber-500/40 transition cursor-pointer"
                    onClick={() => {
                      onSelectConversion(fav.categoryId, fav.fromUnitId, fav.toUnitId);
                      onClose();
                    }}
                  >
                    <span className="font-semibold text-white font-mono">
                      {getUnitSymbol(fav.categoryId, fav.fromUnitId)} →{' '}
                      {getUnitSymbol(fav.categoryId, fav.toUnitId)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(fav.id);
                      }}
                      className="text-gray-400 hover:text-red-400 transition p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Recent Conversions ({history.length})
              </h4>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[11px] text-gray-400 hover:text-red-400 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
              {history.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  No recent conversions yet. Start converting to build your history!
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectConversion(
                        item.categoryId,
                        item.fromUnitId,
                        item.toUnitId,
                        item.fromValue
                      );
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs hover:bg-slate-800 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-mono text-white font-bold">
                        {item.fromValue} {getUnitSymbol(item.categoryId, item.fromUnitId)} ={' '}
                        <span className="text-indigo-300">{item.formattedResult}</span>{' '}
                        {getUnitSymbol(item.categoryId, item.toUnitId)}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition transform group-hover:translate-x-1" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
