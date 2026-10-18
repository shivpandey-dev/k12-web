import type { LucideIcon } from 'lucide-react';

export interface NavItem<TRole extends string = string> {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Roles that see this item. Omit to show it to everyone. UX only; the API enforces access. */
  roles?: readonly TRole[];
}

export interface NavGroup<TRole extends string = string> {
  id: string;
  /** Group heading, e.g. "Finance". Omit for the top group (Dashboard). */
  label?: string;
  items: readonly NavItem<TRole>[];
}

/** Keeps only the items the role may see, and drops groups that end up empty. */
export function filterNavigation<TRole extends string>(
  groups: readonly NavGroup<TRole>[],
  role: TRole,
): NavGroup<TRole>[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}

/** True for the item's own page and anything below it (`/students/42` matches `/students`). */
export function isNavItemActive(href: string, activeHref: string): boolean {
  if (href === '/') return activeHref === '/';
  return activeHref === href || activeHref.startsWith(`${href}/`);
}
