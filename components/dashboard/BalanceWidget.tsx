'use client';

import useSWR from 'swr';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';

export function BalanceWidget() {
  const { data } = useSWR('balances', api.balances.get);
  const balance = data ?? { usdc: '0', eurc: '0', xlm: '0' };

  const sparklineData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.random() * 1000 + 500,
  }));

  const maxValue = Math.max(...sparklineData.map(d => d.value));
  const minValue = Math.min(...sparklineData.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <Card className="space-y-4">
      <h2 className="font-semibold text-ink">On-chain Balances</h2>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-xs text-slate-500">USDC</div>
          <div className="mt-1 text-lg font-semibold text-ink">${parseFloat(balance.usdc).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">EURC</div>
          <div className="mt-1 text-lg font-semibold text-ink">€{parseFloat(balance.eurc).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">XLM</div>
          <div className="mt-1 text-lg font-semibold text-ink">{parseFloat(balance.xlm).toFixed(2)}</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${sparklineData.length * 4} 40`} className="w-full" preserveAspectRatio="none">
        <polyline
          points={sparklineData.map((d, i) => `${i * 4},${40 - ((d.value - minValue) / range) * 35}`).join(' ')}
          fill="none"
          stroke="rgb(139, 92, 246)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="text-xs text-slate-500">30-day trend</div>
    </Card>
  );
}
