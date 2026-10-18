import Button from '@mui/material/Button';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { DataTable } from './data-table';
import { createDataTableColumns } from './features';

interface Student {
  id: string;
  name: string;
  due: number;
}

const STUDENTS: Student[] = Array.from({ length: 30 }, (_, index) => ({
  id: `s${index + 1}`,
  name: `Student ${String(index + 1).padStart(2, '0')}`,
  due: (index % 7) * 1000,
}));

const helper = createDataTableColumns<Student>();
const COLUMNS = helper.columns([
  helper.accessor('name', { header: 'Name' }),
  helper.accessor('due', { header: 'Due', meta: { align: 'right' } }),
]);

const getRowId = (row: Student) => row.id;

const bodyRows = () =>
  within(screen.getAllByRole('rowgroup')[1] as HTMLElement).getAllByRole('row');

describe('DataTable', () => {
  it('pages client-side data, 25 rows at a time', async () => {
    const { user } = renderWithTheme(
      <DataTable label="Students" columns={COLUMNS} data={STUDENTS} getRowId={getRowId} />,
    );
    expect(screen.getByRole('table', { name: 'Students' })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(25);
    expect(screen.getByText('1–25 of 30')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(bodyRows()).toHaveLength(5);
  });

  it('sorts by a column and reports the direction', async () => {
    const { user } = renderWithTheme(
      <DataTable label="Students" columns={COLUMNS} data={STUDENTS} getRowId={getRowId} />,
    );
    await user.click(screen.getByRole('button', { name: 'Name' }));
    await user.click(screen.getByRole('button', { name: 'Name' }));

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(bodyRows()[0]).toHaveTextContent('Student 30');
  });

  it('selects rows and shows bulk actions for them', async () => {
    const onRemind = vi.fn();
    const { user } = renderWithTheme(
      <DataTable
        label="Students"
        columns={COLUMNS}
        data={STUDENTS}
        getRowId={getRowId}
        enableRowSelection
        getRowLabel={(row) => row.name}
        bulkActions={(selected) => (
          <Button onClick={() => onRemind(selected.map((s) => s.id))}>Remind</Button>
        )}
      />,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Select Student 01' }));
    await user.click(screen.getByRole('checkbox', { name: 'Select Student 02' }));

    const bar = screen.getByRole('region', { name: 'Bulk actions' });
    expect(bar).toHaveTextContent('2 selected');
    await user.click(within(bar).getByRole('button', { name: 'Remind' }));
    expect(onRemind).toHaveBeenCalledWith(['s1', 's2']);

    await user.click(within(bar).getByRole('button', { name: 'Clear' }));
    expect(screen.queryByRole('region', { name: 'Bulk actions' })).not.toBeInTheDocument();
  });

  it('uses the server total and reports page changes in server mode', async () => {
    const onPaginationChange = vi.fn();
    const { user } = renderWithTheme(
      <DataTable
        label="Students"
        columns={COLUMNS}
        data={STUDENTS.slice(0, 25)}
        getRowId={getRowId}
        rowCount={132}
        pagination={{ pageIndex: 0, pageSize: 25 }}
        onPaginationChange={onPaginationChange}
      />,
    );
    expect(screen.getByText('1–25 of 132')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onPaginationChange).toHaveBeenCalled();
  });

  it('renders loading, error and empty states', async () => {
    const onRetry = vi.fn();
    const { rerender, user } = renderWithTheme(
      <DataTable
        label="Students"
        columns={COLUMNS}
        data={STUDENTS}
        getRowId={getRowId}
        isLoading
      />,
    );
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Student 01')).not.toBeInTheDocument();

    rerender(
      <DataTable
        label="Students"
        columns={COLUMNS}
        data={STUDENTS}
        getRowId={getRowId}
        error={{ message: "Couldn't load students.", onRetry }}
      />,
    );
    expect(screen.getByText("Couldn't load students.")).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();

    rerender(<DataTable label="Students" columns={COLUMNS} data={[]} getRowId={getRowId} />);
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
  });
});
