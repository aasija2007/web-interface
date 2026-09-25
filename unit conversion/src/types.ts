export type SystemFilter = 'all' | 'metric' | 'imperial';

export type CategoryId =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'volume'
  | 'area'
  | 'speed'
  | 'time'
  | 'data'
  | 'pressure'
  | 'energy'
  | 'power'
  | 'force'
  | 'angle'
  | 'frequency'
  | 'fuel'
  | 'currency';

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  system?: 'metric' | 'imperial' | 'universal';
  /** Ratios relative to base unit of the category */
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
  factor?: number; // Used if standard multiplier: baseVal = val * factor
  trivia?: string;
  isCustom?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  baseUnit: string;
  description: string;
  units: Unit[];
}

export interface ConversionResult {
  fromValue: number;
  fromUnit: Unit;
  toValue: number;
  toUnit: Unit;
  formattedToValue: string;
  formulaForward: string;
  formulaReverse: string;
  category: CategoryId;
}

export interface CustomUnit {
  id: string;
  name: string;
  symbol: string;
  categoryId: CategoryId;
  baseUnitId: string;
  factor: number; // 1 CustomUnit = factor * baseUnit
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  categoryId: CategoryId;
  fromValue: number;
  fromUnitId: string;
  toValue: number;
  toUnitId: string;
  formattedResult: string;
}

export interface FavoriteItem {
  id: string;
  categoryId: CategoryId;
  fromUnitId: string;
  toUnitId: string;
}

export type PrecisionMode = 'auto' | '0' | '2' | '4' | '6' | 'scientific' | 'fraction';
