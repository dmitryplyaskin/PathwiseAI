import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Button,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  PlayCircle,
  Schedule,
  MenuBook,
  SignalCellularAlt,
  EmojiEvents,
} from '@mui/icons-material';
import type { FC } from 'react';
import { LessonStatus } from '@shared/api/lessons/types';

export interface LessonCardData {
  id: string;
  title: string;
  description?: string;
  status: LessonStatus;
  reading_time?: number;
  difficulty?: number;
  next_review_at?: string;
  interval?: number;
  created_at?: string;
  last_reviewed_at?: string;
  unit: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
}

interface LessonCardProps {
  lesson: LessonCardData;
  variant?: 'default' | 'review';
  onClick?: (lesson: LessonCardData) => void;
  onAction?: (lesson: LessonCardData) => void;
}

const getStatusColor = (
  status: LessonStatus,
): 'default' | 'primary' | 'success' => {
  switch (status) {
    case LessonStatus.NOT_STARTED:
      return 'default';
    case LessonStatus.LEARNING:
      return 'primary';
    case LessonStatus.MASTERED:
      return 'success';
    default:
      return 'default';
  }
};

const getStatusText = (status: LessonStatus): string => {
  switch (status) {
    case LessonStatus.NOT_STARTED:
      return 'Не начат';
    case LessonStatus.LEARNING:
      return 'Изучается';
    case LessonStatus.MASTERED:
      return 'Освоен';
    default:
      return 'Неизвестно';
  }
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Для будущих дат (повторение)
  if (diffTime > 0) {
    if (diffDays <= 1) return 'Завтра';
    if (diffDays <= 7) return `Через ${diffDays} дн.`;
  } 
  // Для прошлых дат или "сегодня"
  else if (diffDays === 0) {
      return 'Сегодня';
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getReviewPriority = (nextReviewAt?: string) => {
    if (!nextReviewAt) return { color: 'info' as const, text: 'Планово' };
    
    const date = new Date(nextReviewAt);
    const now = new Date();
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays > 3) return { color: 'error' as const, text: 'Критично' };
    if (diffDays > 0) return { color: 'warning' as const, text: 'Важно' };
    return { color: 'info' as const, text: 'Планово' };
};

export const LessonCard: FC<LessonCardProps> = ({
  lesson,
  variant = 'default',
  onClick,
  onAction,
}) => {
  const theme = useTheme();
  const isReview = variant === 'review';

  const handleCardClick = () => {
    if (onClick) {
      onClick(lesson);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) {
      onAction(lesson);
    }
  };

  const reviewPriority = isReview ? getReviewPriority(lesson.next_review_at) : null;

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: onClick ? 4 : 1,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header: Icon + Breadcrumbs */}
        <Box display="flex" alignItems="flex-start" gap={1}>
           <Box
             sx={{
               p: 1,
               borderRadius: 2,
               bgcolor: isReview ? 'warning.lighter' : 'primary.lighter',
               color: isReview ? 'warning.main' : 'primary.main',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
             }}
           >
             {isReview ? <Schedule fontSize="small" /> : <MenuBook fontSize="small" />}
           </Box>
           
           <Box sx={{ flex: 1, minWidth: 0 }}>
              <Tooltip title={lesson.unit.course.title} arrow>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                   {lesson.unit.course.title}
                </Typography>
              </Tooltip>
              <Tooltip title={lesson.unit.title} arrow>
                <Typography variant="caption" color="text.primary" fontWeight={500} noWrap display="block">
                   {lesson.unit.title}
                </Typography>
              </Tooltip>
           </Box>
        </Box>

        {/* Title & Description */}
        <Box>
          <Tooltip title={lesson.title} arrow>
            <Typography variant="h6" component="h3" fontWeight={600} sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                mb: 1
            }}>
              {lesson.title}
            </Typography>
          </Tooltip>
          
          {lesson.description && (
             <Typography variant="body2" color="text.secondary" sx={{
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 display: '-webkit-box',
                 WebkitLineClamp: 2,
                 WebkitBoxOrient: 'vertical',
             }}>
               {lesson.description}
             </Typography>
          )}
        </Box>
        
        {/* Metadata Stats */}
        <Stack direction="row" spacing={2} alignItems="center" mt="auto" pt={1}>
            {/* Always show reading time if available */}
            {lesson.reading_time && (
                <Tooltip title="Время чтения">
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {lesson.reading_time} мин
                        </Typography>
                    </Box>
                </Tooltip>
            )}
            
            {/* Difficulty */}
            {lesson.difficulty && (
                 <Tooltip title="Сложность">
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <SignalCellularAlt sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {lesson.difficulty}/5
                        </Typography>
                    </Box>
                 </Tooltip>
            )}
        </Stack>

        {/* Footer Actions/Status */}
        <Box display="flex" justifyContent="space-between" alignItems="center" pt={1} borderTop={`1px solid ${theme.palette.divider}`}>
            {isReview ? (
                 <>
                    <Chip 
                        label={reviewPriority?.text} 
                        color={reviewPriority?.color} 
                        size="small" 
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayCircle />}
                        onClick={handleActionClick}
                    >
                        Повторить
                    </Button>
                 </>
            ) : (
                 <>
                    <Chip
                        icon={lesson.status === LessonStatus.MASTERED ? <EmojiEvents sx={{ fontSize: '16px !important' }} /> : undefined}
                        label={getStatusText(lesson.status)}
                        color={getStatusColor(lesson.status)}
                        size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(lesson.created_at)}
                    </Typography>
                 </>
            )}
        </Box>
      </CardContent>
    </Card>
  );
};
