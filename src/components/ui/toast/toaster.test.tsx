import { act, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { resetToastStoreForTests, toast, toastStore } from './toast-store';
import { Toaster } from './toaster';

afterEach(() => resetToastStoreForTests());

describe('toasts', () => {
  it('shows one toast at a time, then the next after dismissal', async () => {
    const { user } = renderWithTheme(<Toaster />);
    act(() => {
      toast.success('Fee recorded');
      toast.info('Report ready');
    });

    expect(screen.getByRole('status')).toHaveTextContent('Fee recorded');
    expect(screen.queryByText('Report ready')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.getByRole('status')).toHaveTextContent('Report ready');
  });

  it('runs the action and closes the toast', async () => {
    const onUndo = vi.fn();
    const { user } = renderWithTheme(<Toaster />);
    act(() => {
      toast.success('Fee record deleted', { action: { label: 'Undo', onClick: onUndo } });
    });

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledOnce();
    expect(screen.queryByText('Fee record deleted')).not.toBeInTheDocument();
  });

  it('announces errors assertively', () => {
    renderWithTheme(<Toaster />);
    act(() => {
      toast.error("Couldn't send SMS");
    });
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't send SMS");
  });

  it('hides a toast automatically after its timeout', () => {
    vi.useFakeTimers();
    try {
      renderWithTheme(<Toaster />);
      act(() => {
        toast.success('Saved');
      });
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(toastStore.getState().queue).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
