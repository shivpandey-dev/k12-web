import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ColorTokens } from './color-tokens';
import { RadiusTokens } from './radius-tokens';
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
      </Stack>
    </Container>
  );
}
