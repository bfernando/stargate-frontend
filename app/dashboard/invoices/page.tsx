import type { Metadata } from 'next';
import { InvoicesPageClient } from './_client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { useInvoices } from '@/hooks/useInvoices';

export default function InvoicesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get('status') ?? '';
  const search = params.get('search') ?? '';
  const page = Number(params.get('page') ?? '1');

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value); else next.delete(key);
      if (key !== 'page') next.delete('page');
      router.replace(`?${next.toString()}`);
    },
    [params, router],
  );

  const query = new URLSearchParams();
  if (status) query.set('status', status);
  if (search) query.set('search', search);
  if (page > 1) query.set('page', String(page));
  const { data } = useInvoices(query.toString() ? `?${query.toString()}` : '');

  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          className="w-56"
          placeholder="Search invoices…"
          value={search}
          onChange={(e) => setParam('search', e.target.value)}
        />
        <select
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
          value={status}
          onChange={(e) => setParam('status', e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Link href="/dashboard/invoices/new" className="ml-auto"><Button>Create Invoice</Button></Link>
      </div>

      <InvoiceTable invoices={data?.items ?? []} />

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <Button
            className="h-8 bg-white text-ink ring-1 ring-slate-300 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setParam('page', String(page - 1))}
          >
            Previous
          </Button>
          <span className="text-slate-500">Page {page} of {totalPages}</span>
          <Button
            className="h-8 bg-white text-ink ring-1 ring-slate-300 disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setParam('page', String(page + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
export const metadata: Metadata = {
  title: 'Invoices – Stargate',
  description: 'Create and manage USDC invoices for your customers.',
};

export default function InvoicesPage() {
  return <InvoicesPageClient />;
}
