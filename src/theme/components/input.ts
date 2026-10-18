import type { Components, Theme } from '@mui/material/styles';

/**
 * Text fields and selects: outlined only, label above the field (never floating), 36px tall.
 */
export const inputOverrides: Components<Theme> = {
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.label,
        color: theme.vars.palette.grey[700],
        '&.Mui-focused, &.Mui-error': { color: theme.vars.palette.grey[700] },
        '&.Mui-disabled': { color: theme.vars.palette.text.disabled },
      }),
      asterisk: ({ theme }) => ({ color: theme.vars.palette.error.main }),
    },
  },
  MuiInputLabel: {
    defaultProps: { shrink: true },
    styleOverrides: {
      root: {
        position: 'static',
        transform: 'none',
        maxWidth: '100%',
        marginBottom: 4,
      },
    },
  },
  MuiOutlinedInput: {
    defaultProps: { notched: false },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.paper,
        borderRadius: theme.radius.md,
        '& .MuiOutlinedInput-notchedOutline': {
          top: 0,
          borderColor: theme.vars.palette.border.strong,
          '& legend': { display: 'none' },
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.vars.palette.grey[400],
        },
        '&.Mui-focused': { boxShadow: theme.tokenShadows.focusRing },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.vars.palette.primary.main,
          borderWidth: 1,
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.vars.palette.error.main,
        },
        '&.Mui-error.Mui-focused': {
          boxShadow: `0 0 0 3px ${theme.vars.palette.error.soft}`,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.vars.palette.action.disabledBackground,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.vars.palette.border.default },
        },
      }),
      input: ({ theme }) => ({
        height: 20,
        padding: '8px 12px',
        '&::placeholder': { color: theme.vars.palette.text.disabled, opacity: 1 },
      }),
      sizeSmall: { '& .MuiOutlinedInput-input': { padding: '4px 10px' } },
      multiline: {
        padding: '8px 12px',
        '& .MuiOutlinedInput-input': { padding: 0, height: 'auto' },
      },
      adornedStart: { paddingLeft: 12 },
      adornedEnd: { paddingRight: 12 },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.vars.palette.grey[500],
        '& .MuiSvgIcon-root': { fontSize: 18 },
      }),
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.caption,
        margin: '4px 0 0',
        color: theme.vars.palette.text.secondary,
        '&.Mui-error': { color: theme.vars.palette.error.dark },
      }),
    },
  },
  MuiSelect: {
    styleOverrides: {
      // MUI's 1.4375em line-height and min-height make the select 0.1px taller than text fields.
      select: { minHeight: 20, lineHeight: '20px' },
      icon: ({ theme }) => ({ right: 8, color: theme.vars.palette.grey[500] }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        marginTop: 4,
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.vars.palette.border.subtle}`,
        boxShadow: theme.tokenShadows.md,
      }),
      list: { padding: 4 },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body1,
        minHeight: 32,
        padding: '6px 8px',
        borderRadius: theme.radius.sm,
        [theme.breakpoints.up('sm')]: { minHeight: 32 },
        '&:hover, &.Mui-focusVisible': { backgroundColor: theme.vars.palette.grey[100] },
        '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible': {
          backgroundColor: theme.vars.palette.primary.soft,
          color: theme.vars.palette.primary.onSoft,
          fontWeight: theme.typography.fontWeightMedium,
        },
      }),
    },
  },
};
