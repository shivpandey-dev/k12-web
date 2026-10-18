import Box from '@mui/material/Box';
import Typography, { type TypographyProps } from '@mui/material/Typography';
import { typeScale, type TypeScaleName } from '@/theme/tokens';
import { PreviewSection } from './preview-section';

interface TypeRow {
  token: TypeScaleName;
  variant: NonNullable<TypographyProps['variant']>;
  sample: string;
}

const ROWS: readonly TypeRow[] = [
  { token: 'display', variant: 'display', sample: '₹4,82,000' },
  { token: 'heading1', variant: 'h1', sample: 'Fee collection' },
  { token: 'heading2', variant: 'h2', sample: 'Class 5-B overview' },
  { token: 'heading3', variant: 'h3', sample: 'Student details' },
  { token: 'title', variant: 'title', sample: 'Card or section title' },
  { token: 'body', variant: 'body1', sample: 'Default text for forms, tables and paragraphs.' },
  { token: 'bodySmall', variant: 'body2', sample: 'Helper text and secondary table information.' },
  { token: 'label', variant: 'label', sample: 'Admission number' },
  { token: 'caption', variant: 'caption', sample: 'Updated 2 minutes ago' },
  { token: 'button', variant: 'button', sample: 'Collect fee' },
];

export function TypographyTokens() {
  return (
    <PreviewSection title="Typography" description="Inter, 14px base, tabular numbers.">
      {ROWS.map(({ token, variant, sample }) => {
        const { fontSize, lineHeight, fontWeight } = typeScale[token];
        return (
          <Box
            key={token}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' },
              gap: { xs: 1, sm: 4 },
              alignItems: 'baseline',
              py: 3,
              borderBottom: 1,
              borderColor: 'border.subtle',
            }}
          >
            <Box>
              <Typography variant="label" sx={{ display: 'block' }}>
                {variant}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {`${fontSize} / ${lineHeight} · ${fontWeight}`}
              </Typography>
            </Box>
            <Typography variant={variant} component="p">
              {sample}
            </Typography>
          </Box>
        );
      })}
    </PreviewSection>
  );
}
