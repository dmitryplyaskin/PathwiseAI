import { useUnit } from 'effector-react';
import { Navigate } from 'react-router';
import { $isAuthenticated } from '../../model/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const isAuthenticated = useUnit($isAuthenticated);

  // Если авторизация не требуется, просто рендерим детей
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Если не авторизован, перенаправляем на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если авторизован, показываем содержимое
  return <>{children}</>;
};
