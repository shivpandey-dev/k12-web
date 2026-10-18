import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { spacingScale } from '@/theme/tokens';
import { PreviewSection } from './preview-section';

const STEPS = Object.entries(spacingScale).sort(([, a], [, b]) => a - b);

export function SpacingTokens() {
  return (
    <PreviewSection
      title="Spacing"
      description="4px unit. theme.spacing(4) and sx={{ p: 4 }} both mean 16px."
    >
      {STEPS.map(([step, px]) => (
        <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 4, py: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 96, flexShrink: 0 }}>
            {`${step} · ${px}px`}
          </Typography>
          <Box
            sx={{
              width: px * 4,
              maxWidth: '100%',
              height: 12,
              bgcolor: 'primary.light',
              borderRadius: 0.5,
            }}
          />
        </Box>
      ))}
    </PreviewSection>
  );
}
