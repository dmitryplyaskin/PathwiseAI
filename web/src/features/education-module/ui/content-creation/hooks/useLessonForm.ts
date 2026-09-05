import { useState, useCallback } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { LessonFormState } from '../types';

export const useLessonForm = () => {
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [complexity, setComplexity] =
    useState<LessonFormState['complexity']>('normal');
  const [courseId, setCourseId] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  const handleComplexityChange = useCallback((event: SelectChangeEvent) => {
    setComplexity(event.target.value as LessonFormState['complexity']);
  }, []);

  const handleCourseChange = useCallback((event: SelectChangeEvent) => {
    const value = event.target.value;
    setCourseId(value);
    if (value !== 'new') {
      setNewCourseName('');
    }
  }, []);

  const resetForm = useCallback(() => {
    setTopic('');
    setDetails('');
    setComplexity('normal');
    setCourseId('');
    setNewCourseName('');
  }, []);

  return {
    // State
    topic,
    details,
    complexity,
    courseId,
    newCourseName,
    // Setters
    setTopic,
    setDetails,
    setComplexity,
    setCourseId,
    setNewCourseName,
    // Handlers
    handleComplexityChange,
    handleCourseChange,
    // Utils
    resetForm,
  };
};
