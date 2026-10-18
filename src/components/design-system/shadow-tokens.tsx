import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { focusRing, shadows } from '@/theme/tokens';
import { PreviewSection } from './preview-section';

const LEVELS = [
  { name: 'xs', shadow: shadows.xs, usage: 'Card at rest' },
  { name: 'sm', shadow: shadows.sm, usage: 'Hovered card' },
  { name: 'md', shadow: shadows.md, usage: 'Menu, popover' },
  { name: 'lg', shadow: shadows.lg, usage: 'Modal, drawer' },
  { name: 'focus ring', shadow: focusRing, usage: 'Keyboard focus' },
] as const;

export function ShadowTokens() {
  return (
    <PreviewSection title="Shadows" description="Tinted with brand-900 instead of black.">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 6,
          bgcolor: 'background.default',
          borderRadius: 2,
          p: 6,
        }}
      >
        {LEVELS.map(({ name, shadow, usage }) => (
          <Box
            key={name}
            sx={{
              height: 88,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: shadow,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              ...(name === 'focus ring' ? { border: 1, borderColor: 'primary.main' } : {}),
            }}
          >
            <Typography variant="label">{name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {usage}
            </Typography>
          </Box>
        ))}
      </Box>
    </PreviewSection>
  );
}
