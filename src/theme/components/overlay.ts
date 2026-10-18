import type { Components, Theme } from '@mui/material/styles';

/** Scrim colour: brand-900 at 45%. */
const SCRIM = 'rgba(35, 15, 53, 0.45)';

/**
 * Dialogs: 16px corners, modal shadow. Widths: `xs` 400 (confirm), `sm` 560 (form, default),
 * `md` 800 (wide form or preview). Drawers slide from the right for quick view/edit.
 */
export const overlayOverrides: Components<Theme> = {
  MuiBackdrop: {
    styleOverrides: {
      root: { variants: [{ props: { invisible: false }, style: { backgroundColor: SCRIM } }] },
    },
  },
  MuiDialog: {
    defaultProps: { maxWidth: 'sm', fullWidth: true },
    styleOverrides: {
      paper: ({ theme }) => ({
        margin: 16,
        borderRadius: theme.radius.xl,
        boxShadow: theme.tokenShadows.lg,
      }),
      paperWidthXs: { maxWidth: 400 },
      paperWidthSm: { maxWidth: 560 },
      paperWidthMd: { maxWidth: 800 },
      paperFullWidth: { width: 'calc(100% - 32px)' },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: ({ theme }) => ({ ...theme.typography.h3, padding: '16px 20px 8px' }),
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: { padding: '4px 20px 16px' },
    },
  },
  MuiDialogContentText: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body1,
        color: theme.vars.palette.text.secondary,
      }),
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '12px 20px',
        gap: 8,
        borderTop: `1px solid ${theme.vars.palette.border.subtle}`,
        '& > :not(style) ~ :not(style)': { marginLeft: 0 },
      }),
    },
  },
  MuiDrawer: {
    defaultProps: { anchor: 'right' },
    styleOverrides: {
      // Only temporary (modal) drawers float with rounded corners; docked ones (app sidebar)
      // stay flat.
      modal: ({ theme }) => ({
        '& .MuiDrawer-paper': {
          width: 'min(440px, 100vw)',
          border: 'none',
          boxShadow: theme.tokenShadows.lg,
        },
        '&.MuiDrawer-anchorRight .MuiDrawer-paper': {
          borderRadius: `${theme.radius.xl}px 0 0 ${theme.radius.xl}px`,
        },
        '&.MuiDrawer-anchorLeft .MuiDrawer-paper': {
          borderRadius: `0 ${theme.radius.xl}px ${theme.radius.xl}px 0`,
        },
      }),
    },
  },
  MuiSnackbar: {
    defaultProps: { anchorOrigin: { vertical: 'bottom', horizontal: 'left' } },
  },
};
