import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { useNavigate } from 'react-router';
import {
  $moduleCreating,
  $moduleCreationError,
  $createdModule,
  $courseOutlineCreating,
  $courseOutlineCreationError,
  $createdCourseOutline,
  resetCreationState,
} from '@shared/model/courses';
import { useCurrentUser } from '@shared/model/users';

export const useContentCreationState = (open: boolean, onClose: () => void) => {
  const navigate = useNavigate();

  // Effector stores
  const {
    moduleCreating,
    moduleCreationError,
    createdModule,
    courseOutlineCreating,
    courseOutlineCreationError,
    createdCourseOutline,
  } = useUnit({
    moduleCreating: $moduleCreating,
    moduleCreationError: $moduleCreationError,
    createdModule: $createdModule,
    courseOutlineCreating: $courseOutlineCreating,
    courseOutlineCreationError: $courseOutlineCreationError,
    createdCourseOutline: $createdCourseOutline,
  });

  // Current user
  const { userId, loading: userLoading, error: userError } = useCurrentUser();

  // Handle successful module creation and redirect
  useEffect(() => {
    if (createdModule) {
      onClose();
      // Redirect to the created lesson
      navigate(
        `/courses/${createdModule.courseId}/lessons/${createdModule.lessonId}`,
      );
      // Reset creation state after navigation
      setTimeout(() => resetCreationState(), 100);
    }
  }, [createdModule, onClose, navigate]);

  // Handle successful course outline creation and redirect
  useEffect(() => {
    if (createdCourseOutline) {
      onClose();
      // Redirect to the created course
      navigate(`/courses/${createdCourseOutline.courseId}`);
      // Reset creation state after navigation
      setTimeout(() => resetCreationState(), 100);
    }
  }, [createdCourseOutline, onClose, navigate]);

  // Reset creation state when modal closes
  useEffect(() => {
    if (!open) {
      resetCreationState();
    }
  }, [open]);

  return {
    userId,
    userLoading,
    userError,
    moduleCreating,
    moduleCreationError,
    courseOutlineCreating,
    courseOutlineCreationError,
  };
};
