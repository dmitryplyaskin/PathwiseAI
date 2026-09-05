import { Box, CircularProgress, Typography } from '@mui/material';

export const AppLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Загрузка приложения...
      </Typography>
    </Box>
  );
};
