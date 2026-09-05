import { useState, useCallback } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { CourseFormState } from '../types';

export const useCourseForm = () => {
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [complexity, setComplexity] =
    useState<CourseFormState['complexity']>('normal');

  const handleComplexityChange = useCallback((event: SelectChangeEvent) => {
    setComplexity(event.target.value as CourseFormState['complexity']);
  }, []);

  const resetForm = useCallback(() => {
    setTopic('');
    setDetails('');
    setComplexity('normal');
  }, []);

  return {
    // State
    topic,
    details,
    complexity,
    // Setters
    setTopic,
    setDetails,
    setComplexity,
    // Handlers
    handleComplexityChange,
    // Utils
    resetForm,
  };
};
