import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { controlHeight, rowHeight } from '@/theme/tokens';
import { PreviewSection } from './preview-section';

const CONTROLS = Object.entries(controlHeight);
const ROWS = Object.entries(rowHeight);

export function SizeTokens() {
  return (
    <PreviewSection
      title="Sizes"
      description="Control heights for buttons and inputs, and row heights per density."
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 4, mb: 6 }}>
        {CONTROLS.map(([name, px]) => (
          <Box
            key={name}
            sx={{
              height: px,
              px: 4,
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 2,
            }}
          >
            <Typography variant="button">{`${name} · ${px}px`}</Typography>
          </Box>
        ))}
      </Box>
      {ROWS.map(([name, px]) => (
        <Box
          key={name}
          sx={{
            height: px,
            display: 'flex',
            alignItems: 'center',
            px: 3,
            borderBottom: 1,
            borderColor: 'border.default',
          }}
        >
          <Typography variant="body1">{`${name} row · ${px}px`}</Typography>
        </Box>
      ))}
    </PreviewSection>
  );
}
