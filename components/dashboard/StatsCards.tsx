'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { CurrencyDisplayToggle } from './CurrencyDisplayToggle';
import type { CurrencyDisplayMode } from '@/types';

export function StatsCards({ invoices }: { invoices: any[] }) {
  const [currencyMode, setCurrencyMode] = useState<CurrencyDisplayMode>('settlement');

  const paid = invoices.filter((invoice) => invoice.status === 'paid');
  const revenue = paid.reduce((sum, invoice) => sum + Number(invoice.net_usdc ?? 0), 0);
  const active = invoices.filter((invoice) => invoice.status === 'pending').length;
  const conversion = invoices.length ? Math.round((paid.length / invoices.length) * 100) : 0;
  const month = paid.filter((invoice) => new Date(invoice.created_at).getMonth() === new Date().getMonth());
  const monthEarnings = month.reduce((sum, invoice) => sum + Number(invoice.net_usdc ?? 0), 0);

  const currencyLabel = currencyMode === 'settlement' ? 'USDC' : 'Original';

  const stats = [
    ['Total revenue', `${revenue.toFixed(2)} ${currencyLabel}`],
    ['Active invoices', active],
    ['Conversion rate', `${conversion}%`],
    ['This month', `${monthEarnings.toFixed(2)} ${currencyLabel}`],
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(([label, value]) => (
        <Card key={label} data-testid="stats-card">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
        </Card>
      ))}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Overview</h2>
        <CurrencyDisplayToggle mode={currencyMode} onChange={setCurrencyMode} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
