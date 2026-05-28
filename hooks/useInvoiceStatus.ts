'use client';

import { useEffect, useRef, useState } from 'react';
import { invoiceStatusUrl } from '@/lib/sse';

export type InvoiceStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

/**
 * Subscribes to live invoice status updates over server-sent events.
 *
 * @param invoiceId - Invoice identifier used to build the status event stream URL.
 * @returns Current status, paid timestamp, loading state, and any connection error.
 *
 * @example
 * const { status, paidAt, loading, error } = useInvoiceStatus(invoice.id);
 */
export function useInvoiceStatus(invoiceId: string) {
  const [status, setStatus] = useState<InvoiceStatus>('pending');
  const [paidAt, setPaidAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reconnects = useRef(0);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!invoiceId) return;
    const connect = () => {
      const es = new EventSource(invoiceStatusUrl(invoiceId));
      esRef.current = es;
      es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status) setStatus(data.status);
        if (data.paid_at) setPaidAt(data.paid_at);
        setLoading(false);
        if (data.status === 'paid' || data.status === 'expired') es.close();
      };
      es.onerror = () => {
        es.close();
        if (reconnects.current >= 10) {
          setError('Connection lost');
          return;
        }
        reconnects.current += 1;
        setTimeout(connect, 3000);
      };
    };
    connect();
    return () => esRef.current?.close();
  }, [invoiceId]);

  return { status, paidAt, loading, error };
}
