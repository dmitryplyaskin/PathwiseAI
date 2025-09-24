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
} from '@mui/material';
import { Edit, Email, Person, CalendarToday } from '@mui/icons-material';

const userProfile = {
  username: 'JohnDoe',
  email: 'johndoe@example.com',
  createdAt: '2023-09-19T10:00:00Z',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', // Placeholder image
};

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
    <Grid item xs={1}>
      {icon}
    </Grid>
    <Grid item xs={4}>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={7}>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  </Grid>
);

export const ProfilePage = () => {
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
              src={userProfile.avatarUrl}
              sx={{ width: 100, height: 100 }}
            />
            <Box flexGrow={1}>
              <Typography variant="h2" component="h1">
                {userProfile.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Профиль пользователя
              </Typography>
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
              value={userProfile.username}
            />
            <ProfileInfoRow
              icon={<Email color="primary" />}
              label="Email"
              value={userProfile.email}
            />
            <ProfileInfoRow
              icon={<CalendarToday color="primary" />}
              label="Дата регистрации"
              value={new Date(userProfile.createdAt).toLocaleDateString(
                'ru-RU',
              )}
            />
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};
