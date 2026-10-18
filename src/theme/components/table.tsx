import type { Components, Theme } from '@mui/material/styles';
import {
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

/**
 * Tables: compact 36px rows by default (`size="small"`), 48px with `size="medium"` for parent and
 * student screens. Rows are opaque so sticky columns can scroll underneath cleanly.
 */
export const tableOverrides: Components<Theme> = {
  MuiTable: {
    defaultProps: { size: 'small' },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.paper,
        '&.MuiTableRow-head': { backgroundColor: theme.vars.palette.grey[50] },
        '&.MuiTableRow-hover:hover': { backgroundColor: theme.vars.palette.grey[50] },
        '&.Mui-selected, &.Mui-selected:hover': {
          backgroundColor: theme.vars.palette.primary.soft,
        },
        '&:last-child > .MuiTableCell-body': { borderBottom: 0 },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body1,
        height: theme.sizes.rowHeight.comfortable,
        padding: '0 12px',
        borderBottom: `1px solid ${theme.vars.palette.border.subtle}`,
      }),
      sizeSmall: ({ theme }) => ({
        height: theme.sizes.rowHeight.compact,
        padding: '0 12px',
      }),
      head: ({ theme }) => ({
        ...theme.typography.label,
        height: theme.sizes.rowHeight.compact,
        whiteSpace: 'nowrap',
        color: theme.vars.palette.text.secondary,
        backgroundColor: theme.vars.palette.grey[50],
        borderBottom: `1px solid ${theme.vars.palette.border.default}`,
      }),
      stickyHeader: ({ theme }) => ({ backgroundColor: theme.vars.palette.grey[50] }),
      paddingCheckbox: { width: 44, padding: '0 4px 0 10px' },
    },
  },
  MuiTableSortLabel: {
    defaultProps: { IconComponent: ArrowUp },
    styleOverrides: {
      root: ({ theme }) => ({
        color: 'inherit',
        '&:hover': { color: theme.vars.palette.text.primary },
        '&.Mui-active': { color: theme.vars.palette.text.primary },
        '&.Mui-focusVisible': {
          boxShadow: theme.tokenShadows.focusRing,
          borderRadius: theme.radius.xs,
        },
      }),
      icon: ({ theme }) => ({
        width: 14,
        height: 14,
        margin: '0 0 0 4px',
        '.Mui-active &': { color: theme.vars.palette.primary.main },
      }),
    },
  },
  MuiTablePagination: {
    defaultProps: {
      rowsPerPageOptions: [10, 25, 50, 100],
      slots: {
        actions: {
          firstButtonIcon: ChevronsLeft,
          lastButtonIcon: ChevronsRight,
          nextButtonIcon: ChevronRight,
          previousButtonIcon: ChevronLeft,
        },
      },
      slotProps: { select: { IconComponent: ChevronDown } },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
        color: theme.vars.palette.text.secondary,
        borderTop: `1px solid ${theme.vars.palette.border.default}`,
      }),
      toolbar: { minHeight: 44, paddingLeft: 12, paddingRight: 4 },
      selectLabel: ({ theme }) => ({ ...theme.typography.body2 }),
      displayedRows: ({ theme }) => ({ ...theme.typography.body2 }),
      input: ({ theme }) => ({
        ...theme.typography.body2,
        marginRight: 16,
        '& .MuiSelect-icon': { width: 16, height: 16, top: 'calc(50% - 8px)' },
      }),
    },
  },
};
