import Button from '@mui/material/Button';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { DialogHeader } from './dialog-header';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders the heading, description and action', () => {
    renderWithTheme(
      <EmptyState
        title="Add your first student"
        description="Students you add appear here."
        action={<Button>Add student</Button>}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Add your first student' })).toBeVisible();
    expect(screen.getByText('Students you add appear here.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add student' })).toBeVisible();
  });
});

describe('DialogHeader', () => {
  it('labels the close button and calls onClose', async () => {
    const onClose = vi.fn();
    const { user } = renderWithTheme(
      <DialogHeader id="title" onClose={onClose}>
        Delete fee record?
      </DialogHeader>,
    );
    expect(screen.getByRole('heading', { name: 'Delete fee record?' })).toHaveAttribute(
      'id',
      'title',
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
