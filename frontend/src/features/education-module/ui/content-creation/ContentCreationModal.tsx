import { useState, useCallback, useMemo, useEffect } from 'react';
import { Alert, Box, Button, Stack, Tab, Tabs } from '@mui/material';
import { useUnit } from 'effector-react';
import { Modal } from '@shared/ui/modal';
import {
  $coursesListError,
  createModule,
  createCourseOutline,
} from '@shared/model/courses';
import type { ModuleComplexity } from '@shared/api/courses/types';
import { useContentCreationState } from './hooks';
import { TABS_CONFIG } from './config';
import { LessonForm, CourseForm } from './forms';
import { useLessonForm, useCourseForm } from './hooks';
import { CreationLoadingDialog } from './CreationLoadingDialog';
import type { TabType } from './types';

interface ContentCreationModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: TabType;
}

export const ContentCreationModal = ({
  open,
  onClose,
  initialTab = 'lesson',
}: ContentCreationModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    if (!open) return;
    setActiveTab(initialTab);
  }, [open, initialTab]);

  // Get shared state and errors
  const { coursesListError } = useUnit({
    coursesListError: $coursesListError,
  });

  // Use content creation state hook for common logic
  const {
    userId,
    userLoading,
    userError,
    moduleCreating,
    moduleCreationError,
    courseOutlineCreating,
    courseOutlineCreationError,
  } = useContentCreationState(open, onClose);

  // Initialize form hooks
  const lessonForm = useLessonForm();
  const courseForm = useCourseForm();

  // Get current form based on active tab
  const currentForm = useMemo(() => {
    return activeTab === 'lesson' ? lessonForm : courseForm;
  }, [activeTab, lessonForm, courseForm]);

  // Handle tab change
  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: TabType) => {
      setActiveTab(newValue);
    },
    [],
  );

  // Validation for submit button
  const isSubmitDisabled = useMemo(() => {
    // Check if user data is loading or no userId
    if (userLoading) return true;
    if (!userId) return true;

    // Check if module or course outline is being created
    if (moduleCreating || courseOutlineCreating) return true;

    // Check common required fields for all tabs
    const hasTopic = currentForm.topic.trim().length > 0;
    const hasComplexity = !!currentForm.complexity;

    if (!hasTopic || !hasComplexity) return true;

    // Additional validation for lesson tab
    if (activeTab === 'lesson') {
      const courseId = lessonForm.courseId.trim();

      // Course must be selected
      if (!courseId) return true;

      // If creating new course, course name must be filled
      if (courseId === 'new') {
        const newCourseName = lessonForm.newCourseName.trim();
        if (!newCourseName) return true;
      }
    }

    // All validations passed - button is enabled
    return false;
  }, [
    moduleCreating,
    courseOutlineCreating,
    userLoading,
    userId,
    currentForm.topic,
    currentForm.complexity,
    activeTab,
    lessonForm.courseId,
    lessonForm.newCourseName,
  ]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!currentForm.topic || !currentForm.complexity || !userId) return;

    if (activeTab === 'lesson') {
      if (!lessonForm.courseId) return;

      createModule({
        topic: currentForm.topic,
        details: currentForm.details || undefined,
        complexity: currentForm.complexity as ModuleComplexity,
        courseId:
          lessonForm.courseId === 'new' ? undefined : lessonForm.courseId,
        newCourseName:
          lessonForm.courseId === 'new' ? lessonForm.newCourseName : undefined,
        userId,
      });
    } else {
      createCourseOutline({
        topic: currentForm.topic,
        details: currentForm.details || undefined,
        complexity: currentForm.complexity as ModuleComplexity,
        userId,
      });
    }
  }, [activeTab, currentForm, userId, lessonForm]);

  // Combine all errors
  const errorMessage =
    coursesListError ||
    moduleCreationError ||
    courseOutlineCreationError ||
    userError;

  return (
    <>
      <Modal
        open={open && !moduleCreating && !courseOutlineCreating}
        onClose={onClose}
        title="Создать новый контент"
      >
        <Stack spacing={3} sx={{ pt: 1 }}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 2,
            }}
          >
            {TABS_CONFIG.map((tab) => (
              <Tab key={tab.id} label={tab.label} value={tab.id} />
            ))}
          </Tabs>

          {/* Forms */}
          {activeTab === 'lesson' && (
            <LessonForm modalOpen={open} form={lessonForm} />
          )}
          {activeTab === 'course' && <CourseForm form={courseForm} />}

          {/* Error message */}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {/* Action buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2} sx={{ pt: 2 }}>
            <Button onClick={onClose} variant="outlined" size="small">
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitDisabled}
              size="small"
            >
              {`Создать ${activeTab === 'lesson' ? 'урок' : 'курс'}`}
            </Button>
          </Box>
        </Stack>
      </Modal>

      {/* Loading dialog */}
      <CreationLoadingDialog
        open={moduleCreating || courseOutlineCreating}
        activeTab={activeTab}
      />
    </>
  );
};
