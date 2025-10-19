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
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowBack,
  PlayCircle,
  CheckCircle,
  School,
  AccessTime,
  Star,
  Assignment,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useUnit } from 'effector-react';
import {
  $courseDetail,
  $courseDetailLoading,
  $courseDetailError,
  loadCourseDetail,
} from '@shared/model/courses';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const CoursePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const { courseDetail, courseDetailLoading, courseDetailError } = useUnit({
    courseDetail: $courseDetail,
    courseDetailLoading: $courseDetailLoading,
    courseDetailError: $courseDetailError,
  });

  // Загружаем данные курса при монтировании компонента
  useEffect(() => {
    if (params.id) {
      loadCourseDetail(params.id);
    }
  }, [params.id]);

  // Показываем загрузку или ошибку
  if (courseDetailLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Загрузка курса...</Typography>
      </Box>
    );
  }

  if (courseDetailError) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="error">
          Ошибка загрузки курса: {courseDetailError}
        </Typography>
      </Box>
    );
  }

  if (!courseDetail) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Курс не найден</Typography>
      </Box>
    );
  }

  const course = courseDetail;

  const handleBackToCourses = () => {
    navigate('/courses');
  };

  const handleViewUnits = () => {
    navigate(`/courses/${params.id}/units`);
  };

  const handleUnitClick = (unitId: string) => {
    navigate(`/courses/${params.id}/units/${unitId}`);
  };

  const nextLesson = course.units
    .flatMap((unit) => unit.lessons)
    .find(
      (lesson) =>
        lesson.status === 'not_started' || lesson.status === 'learning',
    );

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Заголовок */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexDirection: 'column', py: 4 }}>
          <Container maxWidth="lg" sx={{ width: '100%' }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBackToCourses}
                sx={{ color: 'inherit' }}
              >
                Назад к курсам
              </Button>
            </Box>

            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Chip
                      label="Программирование"
                      variant="outlined"
                      sx={{
                        color: 'inherit',
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}
                    />
                    <Chip label="Средний" color="warning" icon={<Star />} />
                  </Box>

                  <Typography variant="h1" component="h1">
                    {course.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: '600px', lineHeight: 1.7 }}
                  >
                    {course.description}
                  </Typography>

                  {/* Метаданные курса */}
                  <Box display="flex" gap={3} flexWrap="wrap">
                    <Box display="flex" alignItems="center" gap={1}>
                      <School color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {course.units.length} модулей
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Assignment color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {course.units.reduce(
                          (total, unit) => total + unit.lessons.length,
                          0,
                        )}{' '}
                        уроков
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {course.units.reduce(
                          (total, unit) =>
                            total +
                            unit.lessons.reduce(
                              (unitTotal, lesson) =>
                                unitTotal + (lesson.reading_time || 0),
                              0,
                            ),
                          0,
                        )}{' '}
                        мин
                      </Typography>
                    </Box>
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
                  <Stack spacing={3}>
                    <Typography variant="h3" color="primary">
                      Прогресс курса
                    </Typography>

                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          {course.units.reduce(
                            (total, unit) =>
                              total +
                              unit.lessons.filter(
                                (lesson) => lesson.status === 'mastered',
                              ).length,
                            0,
                          )}{' '}
                          из{' '}
                          {course.units.reduce(
                            (total, unit) => total + unit.lessons.length,
                            0,
                          )}{' '}
                          уроков
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="primary"
                        >
                          {course.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
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

                    <Stack spacing={2}>
                      {nextLesson && (
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<PlayCircle />}
                          onClick={() =>
                            navigate(
                              `/courses/${params.id}/lessons/${nextLesson.id}`,
                            )
                          }
                          fullWidth
                        >
                          Продолжить обучение
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<School />}
                        onClick={handleViewUnits}
                        fullWidth
                      >
                        Все модули курса
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="course tabs"
          >
            <Tab label="Обзор" />
            <Tab label="Программа" />
          </Tabs>
        </Box>

        {/* Обзор */}
        <TabPanel value={activeTab} index={0}>
          <Stack spacing={4}>
            {/* Описание */}
            <Paper
              elevation={0}
              sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
            >
              <Typography variant="h3" gutterBottom>
                О курсе
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {course.description}
              </Typography>
            </Paper>

            {/* Статистика */}
            <Paper
              elevation={0}
              sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
            >
              <Typography variant="h3" gutterBottom>
                Статистика курса
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight={600}>
                      {course.units.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Модулей
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight={600}>
                      {course.units.reduce(
                        (total, unit) => total + unit.lessons.length,
                        0,
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Уроков
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight={600}>
                      {course.units.reduce(
                        (total, unit) =>
                          total +
                          unit.lessons.filter(
                            (lesson) => lesson.status === 'mastered',
                          ).length,
                        0,
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Завершено
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight={600}>
                      {course.progress}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Прогресс
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </TabPanel>

        {/* Программа */}
        <TabPanel value={activeTab} index={1}>
          <Stack spacing={4}>
            <Typography variant="h2">Программа курса</Typography>

            {/* Уроки курса */}
            <Box>
              <Typography variant="h3" gutterBottom>
                Уроки курса
              </Typography>
              <Stack spacing={2}>
                {course.units.map((unit) => (
                  <Paper
                    key={unit.id}
                    elevation={0}
                    sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
                  >
                    <Typography variant="h4" gutterBottom>
                      {unit.title}
                    </Typography>
                    <List>
                      {unit.lessons.map((lesson) => (
                        <ListItem
                          key={lesson.id}
                          disablePadding
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            navigate(
                              `/courses/${params.id}/lessons/${lesson.id}`,
                            )
                          }
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {lesson.status === 'mastered' ? (
                              <CheckCircle color="success" fontSize="small" />
                            ) : lesson.status === 'learning' ? (
                              <PlayCircle color="primary" fontSize="small" />
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight={600}
                              >
                                {lesson.order}.
                              </Typography>
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                fontWeight={
                                  lesson.status !== 'not_started' ? 500 : 400
                                }
                              >
                                {lesson.title}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {lesson.description}
                                {lesson.reading_time &&
                                  ` • ${lesson.reading_time} мин`}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Stack>
        </TabPanel>
      </Container>
    </Box>
  );
};
