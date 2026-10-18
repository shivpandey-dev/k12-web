'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import {
  useTable,
  type Column,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, type ReactNode } from 'react';
import { EmptyState } from '../empty-state';
import { dataTableFeatures, type DataTableColumn, type DataTableFeatures } from './features';

type Density = 'compact' | 'comfortable';

interface DataTableError {
  message: string;
  onRetry?: () => void;
}

export interface DataTableProps<TData extends RowData> {
  /** Accessible name for the table, e.g. "Students in Class 5-B". */
  label: string;
  columns: ReadonlyArray<DataTableColumn<TData>>;
  data: TData[];
  /** Stable row id, usually the API id. Required for selection to survive paging. */
  getRowId: (row: TData) => string;
  /** Server-side mode: sorting and paging happen in the API; pass the total row count. */
  rowCount?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  enableRowSelection?: boolean;
  /** Names a row for screen readers, e.g. the student's name. Defaults to "row N". */
  getRowLabel?: (row: TData) => string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /** Actions for the selected rows, shown in a bar above the table. */
  bulkActions?: (selectedRows: TData[]) => ReactNode;
  /** Search and filters, shown above the table. */
  toolbar?: ReactNode;
  isLoading?: boolean;
  error?: DataTableError | null;
  /** Shown when there are no rows. Defaults to a plain "No results" message. */
  emptyState?: ReactNode;
  density?: Density;
  /** Keeps the first data column visible while scrolling sideways on small screens. */
  stickyFirstColumn?: boolean;
  hidePagination?: boolean;
}

const SELECT_COLUMN_ID = '__select';
const SELECT_COLUMN_WIDTH = 44;
const SKELETON_ROWS = 5;
const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 25 };

function selectionColumn<TData extends RowData>(
  getRowLabel?: (row: TData) => string,
): DataTableColumn<TData> {
  return {
    id: SELECT_COLUMN_ID,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        slotProps={{ input: { 'aria-label': 'Select all rows on this page' } }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        slotProps={{
          input: {
            'aria-label': `Select ${getRowLabel ? getRowLabel(row.original) : `row ${row.index + 1}`}`,
          },
        }}
      />
    ),
  };
}

const sortDirectionLabel = { asc: 'ascending', desc: 'descending' } as const;

function stickySx(left: number) {
  return { position: 'sticky', left, zIndex: 1, backgroundColor: 'inherit' } as const;
}

/**
 * The app's data table: TanStack Table for state, MUI Table for markup. Handles sorting, paging,
 * row selection with bulk actions, and the loading, error and empty states.
 */
