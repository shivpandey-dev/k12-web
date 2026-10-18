import type { Components, Theme } from '@mui/material/styles';

const ROLES = ['primary', 'secondary', 'error', 'warning', 'success', 'info'] as const;

/**
 * 24px chips with 6px corners. Filled chips use the role's soft tint and dark text (status,
 * role tags); outlined chips are neutral filters.
 */
export const chipOverrides: Components<Theme> = {
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.label,
        height: 24,
        borderRadius: theme.radius.sm,
        '&.Mui-focusVisible': { boxShadow: theme.tokenShadows.focusRing },
        variants: [
          {
            props: { variant: 'filled', color: 'default' },
            style: {
              backgroundColor: theme.vars.palette.grey[100],
              color: theme.vars.palette.grey[700],
              '&.MuiChip-clickable:hover': { backgroundColor: theme.vars.palette.grey[200] },
            },
          },
          ...ROLES.map((role) => ({
            props: { variant: 'filled' as const, color: role },
            style: {
              backgroundColor: theme.vars.palette[role].soft,
              color: theme.vars.palette[role].onSoft,
              '&.MuiChip-clickable:hover': { backgroundColor: theme.vars.palette[role].soft },
            },
          })),
          {
            props: { variant: 'outlined', color: 'default' },
            style: {
              backgroundColor: theme.vars.palette.background.paper,
              borderColor: theme.vars.palette.border.strong,
              color: theme.vars.palette.grey[800],
              '&.MuiChip-clickable:hover': { backgroundColor: theme.vars.palette.grey[100] },
            },
          },
          {
            props: { variant: 'outlined', color: 'primary' },
            style: {
              backgroundColor: theme.vars.palette.primary.soft,
              borderColor: theme.vars.palette.grey[300],
              color: theme.vars.palette.primary.onSoft,
            },
          },
        ],
      }),
      sizeSmall: { height: 20, '& .MuiChip-label': { padding: '0 6px' } },
      label: { padding: '0 8px' },
      icon: { fontSize: 14, marginLeft: 6, marginRight: -2, color: 'inherit' },
      deleteIcon: {
        fontSize: 14,
        marginLeft: -2,
        marginRight: 6,
        color: 'inherit',
        opacity: 0.7,
        '&:hover': { color: 'inherit', opacity: 1 },
      },
    },
  },
};
