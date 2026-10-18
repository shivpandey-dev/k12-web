'use client';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import { X } from 'lucide-react';
import { useStore } from 'zustand';
import { toastStore, type ToastSeverity } from './toast-store';

const AUTO_HIDE_MS: Record<ToastSeverity, number> = {
  success: 5000,
  info: 5000,
  warning: 8000,
  error: 8000,
};

/** Renders the toast queue. Mount once, near the root of the app. */
export function Toaster() {
  const current = useStore(toastStore, (state) => state.queue[0]);
  const dismiss = useStore(toastStore, (state) => state.dismiss);

  if (!current) return null;

  const handleClose = (_event: unknown, reason?: SnackbarCloseReason) => {
    // Clicking elsewhere on the page shouldn't throw away a message the user hasn't read.
    if (reason === 'clickaway') return;
    dismiss(current.id);
  };

  const handleAction = () => {
    current.action?.onClick();
    dismiss(current.id);
  };

  return (
    <Snackbar
      key={current.id}
      open
      autoHideDuration={AUTO_HIDE_MS[current.severity]}
      onClose={handleClose}
    >
      <Alert
        variant="outlined"
        severity={current.severity}
        role={current.severity === 'error' ? 'alert' : 'status'}
        sx={{ minWidth: 280, maxWidth: 440 }}
        action={
          <>
            {current.action ? (
              <Button variant="text" size="small" onClick={handleAction}>
                {current.action.label}
              </Button>
            ) : null}
            <IconButton size="small" aria-label="Dismiss" onClick={() => dismiss(current.id)}>
              <X />
            </IconButton>
          </>
        }
      >
        {current.message}
      </Alert>
    </Snackbar>
  );
}
