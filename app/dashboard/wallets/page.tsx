'use client';

import { ArrowUpRight, Landmark, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';

const balances = [
  { code: 'USDC', flag: '🇺🇸', balance: '12,420.25', network: 'Stellar', status: 'live' },
  { code: 'USD', flag: '🇺🇸', balance: '8,100.00', network: 'Bank payout', status: 'processing' },
  { code: 'EUR', flag: '🇪🇺', balance: '2,840.10', network: 'Bank payout', status: 'pending' },
];

export default function WalletsPage() {
  const [destination, setDestination] = useState('');
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Wallets</h1>
        <p className="text-sm text-slate-500">Settlement balances, payout destinations, and crypto wallet controls.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {balances.map((item) => (
          <Card key={item.code} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500"><span>{item.flag}</span>{item.network}</div>
              <Badge status={item.status} />
            </div>
            <div className="text-2xl font-semibold text-ink">{item.balance} <span className="text-sm text-slate-500">{item.code}</span></div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-violet" />
            <h2 className="font-semibold text-ink">Crypto settlement address</h2>
          </div>
          <div className="flex items-center gap-1">
            <Input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="G... Stellar settlement address"
              className="flex-1"
            />
            {destination && <CopyButton value={destination} label="Copy wallet address" />}
          </div>
          <div className="flex gap-2">
            <Button>Verify ownership</Button>
            <Button className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50">Open explorer</Button>
          </div>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Landmark size={18} className="text-mint" />
            <h2 className="font-semibold text-ink">Payout preview</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Available</span><span>12,420.25 USDC</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Network fee</span><span>0.10 USDC</span></div>
            <div className="flex justify-between font-medium"><span>Estimated net</span><span>12,420.15 USDC</span></div>
          </div>
          <Button className="w-full"><ArrowUpRight size={16} /> Start payout</Button>
        </Card>
      </div>
    </div>
  );
}
