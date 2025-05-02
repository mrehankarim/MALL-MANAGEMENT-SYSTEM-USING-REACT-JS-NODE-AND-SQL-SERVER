import { createTheme } from '@mui/material/styles';

const baseTheme = {
  shape: {
    borderRadius: 8, // ~0.5rem
  },
};

const lightPalette = {
  mode: 'light',
  background: {
    default: '#ffffff', // oklch(1 0 0)
    paper: '#ffffff',   // oklch(1 0 0)
  },
  primary: {
    main: '#7c4dff',          // oklch(0.623 0.214 259.815)
    contrastText: '#f4f1ff',  // oklch(0.97 0.014 254.604)
  },
  secondary: {
    main: '#f7f7ff',          // oklch(0.967 0.001 286.375)
    contrastText: '#34313d',  // oklch(0.21 0.006 285.885)
  },
  text: {
    primary: '#242424',       // oklch(0.141 0.005 285.823)
    secondary: '#877b9c',     // oklch(0.552 0.016 285.938)
  },
  divider: '#ebebf2',         // oklch(0.92 0.004 286.32)
};

const darkPalette = {
  mode: 'dark',
  background: {
    default: '#09090B',       // oklch(0.141 0.005 285.823)
    paper: '#09090B',         // oklch(0.21 0.006 285.885)
  },
  primary: {
    main: '#3B82F6',          // oklch(0.546 0.245 262.881)
    contrastText: '#463779',  // oklch(0.379 0.146 265.522)
  },
  secondary: {
    main: '#3a3845',          // oklch(0.274 0.006 286.033)
    contrastText: '#fcfcfc',  // oklch(0.985 0 0)
  },
  text: {
    primary: '#fcfcfc',       // oklch(0.985 0 0)
    secondary: '#bcb4d8',     // oklch(0.705 0.015 286.067)
  },
  divider: 'rgba(255, 255, 255, 0.1)', // oklch(1 0 0 / 10%)
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
});
