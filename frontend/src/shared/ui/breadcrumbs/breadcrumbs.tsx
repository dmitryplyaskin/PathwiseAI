import React from 'react';
import { Link } from 'react-router';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import type { BreadcrumbsProps } from './types';

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <NavigateNext fontSize="small" />,
  maxItems = 8,
  className,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box className={className} sx={{ mb: 2 }}>
      <MuiBreadcrumbs
        separator={separator}
        maxItems={maxItems}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary',
            mx: 1,
          },
        }}
      >
        {items.map((item, index) => {
          // const isLast = index === items.length - 1;
          const isHome = item.path === '/';

          // if (isLast || !item.path) {
          //   return (
          //     <Chip
          //       key={index}
          //       label={
          //         <Box display="flex" alignItems="center" gap={0.5}>
          //           {isHome && <Home fontSize="small" />}
          //           <Typography variant="body2" component="span">
          //             {item.label}
          //           </Typography>
          //         </Box>
          //       }
          //       variant="filled"
          //       color="primary"
          //       size="small"
          //       sx={{
          //         fontWeight: 600,
          //         '& .MuiChip-label': {
          //           px: 1.5,
          //           py: 0.5,
          //         },
          //       }}
          //     />
          //   );
          // }

          return (
            <Link
              key={index}
              to={item.path || ''}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'primary.50',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {isHome && <Home fontSize="small" />}
                <Typography variant="body2" component="span">
                  {item.label}
                </Typography>
              </Box>
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};
