import type { Components, Theme } from '@mui/material/styles';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

const ROLES = ['error', 'warning', 'success', 'info'] as const;

const ALERT_ICON_SIZE = 18;

/**
 * Alerts. `standard` (default) = inline banner in the role's soft tint. `outlined` = the toast
 * look: white card, coloured status icon, menu shadow.
 */
export const feedbackOverrides: Components<Theme> = {
  MuiAlert: {
    defaultProps: {
      iconMapping: {
        success: <CircleCheck size={ALERT_ICON_SIZE} />,
        info: <Info size={ALERT_ICON_SIZE} />,
        warning: <TriangleAlert size={ALERT_ICON_SIZE} />,
        error: <CircleAlert size={ALERT_ICON_SIZE} />,
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body1,
        alignItems: 'flex-start',
        padding: '8px 12px',
        borderRadius: theme.radius.md,
        variants: ROLES.flatMap((role) => [
          {
            props: { variant: 'standard' as const, severity: role },
            style: {
              backgroundColor: theme.vars.palette[role].soft,
              color: theme.vars.palette[role].onSoft,
              '& .MuiAlert-icon': { color: theme.vars.palette[role].onSoft },
            },
          },
          {
            props: { variant: 'outlined' as const, severity: role },
            style: {
              backgroundColor: theme.vars.palette.background.paper,
              borderColor: theme.vars.palette.border.default,
              color: theme.vars.palette.text.primary,
              boxShadow: theme.tokenShadows.md,
              '& .MuiAlert-icon': { color: theme.vars.palette[role].main },
            },
          },
        ]),
      }),
      icon: { marginRight: 8, padding: '1px 0', opacity: 1 },
      message: { padding: 0, minWidth: 0, overflow: 'visible' },
      action: { padding: 0, marginRight: -4, alignSelf: 'center' },
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.title,
        margin: 0,
        color: 'inherit',
      }),
    },
  },
};
