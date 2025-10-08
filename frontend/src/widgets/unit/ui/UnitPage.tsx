import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Chip,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import {
  ExpandMore,
  PlayCircle,
  CheckCircle,
  Circle,
  AccessTime,
  School,
  TrendingUp,
  Assignment,
  ArrowBack,
  Star,
} from '@mui/icons-material';
import { useState } from 'react';
import { mockUnitDetail } from '../model/mock';

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

const getLessonStatusIcon = (status: string, progress: number) => {
  if (status === 'completed' || progress === 100) {
    return <CheckCircle color="success" />;
  } else if (progress > 0) {
    return <PlayCircle color="primary" />;
  }
  return <Circle color="disabled" />;
};

export const UnitPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['group-1']);

  const unit = mockUnitDetail;

  const handleLessonClick = (lessonId: string) => {
    navigate(
      `/courses/${params.id}/units/${params.unitId}/lessons/${lessonId}`,
    );
  };

  const handleBackToUnits = () => {
    navigate(`/courses/${params.id}/units`);
  };

  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const nextLesson = unit.lessonGroups
    .flatMap((group) => group.lessons)
    .find((lesson) => lesson.status === 'in_progress' && lesson.progress < 100);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Заголовок */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexDirection: 'column', py: 4 }}>
          <Container maxWidth="lg" sx={{ width: '100%' }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBackToUnits}
                sx={{ color: 'inherit' }}
              >
                Назад к модулям
              </Button>
            </Box>

            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                  <Typography variant="h1" component="h1">
                    {unit.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: '600px' }}
                  >
                    {unit.description}
                  </Typography>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Chip
                      label={getDifficultyLabel(unit.difficulty)}
                      color={getDifficultyColor(unit.difficulty) as any}
                      icon={<Star />}
                    />
                    <Chip
                      label={`${unit.totalLessons} уроков`}
                      icon={<School />}
                      variant="outlined"
                      sx={{
                        color: 'inherit',
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}
                    />
                    <Chip
                      label={unit.estimatedTime}
                      icon={<AccessTime />}
                      variant="outlined"
                      sx={{
                        color: 'inherit',
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}
                    />
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="h3" color="primary">
                      Прогресс модуля
                    </Typography>

                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          {unit.completedLessons} из {unit.totalLessons} уроков
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="primary"
                        >
                          {unit.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={unit.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>

                    {nextLesson && (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<PlayCircle />}
                        onClick={() => handleLessonClick(nextLesson.id)}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Продолжить обучение
                      </Button>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Основной контент */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>
              {/* Группы уроков */}
              <Stack spacing={2}>
                <Typography
                  variant="h2"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Assignment color="primary" />
                  Содержание модуля
                </Typography>

                {unit.lessonGroups.map((group) => (
                  <Accordion
                    key={group.id}
                    expanded={expandedGroups.includes(group.id)}
                    onChange={() => handleGroupToggle(group.id)}
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        margin: 0,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        px: 3,
                        py: 2,
                        '& .MuiAccordionSummary-content': {
                          margin: 0,
                          alignItems: 'center',
                        },
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        width="100%"
                      >
                        <Box flex={1}>
                          <Typography
                            variant="h4"
                            component="h3"
                            sx={{ fontWeight: 500 }}
                          >
                            {group.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {group.description}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <TrendingUp fontSize="small" color="primary" />
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color="primary"
                            >
                              {group.progress}%
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {group.completedLessons}/{group.lessons.length}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0 }}>
                      <List disablePadding>
                        {group.lessons.map((lesson) => (
                          <ListItem key={lesson.id} disablePadding>
                            <ListItemButton
                              onClick={() => handleLessonClick(lesson.id)}
                              sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                  bgcolor: 'action.hover',
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                {getLessonStatusIcon(
                                  lesson.status,
                                  lesson.progress,
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {lesson.title}
                                  </Typography>
                                }
                                secondary={
                                  <Stack spacing={1} sx={{ mt: 0.5 }}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {lesson.description}
                                    </Typography>
                                    {lesson.progress > 0 && (
                                      <LinearProgress
                                        variant="determinate"
                                        value={lesson.progress}
                                        sx={{
                                          height: 4,
                                          borderRadius: 2,
                                          backgroundColor: 'action.hover',
                                          '& .MuiLinearProgress-bar': {
                                            borderRadius: 2,
                                          },
                                        }}
                                      />
                                    )}
                                  </Stack>
                                }
                              />
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {lesson.progress}%
                                </Typography>
                              </Box>
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Боковая панель */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* Требования */}
              <Paper
                elevation={0}
                sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
              >
                <Typography variant="h3" gutterBottom>
                  Требования
                </Typography>
                <List dense>
                  {unit.prerequisites.map((prerequisite, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {prerequisite}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* Статистика */}
              <Paper
                elevation={0}
                sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
              >
                <Typography variant="h3" gutterBottom>
                  Статистика
                </Typography>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Всего уроков:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {unit.totalLessons}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Завершено:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="success.main"
                    >
                      {unit.completedLessons}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Осталось:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="warning.main"
                    >
                      {unit.totalLessons - unit.completedLessons}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Время изучения:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {unit.estimatedTime}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
