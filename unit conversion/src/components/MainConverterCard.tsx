import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Check,
  Star,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Category, PrecisionMode, Unit, SystemFilter } from '../types';
import { convertValue, formatNumber, getFormulaStrings } from '../utils/converterEngine';

interface MainConverterCardProps {
  category: Category;
  fromUnit: Unit;
  toUnit: Unit;
  setFromUnit: (u: Unit) => void;
  setToUnit: (u: Unit) => void;
  systemFilter: SystemFilter;
  onAddFavorite: (catId: any, fromId: string, toId: string) => void;
  isFavorite: boolean;
  onRecordHistory: (fromVal: number, fromUnitId: string, toVal: number, toUnitId: string, formatted: string) => void;
}

export const MainConverterCard: React.FC<MainConverterCardProps> = ({
  category,
  fromUnit,
  toUnit,
  setFromUnit,
  setToUnit,
  systemFilter,
  onAddFavorite,
  isFavorite,
  onRecordHistory
}) => {
  const [inputValue, setInputValue] = useState<string>('1');
  const [precisionMode, setPrecisionMode] = useState<PrecisionMode>('auto');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  // Filter units based on Metric/Imperial global system filter
  const filteredUnits = category.units.filter((u) => {
    if (systemFilter === 'all') return true;
    if (!u.system || u.system === 'universal') return true;
    return u.system === systemFilter;
  });

  const numericVal = parseFloat(inputValue);
  const isValidNumber = !isNaN(numericVal);

  // Perform live bi-directional calculation
  const rawResult = isValidNumber ? convertValue(numericVal, fromUnit, toUnit) : 0;
  const formattedResult = isValidNumber ? formatNumber(rawResult, precisionMode) : '0';

  // Educational step-by-step formulas
  const formulas = getFormulaStrings(fromUnit, toUnit);

  // Record conversion to history after typing stops
  useEffect(() => {
    if (isValidNumber && numericVal !== 0) {
      const timer = setTimeout(() => {
        onRecordHistory(numericVal, fromUnit.id, rawResult, toUnit.id, formattedResult);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [inputValue, fromUnit.id, toUnit.id, precisionMode]);

  // Input validation for negative physical values
  const handleInputChange = (val: string) => {
    setInputValue(val);
    const parsed = parseFloat(val);

    if (val.trim() !== '' && isNaN(parsed)) {
      setErrorMessage('Please enter a valid numeric value');
    } else if (parsed < 0 && category.id !== 'temperature') {
      setErrorMessage('Physical quantities like length, weight, or area cannot be negative');
    } else {
      setErrorMessage('');
    }
  };

  // Swap units button click
  const handleSwap = () => {
    setIsSwapping(true);
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setTimeout(() => setIsSwapping(false), 400);
  };

  // Copy result to clipboard with visual feedback
  const handleCopy = () => {
    const textToCopy = `${inputValue} ${fromUnit.symbol} = ${formattedResult} ${toUnit.symbol}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    // Trigger subtle confetti burst
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputValue('1');
    setErrorMessage('');
  };

  return (
    <div className="w-full glass-panel border border-[var(--border-cartographer)] p-5 md:p-8 mb-6 relative overflow-hidden shadow-xl bg-[var(--panel-cartographer)]">
      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-map tracking-tight text-[var(--ink-blue)] flex items-center gap-2">
              <span>{category.name} Translator</span>
            </h3>
            {isFavorite && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--wax-red)]/15 text-[var(--wax-red)] border border-[var(--wax-red)]/30 flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-[var(--wax-red)] text-[var(--wax-red)]" /> Pinned
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-dim)] font-semibold mt-0.5">{category.description}</p>
        </div>

        {/* Toolbar Pills */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Precision Selector */}
          <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-cartographer)] rounded-xl px-3 py-1.5 text-xs font-bold shadow-inner">
            <Sliders className="w-3.5 h-3.5 text-[var(--ink-blue)] shrink-0" />
            <span className="text-[var(--text-dim)] font-bold hidden sm:inline">Precision:</span>
            <select
              value={precisionMode}
              onChange={(e) => setPrecisionMode(e.target.value as PrecisionMode)}
              className="bg-transparent text-[var(--text-dark)] font-bold focus:outline-none cursor-pointer text-xs sm:text-sm"
            >
              <option value="auto">Auto Smart</option>
              <option value="0">0 Decimals</option>
              <option value="2">2 Decimals</option>
              <option value="4">4 Decimals</option>
              <option value="6">6 Decimals</option>
              <option value="scientific">Scientific (1e+N)</option>
              <option value="fraction">Fraction (1 1/2)</option>
            </select>
          </div>

          {/* Star Favorite Button */}
          <button
            onClick={() => onAddFavorite(category.id, fromUnit.id, toUnit.id)}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-[var(--wax-red)]/20 border-[var(--wax-red)]/40 text-[var(--wax-red)] shadow-sm'
                : 'bg-[var(--card-bg)] border-[var(--border-cartographer)] text-[var(--text-dim)] hover:text-[var(--ink-blue)] hover:border-[var(--ink-blue)]'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-[var(--wax-red)] text-[var(--wax-red)]' : ''}`} />
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-cartographer)] text-[var(--text-dim)] hover:text-[var(--text-dark)] hover:border-[var(--ink-blue)] transition-all"
            title="Reset input value"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dual Conversion Layout (From <-> To) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4 sm:gap-6 items-center mb-6">
        {/* FROM FIELD CARD */}
        <div className="glass-card p-4 sm:p-5 border border-[var(--border-cartographer)] bg-[var(--card-bg)] focus-within:border-[var(--ink-blue)] transition-all shadow-md">
          <div className="flex items-center justify-between mb-2 text-xs font-bold tracking-wider text-[var(--text-dim)]">
            <span className="uppercase font-serif-map">INPUT QUANTITY</span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-[var(--ink-blue-bg)] text-[var(--ink-blue)] border border-[var(--border-cartographer)] font-bold">
              {fromUnit.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter value..."
              className="w-full bg-transparent text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-[var(--text-dark)] placeholder-[var(--text-dim)] focus:outline-none tracking-tight"
            />
            {/* From Unit Select Dropdown */}
            <select
              value={fromUnit.id}
              onChange={(e) => {
                const selected = category.units.find((u) => u.id === e.target.value);
                if (selected) setFromUnit(selected);
              }}
              className="bg-[var(--panel-cartographer)] border border-[var(--border-cartographer)] text-[var(--ink-blue)] text-xs sm:text-sm font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--ink-blue)] cursor-pointer min-w-[130px] shadow-sm"
            >
              {filteredUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SWAP BUTTON - Wax Red Accent */}
        <div className="flex justify-center my-1 lg:my-0">
          <button
            onClick={handleSwap}
            className={`p-3.5 rounded-2xl btn-wax-red text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-300 ${
              isSwapping ? 'rotate-180' : ''
            }`}
            title="Swap Units (Alt + S)"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* TO FIELD CARD */}
        <div className="glass-card p-4 sm:p-5 border border-[var(--sage-green)] bg-[var(--sage-green-bg)] focus-within:border-[var(--ink-blue)] transition-all shadow-md">
          <div className="flex items-center justify-between mb-2 text-xs font-bold tracking-wider text-[var(--sage-green)]">
            <span className="uppercase font-serif-map">TRANSLATED VALUE</span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-[var(--sage-green-bg)] text-[var(--sage-green)] border border-[var(--sage-green)]/30 font-bold">
              {toUnit.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="overflow-x-auto scrollbar-none py-1 flex-1">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-[var(--ink-blue)] tracking-tight whitespace-nowrap drop-shadow-sm">
                {formattedResult}
              </span>
            </div>

            {/* To Unit Select Dropdown */}
            <select
              value={toUnit.id}
              onChange={(e) => {
                const selected = category.units.find((u) => u.id === e.target.value);
                if (selected) setToUnit(selected);
              }}
              className="bg-[var(--panel-cartographer)] border border-[var(--border-cartographer)] text-[var(--ink-blue)] text-xs sm:text-sm font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--ink-blue)] cursor-pointer min-w-[130px] shadow-sm"
            >
              {filteredUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inline Validation Warning */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--wax-red)]/15 border border-[var(--wax-red)]/40 text-[var(--wax-red)] text-xs sm:text-sm flex items-center gap-2 font-bold animate-fade-in shadow-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[var(--wax-red)]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Bottom Footer: Formula & Copy Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-cartographer)] text-xs sm:text-sm text-[var(--text-dark)] font-bold">
        {/* Educational Formula Display */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-mono text-[var(--ink-blue)] font-bold text-xs sm:text-sm">
            <Info className="w-4 h-4 text-[var(--ink-blue)] shrink-0" />
            <span>Formula: {formulas.forward}</span>
          </div>
          <div className="text-[11px] sm:text-xs text-[var(--text-dim)] font-mono pl-6 font-semibold">
            Reverse: {formulas.reverse}
          </div>
        </div>

        {/* Copy Result Button - Wax Red Action */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
            copied
              ? 'bg-[var(--sage-green)] text-white shadow-sm scale-105'
              : 'btn-wax-red hover:scale-[1.02]'
          }`}
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Result'}</span>
        </button>
      </div>

      {/* Unit Trivia & Fun Facts popover card */}
      {(fromUnit.trivia || toUnit.trivia) && (
        <div className="mt-4 p-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-cartographer)] text-xs sm:text-sm text-[var(--text-dark)] flex items-start gap-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-[var(--wax-red)] shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-bold text-[var(--wax-red)] block mb-0.5 text-xs font-serif-map">Cartographer Notes:</span>
            <p className="text-[var(--text-dark)] text-xs sm:text-sm leading-relaxed font-medium">
              {fromUnit.trivia || toUnit.trivia}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
