'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

export function InvoiceTimeline({ invoiceId }: { invoiceId: string }) {
  const { data } = useSWR(`invoice-timeline-${invoiceId}`, () => api.invoiceTimeline.get(invoiceId));
  const events = data ?? [];

  const eventIcons: Record<string, string> = {
    created: '📄',
    viewed: '👁️',
    paid: '✅',
    settled: '🏦',
    expired: '⏰',
    cancelled: '❌',
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-ink">Invoice Timeline</h2>
      <div className="space-y-3">
        {events.length > 0 ? (
          events.map((event: any, index: number) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="text-2xl">{eventIcons[event.event_type] || '•'}</div>
                {index < events.length - 1 && <div className="mt-2 h-8 w-0.5 bg-slate-200" />}
              </div>
              <div className="flex-1 pt-1">
                <div className="font-medium text-ink capitalize">{event.event_type.replace('_', ' ')}</div>
                <div className="text-sm text-slate-600">{event.description}</div>
                <div className="mt-1 text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">No timeline events yet.</div>
        )}
      </div>
    </div>
  );
}
