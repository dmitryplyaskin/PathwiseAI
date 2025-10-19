import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import {
  EmojiEvents,
  MenuBook,
  TrendingUp,
  Circle,
  CheckCircle,
  PlayCircle,
} from '@mui/icons-material';
import type { FC } from 'react';
import type { Unit } from '@widgets/units-list/model/mock';

interface UnitCardProps {
  unit: Unit;
  handleUnitClick: (id: string) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'success';
    case 'intermediate':
      return 'warning';
    case 'advanced':
      return 'error';
    default:
      return 'default';
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'Начальный';
    case 'intermediate':
      return 'Средний';
    case 'advanced':
      return 'Продвинутый';
    default:
      return difficulty;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle color="success" />;
    case 'in_progress':
      return <PlayCircle color="primary" />;
    case 'not_started':
      return <Circle color="disabled" />;
    default:
      return <Circle color="disabled" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Завершен';
    case 'in_progress':
      return 'В процессе';
    case 'not_started':
      return 'Не начат';
    default:
      return status;
  }
};

export const UnitCard: FC<UnitCardProps> = ({ unit, handleUnitClick }) => {
  return (
    <Card
      onClick={() => handleUnitClick(unit.id)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2} height="100%">
          {/* Заголовок с иконкой статуса */}
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Box sx={{ mt: 0.5 }}>{getStatusIcon(unit.status)}</Box>
            <Typography
              variant="h4"
              component="h3"
              sx={{ fontWeight: 500, flex: 1 }}
            >
              {unit.title}
            </Typography>
          </Box>

          {/* Описание */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              lineHeight: 1.6,
            }}
          >
            {unit.description}
          </Typography>

          {/* Прогресс */}
          <Box>
            <LinearProgress
              variant="determinate"
              value={unit.progress}
              sx={{
                mb: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              Прогресс: {unit.progress}% ({unit.completedLessons}/
              {unit.lessonsCount} уроков)
            </Typography>
          </Box>

          {/* Метаданные */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <MenuBook fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {unit.lessonsCount} уроков
              </Typography>
            </Box>

            <Chip
              label={getDifficultyLabel(unit.difficulty)}
              color={getDifficultyColor(unit.difficulty) as any}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Статус и последнее изучение */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              {unit.lastStudied === 'Never'
                ? 'Не изучался'
                : `Изучался: ${unit.lastStudied}`}
            </Typography>

            <Chip
              icon={unit.status === 'completed' ? <EmojiEvents /> : undefined}
              label={getStatusLabel(unit.status)}
              color={
                unit.status === 'completed'
                  ? 'success'
                  : unit.status === 'in_progress'
                    ? 'info'
                    : 'default'
              }
              size="small"
              sx={{
                fontWeight: 500,
                '& .MuiChip-icon': {
                  fontSize: '16px',
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>

      {/* Индикатор прогресса в углу */}
      {unit.progress > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'background.paper',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <TrendingUp fontSize="small" color="primary" />
          <Typography variant="caption" fontWeight={600} color="primary">
            {unit.progress}%
          </Typography>
        </Box>
      )}
    </Card>
  );
};
