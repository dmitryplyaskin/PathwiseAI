import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { QuestionAnswer, Send, Close } from '@mui/icons-material';

interface QuestionInputProps {
  showInput: boolean;
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onShowInput: () => void;
  onHideInput: () => void;
}

export const QuestionInput = ({
  showInput,
  inputValue,
  isLoading,
  onInputChange,
  onSend,
  onShowInput,
  onHideInput,
}: QuestionInputProps) => {
  if (!showInput) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 2,
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={onShowInput}
          startIcon={<QuestionAnswer />}
          size="small"
        >
          Задать вопрос ИИ-помощнику
        </Button>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 2.5,
        mt: 3,
        borderRadius: 3,
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <QuestionAnswer sx={{ color: 'primary.main', fontSize: 18 }} />
            <Typography variant="body2" fontWeight={700} color="text.primary">
              Вопрос ИИ‑помощнику
            </Typography>
          </Box>
          <Tooltip title="Закрыть">
            <IconButton size="small" onClick={onHideInput}>
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Например: Объясни разницу между обучением с учителем и без учителя..."
          multiline
          rows={3}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="text" onClick={onHideInput} sx={{ color: 'text.secondary' }}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={onSend}
            disabled={!inputValue.trim() || isLoading}
            startIcon={<Send />}
            size="small"
          >
            {isLoading ? 'Отправка...' : 'Отправить'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};
