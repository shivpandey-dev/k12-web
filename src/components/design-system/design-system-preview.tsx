import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ButtonSamples } from './button-samples';
import { ChipSamples } from './chip-samples';
import { ColorTokens } from './color-tokens';
import { FieldSamples } from './field-samples';
import { RadiusTokens } from './radius-tokens';
import { SelectionSamples } from './selection-samples';
import { ShadowTokens } from './shadow-tokens';
import { SizeTokens } from './size-tokens';
import { SpacingTokens } from './spacing-tokens';
import { TypographyTokens } from './typography-tokens';

/** Living reference for the app design system. Each build step adds its section here. */
export function DesignSystemPreview() {
  return (
    <Container maxWidth="lg" component="main" sx={{ py: 10 }}>
      <Typography variant="h1" sx={{ mb: 1 }}>
        KidzDiary design system
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 8 }}>
        Foundations for the school app. Development builds only.
      </Typography>
      <Stack spacing={6}>
        <ColorTokens />
        <TypographyTokens />
        <SpacingTokens />
        <RadiusTokens />
        <ShadowTokens />
        <SizeTokens />
        <ButtonSamples />
        <FieldSamples />
        <SelectionSamples />
        <ChipSamples />
      </Stack>
    </Container>
  );
}
