import { Box, Paper, CircularProgress, Typography, Stack } from '@mui/material';

export const LoadingScreen = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #f8fbff 0%, #eff6ff 50%, #dbeafe 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'primary.100',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Загрузка урока...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Подготавливаем материалы для изучения
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
