import type { Components, Theme } from '@mui/material/styles';

/** Cards: white, 1px border, 12px corners, resting shadow. Header and footer get dividers. */
export const cardOverrides: Components<Theme> = {
  MuiPaper: {
    styleOverrides: {
      rounded: ({ theme }) => ({ borderRadius: theme.radius.lg }),
    },
  },
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${theme.vars.palette.border.default}`,
        boxShadow: theme.tokenShadows.xs,
      }),
    },
  },
  MuiCardHeader: {
    defaultProps: { slotProps: { title: { variant: 'title' }, subheader: { variant: 'body2' } } },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.vars.palette.border.subtle}`,
      }),
      subheader: ({ theme }) => ({ color: theme.vars.palette.text.secondary }),
      action: { margin: 0, alignSelf: 'center' },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: { padding: 16, '&:last-child': { paddingBottom: 16 } },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '10px 16px',
        gap: 8,
        justifyContent: 'flex-end',
        borderTop: `1px solid ${theme.vars.palette.border.subtle}`,
        '& > :not(style) ~ :not(style)': { marginLeft: 0 },
      }),
    },
  },
};
