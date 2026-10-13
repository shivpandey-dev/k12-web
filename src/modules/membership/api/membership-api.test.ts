import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { myMembership, page } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import { membershipApi } from './membership-api';

describe('membershipApi.listMineActive', () => {
  it('requests active memberships and follows every page', async () => {
    const seen: string[] = [];
    server.use(
      http.get('*/api/v1/auth/me/memberships', ({ request }) => {
        const url = new URL(request.url);
        seen.push(url.search);
        const pageNumber = Number(url.searchParams.get('page'));
        return HttpResponse.json(page([myMembership({ id: `m-${pageNumber}` })], pageNumber, 2));
      }),
    );

    const memberships = await membershipApi.listMineActive();

    expect(memberships.map((m) => m.id)).toEqual(['m-1', 'm-2']);
    expect(seen).toEqual(['?page=1&limit=100&status=ACTIVE', '?page=2&limit=100&status=ACTIVE']);
  });
});
