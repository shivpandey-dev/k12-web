import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type CellData,
  type ColumnDef,
  type RowData,
  type TableFeatures,
} from '@tanstack/react-table';

/** Every DataTable registers the same features: sorting, pagination and row selection. */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  // v9 only bundles the sort functions you register; these cover auto-detected text, numbers
  // and dates.
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumn<TData extends RowData, TValue extends CellData = CellData> = ColumnDef<
  DataTableFeatures,
  TData,
  TValue
>;

/** Column helper bound to the DataTable features. Define columns at module scope. */
export const createDataTableColumns = <TData extends RowData>() =>
  createColumnHelper<DataTableFeatures, TData>();

declare module '@tanstack/table-core' {
  // The type parameters must match the original declaration for the interfaces to merge.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData,
  > {
    /** Right-align numbers and amounts. */
    align?: 'left' | 'center' | 'right';
    /** Fixed column width, e.g. 120 or '20%'. */
    width?: number | string;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
