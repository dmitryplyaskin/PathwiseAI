import {
  Container,
  Box,
  Card,
  Typography,
  Button,
  Stack,
  Avatar,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import {
  Edit,
  Email,
  Person,
  CalendarToday,
  Security,
} from '@mui/icons-material';
import { useUnit } from 'effector-react';
import { $currentUser } from '../../shared/model/auth';

const ProfileInfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
}) => (
  <Grid container spacing={2} alignItems="center">
    <Grid size={{ xs: 1 }}>{icon}</Grid>
    <Grid size={{ xs: 4 }}>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid size={{ xs: 7 }}>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  </Grid>
);

export const ProfilePage = () => {
  const currentUser = useUnit($currentUser);

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" textAlign="center">
          Пользователь не найден
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Card sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={4}>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            textAlign={{ xs: 'center', sm: 'left' }}
            gap={4}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor:
                  currentUser.role === 'admin'
                    ? 'secondary.main'
                    : 'primary.main',
              }}
            >
              {currentUser.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h2" component="h1">
                {currentUser.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Профиль пользователя
              </Typography>
              <Chip
                label={
                  currentUser.role === 'admin'
                    ? 'Администратор'
                    : 'Пользователь'
                }
                color={currentUser.role === 'admin' ? 'secondary' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Edit />}
              sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
            >
              Редактировать
            </Button>
          </Box>

          <Divider />

          <Stack spacing={3}>
            <ProfileInfoRow
              icon={<Person color="primary" />}
              label="Имя пользователя"
              value={currentUser.username}
            />
            <ProfileInfoRow
              icon={<Email color="primary" />}
              label="Email"
              value={currentUser.email}
            />
            <ProfileInfoRow
              icon={<Security color="primary" />}
              label="Роль"
              value={
                currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'
              }
            />
            <ProfileInfoRow
              icon={<CalendarToday color="primary" />}
              label="Дата регистрации"
              value={new Date(currentUser.created_at).toLocaleDateString(
                'ru-RU',
              )}
            />
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};
