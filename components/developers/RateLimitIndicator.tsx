'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';

interface RateLimitStatus {
  used: number;
  limit: number;
  reset_at: string; // ISO-8601 timestamp
}

function formatResetTime(isoString: string): string {
  const resetDate = new Date(isoString);
  const now = new Date();
  const diffMs = resetDate.getTime() - now.getTime();

  if (diffMs <= 0) return 'resetting now';

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffHours > 0) {
    const remainingMins = diffMins % 60;
    return remainingMins > 0
      ? `in ${diffHours}h ${remainingMins}m`
      : `in ${diffHours}h`;
  }
  if (diffMins > 0) return `in ${diffMins}m`;
  return `in ${diffSecs}s`;
}

function getBarColor(pct: number): string {
  if (pct >= 90) return 'bg-coral';
  if (pct >= 70) return 'bg-amberline';
  return 'bg-violet';
}

export function RateLimitIndicator() {
  const { data, error, isLoading } = useSWR<RateLimitStatus>(
    'rate-limit',
    () => api.developers.rateLimit(),
    { refreshInterval: 30_000 },
  );

  if (isLoading) {
    return (
      <Card className="space-y-3">
        <h2 className="font-semibold text-ink">API Rate Limit</h2>
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
        <p className="text-xs text-slate-400">Loading usage…</p>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="space-y-3">
        <h2 className="font-semibold text-ink">API Rate Limit</h2>
        <p className="text-xs text-slate-500">Unable to load rate limit data.</p>
      </Card>
    );
  }

  const pct = data.limit > 0 ? Math.min(Math.round((data.used / data.limit) * 100), 100) : 0;
  const barColor = getBarColor(pct);
  const resetLabel = formatResetTime(data.reset_at);

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ink">API Rate Limit</h2>
        <span className="text-xs text-slate-500">Resets {resetLabel}</span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={data.used}
        aria-valuemin={0}
        aria-valuemax={data.limit}
        aria-label={`API usage: ${data.used} of ${data.limit} requests used`}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          <span className="font-medium text-ink">{data.used.toLocaleString()}</span>
          {' / '}
          {data.limit.toLocaleString()} requests used
        </span>
        <span className={pct >= 90 ? 'font-semibold text-coral' : pct >= 70 ? 'font-semibold text-amberline' : ''}>
          {pct}%
        </span>
      </div>

      {pct >= 90 && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          You are approaching your rate limit. Requests may be throttled soon.
        </p>
      )}
    </Card>
  );
}
