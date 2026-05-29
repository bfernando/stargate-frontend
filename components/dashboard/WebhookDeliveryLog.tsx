'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

export function WebhookDeliveryLog({ webhookId }: { webhookId: string }) {
  const { data, mutate } = useSWR(`webhook-deliveries-${webhookId}`, () => api.webhookDeliveries.list(webhookId, '?limit=50'));
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleReplay(deliveryId: string) {
    await api.webhookDeliveries.replay(deliveryId);
    mutate();
  }

  const deliveries = data?.items ?? [];

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-ink">Delivery History</h2>
      <div className="rounded-md border border-slate-200 bg-white">
        {deliveries.length > 0 ? (
          deliveries.map((delivery: any) => (
            <div key={delivery.id} className="border-b border-slate-100 p-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${delivery.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium text-ink">{delivery.event}</span>
                    <span className="text-xs text-slate-500">{delivery.response_status}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {new Date(delivery.created_at).toLocaleString()} · {delivery.latency_ms}ms
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-white text-ink ring-1 ring-slate-300 text-xs" onClick={() => setExpandedId(expandedId === delivery.id ? null : delivery.id)}>
                    {expandedId === delivery.id ? 'Hide' : 'Show'}
                  </Button>
                  <Button className="bg-white text-ink ring-1 ring-slate-300 text-xs" onClick={() => handleReplay(delivery.id)}>Replay</Button>
                </div>
              </div>
              {expandedId === delivery.id && (
                <div className="mt-3 rounded-md bg-slate-100 p-3">
                  <pre className="overflow-auto text-xs text-slate-900">{delivery.response_body}</pre>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-sm text-slate-500">No deliveries yet.</div>
        )}
      </div>
    </div>
  );
}
