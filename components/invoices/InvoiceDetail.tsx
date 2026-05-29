'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RefundModal } from '@/components/invoices/RefundModal';
import { api } from '@/lib/api';

export function InvoiceDetail({ invoice, onCancel, onRefund }: { invoice: any; onCancel(): void; onRefund?(): void }) {
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundStatus, setRefundStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handleRefund = async () => {
    try {
      setRefundStatus('pending');
      await api.invoices.refund(invoice.id);
      setRefundStatus('success');
      onRefund?.();
    } catch (err) {
      setRefundStatus('error');
      throw err;
    }
  };

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className ?? ''}`} />;
}

export function InvoiceDetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <section className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-20" />
        <dl className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </dl>
      </section>
      <aside className="rounded-md border border-slate-200 bg-white p-4 space-y-4">
        <Skeleton className="mx-auto h-60 w-60" />
        <Skeleton className="h-10 w-full" />
      </aside>
    </div>
  );
}

export function InvoiceDetail({ invoice, onCancel }: { invoice: any; onCancel(): void }) {
  const getSorobanExplorerUrl = (txHash: string) => {
    const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'public' : 'testnet';
    return `https://stellar.expert/explorer/${network}/tx/${txHash}`;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-ink">Invoice {invoice.id}</h1>
        <Badge status={invoice.status} />
        {refundStatus === 'success' && <p className="text-sm text-green-600">Refund initiated successfully</p>}
        {refundStatus === 'error' && <p className="text-sm text-red-600">Refund failed</p>}
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-500">Amount</dt><dd>{invoice.amount_usdc} USDC</dd></div>
          <div><dt className="text-slate-500">Buyer pays</dt><dd>{invoice.gross_usdc} USDC</dd></div>
          <div><dt className="text-slate-500">Muxed address</dt><dd className="break-all font-mono text-xs">{invoice.muxed_address}</dd></div>
          <div><dt className="text-slate-500">Expires</dt><dd>{new Date(invoice.expires_at).toLocaleString()}</dd></div>
        </dl>
        <div className="flex gap-2">
          {invoice.status === 'pending' && <Button onClick={onCancel}>Cancel invoice</Button>}
          {invoice.status === 'paid' && <Button onClick={() => setRefundOpen(true)}>Refund</Button>}
          {invoice.paid_at && invoice.tx_hash && (
            <Button variant="secondary" asChild>
              <a href={getSorobanExplorerUrl(invoice.tx_hash)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                View on Stellar Expert <ExternalLink size={16} />
              </a>
            </Button>
          )}
        </div>
      </section>
      <aside className="rounded-md border border-slate-200 bg-white p-4">
        <QRCodeSVG value={invoice.payment_url} size={240} className="mx-auto max-w-full" />
        <Button className="mt-4 w-full" onClick={() => navigator.clipboard.writeText(invoice.payment_url)}>Copy payment URL</Button>
      </aside>
      <RefundModal
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        invoiceId={invoice.id}
        amount={invoice.amount_usdc}
        onConfirm={handleRefund}
      />
    </div>
  );
}
