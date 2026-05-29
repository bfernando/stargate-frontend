'use client';

import { useState } from 'react';
import { Copy, ExternalLink, Lock, Plus, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useInvoices } from '@/hooks/useInvoices';
import { ShareModal } from '@/components/payment-links/ShareModal';
import { PasswordProtectionModal } from '@/components/payment-links/PasswordProtectionModal';

export default function PaymentLinksPage() {
  const { data } = useInvoices('?limit=50');
  const links = data?.items ?? [];
  const [sharing, setSharing] = useState<{ url: string; label: string } | null>(null);
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; invoiceId?: string } | null>(null);
  const [linkPasswords, setLinkPasswords] = useState<Record<string, string | null>>({});
  return (
    <>
    {sharing && <ShareModal url={sharing.url} label={sharing.label} onClose={() => setSharing(null)} />}
    {passwordModal && (
      <PasswordProtectionModal
        open={passwordModal.open}
        onClose={() => setPasswordModal(null)}
        onSave={(password) => {
          if (passwordModal.invoiceId) {
            setLinkPasswords((prev) => ({ ...prev, [passwordModal.invoiceId!]: password }));
          }
        }}
        currentPassword={passwordModal.invoiceId ? linkPasswords[passwordModal.invoiceId] : null}
      />
    )}
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Payment Links</h1>
          <p className="text-sm text-slate-500">Share hosted checkout links backed by Stellar USDC invoices.</p>
        </div>
        <Link href="/dashboard/payment-links/new">
          <Button><Plus size={16} /> New link</Button>
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {links.map((invoice) => (
          <Card key={invoice.id} className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium text-ink">{invoice.description || 'Hosted checkout link'}</div>
                <div className="mt-1 font-mono text-xs text-slate-500">{invoice.id}</div>
              </div>
              <div className="flex items-center gap-2">
                {linkPasswords[invoice.id] && <Lock size={16} className="text-slate-400" />}
                <Badge status={invoice.status} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><div className="text-slate-500">Buyer pays</div><div className="font-medium">{invoice.gross_usdc}</div></div>
              <div><div className="text-slate-500">Fee</div><div className="font-medium">{invoice.fee_usdc}</div></div>
              <div><div className="text-slate-500">Expires</div><div className="font-medium">{new Date(invoice.expires_at).toLocaleDateString()}</div></div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={() => navigator.clipboard.writeText(invoice.payment_url)}>
                <Copy size={16} /> Copy
              </Button>
              <Button className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={() => setPasswordModal({ open: true, invoiceId: invoice.id })}>
                <Lock size={16} /> Protect
              </Button>
              <Button className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={() => setSharing({ url: invoice.payment_url, label: invoice.description || invoice.id })}>
                <Share2 size={16} /> Share
              </Button>
              <Link href={`/pay/${invoice.id}`} target="_blank">
                <Button className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50">
                  <ExternalLink size={16} /> Open
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
      {!links.length && (
        <Card className="flex items-center justify-between">
          <div>
            <div className="font-medium text-ink">No payment links yet</div>
            <div className="text-sm text-slate-500">Create an invoice to generate a hosted checkout link.</div>
          </div>
          <Link href="/dashboard/invoices/new"><Button>Create link</Button></Link>
        </Card>
      )}
    </div>
    </>
  );
}
