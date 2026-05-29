'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PaymentWidget } from '@/components/payment/PaymentWidget';
import { useInvoiceStatus } from '@/hooks/useInvoiceStatus';

export function PayPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const status = useInvoiceStatus(id);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (status.status === 'paid') router.push(`/pay/${id}/success`);
  }, [status.status, router, id]);
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 p-6">
      <div className="text-sm text-slate-500">Elapsed {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div>
      <PaymentWidget invoiceId={id} />
    </main>
  );
}
