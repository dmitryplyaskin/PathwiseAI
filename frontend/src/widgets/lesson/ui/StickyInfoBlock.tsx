import { Box, Button, Paper, Typography } from '@mui/material';

export const StickyInfoBlock = () => {
  return (
    <Box
      component={Paper}
      sx={{
        position: 'sticky',
        top: '20px',
        p: 2,
        width: '250px',
        flexShrink: 0,
        alignSelf: 'flex-start',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Lesson Information
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Created: 2025-09-20
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Last studied: 2025-09-20
      </Typography>
      <Button variant="contained" fullWidth>
        Take the test
      </Button>
    </Box>
  );
};
