import React, { useState, useEffect } from 'react';
import { CATEGORIES as INITIAL_CATEGORIES } from './data/units';
import {
  Category,
  CategoryId,
  CustomUnit,
  FavoriteItem,
  HistoryItem,
  SystemFilter,
  Unit
} from './types';
import { parseNaturalLanguageQuery } from './utils/converterEngine';
import { fetchLiveCurrencyRates } from './services/currencyService';

// Components
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { MainConverterCard } from './components/MainConverterCard';
import { VisualScaleBar } from './components/VisualScaleBar';
import { MultiUnitGrid } from './components/MultiUnitGrid';
import { BatchConverter } from './components/BatchConverter';
import { ReferenceTable } from './components/ReferenceTable';
import { CustomUnitModal } from './components/CustomUnitModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { WidgetEmbedModal } from './components/WidgetEmbedModal';
import { HistorySidebar } from './components/HistorySidebar';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('omniconvert_theme') as 'dark' | 'light') || 'dark';
  });

  // Global system filter
  const [systemFilter, setSystemFilter] = useState<SystemFilter>('all');

  // Categories & Units state (including user custom units)
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Active Category state
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('length');

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];

  // Active From and To Units
  const [fromUnit, setFromUnit] = useState<Unit>(activeCategory.units[0]);
  const [toUnit, setToUnit] = useState<Unit>(activeCategory.units[1] || activeCategory.units[0]);

  // View Mode Tabs (Standard, Multi-Unit, Batch, Reference Table)
  const [activeViewMode, setActiveViewMode] = useState<'converter' | 'multi' | 'batch' | 'table'>('converter');

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCustomUnitModalOpen, setIsCustomUnitModalOpen] = useState(false);
  const [isWidgetEmbedModalOpen, setIsWidgetEmbedModalOpen] = useState(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);

  // Persistence: History & Favorites
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('omniconvert_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem('omniconvert_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Apply Theme Class
  useEffect(() => {
    localStorage.setItem('omniconvert_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Load live currency exchange rates on mount
  useEffect(() => {
    fetchLiveCurrencyRates().then((rates) => {
      if (rates) {
        setCategories((prevCategories) =>
          prevCategories.map((cat) => {
            if (cat.id === 'currency') {
              return {
                ...cat,
                units: cat.units.map((unit) => {
                  if (rates[unit.id]) {
                    return { ...unit, factor: rates[unit.id] };
                  }
                  return unit;
                })
              };
            }
            return cat;
          })
        );
      }
    });
  }, []);

  // Update From and To units when Category changes
  useEffect(() => {
    setFromUnit(activeCategory.units[0]);
    setToUnit(activeCategory.units[1] || activeCategory.units[0]);
  }, [activeCategoryId]);

  // Sync state to URL params for shareable deep links
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('cat', activeCategoryId);
    params.set('from', fromUnit.id);
    params.set('to', toUnit.id);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [activeCategoryId, fromUnit.id, toUnit.id]);

  // Read URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat') as CategoryId;
    const fromParam = params.get('from');
    const toParam = params.get('to');

    if (catParam && categories.some((c) => c.id === catParam)) {
      setActiveCategoryId(catParam);
      const cat = categories.find((c) => c.id === catParam)!;
      if (fromParam) {
        const f = cat.units.find((u) => u.id === fromParam);
        if (f) setFromUnit(f);
      }
      if (toParam) {
        const t = cat.units.find((u) => u.id === toParam);
        if (t) setToUnit(t);
      }
    }
  }, []);

  // Keyboard Shortcuts Listener (Alt+S for Swap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fromUnit, toUnit]);

  // Record History item
  const handleRecordHistory = (
    fromVal: number,
    fromUnitId: string,
    toVal: number,
    toUnitId: string,
    formattedResult: string
  ) => {
    const newItem: HistoryItem = {
      id: `hist_${Date.now()}`,
      timestamp: Date.now(),
      categoryId: activeCategoryId,
      fromValue: fromVal,
      fromUnitId,
      toValue: toVal,
      toUnitId,
      formattedResult
    };

    const updated = [newItem, ...history.slice(0, 49)];
    setHistory(updated);
    localStorage.setItem('omniconvert_history', JSON.stringify(updated));
  };

  // Favorite toggle
  const isCurrentFavorite = favorites.some(
    (f) => f.categoryId === activeCategoryId && f.fromUnitId === fromUnit.id && f.toUnitId === toUnit.id
  );

  const handleAddFavorite = (catId: CategoryId, fromId: string, toId: string) => {
    if (isCurrentFavorite) {
      const updated = favorites.filter(
        (f) => !(f.categoryId === catId && f.fromUnitId === fromId && f.toUnitId === toId)
      );
      setFavorites(updated);
      localStorage.setItem('omniconvert_favorites', JSON.stringify(updated));
    } else {
      const newFav: FavoriteItem = {
        id: `fav_${Date.now()}`,
        categoryId: catId,
        fromUnitId: fromId,
        toUnitId: toId
      };
      const updated = [newFav, ...favorites];
      setFavorites(updated);
      localStorage.setItem('omniconvert_favorites', JSON.stringify(updated));
    }
  };

  const handleRemoveFavorite = (favId: string) => {
    const updated = favorites.filter((f) => f.id !== favId);
    setFavorites(updated);
    localStorage.setItem('omniconvert_favorites', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('omniconvert_history');
  };

  // Natural language query handler
  const handleNaturalLanguageQuery = (queryText: string) => {
    const result = parseNaturalLanguageQuery(queryText, categories);
    if (result) {
      setActiveCategoryId(result.category.id);
      setFromUnit(result.fromUnit);
      setToUnit(result.toUnit);
    }
  };

  // Save Custom Unit
  const handleSaveCustomUnit = (customUnit: CustomUnit) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === customUnit.categoryId) {
          const newUnit: Unit = {
            id: customUnit.id,
            name: customUnit.name,
            symbol: customUnit.symbol,
            factor: customUnit.factor,
            system: 'universal',
            isCustom: true,
            trivia: `User defined custom unit: 1 ${customUnit.name} = ${customUnit.factor} ${customUnit.baseUnitId}`
          };
          return {
            ...cat,
            units: [...cat.units, newUnit]
          };
        }
        return cat;
      })
    );
  };

  // Select Unit Pair from Command Palette or History
  const handleSelectConversion = (
    catId: CategoryId,
    fromId: string,
    toId: string,
    val?: number
  ) => {
    setActiveCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      const f = cat.units.find((u) => u.id === fromId);
      const t = cat.units.find((u) => u.id === toId);
      if (f) setFromUnit(f);
      if (t) setToUnit(t);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <Header
          theme={theme}
          setTheme={setTheme}
          systemFilter={systemFilter}
          setSystemFilter={setSystemFilter}
          onNaturalLanguageQuery={handleNaturalLanguageQuery}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenHistory={() => setIsHistorySidebarOpen(true)}
          onOpenCustomUnitModal={() => setIsCustomUnitModalOpen(true)}
          onOpenWidgetEmbedModal={() => setIsWidgetEmbedModalOpen(true)}
          favoritesCount={favorites.length}
        />

        {/* Main Content Layout - Standard Balanced Container */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
          />

          {/* Mode Tabs Selector (Standard / Multi-Unit / Batch / Reference) */}
          <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-cartographer)] pb-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveViewMode('converter')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                activeViewMode === 'converter'
                  ? 'bg-[var(--ink-blue)] border-[var(--ink-blue)] text-white shadow-md'
                  : 'bg-[var(--card-bg)] border-[var(--border-cartographer)] text-[var(--ink-blue)] hover:bg-[var(--ink-blue-bg)]'
              }`}
            >
              Standard Translator
            </button>
            <button
              onClick={() => setActiveViewMode('multi')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                activeViewMode === 'multi'
                  ? 'bg-[var(--ink-blue)] border-[var(--ink-blue)] text-white shadow-md'
                  : 'bg-[var(--card-bg)] border-[var(--border-cartographer)] text-[var(--ink-blue)] hover:bg-[var(--ink-blue-bg)]'
              }`}
            >
              Simultaneous Domain Grid
            </button>
            <button
              onClick={() => setActiveViewMode('batch')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                activeViewMode === 'batch'
                  ? 'bg-[var(--ink-blue)] border-[var(--ink-blue)] text-white shadow-md'
                  : 'bg-[var(--card-bg)] border-[var(--border-cartographer)] text-[var(--ink-blue)] hover:bg-[var(--ink-blue-bg)]'
              }`}
            >
              Batch / Bulk Convert
            </button>
            <button
              onClick={() => setActiveViewMode('table')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                activeViewMode === 'table'
                  ? 'bg-[var(--ink-blue)] border-[var(--ink-blue)] text-white shadow-md'
                  : 'bg-[var(--card-bg)] border-[var(--border-cartographer)] text-[var(--ink-blue)] hover:bg-[var(--ink-blue-bg)]'
              }`}
            >
              Reference Chart Matrix
            </button>
          </div>

          {/* Primary Main Converter Card */}
          <MainConverterCard
            category={activeCategory}
            fromUnit={fromUnit}
            toUnit={toUnit}
            setFromUnit={setFromUnit}
            setToUnit={setToUnit}
            systemFilter={systemFilter}
            onAddFavorite={handleAddFavorite}
            isFavorite={isCurrentFavorite}
            onRecordHistory={handleRecordHistory}
          />

          {/* Relative Scale Visualizer */}
          <VisualScaleBar fromUnit={fromUnit} toUnit={toUnit} value={1} />

          {/* Conditional Secondary View Panels */}
          {activeViewMode === 'multi' && (
            <MultiUnitGrid category={activeCategory} fromUnit={fromUnit} value={1} />
          )}

          {activeViewMode === 'batch' && (
            <BatchConverter fromUnit={fromUnit} toUnit={toUnit} />
          )}

          {activeViewMode === 'table' && (
            <ReferenceTable fromUnit={fromUnit} toUnit={toUnit} />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        categories={categories}
        onSelectUnitPair={handleSelectConversion}
      />

      <CustomUnitModal
        isOpen={isCustomUnitModalOpen}
        onClose={() => setIsCustomUnitModalOpen(false)}
        categories={categories}
        onSaveCustomUnit={handleSaveCustomUnit}
      />

      <WidgetEmbedModal
        isOpen={isWidgetEmbedModalOpen}
        onClose={() => setIsWidgetEmbedModalOpen(false)}
      />

      <HistorySidebar
        isOpen={isHistorySidebarOpen}
        onClose={() => setIsHistorySidebarOpen(false)}
        history={history}
        favorites={favorites}
        categories={categories}
        onSelectConversion={handleSelectConversion}
        onClearHistory={handleClearHistory}
        onRemoveFavorite={handleRemoveFavorite}
      />
    </div>
  );
};

export default App;
