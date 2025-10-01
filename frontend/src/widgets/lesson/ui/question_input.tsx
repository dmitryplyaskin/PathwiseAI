import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Fade,
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
      <Fade in timeout={500}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 2,
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            onClick={onShowInput}
            startIcon={<QuestionAnswer />}
            size="large"
            sx={{
              py: 2,
              px: 4,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Задать вопрос ИИ-помощнику
          </Button>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          border: '2px solid',
          borderColor: 'primary.200',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
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
              <QuestionAnswer sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" fontWeight={600} color="primary.main">
                Задайте вопрос ИИ-помощнику
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
                '&:hover': {
                  '& fieldset': {
                    borderColor: 'primary.main',
                  },
                },
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
            <Button
              variant="outlined"
              onClick={onHideInput}
              sx={{ borderRadius: 2 }}
            >
              Отмена
            </Button>
            <Button
              variant="contained"
              onClick={onSend}
              disabled={!inputValue.trim() || isLoading}
              startIcon={<Send />}
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              {isLoading ? 'Отправка...' : 'Отправить'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Fade>
  );
};
