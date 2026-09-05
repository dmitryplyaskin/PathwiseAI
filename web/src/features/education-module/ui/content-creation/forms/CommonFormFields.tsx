import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { COMPLEXITY_OPTIONS } from './complexity-options';

interface CommonFormFieldsProps {
  activeTab: 'lesson' | 'course';
  topic: string;
  onTopicChange: (value: string) => void;
  details: string;
  onDetailsChange: (value: string) => void;
  complexity: string;
  onComplexityChange: (event: SelectChangeEvent) => void;
}

export const CommonFormFields = ({
  activeTab,
  topic,
  onTopicChange,
  details,
  onDetailsChange,
  complexity,
  onComplexityChange,
}: CommonFormFieldsProps) => {
  return (
    <>
      <TextField
        label={
          activeTab === 'lesson'
            ? 'Какой вопрос вы хотите изучить?'
            : 'Тема курса'
        }
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Дополнительное описание (опционально)"
        value={details}
        onChange={(e) => onDetailsChange(e.target.value)}
        multiline
        rows={4}
        fullWidth
      />

      {/* Complexity field */}
      <FormControl fullWidth>
        <InputLabel id="complexity-select-label">
          Сложность объяснения
        </InputLabel>
        <Select
          labelId="complexity-select-label"
          value={complexity}
          label="Сложность объяснения"
          onChange={onComplexityChange}
        >
          {COMPLEXITY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {complexity && (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'action.hover',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {
              COMPLEXITY_OPTIONS.find((opt) => opt.value === complexity)
                ?.description
            }
          </Typography>
        </Box>
      )}
    </>
  );
};
