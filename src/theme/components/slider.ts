import type { Components, Theme } from '@mui/material/styles';

/** 4px track, 16px white thumb with an aubergine border. */
export const sliderOverrides: Components<Theme> = {
  MuiSlider: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 4,
        color: theme.vars.palette.primary.main,
        '&.Mui-disabled': { color: theme.vars.palette.grey[400] },
      }),
      rail: ({ theme }) => ({ backgroundColor: theme.vars.palette.grey[200], opacity: 1 }),
      track: { border: 'none' },
      thumb: ({ theme }) => ({
        width: 16,
        height: 16,
        backgroundColor: theme.vars.palette.background.paper,
        border: '2px solid currentColor',
        boxShadow: 'none',
        '&::before': { boxShadow: 'none' },
        '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: theme.tokenShadows.focusRing },
      }),
      valueLabel: ({ theme }) => ({
        ...theme.typography.caption,
        fontWeight: theme.typography.fontWeightMedium,
        padding: '2px 6px',
        borderRadius: theme.radius.sm,
        backgroundColor: theme.vars.palette.grey[900],
      }),
      mark: ({ theme }) => ({ backgroundColor: theme.vars.palette.grey[400] }),
      markLabel: ({ theme }) => ({
        ...theme.typography.caption,
        color: theme.vars.palette.text.secondary,
      }),
    },
  },
};
