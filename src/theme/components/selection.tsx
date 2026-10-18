import type { Components, Theme } from '@mui/material/styles';

/** Class names for the custom 16px checkbox and radio marks, styled below. */
const CHECKBOX_BOX = 'kd-checkbox-box';
const RADIO_DOT = 'kd-radio-dot';

const checkMark = (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
    <path
      d="M3.5 8.5l3 3 6-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const dashMark = (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
    <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Checkbox, radio, switch and their labels. */
export const selectionOverrides: Components<Theme> = {
  MuiCheckbox: {
    defaultProps: {
      icon: <span className={CHECKBOX_BOX} />,
      checkedIcon: <span className={CHECKBOX_BOX}>{checkMark}</span>,
      indeterminateIcon: <span className={CHECKBOX_BOX}>{dashMark}</span>,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 6,
        '&:hover': { backgroundColor: 'transparent' },
        [`& .${CHECKBOX_BOX}`]: {
          width: 16,
          height: 16,
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.radius.xs,
          border: `1.5px solid ${theme.vars.palette.grey[400]}`,
          backgroundColor: theme.vars.palette.background.paper,
          color: theme.vars.palette.primary.contrastText,
        },
        [`&:hover .${CHECKBOX_BOX}`]: { borderColor: theme.vars.palette.primary.main },
        [`&.Mui-checked .${CHECKBOX_BOX}, &.MuiCheckbox-indeterminate .${CHECKBOX_BOX}`]: {
          backgroundColor: theme.vars.palette.primary.main,
          borderColor: theme.vars.palette.primary.main,
        },
        [`&.Mui-focusVisible .${CHECKBOX_BOX}`]: { boxShadow: theme.tokenShadows.focusRing },
        [`&.Mui-disabled .${CHECKBOX_BOX}`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
          borderColor: theme.vars.palette.border.default,
        },
        [`&.Mui-disabled.Mui-checked .${CHECKBOX_BOX}`]: {
          backgroundColor: theme.vars.palette.grey[300],
          borderColor: theme.vars.palette.grey[300],
        },
      }),
    },
  },
  MuiRadio: {
    defaultProps: {
      icon: <span className={RADIO_DOT} />,
      checkedIcon: <span className={RADIO_DOT} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 6,
        '&:hover': { backgroundColor: 'transparent' },
        [`& .${RADIO_DOT}`]: {
          width: 16,
          height: 16,
          boxSizing: 'border-box',
          display: 'inline-block',
          borderRadius: '50%',
          border: `1.5px solid ${theme.vars.palette.grey[400]}`,
          backgroundColor: theme.vars.palette.background.paper,
        },
        [`&:hover .${RADIO_DOT}`]: { borderColor: theme.vars.palette.primary.main },
        [`&.Mui-checked .${RADIO_DOT}`]: {
          border: `5px solid ${theme.vars.palette.primary.main}`,
        },
        [`&.Mui-focusVisible .${RADIO_DOT}`]: { boxShadow: theme.tokenShadows.focusRing },
        [`&.Mui-disabled .${RADIO_DOT}`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
          borderColor: theme.vars.palette.border.default,
        },
        [`&.Mui-disabled.Mui-checked .${RADIO_DOT}`]: {
          borderColor: theme.vars.palette.grey[300],
        },
      }),
    },
  },
  MuiSwitch: {
    styleOverrides: {
      // Compact 32×18 switch with the thumb inside the track. The 6px margin matches the
      // checkbox and radio hit area so labels line up.
      root: {
        width: 32,
        height: 18,
        padding: 0,
        margin: 6,
        overflow: 'visible',
      },
      switchBase: ({ theme }) => ({
        padding: 2,
        '&:hover': { backgroundColor: 'transparent' },
        '&.Mui-checked': {
          transform: 'translateX(14px)',
          color: theme.vars.palette.common.white,
          '&:hover': { backgroundColor: 'transparent' },
          '& + .MuiSwitch-track': {
            backgroundColor: theme.vars.palette.primary.main,
            opacity: 1,
          },
        },
        '&.Mui-focusVisible + .MuiSwitch-track': { boxShadow: theme.tokenShadows.focusRing },
        '&.Mui-disabled': { color: theme.vars.palette.grey[100] },
        '&.Mui-disabled + .MuiSwitch-track': { opacity: 0.5 },
      }),
      thumb: { width: 14, height: 14, boxShadow: 'none' },
      track: ({ theme }) => ({
        borderRadius: 9,
        backgroundColor: theme.vars.palette.grey[400],
        opacity: 1,
      }),
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      // Offsets the 6px hit area so the control lines up with text above it.
      root: { marginLeft: -6, marginRight: 16 },
      label: ({ theme }) => ({
        ...theme.typography.body1,
        '&.Mui-disabled': { color: theme.vars.palette.text.disabled },
      }),
    },
  },
};
