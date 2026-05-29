'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { CurrencyDisplayMode } from '@/types';

interface CurrencyDisplayToggleProps {
  /** Current display mode from parent state */
  mode: CurrencyDisplayMode;
  /** Callback when mode changes */
  onChange: (mode: CurrencyDisplayMode) => void;
}

export function CurrencyDisplayToggle({ mode, onChange }: CurrencyDisplayToggleProps) {
  const [settlementCurrency, setSettlementCurrency] = useState('USDC');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.currency.getSettings().then((settings) => {
      setSettlementCurrency(settings.settlement_currency);
    }).catch(() => {
      // Default to USDC if API fails
    });
  }, []);

  const handleToggle = async (newMode: CurrencyDisplayMode) => {
    setIsLoading(true);
    try {
      await api.currency.updateSettings({ mode: newMode });
      onChange(newMode);
    } catch (err) {
      console.error('Failed to update currency display mode:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      <button
        onClick={() => handleToggle('settlement')}
        disabled={isLoading}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          mode === 'settlement'
            ? 'bg-violet text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        {settlementCurrency}
      </button>
      <button
        onClick={() => handleToggle('original')}
        disabled={isLoading}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          mode === 'original'
            ? 'bg-violet text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        Original
      </button>
    </div>
  );
}
