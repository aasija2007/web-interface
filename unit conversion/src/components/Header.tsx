import React, { useState } from 'react';
import {
  Compass,
  Search,
  Mic,
  MicOff,
  Sun,
  Moon,
  Command,
  History as HistoryIcon,
  PlusCircle,
  Code
} from 'lucide-react';
import { SystemFilter } from '../types';
import { speechService } from '../services/speechService';

interface HeaderProps {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  systemFilter: SystemFilter;
  setSystemFilter: (s: SystemFilter) => void;
  onNaturalLanguageQuery: (query: string) => void;
  onOpenCommandPalette: () => void;
  onOpenHistory: () => void;
  onOpenCustomUnitModal: () => void;
  onOpenWidgetEmbedModal: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  systemFilter,
  setSystemFilter,
  onNaturalLanguageQuery,
  onOpenCommandPalette,
  onOpenHistory,
  onOpenCustomUnitModal,
  onOpenWidgetEmbedModal,
  favoritesCount
}) => {
  const [nlQuery, setNlQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  const handleNlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nlQuery.trim()) {
      onNaturalLanguageQuery(nlQuery);
    }
  };

  const toggleVoiceInput = () => {
    if (!speechService.isSupported()) {
      setVoiceError('Voice input is not supported in this browser.');
      setTimeout(() => setVoiceError(''), 4000);
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.startListening(
        (transcript, isFinal) => {
          setNlQuery(transcript);
          if (isFinal) {
            onNaturalLanguageQuery(transcript);
            setIsListening(false);
          }
        },
        (err) => {
          setVoiceError(`Voice error: ${err}`);
          setIsListening(false);
          setTimeout(() => setVoiceError(''), 4000);
        },
        () => setIsListening(false)
      );
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-[var(--border-cartographer)] px-4 sm:px-6 py-3 mb-6 bg-[var(--panel-cartographer)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-[var(--ink-blue)] text-white flex items-center justify-center shadow border border-[var(--border-cartographer)] group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 animate-spin-slow text-[var(--panel-cartographer)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif-map tracking-tight text-[var(--ink-blue)] flex items-center gap-2">
                <span>CARTOGRAPHER</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--wax-red)] text-white uppercase tracking-widest">
                  PRO
                </span>
              </h1>
              <p className="text-[11px] text-[var(--text-dim)] font-semibold tracking-wide">
                Translating Dimensions & Spatial Ratios
              </p>
            </div>
          </div>

          {/* Quick Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-cartographer)] text-[var(--ink-blue)] transition"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--wax-red)]" /> : <Moon className="w-4 h-4 text-[var(--ink-blue)]" />}
            </button>
            <button
              onClick={onOpenHistory}
              className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-cartographer)] text-[var(--ink-blue)] transition relative"
            >
              <HistoryIcon className="w-4 h-4 text-[var(--wax-red)]" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--wax-red)] text-[10px] font-bold text-white flex items-center justify-center shadow">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Natural Language Search Omnibox */}
        <div className="w-full md:max-w-md relative">
          <form onSubmit={handleNlSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[var(--ink-blue)] pointer-events-none" />
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="Type '50 kg to lbs', '37 C to F', or '100 USD in EUR'..."
              className="w-full pl-10 pr-24 py-2 text-xs sm:text-sm rounded-xl bg-[var(--card-bg)] border border-[var(--border-cartographer)] text-[var(--text-dark)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--ink-blue)] focus:ring-2 focus:ring-[var(--ink-blue)]/20 transition shadow-inner font-semibold"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-1.5 rounded-lg transition ${
                  isListening ? 'bg-[var(--wax-red)] text-white animate-pulse' : 'hover:bg-[var(--ink-blue-bg)] text-[var(--text-dim)] hover:text-[var(--text-dark)]'
                }`}
                title={isListening ? 'Listening...' : 'Voice Search'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-[var(--ink-blue)] bg-[var(--ink-blue-bg)] rounded-lg border border-[var(--border-cartographer)] hover:bg-[var(--ink-blue-bg)] transition font-bold"
                title="Command Palette (Ctrl+K)"
              >
                <Command className="w-3 h-3 text-[var(--ink-blue)]" />
                <span>K</span>
              </button>
            </div>
          </form>

          {voiceError && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-xl bg-[var(--wax-red)]/15 border border-[var(--wax-red)]/40 text-[var(--wax-red)] text-xs text-center z-50 animate-fade-in font-bold">
              {voiceError}
            </div>
          )}
        </div>

        {/* Global Toolbar Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Unit System Switcher */}
          <div className="flex items-center bg-[var(--card-bg)] border border-[var(--border-cartographer)] rounded-xl p-1 text-xs font-bold shadow-inner">
            <button
              onClick={() => setSystemFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                systemFilter === 'all' ? 'bg-[var(--ink-blue)] text-white shadow-sm' : 'text-[var(--text-dim)] hover:text-[var(--text-dark)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSystemFilter('metric')}
              className={`px-2.5 py-1 rounded-lg transition ${
                systemFilter === 'metric' ? 'bg-[var(--ink-blue)] text-white shadow-sm' : 'text-[var(--text-dim)] hover:text-[var(--text-dark)]'
              }`}
            >
              Metric
            </button>
            <button
              onClick={() => setSystemFilter('imperial')}
              className={`px-2.5 py-1 rounded-lg transition ${
                systemFilter === 'imperial' ? 'bg-[var(--ink-blue)] text-white shadow-sm' : 'text-[var(--text-dim)] hover:text-[var(--text-dark)]'
              }`}
            >
              Imperial
            </button>
          </div>

          {/* Custom Unit Modal Button */}
          <button
            onClick={onOpenCustomUnitModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--card-bg)] hover:bg-[var(--ink-blue-bg)] border border-[var(--border-cartographer)] text-[var(--ink-blue)] transition shadow-sm"
            title="Create Custom Unit"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[var(--ink-blue)]" />
            <span>Custom Unit</span>
          </button>

          {/* Embed Widget Generator Button */}
          <button
            onClick={onOpenWidgetEmbedModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--card-bg)] hover:bg-[var(--ink-blue-bg)] border border-[var(--border-cartographer)] text-[var(--ink-blue)] transition shadow-sm"
            title="Embed Converter Widget"
          >
            <Code className="w-3.5 h-3.5 text-[var(--sage-green)]" />
            <span>Widget</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--card-bg)] hover:bg-[var(--ink-blue-bg)] border border-[var(--border-cartographer)] text-[var(--ink-blue)] transition relative shadow-sm"
          >
            <HistoryIcon className="w-3.5 h-3.5 text-[var(--wax-red)]" />
            <span>History</span>
            {favoritesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[var(--wax-red)] text-[10px] font-bold text-white flex items-center justify-center shadow">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Dark / Light Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--ink-blue-bg)] border border-[var(--border-cartographer)] text-[var(--ink-blue)] transition shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Cartographer Theme`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--wax-red)]" /> : <Moon className="w-4 h-4 text-[var(--ink-blue)]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
