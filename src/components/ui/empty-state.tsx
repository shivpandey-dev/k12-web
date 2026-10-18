import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  /** A Lucide icon element, e.g. `<Users />`. */
  icon?: ReactNode;
  /** Names the space as an invitation: "Add your first student". */
  title: string;
  description?: string;
  /** Usually one primary button. */
  action?: ReactNode;
  headingComponent?: 'h2' | 'h3' | 'h4';
}

/** Shown when a list or view has no data yet. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  headingComponent = 'h2',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1,
        px: 4,
        py: 10,
      }}
    >
      {icon ? (
        <Box
          aria-hidden
          sx={{
            width: 44,
            height: 44,
            mb: 2,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.soft',
            color: 'primary.main',
            '& svg': { width: 22, height: 22 },
          }}
        >
          {icon}
        </Box>
      ) : null}
      <Typography variant="h3" component={headingComponent}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          {description}
        </Typography>
      ) : null}
      {action ? <Box sx={{ mt: 3 }}>{action}</Box> : null}
    </Box>
  );
}
