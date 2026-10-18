import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface DialogHeaderProps {
  /** Pass the same id to the Dialog's `aria-labelledby`. */
  id: string;
  children: ReactNode;
  onClose: () => void;
  closeLabel?: string;
}

/** Dialog title with a close button on the right. */
export function DialogHeader({ id, children, onClose, closeLabel = 'Close' }: DialogHeaderProps) {
  return (
    <DialogTitle
      id={id}
      sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}
    >
      {children}
      <IconButton size="small" aria-label={closeLabel} onClick={onClose} sx={{ mr: -1, mt: -0.5 }}>
        <X />
      </IconButton>
    </DialogTitle>
  );
}
