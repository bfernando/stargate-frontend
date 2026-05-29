'use client';

import useSWR from 'swr';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';
import { InvoiceTimeline } from '@/components/invoices/InvoiceTimeline';
import { InvoiceDetail, InvoiceDetailSkeleton } from '@/components/invoices/InvoiceDetail';
import { api } from '@/lib/api';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { data, mutate } = useSWR(['invoice', params.id], () => api.invoices.get(params.id));
  if (!data) return null;
  return (
    <InvoiceDetail
      invoice={data}
      onCancel={async () => { await api.invoices.cancel(params.id); mutate(); }}
      onRefund={async () => { mutate(); }}
    />
  );
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <InvoiceDetail invoice={data} onCancel={async () => { await api.invoices.cancel(params.id); mutate(); }} />
      <InvoiceTimeline invoiceId={params.id} />
    </div>
  );
  if (!data) return <InvoiceDetailSkeleton />;
  return <InvoiceDetail invoice={data} onCancel={async () => { await api.invoices.cancel(params.id); mutate(); }} />;
}
