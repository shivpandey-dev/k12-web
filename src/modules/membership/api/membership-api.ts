import { api, unwrap, type Schema } from '@/lib/api';

export type MyMembership = Schema<'MyMembershipResponseDto'>;
export type MembershipRole = MyMembership['role'];

/** k12-api caps page size at 100. */
const PAGE_LIMIT = 100;
/** Safety stop; a user with more memberships than this is a data problem, not a UI case. */
const MAX_PAGES = 10;

export const membershipApi = {
  /** All ACTIVE memberships of the signed-in user, across pages. */
  async listMineActive(signal?: AbortSignal): Promise<MyMembership[]> {
    const memberships: MyMembership[] = [];
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const result = await unwrap(
        api.GET('/api/v1/auth/me/memberships', {
          params: { query: { page, limit: PAGE_LIMIT, status: 'ACTIVE' } },
          signal,
        }),
      );
      memberships.push(...result.data);
      if (page >= result.meta.totalPages) break;
    }
    return memberships;
  },
};
