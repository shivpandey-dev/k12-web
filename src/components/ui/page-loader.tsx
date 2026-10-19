import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/** Full-height spinner while the session or a route guard is resolving. */
export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress aria-label={label} size={32} />
    </Box>
  );
}
