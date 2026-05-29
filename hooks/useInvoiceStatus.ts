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
const TERMINAL: InvoiceStatus[] = ['paid', 'expired', 'cancelled'];
const MAX_RECONNECTS = 8;
const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 30_000;

export function useInvoiceStatus(invoiceId: string) {
  const [status, setStatus] = useState<InvoiceStatus>('pending');
  const [paidAt, setPaidAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reconnects = useRef(0);
  const esRef = useRef<EventSource | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        reconnects.current = 0; // reset on successful message
        if (TERMINAL.includes(data.status)) es.close();
      };

      es.onerror = () => {
        es.close();
        if (reconnects.current >= MAX_RECONNECTS) {
          setError('Connection lost');
          return;
        }
        const delay = Math.min(BASE_DELAY_MS * 2 ** reconnects.current, MAX_DELAY_MS);
        reconnects.current += 1;
        timerRef.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      esRef.current?.close();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [invoiceId]);

  return { status, paidAt, loading, error };
}
