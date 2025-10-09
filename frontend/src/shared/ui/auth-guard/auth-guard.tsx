import { useUnit } from 'effector-react';
import { Navigate } from 'react-router';
import { Box, CircularProgress } from '@mui/material';
import { $isAuthenticated, $authLoading } from '../../model/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const [isAuthenticated, authLoading] = useUnit([
    $isAuthenticated,
    $authLoading,
  ]);

  // Если авторизация не требуется, просто рендерим детей
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Если идет загрузка, показываем индикатор
  if (authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Если не авторизован, перенаправляем на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если авторизован, показываем содержимое
  return <>{children}</>;
};
