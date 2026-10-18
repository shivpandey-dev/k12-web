import { screen, within } from '@testing-library/react';
import { House, Receipt } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { AppShell } from './app-shell';
import { MembershipSwitcher } from './membership-switcher';
import type { NavGroup } from './navigation';
import { PageHeader } from './page-header';
import { ProfileMenu } from './profile-menu';
import { SearchTrigger } from './search-trigger';
import { resetShellStoreForTests, shellStore } from './shell-store';

const NAV: readonly NavGroup[] = [
  { id: 'home', items: [{ label: 'Dashboard', href: '/dashboard', icon: House }] },
  { id: 'finance', label: 'Finance', items: [{ label: 'Fees', href: '/fees', icon: Receipt }] },
];

afterEach(() => {
  resetShellStoreForTests();
  localStorage.clear();
});

describe('AppShell', () => {
  it('marks the current page in the navigation', () => {
    renderWithTheme(
      <AppShell productName="KidzDiary" navigation={NAV} activeHref="/fees/12" topBar={null}>
        <p>Content</p>
      </AppShell>,
    );
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Fees' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('main')).toHaveTextContent('Content');
  });

  it('collapses to an icon rail and remembers it', async () => {
    const { user } = renderWithTheme(
      <AppShell productName="KidzDiary" navigation={NAV} activeHref="/dashboard" topBar={null}>
        <p>Content</p>
      </AppShell>,
    );
    await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));

    expect(screen.getByRole('button', { name: 'Expand navigation' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(shellStore.getState().isNavCollapsed).toBe(true);
    expect(localStorage.getItem('kidzdiary.app-shell')).toContain('"isNavCollapsed":true');
    // Labels move into accessible names and tooltips.
    expect(screen.getByRole('link', { name: 'Fees' })).toBeInTheDocument();
  });

  it('lets the caller handle navigation clicks', async () => {
    const onNavigate = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const { user } = renderWithTheme(
      <AppShell
        productName="KidzDiary"
        navigation={NAV}
        activeHref="/dashboard"
        topBar={null}
        onNavigate={onNavigate}
      >
        <p>Content</p>
      </AppShell>,
    );
    await user.click(screen.getByRole('link', { name: 'Fees' }));
    expect(onNavigate).toHaveBeenCalledWith(expect.anything(), '/fees');
  });
});

describe('top bar pieces', () => {
  it('switches membership from the menu', async () => {
    const onSelect = vi.fn();
    const { user } = renderWithTheme(
      <MembershipSwitcher
        memberships={[
          { id: 'a', schoolName: 'DPS Noida', roleLabel: 'Admin' },
          { id: 'b', schoolName: 'Green Valley', roleLabel: 'Teacher' },
        ]}
        activeId="a"
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Switch school or role/ }));
    await user.click(screen.getByRole('menuitem', { name: /Green Valley/ }));
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('shows a plain label when there is only one membership', () => {
    renderWithTheme(
      <MembershipSwitcher
        memberships={[{ id: 'a', schoolName: 'DPS Noida', roleLabel: 'Admin' }]}
        activeId="a"
        onSelect={vi.fn()}
      />,
    );
    const button = screen.getByRole('button', { name: 'DPS Noida · Admin' });
    expect(button).not.toHaveAttribute('aria-haspopup');
  });

  it('opens search with Ctrl+K', async () => {
    const onOpen = vi.fn();
    const { user } = renderWithTheme(<SearchTrigger onOpen={onOpen} />);
    await user.keyboard('{Control>}k{/Control}');
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('signs out from the profile menu', async () => {
    const onSignOut = vi.fn();
    const { user } = renderWithTheme(
      <ProfileMenu
        name="Shiv Pandey"
        onProfile={vi.fn()}
        onChangePassword={vi.fn()}
        onSignOut={onSignOut}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Account menu for Shiv Pandey' }));
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});

describe('PageHeader', () => {
  it('renders breadcrumbs, the page heading and actions', () => {
    renderWithTheme(
      <PageHeader
        title="Students"
        breadcrumbs={[{ label: 'Academics', href: '/academics' }, { label: 'Students' }]}
        actions={<button type="button">Add student</button>}
      />,
    );
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(crumbs).getByRole('link', { name: 'Academics' })).toHaveAttribute(
      'href',
      '/academics',
    );
    expect(within(crumbs).getByText('Students')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('heading', { level: 1, name: 'Students' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add student' })).toBeInTheDocument();
  });
});
