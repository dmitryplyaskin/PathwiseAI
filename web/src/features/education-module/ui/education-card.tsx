import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import type { FC } from 'react';

interface EducationCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    progress: number;
    lastStudied: string;
    status: string;
  };
  handleModuleClick: (id: string) => void;
}

export const EducationCard: FC<EducationCardProps> = ({
  module,
  handleModuleClick,
}) => {
  return (
    <Card
      onClick={() => handleModuleClick(module.id)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2} height="100%">
          <Typography variant="h4" component="h3">
            {module.title}
          </Typography>

          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {module.description}
          </Typography>

          <Box>
            <LinearProgress
              variant="determinate"
              value={module.progress}
              sx={{ mb: 1, height: 6 }}
            />
            <Typography variant="caption" color="text.secondary">
              Прогресс: {module.progress}%
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              {module.lastStudied}
            </Typography>

            <Chip
              icon={module.status === 'completed' ? <EmojiEvents /> : undefined}
              label={module.status === 'completed' ? 'Завершен' : 'В процессе'}
              color={module.status === 'completed' ? 'success' : 'info'}
              size="small"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
