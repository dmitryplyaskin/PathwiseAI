/// <reference types="vite/client" />

import '@mui/material/styles';

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
