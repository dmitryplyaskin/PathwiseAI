import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Chip,
  ButtonGroup,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import {
  School,
  TrendingUp,
  FilterList,
  GridView,
  ViewList,
} from '@mui/icons-material';
import { useState } from 'react';
import { UnitCard } from '@features/unit-card/ui/UnitCard';
import { mockUnits } from '../model/mock';

type FilterType = 'all' | 'completed' | 'in_progress' | 'not_started';
type ViewMode = 'grid' | 'list';

export const UnitsList = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleUnitClick = (unitId: string) => {
    navigate(`/courses/${params.id}/units/${unitId}`);
  };

  const filteredUnits = mockUnits.filter((unit) => {
    if (filter === 'all') return true;
    return unit.status === filter;
  });

  const inProgressUnits = mockUnits.filter(
    (unit) => unit.status === 'in_progress',
  );
  const completedUnits = mockUnits.filter(
    (unit) => unit.status === 'completed',
  );

  const totalProgress = Math.round(
    mockUnits.reduce((acc, unit) => acc + unit.progress, 0) / mockUnits.length,
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Заголовок */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexDirection: 'column', py: 6 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Модули курса: Машинное обучение
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            maxWidth="800px"
            sx={{ mb: 3 }}
          >
            Структурированная программа обучения машинному обучению. Каждый
            модуль содержит теоретические материалы и практические задания.
          </Typography>

          {/* Статистика курса */}
          <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
            <Box display="flex" alignItems="center" gap={1}>
              <School color="primary" />
              <Typography variant="body2" color="text.secondary">
                {mockUnits.length} модулей
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp color="primary" />
              <Typography variant="body2" color="text.secondary">
                {totalProgress}% завершено
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Фильтры и управление */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={1}>
                <FilterList color="action" />
                <Typography variant="body2" color="text.secondary">
                  Фильтр:
                </Typography>
              </Box>

              <ButtonGroup size="small" variant="outlined">
                <Button
                  variant={filter === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('all')}
                >
                  Все ({mockUnits.length})
                </Button>
                <Button
                  variant={filter === 'in_progress' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('in_progress')}
                >
                  В процессе ({inProgressUnits.length})
                </Button>
                <Button
                  variant={filter === 'completed' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('completed')}
                >
                  Завершенные ({completedUnits.length})
                </Button>
                <Button
                  variant={filter === 'not_started' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('not_started')}
                >
                  Не начатые
                </Button>
              </ButtonGroup>
            </Box>

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

          {/* Текущие модули */}
          {inProgressUnits.length > 0 && filter === 'all' && (
            <Stack spacing={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp color="primary" />
                <Typography variant="h2">Изучаются сейчас</Typography>
                <Chip
                  label={inProgressUnits.length}
                  color="primary"
                  size="small"
                />
              </Box>

              <Grid container spacing={3}>
                {inProgressUnits.map((unit) => (
                  <Grid
                    key={unit.id}
                    size={{ xs: 12, sm: 6, lg: viewMode === 'grid' ? 4 : 6 }}
                  >
                    <UnitCard unit={unit} handleUnitClick={handleUnitClick} />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )}

          {/* Все модули */}
          <Stack spacing={3}>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <School color="primary" />
                <Typography variant="h2">
                  {filter === 'all'
                    ? 'Все модули'
                    : filter === 'completed'
                      ? 'Завершенные модули'
                      : filter === 'in_progress'
                        ? 'Модули в процессе'
                        : 'Не начатые модули'}
                </Typography>
                <Chip
                  label={filteredUnits.length}
                  color="primary"
                  size="small"
                />
              </Box>

              {filter === 'all' && (
                <Typography variant="body2" color="text.secondary">
                  Общий прогресс: {totalProgress}%
                </Typography>
              )}
            </Box>

            <Grid container spacing={3}>
              {filteredUnits.map((unit) => (
                <Grid
                  key={unit.id}
                  size={{ xs: 12, sm: 6, lg: viewMode === 'grid' ? 4 : 6 }}
                >
                  <UnitCard unit={unit} handleUnitClick={handleUnitClick} />
                </Grid>
              ))}
            </Grid>

            {filteredUnits.length === 0 && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                py={8}
                gap={2}
              >
                <School sx={{ fontSize: 64, color: 'text.disabled' }} />
                <Typography variant="h3" color="text.secondary">
                  Модули не найдены
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                >
                  Попробуйте изменить фильтр или начните изучение новых модулей
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
