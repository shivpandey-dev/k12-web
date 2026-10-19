import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

const PRODUCT_NAME = 'KidzDiary';

/**
 * Split screen for signed-out and account pages: aubergine brand panel on the left (hidden on
 * small screens) and the form on the right.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '44%',
          maxWidth: 560,
          p: 12,
          bgcolor: 'sidebar.background',
          color: 'sidebar.text',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'sidebar.textActive' }}>
          <Box
            aria-hidden
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'primary.light',
              color: 'sidebar.background',
              typography: 'h3',
            }}
          >
            {PRODUCT_NAME.charAt(0)}
          </Box>
          <Typography variant="h3" component="p" sx={{ color: 'inherit' }}>
            {PRODUCT_NAME}
          </Typography>
        </Box>
        <Box>
          <Typography variant="display" component="p" sx={{ color: 'sidebar.textActive', mb: 3 }}>
            One diary for your whole school.
          </Typography>
          <Typography variant="body1" sx={{ color: 'inherit', maxWidth: 380 }}>
            Attendance, fees, classes and notices for owners, staff, teachers, parents and students
            in one place.
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'sidebar.groupLabel' }}>
          © {PRODUCT_NAME}
        </Typography>
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 5, sm: 8 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>{children}</Box>
      </Box>
    </Box>
  );
}
