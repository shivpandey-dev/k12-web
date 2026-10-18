import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { ChartCard } from './chart-card';

describe('ChartCard', () => {
  it('switches between the chart and its table view', async () => {
    const { user } = renderWithTheme(
      <ChartCard title="Fee collected" table={<p>Table of fees</p>}>
        <p>Bar chart</p>
      </ChartCard>,
    );
    expect(screen.getByRole('region', { name: 'Fee collected' })).toBeInTheDocument();
    expect(screen.getByText('Bar chart')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Table view' }));
    expect(screen.getByText('Table of fees')).toBeInTheDocument();
    expect(screen.queryByText('Bar chart')).not.toBeInTheDocument();
  });
});
