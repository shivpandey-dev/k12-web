import { House, Receipt, Settings } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { filterNavigation, isNavItemActive, type NavGroup } from './navigation';

type Role = 'ADMIN' | 'PARENT';

const GROUPS: readonly NavGroup<Role>[] = [
  { id: 'home', items: [{ label: 'Dashboard', href: '/dashboard', icon: House }] },
  {
    id: 'finance',
    label: 'Finance',
    items: [{ label: 'Fees', href: '/fees', icon: Receipt }],
  },
  {
    id: 'school',
    label: 'School',
    items: [{ label: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN'] }],
  },
];

describe('filterNavigation', () => {
  it('keeps items without roles and items for the role', () => {
    const labels = filterNavigation(GROUPS, 'ADMIN').flatMap((g) => g.items.map((i) => i.label));
    expect(labels).toEqual(['Dashboard', 'Fees', 'Settings']);
  });

  it('drops groups that end up empty for the role', () => {
    expect(filterNavigation(GROUPS, 'PARENT').map((g) => g.id)).toEqual(['home', 'finance']);
  });
});

describe('isNavItemActive', () => {
  it('matches the page and pages below it, not similar prefixes', () => {
    expect(isNavItemActive('/students', '/students')).toBe(true);
    expect(isNavItemActive('/students', '/students/42')).toBe(true);
    expect(isNavItemActive('/students', '/students-import')).toBe(false);
    expect(isNavItemActive('/', '/fees')).toBe(false);
  });
});
