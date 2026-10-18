import type { Components, Theme } from '@mui/material/styles';

/**
 * Button hierarchy: `contained` = primary (one per screen), `outlined` = secondary (the default),
 * `text` = tertiary. Outlined buttons in the primary colour use neutral greys so the filled
 * primary stays the only strong accent; other colours (e.g. `error`) keep their own hue.
 */
export const buttonOverrides: Components<Theme> = {
  MuiButtonBase: {
    // Focus rings replace the ripple; ripples read as noise in dense screens.
    defaultProps: { disableRipple: true },
  },
  MuiButton: {
    defaultProps: { variant: 'outlined', disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        height: theme.sizes.controlHeight.medium,
        minWidth: 0,
        padding: '0 14px',
        borderRadius: theme.radius.md,
        whiteSpace: 'nowrap',
        '&.Mui-focusVisible': { boxShadow: theme.tokenShadows.focusRing },
        '& .MuiButton-startIcon': { marginLeft: -2, marginRight: 6 },
        '& .MuiButton-endIcon': { marginLeft: 6, marginRight: -2 },
        '& .MuiButton-icon > *:nth-of-type(1)': { fontSize: 18 },
        variants: [
          {
            props: { variant: 'outlined', color: 'primary' },
            style: {
              backgroundColor: theme.vars.palette.background.paper,
              borderColor: theme.vars.palette.border.strong,
              color: theme.vars.palette.grey[800],
              '&:hover': {
                backgroundColor: theme.vars.palette.grey[100],
                borderColor: theme.vars.palette.border.strong,
              },
            },
          },
          {
            props: { variant: 'outlined' },
            style: {
              '&.Mui-disabled': {
                borderColor: theme.vars.palette.border.default,
                backgroundColor: theme.vars.palette.action.disabledBackground,
              },
            },
          },
          { props: { variant: 'text' }, style: { padding: '0 10px' } },
        ],
      }),
      sizeSmall: ({ theme }) => ({
        height: theme.sizes.controlHeight.small,
        padding: '0 10px',
        borderRadius: theme.radius.sm,
        fontSize: theme.typography.pxToRem(13),
      }),
      sizeLarge: ({ theme }) => ({
        height: theme.sizes.controlHeight.large,
        padding: '0 18px',
        fontSize: theme.typography.pxToRem(14),
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 8,
        borderRadius: theme.radius.md,
        color: theme.vars.palette.grey[700],
        '& .MuiSvgIcon-root': { fontSize: 20 },
        '&:hover': { backgroundColor: theme.vars.palette.grey[100] },
        '&.Mui-focusVisible': { boxShadow: theme.tokenShadows.focusRing },
      }),
      sizeSmall: ({ theme }) => ({ padding: 4, borderRadius: theme.radius.sm }),
    },
  },
};
