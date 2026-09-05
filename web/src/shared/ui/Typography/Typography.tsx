import React from 'react';
import {
  Typography as MuiTypography,
  type TypographyProps as MuiTypographyProps,
} from '@mui/material';

export interface TypographyProps extends Omit<MuiTypographyProps, 'variant'> {
  variant?: 'h1Gradient' | 'h1Solid' | MuiTypographyProps['variant'];
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  ...props
}) => {
  return <MuiTypography variant={variant} {...props} />;
};
