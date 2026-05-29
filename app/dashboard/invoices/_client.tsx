'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { useInvoices } from '@/hooks/useInvoices';

export function InvoicesPageClient() {
  const [status, setStatus] = useState('');
  const { data } = useInvoices(status ? `?status=${status}` : '');
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="expired">Expired</option>
        </select>
        <Link href="/dashboard/invoices/new"><Button>Create Invoice</Button></Link>
      </div>
      <InvoiceTable invoices={data?.items ?? []} />
    </div>
  );
}
