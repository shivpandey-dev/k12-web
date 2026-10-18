import type { Components, Theme } from '@mui/material/styles';

/**
 * `Tabs` = page-level underline tabs. `ToggleButtonGroup` = segmented control for switching a
 * view (day / week / month).
 */
export const tabsOverrides: Components<Theme> = {
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 36,
        borderBottom: `1px solid ${theme.vars.palette.border.default}`,
      }),
      list: { gap: 20 },
      indicator: ({ theme }) => ({ height: 2, backgroundColor: theme.vars.palette.primary.main }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body1,
        fontWeight: theme.typography.fontWeightMedium,
        minHeight: 36,
        minWidth: 0,
        padding: '8px 0',
        textTransform: 'none',
        color: theme.vars.palette.text.secondary,
        '&:hover': { color: theme.vars.palette.text.primary },
        '&.Mui-selected': { color: theme.vars.palette.primary.main },
        '&.Mui-focusVisible': {
          boxShadow: theme.tokenShadows.focusRing,
          borderRadius: theme.radius.xs,
        },
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        gap: 2,
        padding: 3,
        borderRadius: theme.radius.md,
        backgroundColor: theme.vars.palette.grey[100],
      }),
      grouped: ({ theme }) => ({
        margin: 0,
        border: 0,
        // MUI's grouped first/last-child radius rules are more specific than this slot.
        borderRadius: `${theme.radius.sm}px !important`,
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
        fontWeight: theme.typography.fontWeightMedium,
        height: 28,
        padding: '0 10px',
        border: 0,
        textTransform: 'none',
        color: theme.vars.palette.text.secondary,
        '&:hover': { backgroundColor: 'transparent', color: theme.vars.palette.text.primary },
        '&.Mui-selected, &.Mui-selected:hover': {
          backgroundColor: theme.vars.palette.background.paper,
          color: theme.vars.palette.text.primary,
          boxShadow: theme.tokenShadows.sm,
        },
        '&.Mui-focusVisible': { boxShadow: theme.tokenShadows.focusRing },
      }),
    },
  },
};
