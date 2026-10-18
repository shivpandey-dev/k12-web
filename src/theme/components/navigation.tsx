import type { Components, Theme } from '@mui/material/styles';
import { ChevronRight } from 'lucide-react';

/** Breadcrumbs, tooltips, avatars and badges used by the app shell. */
export const navigationOverrides: Components<Theme> = {
  MuiBreadcrumbs: {
    defaultProps: { separator: <ChevronRight size={14} aria-hidden /> },
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
        color: theme.vars.palette.text.secondary,
      }),
      separator: ({ theme }) => ({
        marginLeft: 4,
        marginRight: 4,
        color: theme.vars.palette.grey[400],
      }),
      li: ({ theme }) => ({
        '& a': {
          color: 'inherit',
          textDecoration: 'none',
          borderRadius: theme.radius.xs,
          '&:hover': { color: theme.vars.palette.text.primary, textDecoration: 'underline' },
          '&:focus-visible': { outline: 'none', boxShadow: theme.tokenShadows.focusRing },
        },
      }),
    },
  },
  MuiTooltip: {
    defaultProps: { arrow: false, enterDelay: 400 },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        ...theme.typography.caption,
        fontWeight: theme.typography.fontWeightMedium,
        padding: '4px 8px',
        borderRadius: theme.radius.sm,
        backgroundColor: theme.vars.palette.grey[900],
      }),
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.label,
        width: 28,
        height: 28,
        variants: [
          {
            props: { variant: 'circular' },
            style: {
              backgroundColor: theme.vars.palette.secondary.soft,
              color: theme.vars.palette.secondary.onSoft,
            },
          },
        ],
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: ({ theme }) => ({ minWidth: 28, color: theme.vars.palette.grey[600] }),
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: ({ theme }) => ({ ...theme.typography.body1 }),
      secondary: ({ theme }) => ({
        ...theme.typography.body2,
        color: theme.vars.palette.text.secondary,
      }),
    },
  },
  MuiBadge: {
    styleOverrides: {
      dot: ({ theme }) => ({
        minWidth: 8,
        height: 8,
        boxShadow: `0 0 0 2px ${theme.vars.palette.background.paper}`,
      }),
    },
  },
};
