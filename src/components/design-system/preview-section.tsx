import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface PreviewSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** A titled card that groups one family of tokens on the preview page. */
export function PreviewSection({ title, description, children }: PreviewSectionProps) {
  return (
    <Box
      component="section"
      aria-label={title}
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'border.default',
        borderRadius: 3,
        boxShadow: 1,
        p: 6,
      }}
    >
      <Typography variant="h2" sx={{ mb: description ? 1 : 4 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {description}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}
