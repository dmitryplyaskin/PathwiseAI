import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  LinearProgress,
  Chip,
  Box,
  Stack,
  Avatar,
  Rating,
} from '@mui/material';
import {
  School,
  AccessTime,
  People,
  Circle,
  CheckCircle,
  PlayCircle,
} from '@mui/icons-material';
import type { FC } from 'react';
import type { CourseListItem } from '@/shared/api/courses/types';

interface CourseCardProps {
  course: CourseListItem;
  handleCourseClick: (id: string) => void;
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

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'machine_learning':
      return 'Машинное обучение';
    case 'data_science':
      return 'Data Science';
    case 'programming':
      return 'Программирование';
    case 'mathematics':
      return 'Математика';
    default:
      return category;
  }
};

export const CourseCard: FC<CourseCardProps> = ({
  course,
  handleCourseClick,
}) => {
  return (
    <Card
      onClick={() => handleCourseClick(course.id)}
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
      {/* Изображение курса */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
          background: `linear-gradient(45deg, ${
            course.difficulty === 'beginner'
              ? '#4caf50, #81c784'
              : course.difficulty === 'intermediate'
                ? '#ff9800, #ffb74d'
                : '#f44336, #e57373'
          })`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <School sx={{ fontSize: 64, color: 'white', opacity: 0.8 }} />

        {/* Статус в углу */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(0,0,0,0.7)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {getStatusIcon(course.status)}
          <Typography variant="caption" color="white" fontWeight={500}>
            {getStatusLabel(course.status)}
          </Typography>
        </Box>

        {/* Прогресс в углу */}
        {course.progress > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'rgba(0,0,0,0.7)',
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="white" fontWeight={600}>
              {course.progress}%
            </Typography>
          </Box>
        )}
      </CardMedia>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2} height="100%">
          {/* Категория */}
          <Chip
            label={getCategoryLabel(course.category)}
            size="small"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />

          {/* Заголовок */}
          <Typography variant="h4" component="h3" sx={{ fontWeight: 500 }}>
            {course.title}
          </Typography>

          {/* Краткое описание */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              lineHeight: 1.6,
            }}
          >
            {course.shortDescription}
          </Typography>

          {/* Прогресс */}
          {course.progress > 0 && (
            <Box>
              <LinearProgress
                variant="determinate"
                value={course.progress}
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
                Прогресс: {course.completedLessons}/{course.totalLessons} уроков
              </Typography>
            </Box>
          )}

          {/* Метаданные курса */}
          <Stack spacing={1}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <School fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {course.unitsCount} модулей
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {course.estimatedTime}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <People fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {course.studentsCount.toLocaleString()} студентов
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Rating
                  value={course.rating}
                  precision={0.1}
                  size="small"
                  readOnly
                />
                <Typography variant="caption" color="text.secondary">
                  {course.rating}
                </Typography>
              </Box>
            </Box>
          </Stack>

          {/* Нижняя панель */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pt={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {course.instructor
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {course.instructor}
              </Typography>
            </Box>

            <Chip
              label={getDifficultyLabel(course.difficulty)}
              color={getDifficultyColor(course.difficulty) as any}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Теги */}
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {course.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.6rem',
                  height: 20,
                }}
              />
            ))}
            {course.tags.length > 3 && (
              <Chip
                label={`+${course.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.6rem',
                  height: 20,
                }}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
