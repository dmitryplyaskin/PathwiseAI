/// <reference types="vite/client" />

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    h1Gradient: React.CSSProperties;
    h1Solid: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    h1Gradient?: React.CSSProperties;
    h1Solid?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1Gradient: true;
    h1Solid: true;
  }
}
