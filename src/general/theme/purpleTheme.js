import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

export const purpleTheme = createTheme({
  palette: {
    primary: {
        main: '#262254'
    },
    secondary: {
        main: '#543884'
    },
    error: {
        main: red.A400
    },
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  /*colorSchemes: {
    light: {
      palette: {
        gradient:
          'linear-gradient(to left, var(--mui-palette-primary-main), var(--mui-palette-primary-dark))',
        border: {
         subtle: 'var(--mui-palette-neutral-200)',
        },
      },
    },
    dark: {
      palette: {
        gradient:
          'linear-gradient(to left, var(--mui-palette-primary-light), var(--mui-palette-primary-main))',
        border: {
          subtle: 'var(--mui-palette-neutral-600)',
        },
      },
    },
  }, */ 
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});
