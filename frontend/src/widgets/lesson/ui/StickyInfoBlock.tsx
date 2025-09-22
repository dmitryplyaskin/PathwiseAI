import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import { Quiz, Schedule, DateRange } from '@mui/icons-material';

export const StickyInfoBlock = () => {
  return (
    <Box
      component={Paper}
      elevation={0}
      sx={{
        position: 'sticky',
        top: '20px',
        p: 3,
        width: '280px',
        flexShrink: 0,
        alignSelf: 'flex-start',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={500} color="primary.main">
          Информация об уроке
        </Typography>

        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <DateRange fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Создан: 20 сентября 2025
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Изучен: 20 сентября 2025
            </Typography>
          </Box>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography variant="body2" fontWeight={500}>
            Статус прохождения
          </Typography>
          <Chip
            label="В процессе изучения"
            color="info"
            size="small"
            sx={{ alignSelf: 'flex-start', fontWeight: 500 }}
          />
        </Stack>

        <Button
          variant="contained"
          fullWidth
          startIcon={<Quiz />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          Пройти тест
        </Button>
      </Stack>
    </Box>
  );
};
