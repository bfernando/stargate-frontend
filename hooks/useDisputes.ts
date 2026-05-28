'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

/**
 * Loads the dispute list, optionally filtered by a query string.
 *
 * @param query - Optional search or filter query passed to the disputes API.
 * @returns An SWR response containing the dispute list, loading state, and errors.
 *
 * @example
 * const { data, isLoading } = useDisputes('status=open');
 */
export function useDisputes(query = '') {
  return useSWR(['disputes', query], () => api.disputes.list(query), { refreshInterval: 30_000 });
}

/**
 * Loads a single dispute by id.
 *
 * @param id - Dispute identifier to fetch from the API.
 * @returns An SWR response containing the dispute record, loading state, and errors.
 *
 * @example
 * const { data: dispute } = useDispute(disputeId);
 */
export function useDispute(id: string) {
  return useSWR(['dispute', id], () => api.disputes.get(id), { refreshInterval: 10_000 });
}

/**
 * Loads and refreshes the timeline events for a dispute.
 *
 * @param id - Dispute identifier whose timeline should be fetched.
 * @returns An SWR response containing timeline events, loading state, and errors.
 *
 * @example
 * const { data: timeline } = useDisputeTimeline(disputeId);
 */
export function useDisputeTimeline(id: string) {
  return useSWR(['dispute-timeline', id], () => api.disputes.timeline(id), { refreshInterval: 10_000 });
}
