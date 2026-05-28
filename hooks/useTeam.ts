'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

/**
 * Loads the team member list, optionally filtered by a query string.
 *
 * @param query - Optional search or filter query passed to the team API.
 * @returns An SWR response containing team members, loading state, and errors.
 *
 * @example
 * const { data: members } = useTeamMembers('role=admin');
 */
export function useTeamMembers(query = '') {
  return useSWR(['team', query], () => api.team.list(query), { refreshInterval: 30_000 });
}

/**
 * Loads a single team member by id.
 *
 * @param id - Team member identifier to fetch from the API.
 * @returns An SWR response containing the team member record, loading state, and errors.
 *
 * @example
 * const { data: member } = useTeamMember(memberId);
 */
export function useTeamMember(id: string) {
  return useSWR(['team-member', id], () => api.team.get(id));
}
