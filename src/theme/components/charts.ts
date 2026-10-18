import type { Components, Theme } from '@mui/material/styles';
import { chartSeries } from '../tokens';

/**
 * MUI X Charts: validated series colours in fixed order, quiet axes and grid, 4px rounded bar
 * ends, and tooltips styled like menus.
 */
export const chartOverrides: Components<Theme> = {
  MuiChartsDataProvider: {
    defaultProps: { colors: [...chartSeries] },
  },
  MuiBarChart: {
    defaultProps: { borderRadius: 4 },
  },
  MuiChartsXAxis: {
    defaultProps: { disableTicks: true },
  },
  MuiChartsYAxis: {
    defaultProps: { disableLine: true, disableTicks: true },
  },
  MuiChartsAxis: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiChartsAxis-line': { stroke: theme.vars.palette.border.strong },
        '& .MuiChartsAxis-tickLabel': { fill: theme.vars.palette.text.secondary },
        '& .MuiChartsAxis-label': { fill: theme.vars.palette.text.secondary },
      }),
    },
  },
  MuiChartsGrid: {
    styleOverrides: {
      line: ({ theme }) => ({ stroke: theme.vars.palette.border.subtle }),
    },
  },
  MuiChartsTooltip: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.vars.palette.border.default}`,
        boxShadow: theme.tokenShadows.md,
      }),
      cell: ({ theme }) => ({
        ...theme.typography.body2,
        '&.MuiChartsTooltip-labelCell': { color: theme.vars.palette.text.secondary },
        '&.MuiChartsTooltip-valueCell': { fontWeight: theme.typography.fontWeightMedium },
      }),
    },
  },
  MuiChartsLegend: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiChartsLegend-label': {
          ...theme.typography.body2,
          color: theme.vars.palette.grey[700],
        },
      }),
    },
  },
};
