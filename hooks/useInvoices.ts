'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

/**
 * Loads the invoice list, optionally filtered by a query string.
 *
 * @param query - Optional search or filter query passed to the invoices API.
 * @returns An SWR response containing invoices, loading state, and errors.
 *
 * @example
 * const { data: invoices } = useInvoices('status=paid');
 */
export function useInvoices(query = '') {
  return useSWR(['invoices', query], () => api.invoices.list(query), { refreshInterval: 30_000 });
}
