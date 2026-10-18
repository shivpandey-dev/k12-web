'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { DialogHeader, toast } from '@/components/ui';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

const CONFIRM_TITLE_ID = 'preview-confirm-title';
const DRAWER_TITLE_ID = 'preview-drawer-title';

export function OverlaySamples() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDelete = () => {
    setIsConfirmOpen(false);
    toast.success('Fee record deleted', {
      action: { label: 'Undo', onClick: () => toast.info('Fee record restored') },
    });
  };

  return (
    <PreviewSection title="Modal, drawer and toasts">
      <PreviewRow label="Overlays">
        <Button onClick={() => setIsConfirmOpen(true)}>Open confirm dialog</Button>
        <Button onClick={() => setIsDrawerOpen(true)}>Open drawer</Button>
      </PreviewRow>
      <PreviewRow label="Toasts">
        <Button onClick={() => toast.success('Fee of ₹12,500 recorded')}>Success</Button>
        <Button onClick={() => toast.info('Report is being prepared')}>Info</Button>
        <Button onClick={() => toast.warning('3 students have no parent phone number')}>
          Warning
        </Button>
        <Button onClick={() => toast.error("Couldn't send SMS. Try again.")}>Error</Button>
      </PreviewRow>

      <Dialog
        maxWidth="xs"
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        aria-labelledby={CONFIRM_TITLE_ID}
      >
        <DialogHeader id={CONFIRM_TITLE_ID} onClose={() => setIsConfirmOpen(false)}>
          Delete fee record?
        </DialogHeader>
        <DialogContent>
          <DialogContentText>
            ₹12,500 paid by Diya K. on 4 Oct will be removed. This can&apos;t be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete record
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        slotProps={{ paper: { 'aria-labelledby': DRAWER_TITLE_ID } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <DialogHeader id={DRAWER_TITLE_ID} onClose={() => setIsDrawerOpen(false)}>
            Diya Kapoor · 5-B
          </DialogHeader>
          <Box sx={{ flex: 1, px: 5, py: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Admission KD-2026-0142
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Father: R. Kapoor · 98765 43210
            </Typography>
          </Box>
          <DialogActions>
            <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
            <Button variant="contained">Collect fee</Button>
          </DialogActions>
        </Box>
      </Drawer>
    </PreviewSection>
  );
}
