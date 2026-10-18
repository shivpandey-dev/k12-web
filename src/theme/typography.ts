import type { TypographyStyle, TypographyVariantsOptions } from '@mui/material/styles';
import { FONT_FAMILY, fontWeight, typeScale, type TypeStyle } from './tokens';

const HTML_FONT_SIZE = 16;

const toRem = (px: number) => `${px / HTML_FONT_SIZE}rem`;

function toVariant({
  fontSize,
  lineHeight,
  fontWeight: weight,
  letterSpacing,
}: TypeStyle): TypographyStyle {
  return {
    fontSize: toRem(fontSize),
    lineHeight: lineHeight / fontSize,
    fontWeight: weight,
    ...(letterSpacing ? { letterSpacing } : {}),
  };
}

/** Maps the type scale onto MUI variants. h4–h6, subtitle and overline are disabled. */
export const typography: TypographyVariantsOptions = {
  fontFamily: FONT_FAMILY,
  fontSize: typeScale.body.fontSize,
  htmlFontSize: HTML_FONT_SIZE,
  fontWeightLight: fontWeight.regular,
  fontWeightRegular: fontWeight.regular,
  fontWeightMedium: fontWeight.medium,
  fontWeightBold: fontWeight.semibold,
  display: toVariant(typeScale.display),
  h1: toVariant(typeScale.heading1),
  h2: toVariant(typeScale.heading2),
  h3: toVariant(typeScale.heading3),
  title: toVariant(typeScale.title),
  body1: toVariant(typeScale.body),
  body2: toVariant(typeScale.bodySmall),
  label: toVariant(typeScale.label),
  caption: toVariant(typeScale.caption),
  button: { ...toVariant(typeScale.button), textTransform: 'none' },
  h4: undefined,
  h5: undefined,
  h6: undefined,
  subtitle1: undefined,
  subtitle2: undefined,
  overline: undefined,
};
