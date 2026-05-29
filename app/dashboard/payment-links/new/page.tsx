'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ABTestVariantSelector } from '@/components/payment-links/ABTestVariantSelector';
import { api } from '@/lib/api';
import type { BrandingSettings } from '@/types';

interface Variant {
  name: string;
  traffic_percentage: number;
  branding: BrandingSettings;
}

export default function NewPaymentLinkPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enableABTest, setEnableABTest] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([
    {
      name: 'Control',
      traffic_percentage: 50,
      branding: {
        primary_color: '#6C5CE7',
        secondary_color: '#00CEC9',
        accent_color: '#1860A5',
        cta_text: 'Pay with USDC',
        cta_background_color: '#0D0F1A',
        cta_text_color: '#FFFFFF',
        show_merchant_name: true,
      },
    },
    {
      name: 'Variant B',
      traffic_percentage: 50,
      branding: {
        primary_color: '#E17055',
        secondary_color: '#FDCB6E',
        accent_color: '#00CEC9',
        cta_text: 'Complete Payment',
        cta_background_color: '#6C5CE7',
        cta_text_color: '#FFFFFF',
        show_merchant_name: true,
      },
    },
  ]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a name for this payment link.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Create the invoice first
      const invoice = await api.invoices.create({
        amount_usdc: Number(amount),
        description: description || undefined,
      });

      // If A/B test is enabled, create the test
      if (enableABTest && variants.length >= 2) {
        await api.abTests.create({
          name: `A/B Test: ${name}`,
          description: description || undefined,
          variants: variants.map((v) => ({
            name: v.name,
            traffic_percentage: v.traffic_percentage,
            branding: v.branding,
          })),
        });
      }

      router.push('/dashboard/payment-links');
    } catch (err) {
      console.error('Failed to create payment link:', err);
      setError('Failed to create payment link. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/payment-links"
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-ink">New Payment Link</h1>
          <p className="text-sm text-slate-500">Create a hosted checkout link backed by a Stellar USDC invoice.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Card className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Link Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Basic Plan Payment"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this payment for?"
              className="h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Amount (USDC)</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </Card>

      {/* A/B Test Toggle */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-ink">A/B Test</h3>
            <p className="text-sm text-slate-500">
              Create multiple variants of this payment page and split traffic to test performance.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={enableABTest}
              onChange={(e) => setEnableABTest(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-violet peer-checked:after:translate-x-full" />
          </label>
        </div>

        {enableABTest && (
          <ABTestVariantSelector variants={variants} onChange={setVariants} />
        )}
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleCreate} disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create Payment Link'}
        </Button>
        <Link href="/dashboard/payment-links">
          <Button className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}
