interface RatesCache {
  rates: Record<string, number>;
  timestamp: number;
}

const CACHE_KEY = 'omniconvert_currency_rates';
const CACHE_DURATION_MS = 1000 * 60 * 60; // 1 hour

export const fetchLiveCurrencyRates = async (): Promise<Record<string, number> | null> => {
  try {
    // 1. Check local storage cache first
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed: RatesCache = JSON.parse(cachedData);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
        return parsed.rates;
      }
    }

    // 2. Fetch fresh rates from Frankfurter API (USD base)
    const response = await fetch('https://api.frankfurter.app/latest?from=USD');
    if (!response.ok) {
      throw new Error(`Currency API HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const rates: Record<string, number> = { USD: 1 };

    if (data && data.rates) {
      Object.keys(data.rates).forEach((code) => {
        // Frankfurter gives rate as: 1 USD = rate targetCurrency
        // So factor (relative to USD) = 1 / rate
        rates[code.toLowerCase()] = 1 / data.rates[code];
      });

      // Save cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          rates,
          timestamp: Date.now()
        })
      );

      return rates;
    }
  } catch (error) {
    console.warn('Unable to fetch live currency exchange rates, using fallback values:', error);
  }

  return null;
};
