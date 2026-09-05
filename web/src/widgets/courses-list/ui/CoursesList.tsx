import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Chip,
  ButtonGroup,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router';
import {
  School,
  TrendingUp,
  FilterList,
  GridView,
  ViewList,
  Search,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { CourseCardWithLessons } from '@features/course-card/ui/CourseCardWithLessons';
import { loadCoursesList } from '@shared/model/courses';
import { useUnit } from 'effector-react';
import {
  $coursesList,
  $coursesListLoading,
  $coursesListError,
} from '@shared/model/courses';
import type { CourseListItem } from '@shared/api/courses/types';

type FilterType = 'all' | 'completed' | 'in_progress' | 'not_started';
type ViewMode = 'grid' | 'list';
type SortType = 'rating' | 'progress' | 'students' | 'title';
type CategoryType =
  | 'all'
  | 'machine_learning'
  | 'data_science'
  | 'programming'
  | 'mathematics';
type DifficultyType = 'all' | 'beginner' | 'intermediate' | 'advanced';

export const CoursesList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('rating');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyType>('all');

  const coursesList = useUnit($coursesList);
  const coursesListLoading = useUnit($coursesListLoading);
  const coursesListError = useUnit($coursesListError);

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  useEffect(() => {
    loadCoursesList();
  }, []);

  // Используем только данные из API
  const courses: CourseListItem[] = coursesList;

  // Фильтрация и сортировка
  const filteredCourses = courses.filter((course) => {
    // Фильтр по статусу
    if (filter !== 'all' && course.status !== filter) return false;

    // Фильтр по категории
    if (categoryFilter !== 'all' && course.category !== categoryFilter)
      return false;

    // Фильтр по сложности
    if (difficultyFilter !== 'all' && course.difficulty !== difficultyFilter)
      return false;

    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Сортировка
  filteredCourses.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'progress':
        return b.progress - a.progress;
      case 'students':
        return b.studentsCount - a.studentsCount;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const inProgressCourses = courses.filter(
    (course) => course.status === 'in_progress',
  );
  const completedCourses = courses.filter(
    (course) => course.status === 'completed',
  );

  const totalProgress = courses.length
    ? Math.round(
        courses.reduce((acc, course) => acc + course.progress, 0) /
          courses.length,
      )
    : 0;

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{ mb: 1, fontSize: { xs: '1.8rem', md: '2.2rem' } }}
          >
            Мои курсы
          </Typography>
          <Typography variant="body2">
            Выберите тему и продолжайте свой учебный маршрут.
          </Typography>
          {!coursesListLoading && !coursesListError && (
            <Stack
              direction="row"
              useFlexGap
              spacing={2}
              sx={{ mt: 2, flexWrap: 'wrap' }}
            >
              <Typography variant="body2">
                Всего курсов: {courses.length}
              </Typography>
              <Typography variant="body2">
                Средний прогресс: {totalProgress}%
              </Typography>
            </Stack>
          )}
        </Box>
        <Stack spacing={4}>
          {/* Индикатор загрузки */}
          {coursesListLoading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {/* Ошибка загрузки */}
          {coursesListError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Ошибка загрузки курсов: {coursesListError}
            </Alert>
          )}
          {/* Поиск и фильтры */}
          <Stack spacing={3}>
            {/* Поиск */}
            <TextField
              fullWidth
              variant="outlined"
              label="Поиск курсов"
              placeholder="Название, описание или тег"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 600,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Фильтры */}
            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ flexWrap: 'wrap', gap: 2 }}
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={1}>
                  <FilterList color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Фильтры:
                  </Typography>
                </Box>

                <Box
                  role="group"
                  aria-label="Статус курса"
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    '& .MuiButton-root': { minHeight: 40 },
                  }}
                >
                  <Button
                    variant={filter === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setFilter('all')}
                  >
                    Все ({courses.length})
                  </Button>
                  <Button
                    variant={
                      filter === 'in_progress' ? 'contained' : 'outlined'
                    }
                    onClick={() => setFilter('in_progress')}
                  >
                    В процессе ({inProgressCourses.length})
                  </Button>
                  <Button
                    variant={filter === 'completed' ? 'contained' : 'outlined'}
                    onClick={() => setFilter('completed')}
                  >
                    Завершенные ({completedCourses.length})
                  </Button>
                  <Button
                    variant={
                      filter === 'not_started' ? 'contained' : 'outlined'
                    }
                    onClick={() => setFilter('not_started')}
                  >
                    Новые
                  </Button>
                </Box>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Категория</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Категория"
                    onChange={(e) =>
                      setCategoryFilter(e.target.value as CategoryType)
                    }
                  >
                    <MenuItem value="all">Все</MenuItem>
                    <MenuItem value="machine_learning">ML</MenuItem>
                    <MenuItem value="data_science">Data Science</MenuItem>
                    <MenuItem value="programming">Программирование</MenuItem>
                    <MenuItem value="mathematics">Математика</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Сложность</InputLabel>
                  <Select
                    value={difficultyFilter}
                    label="Сложность"
                    onChange={(e) =>
                      setDifficultyFilter(e.target.value as DifficultyType)
                    }
                  >
                    <MenuItem value="all">Все</MenuItem>
                    <MenuItem value="beginner">Начальный</MenuItem>
                    <MenuItem value="intermediate">Средний</MenuItem>
                    <MenuItem value="advanced">Продвинутый</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Сортировка</InputLabel>
                  <Select
                    value={sortBy}
                    label="Сортировка"
                    onChange={(e) => setSortBy(e.target.value as SortType)}
                  >
                    <MenuItem value="rating">По рейтингу</MenuItem>
                    <MenuItem value="progress">По прогрессу</MenuItem>
                    <MenuItem value="students">По популярности</MenuItem>
                    <MenuItem value="title">По названию</MenuItem>
                  </Select>
                </FormControl>

                <ButtonGroup size="small" variant="outlined">
                  <Button
                    variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('grid')}
                    startIcon={<GridView />}
                  >
                    Сетка
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('list')}
                    startIcon={<ViewList />}
                  >
                    Список
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          </Stack>

          {/* Активные курсы */}
          {inProgressCourses.length > 0 && filter === 'all' && (
            <Stack spacing={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp color="primary" />
                <Typography variant="h2">Продолжить обучение</Typography>
                <Chip
                  label={inProgressCourses.length}
                  color="primary"
                  size="small"
                />
              </Box>

              <Grid container spacing={3}>
                {inProgressCourses.map((course) => (
                  <Grid
                    key={course.id}
                    size={{
                      xs: 12,
                      sm: viewMode === 'grid' ? 6 : 12,
                      lg: viewMode === 'grid' ? 4 : 12,
                    }}
                  >
                    <CourseCardWithLessons
                      course={course}
                      handleCourseClick={handleCourseClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )}

          {/* Все курсы */}
          <Stack spacing={3}>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              justifyContent="space-between"
              sx={{ flexWrap: 'wrap', gap: 2 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <School color="primary" />
                <Typography variant="h2">
                  {filter === 'all'
                    ? 'Все курсы'
                    : filter === 'completed'
                      ? 'Завершенные курсы'
                      : filter === 'in_progress'
                        ? 'Курсы в процессе'
                        : 'Новые курсы'}
                </Typography>
                <Chip
                  label={filteredCourses.length}
                  color="primary"
                  size="small"
                />
              </Box>

              {searchQuery && (
                <Typography variant="body2" color="text.secondary">
                  Результаты поиска: "{searchQuery}"
                </Typography>
              )}
            </Box>

            <Grid container spacing={3}>
              {filteredCourses.map((course) => (
                <Grid
                  key={course.id}
                  size={{
                    xs: 12,
                    sm: viewMode === 'grid' ? 6 : 12,
                    lg: viewMode === 'grid' ? 4 : 12,
                  }}
                >
                  <CourseCardWithLessons
                    course={course}
                    handleCourseClick={handleCourseClick}
                  />
                </Grid>
              ))}
            </Grid>

            {!coursesListLoading &&
              !coursesListError &&
              filteredCourses.length === 0 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  py={8}
                  gap={2}
                >
                  <School sx={{ fontSize: 64, color: 'text.disabled' }} />
                  <Typography variant="h3" color="text.secondary">
                    Курсы не найдены
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Попробуйте изменить фильтры или поисковый запрос
                  </Typography>
                  {(filter !== 'all' ||
                    searchQuery ||
                    categoryFilter !== 'all' ||
                    difficultyFilter !== 'all') && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchQuery('');
                        setCategoryFilter('all');
                        setDifficultyFilter('all');
                        setFilter('all');
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  )}
                </Box>
              )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