export function DataTable<TData extends RowData>({
  label,
  columns,
  data,
  getRowId,
  rowCount,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  enableRowSelection = false,
  getRowLabel,
  rowSelection,
  onRowSelectionChange,
  bulkActions,
  toolbar,
  isLoading = false,
  error = null,
  emptyState,
  density = 'compact',
  stickyFirstColumn = true,
  hidePagination = false,
}: DataTableProps<TData>) {
  const isManual = rowCount !== undefined;

  const allColumns = useMemo(
    () => (enableRowSelection ? [selectionColumn<TData>(getRowLabel), ...columns] : [...columns]),
    [columns, enableRowSelection, getRowLabel],
  );

  const table = useTable({
    features: dataTableFeatures,
    columns: allColumns,
    data,
    getRowId,
    enableRowSelection,
    manualSorting: isManual,
    manualPagination: isManual,
    rowCount,
    initialState: { pagination: DEFAULT_PAGINATION },
    state: {
      ...(sorting ? { sorting } : {}),
      ...(pagination ? { pagination } : {}),
      ...(rowSelection ? { rowSelection } : {}),
    },
    ...(onSortingChange ? { onSortingChange } : {}),
    ...(onPaginationChange ? { onPaginationChange } : {}),
    ...(onRowSelectionChange ? { onRowSelectionChange } : {}),
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getAllLeafColumns();
  const columnCount = visibleColumns.length;

  const firstDataColumnId = visibleColumns.find((column) => column.id !== SELECT_COLUMN_ID)?.id;
  const stickyLeft = enableRowSelection ? SELECT_COLUMN_WIDTH : 0;

  const cellSx = (column: Column<DataTableFeatures, TData>) => {
    const meta = column.columnDef.meta;
    if (column.id === SELECT_COLUMN_ID) {
      return { width: SELECT_COLUMN_WIDTH, ...(stickyFirstColumn ? stickySx(0) : {}) };
    }
    return {
      textAlign: meta?.align ?? 'left',
      ...(meta?.width !== undefined ? { width: meta.width } : {}),
      ...(stickyFirstColumn && column.id === firstDataColumnId ? stickySx(stickyLeft) : {}),
    };
  };

  const renderBody = () => {
    if (isLoading) {
      return Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
        <TableRow key={`skeleton-${rowIndex}`}>
          {visibleColumns.map((column) => (
            <TableCell key={column.id} sx={cellSx(column)}>
              <Skeleton variant="text" width={column.id === SELECT_COLUMN_ID ? 16 : '70%'} />
            </TableCell>
          ))}
        </TableRow>
      ));
    }
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={columnCount} sx={{ py: 4 }}>
            <Alert
              severity="error"
              action={
                error.onRetry ? (
                  <Button variant="text" size="small" color="inherit" onClick={error.onRetry}>
                    Retry
                  </Button>
                ) : undefined
              }
            >
              {error.message}
            </Alert>
          </TableCell>
        </TableRow>
      );
    }
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columnCount} sx={{ height: 'auto' }}>
            {emptyState ?? (
              <EmptyState
                title="No results"
                description="Try changing the search or filters."
                headingComponent="h3"
              />
            )}
          </TableCell>
        </TableRow>
      );
    }
    return rows.map((row: Row<DataTableFeatures, TData>) => (
      <TableRow key={row.id} hover selected={row.getIsSelected()}>
        {row.getAllCells().map((cell) => (
          <TableCell
            key={cell.id}
            sx={cellSx(cell.column)}
            padding={cell.column.id === SELECT_COLUMN_ID ? 'checkbox' : 'normal'}
          >
            <table.FlexRender cell={cell} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Box>
      {toolbar ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 2.5,
            borderBottom: 1,
            borderColor: 'border.subtle',
          }}
        >
          {toolbar}
        </Box>
      ) : null}
      {selectedRows.length > 0 ? (
        <Box
          role="region"
          aria-label="Bulk actions"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 1,
            bgcolor: 'primary.soft',
            color: 'primary.onSoft',
          }}
        >
          <Typography variant="label" sx={{ color: 'inherit' }}>
            {`${selectedRows.length} selected`}
          </Typography>
          {bulkActions?.(selectedRows)}
          <Button variant="text" size="small" onClick={() => table.resetRowSelection(true)}>
            Clear
          </Button>
        </Box>
      ) : null}
      <TableContainer>
        <Table
          size={density === 'compact' ? 'small' : 'medium'}
          aria-label={label}
          aria-busy={isLoading}
        >
          <TableHead>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const { column } = header;
                  const sorted = column.getIsSorted();
                  const isSelect = column.id === SELECT_COLUMN_ID;
                  return (
                    <TableCell
                      key={header.id}
                      sx={cellSx(column)}
                      padding={isSelect ? 'checkbox' : 'normal'}
                      aria-sort={sorted ? sortDirectionLabel[sorted] : undefined}
                    >
                      {header.isPlaceholder ? null : column.getCanSort() ? (
                        <TableSortLabel
                          active={sorted !== false}
                          direction={sorted || 'asc'}
                          onClick={column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                        </TableSortLabel>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>{renderBody()}</TableBody>
        </Table>
      </TableContainer>
      {hidePagination ? null : (
        <TablePagination
          component="div"
          count={table.getRowCount()}
          page={pageIndex}
          rowsPerPage={pageSize}
          onPageChange={(_event, page) => table.setPageIndex(page)}
          onRowsPerPageChange={(event) => table.setPageSize(Number(event.target.value))}
        />
      )}
    </Box>
  );
}
