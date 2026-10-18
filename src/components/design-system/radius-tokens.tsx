import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { radius, type RadiusName } from '@/theme/tokens';
import { PreviewSection } from './preview-section';

const USAGE: Record<RadiusName, string> = {
  none: 'Tables inside cards',
  xs: 'Checkbox, tag',
  sm: 'Chip, menu item',
  md: 'Button, input',
  lg: 'Card, table',
  xl: 'Modal, drawer',
  full: 'Avatar, pill',
};

const NAMES = [
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'full',
] as const satisfies readonly RadiusName[];

export function RadiusTokens() {
  return (
    <PreviewSection title="Radius">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 4,
        }}
      >
        {NAMES.map((name) => (
          <Box key={name}>
            <Box
              sx={{
                height: 72,
                border: 1,
                borderColor: 'primary.light',
                bgcolor: 'background.default',
                borderRadius: `${radius[name]}px`,
                mb: 2,
              }}
            />
            <Typography variant="label" sx={{ display: 'block' }}>
              {name === 'full' ? 'full' : `${name} · ${radius[name]}px`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {USAGE[name]}
            </Typography>
          </Box>
        ))}
      </Box>
    </PreviewSection>
  );
}
