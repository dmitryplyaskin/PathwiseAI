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
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
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
  People,
  Star,
  Assignment,
} from '@mui/icons-material';
import { useState } from 'react';
import { mockCourseDetail } from '../model/mock';
import { UnitCard } from '../../../features/unit-card/ui/UnitCard';

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

export const CoursePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const course = mockCourseDetail;

  const handleBackToCourses = () => {
    navigate('/courses');
  };

  const handleViewUnits = () => {
    navigate(`/courses/${params.id}/units`);
  };

  const handleUnitClick = (unitId: string) => {
    navigate(`/courses/${params.id}/units/${unitId}`);
  };

  const nextUnit = course.units.find(
    (unit) => unit.status === 'in_progress' || unit.status === 'not_started',
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
                      label={getCategoryLabel(course.category)}
                      variant="outlined"
                      sx={{
                        color: 'inherit',
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}
                    />
                    <Chip
                      label={getDifficultyLabel(course.difficulty)}
                      color={getDifficultyColor(course.difficulty)}
                      icon={<Star />}
                    />
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
                        {course.unitsCount} модулей
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Assignment color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {course.totalLessons} уроков
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {course.estimatedTime}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <People color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {course.studentsCount.toLocaleString()} студентов
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Star color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {course.rating} рейтинг
                      </Typography>
                    </Box>
                  </Box>

                  {/* Инструктор */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 48, height: 48 }}>
                      {course.instructor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {course.instructor.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating
                          value={course.instructor.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="caption" color="text.secondary">
                          {course.instructor.coursesCount} курсов •{' '}
                          {course.instructor.studentsCount.toLocaleString()}{' '}
                          студентов
                        </Typography>
                      </Box>
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
                          {course.completedLessons} из {course.totalLessons}{' '}
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
                      {nextUnit && (
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<PlayCircle />}
                          onClick={() => handleUnitClick(nextUnit.id)}
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
            <Tab label="Инструктор" />
            <Tab label="Отзывы" />
          </Tabs>
        </Box>

        {/* Обзор */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={4}>
                {/* Описание */}
                <Paper
                  elevation={0}
                  sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
                >
                  <Typography variant="h3" gutterBottom>
                    О курсе
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}
                  >
                    {course.fullDescription}
                  </Typography>
                </Paper>

                {/* Что вы изучите */}
                <Paper
                  elevation={0}
                  sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
                >
                  <Typography variant="h3" gutterBottom>
                    Что вы изучите
                  </Typography>
                  <List>
                    {course.learningOutcomes.map((outcome, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">{outcome}</Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

                {/* Теги */}
                <Paper
                  elevation={0}
                  sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
                >
                  <Typography variant="h3" gutterBottom>
                    Технологии
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {course.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Paper>
              </Stack>
            </Grid>

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
                    {course.prerequisites.map((prerequisite, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle color="primary" fontSize="small" />
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
                    Статистика курса
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Модулей:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {course.unitsCount}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Уроков:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {course.totalLessons}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Студентов:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {course.studentsCount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Рейтинг:
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating
                          value={course.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {course.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Программа */}
        <TabPanel value={activeTab} index={1}>
          <Stack spacing={4}>
            <Typography variant="h2">Программа курса</Typography>

            {/* Краткое содержание */}
            <Paper
              elevation={0}
              sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
            >
              <Typography variant="h3" gutterBottom>
                Краткое содержание
              </Typography>
              <List>
                {course.syllabus.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight={600}
                      >
                        {index + 1}.
                      </Typography>
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2">{item}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Модули курса */}
            <Box>
              <Typography variant="h3" gutterBottom>
                Модули курса
              </Typography>
              <Grid container spacing={3}>
                {course.units.map((unit) => (
                  <Grid key={unit.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <UnitCard unit={unit} handleUnitClick={handleUnitClick} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </TabPanel>

        {/* Инструктор */}
        <TabPanel value={activeTab} index={2}>
          <Paper
            elevation={0}
            sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}
          >
            <Stack spacing={3}>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                  {course.instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Avatar>
                <Box>
                  <Typography variant="h3" gutterBottom>
                    {course.instructor.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Rating
                      value={course.instructor.rating}
                      precision={0.1}
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.rating} рейтинг
                    </Typography>
                  </Box>
                  <Box display="flex" gap={3}>
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.coursesCount} курсов
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.studentsCount.toLocaleString()}{' '}
                      студентов
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {course.instructor.bio}
              </Typography>
            </Stack>
          </Paper>
        </TabPanel>

        {/* Отзывы */}
        <TabPanel value={activeTab} index={3}>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h2">Отзывы студентов</Typography>
              <Chip
                label={course.reviews.length}
                color="primary"
                size="small"
              />
            </Box>

            {course.reviews.map((review) => (
              <Card
                key={review.id}
                elevation={0}
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {review.author}
                      </Typography>
                      <Rating value={review.rating} size="small" readOnly />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {review.comment}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </TabPanel>
      </Container>
    </Box>
  );
};
