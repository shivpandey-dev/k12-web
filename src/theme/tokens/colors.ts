/**
 * Raw colour scales for the KidzDiary app design system. Generated in OKLCH so each step is
 * perceptually even. Components must not import these directly: use the semantic palette roles
 * (`primary.main`, `text.secondary`, `border.default`, ...) so dark mode can remap them later.
 */

export const COLOR_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type ColorStep = (typeof COLOR_STEPS)[number];
export type ColorScale = Readonly<Record<ColorStep, string>>;

/** Aubergine. 600 is the primary fill (8.2:1 against white). */
export const brand: ColorScale = {
  50: '#FAF0FF',
  100: '#EEE2FD',
  200: '#D9C9ED',
  300: '#BEAAD8',
  400: '#9F85BE',
  500: '#8060A4',
  600: '#614084',
  700: '#4C2F69',
  800: '#382050',
  900: '#230F35',
};

/** Greys with a faint aubergine tint so they sit with the brand. */
export const neutral: ColorScale = {
  50: '#FBF9FD',
  100: '#F4F2F7',
  200: '#E8E5EC',
  300: '#D6D3DA',
  400: '#A3A0A7',
  500: '#767379',
  600: '#56545A',
  700: '#413E44',
  800: '#2A282D',
  900: '#17151A',
};

/** Secondary accent for badges, role tags and highlights. Never used for errors. */
export const rose: ColorScale = {
  50: '#FFEDF6',
  100: '#FFDEE9',
  200: '#EEC4D3',
  300: '#D8A3B6',
  400: '#BD7C95',
  500: '#A25575',
  600: '#803356',
  700: '#662542',
  800: '#4D1630',
  900: '#33071C',
};

export const success: ColorScale = {
  50: '#E4FDE8',
  100: '#D3F1D8',
  200: '#B6DDBD',
  300: '#90C39A',
  400: '#62A470',
  500: '#2E8548',
  600: '#006526',
  700: '#005019',
  800: '#003B0D',
  900: '#002402',
};

export const warning: ColorScale = {
  50: '#FFEEC2',
  100: '#FFDFAE',
  200: '#FCCA90',
  300: '#EBB16C',
  400: '#D79540',
  500: '#BE7200',
  600: '#8E5400',
  700: '#704000',
  800: '#542E00',
  900: '#381C00',
};

export const danger: ColorScale = {
  50: '#FFE9E4',
  100: '#FFD9D3',
  200: '#FFBDB6',
  300: '#F19991',
  400: '#DA6C66',
  500: '#C13C3B',
  600: '#9E0016',
  700: '#7F000A',
  800: '#620001',
  900: '#420000',
};

export const info: ColorScale = {
  50: '#E1F9FF',
  100: '#D0ECFF',
  200: '#B1D6F7',
  300: '#89BAE4',
  400: '#5998CD',
  500: '#1F77B5',
  600: '#005695',
  700: '#004278',
  800: '#00305D',
  900: '#001B3F',
};

export const WHITE = '#FFFFFF';

/** Categorical chart series, in order of use. Each has at least 3:1 contrast against white. */
export const chartSeries = [
  '#754D9E',
  '#1D9999',
  '#C8800D',
  '#347EC4',
  '#C1628A',
  '#4D9351',
  '#DB684C',
  '#677284',
] as const;

export const colorScales = { brand, neutral, rose, success, warning, danger, info } as const;
export type ColorScaleName = keyof typeof colorScales;
