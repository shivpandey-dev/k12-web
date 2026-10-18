import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface PreviewRowProps {
  label: string;
  children: ReactNode;
}

/** A labelled, wrapping row of component samples inside a preview section. */
export function PreviewRow({ label, children }: PreviewRowProps) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
