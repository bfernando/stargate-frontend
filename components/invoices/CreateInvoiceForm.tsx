'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

const USDC_MAX_DECIMALS = 7;

const schema = z.object({
  amount_usdc: z.coerce
    .number()
    .positive()
    .max(100000)
    .refine(
      (v) => !String(v).includes('.') || String(v).split('.')[1].length <= USDC_MAX_DECIMALS,
      { message: `Amount cannot have more than ${USDC_MAX_DECIMALS} decimal places` }
    ),
  description: z.string().max(500).optional(),
  expires_in_minutes: z.coerce.number().default(60),
});

export function CreateInvoiceForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { expires_in_minutes: 60 } });
  const amount = Number(form.watch('amount_usdc') ?? 0);
  const preview = useMemo(() => {
    const fee = amount * 0.005 + 0.25;
    return { net: Math.max(amount - 0.25, 0).toFixed(2), gross: (amount + fee).toFixed(2) };
  }, [amount]);

  async function onSubmit(data: z.infer<typeof schema>) {
    const invoice = await api.invoices.create(data);
    router.push(`/dashboard/invoices/${invoice.id}`);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form className="max-w-xl space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <Input placeholder="Amount (USDC)" type="number" step="0.0000001" {...form.register('amount_usdc')} />
        {form.formState.errors.amount_usdc && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.amount_usdc.message}</p>
        )}
      </div>
      <Input placeholder="Description" {...form.register('description')} />
      <select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" {...form.register('expires_in_minutes')}>
        <option value={15}>15m</option>
        <option value={30}>30m</option>
        <option value={60}>1h</option>
        <option value={360}>6h</option>
        <option value={1440}>24h</option>
      </select>
      <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">You receive: {preview.net} USDC. Buyer pays: {preview.gross} USDC.</div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create invoice'}
      </Button>
    </form>
  );
}
