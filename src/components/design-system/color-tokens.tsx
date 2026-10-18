import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  chartSeries,
  COLOR_STEPS,
  colorScales,
  neutral,
  WHITE,
  type ColorScaleName,
} from '@/theme/tokens';
import { PreviewSection } from './preview-section';

const SCALE_LABELS: Record<ColorScaleName, string> = {
  brand: 'Brand (aubergine)',
  neutral: 'Neutral',
  rose: 'Rose accent',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Info',
};

const SCALE_NAMES = [
  'brand',
  'neutral',
  'rose',
  'success',
  'warning',
  'danger',
  'info',
] as const satisfies readonly ColorScaleName[];

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

/** Picks whichever of white or neutral-900 reads better on the swatch. */
function labelColor(hex: string) {
  const l = relativeLuminance(hex);
  const onWhite = 1.05 / (l + 0.05);
  const onDark = (l + 0.05) / (relativeLuminance(neutral[900]) + 0.05);
  return onWhite >= onDark ? WHITE : neutral[900];
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <Box
      title={hex}
      sx={{
        bgcolor: hex,
        color: labelColor(hex),
        height: 56,
        borderRadius: 1,
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minWidth: 0,
      }}
    >
      <Typography variant="label" sx={{ display: 'block', color: 'inherit' }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: 'inherit', overflow: 'hidden' }}>
        {hex.slice(1)}
      </Typography>
    </Box>
  );
}

const rowSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(5, minmax(0, 1fr))', md: '120px repeat(10, minmax(0, 1fr))' },
  gap: 1,
  alignItems: 'center',
  mb: 2,
} as const;

export function ColorTokens() {
  return (
    <PreviewSection
      title="Colour"
      description="Raw scales, 50 to 900. Components use the semantic roles (primary, text, border, status), not these values directly."
    >
      {SCALE_NAMES.map((name) => (
        <Box key={name} sx={rowSx}>
          <Typography variant="title" sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            {SCALE_LABELS[name]}
          </Typography>
          {COLOR_STEPS.map((step) => (
            <Swatch key={step} hex={colorScales[name][step]} label={String(step)} />
          ))}
        </Box>
      ))}
      <Box
        sx={{
          ...rowSx,
          gridTemplateColumns: {
            xs: 'repeat(4, minmax(0, 1fr))',
            md: '120px repeat(8, minmax(0, 1fr))',
          },
        }}
      >
        <Typography variant="title" sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
          Chart series
        </Typography>
        {chartSeries.map((hex, index) => (
          <Swatch key={hex} hex={hex} label={String(index + 1)} />
        ))}
      </Box>
    </PreviewSection>
  );
}
