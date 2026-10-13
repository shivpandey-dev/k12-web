import { describe, expect, it } from 'vitest';
import { myMembership } from '@/test/msw/fixtures';
import { resolveActiveMembership } from './active-membership';

const teacher = myMembership({ id: 'm-teacher', role: 'TEACHER' });
const parent = myMembership({ id: 'm-parent', role: 'PARENT' });

describe('resolveActiveMembership', () => {
  it('reports none when the user has no memberships', () => {
    expect(resolveActiveMembership([], null)).toEqual({ status: 'none' });
  });

  it('selects the only membership automatically', () => {
    expect(resolveActiveMembership([teacher], null)).toEqual({
      status: 'active',
      membership: teacher,
    });
  });

  it('uses the remembered membership when it is still valid', () => {
    expect(resolveActiveMembership([teacher, parent], 'm-parent')).toEqual({
      status: 'active',
      membership: parent,
    });
  });

  it('asks the user to choose when several exist and none is remembered', () => {
    expect(resolveActiveMembership([teacher, parent], null)).toEqual({
      status: 'needs-selection',
    });
  });

  it('ignores a remembered membership that no longer exists', () => {
    expect(resolveActiveMembership([teacher, parent], 'm-revoked')).toEqual({
      status: 'needs-selection',
    });
    expect(resolveActiveMembership([teacher], 'm-revoked')).toEqual({
      status: 'active',
      membership: teacher,
    });
  });
});
