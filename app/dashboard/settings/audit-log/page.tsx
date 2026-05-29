'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, RefreshCw, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import type { AuditAction, AuditLogEntry, AuditLogListResponse } from '@/types';

const ACTION_LABELS: Record<AuditAction, string> = {
  'merchant.updated': 'Merchant Updated',
  'invoice.created': 'Invoice Created',
  'invoice.cancelled': 'Invoice Cancelled',
  'payment.received': 'Payment Received',
  'webhook.created': 'Webhook Created',
  'webhook.deleted': 'Webhook Deleted',
  'team.invited': 'Team Member Invited',
  'team.removed': 'Team Member Removed',
  'team.role_changed': 'Team Role Changed',
  'dispute.opened': 'Dispute Opened',
  'dispute.responded': 'Dispute Responded',
  'settings.changed': 'Settings Changed',
  'api_key.generated': 'API Key Generated',
  'api_key.revoked': 'API Key Revoked',
  'login': 'Login',
  'logout': 'Logout',
  'branding.updated': 'Branding Updated',
  'ab_test.created': 'A/B Test Created',
  'ab_test.updated': 'A/B Test Updated',
};

const ACTION_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All actions' },
  ...Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label })),
];

export default function AuditLogPage() {
  const [data, setData] = useState<AuditLogListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const limit = 20;

  const loadAuditLog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (search.trim()) params.set('search', search.trim());
      if (actionFilter) params.set('action', actionFilter);
      const result = await api.auditLog.list(`?${params.toString()}`);
      setData(result);
    } catch (err) {
      console.error('Failed to load audit log:', err);
      setError('Failed to load audit log. Showing demo data.');
      setMockData();
    } finally {
      setIsLoading(false);
    }
  }, [page, search, actionFilter]);

  useEffect(() => {
    loadAuditLog();
  }, [loadAuditLog]);

  const setMockData = () => {
    const mockItems: AuditLogEntry[] = [
      {
        id: '1',
        merchant_id: 'm1',
        actor_email: 'merchant@example.com',
        action: 'login',
        resource_type: 'session',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        merchant_id: 'm1',
        actor_email: 'merchant@example.com',
        action: 'invoice.created',
        resource_type: 'invoice',
        resource_id: 'inv_123',
        details: { amount: '100.00' },
        ip_address: '192.168.1.1',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        merchant_id: 'm1',
        actor_email: 'admin@example.com',
        action: 'team.invited',
        resource_type: 'team_member',
        resource_id: 'tm_456',
        details: { email: 'newdev@example.com', role: 'developer' },
        ip_address: '10.0.0.1',
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '4',
        merchant_id: 'm1',
        actor_email: 'merchant@example.com',
        action: 'settings.changed',
        resource_type: 'merchant',
        details: { field: 'settlement_cadence', from: 'daily', to: 'weekly' },
        ip_address: '192.168.1.1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '5',
        merchant_id: 'm1',
        actor_email: 'merchant@example.com',
        action: 'payment.received',
        resource_type: 'payment',
        resource_id: 'pay_789',
        details: { amount: '50.00', currency: 'USDC' },
        ip_address: '203.0.113.1',
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
    setData({
      page,
      limit,
      total: 5,
      items: mockItems,
    });
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Audit Log</h1>
        <p className="text-sm text-slate-500">
          Track every action taken across your account — who did what, when, and from where.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
            <Input
              className="w-full pl-9"
              placeholder="Search by actor, resource, or IP..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="h-10 rounded-md border border-slate-300 bg-white pl-9 pr-8 text-sm outline-none focus:border-violet focus:ring-2 focus:ring-violet/15"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <Button
            onClick={loadAuditLog}
            className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50"
          >
            <RefreshCw size={16} /> Refresh
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-slate-500">Loading audit log...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Resource</th>
                    <th className="px-4 py-3">IP Address</th>
                    <th className="px-4 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-ink">{entry.actor_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={entry.action.replace(/\./g, '_')} />
                        <div className="mt-0.5 text-xs text-slate-500">
                          {ACTION_LABELS[entry.action] || entry.action}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700">{entry.resource_type}</div>
                        {entry.resource_id && (
                          <div className="font-mono text-xs text-slate-400">{entry.resource_id}</div>
                        )}
                        {entry.details && Object.keys(entry.details).length > 0 && (
                          <div className="mt-1 text-xs text-slate-400">
                            {JSON.stringify(entry.details).slice(0, 60)}
                            {JSON.stringify(entry.details).length > 60 ? '...' : ''}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{entry.ip_address}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <div>{new Date(entry.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(entry.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!data || data.items.length === 0) && (
                    <tr>
                      <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                        No audit log entries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.total > limit && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                <p className="text-sm text-slate-500">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const start = Math.max(1, page - 2);
                    const pageNum = start + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                          pageNum === page
                            ? 'bg-violet text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
