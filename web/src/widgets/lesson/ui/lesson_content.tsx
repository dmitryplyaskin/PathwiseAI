import { Paper, Box, Typography, Divider } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { MarkdownRenderer } from '@shared/ui';

interface LessonContentProps {
  content: string;
}

export const LessonContent = ({ content }: LessonContentProps) => {
  const aiDisclaimerText =
    'Материал урока сгенерирован/сформирован с помощью ИИ в образовательных целях и может содержать неточности или ошибки. Пожалуйста, перепроверяйте важную информацию по первоисточникам.';

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: { xs: 2.5, md: 3 },
        bgcolor: 'background.paper',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <AutoAwesome sx={{ color: 'primary.main', fontSize: 18 }} />
        <Typography
          variant="caption"
          fontWeight={700}
          color="primary.main"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          Материал урока
        </Typography>
      </Box>
      <MarkdownRenderer showLineNumbers={true} maxCodeHeight="500px">
        {content}
      </MarkdownRenderer>
      <Divider sx={{ mt: 3, mb: 1.5 }} />
      <Typography
        variant="caption"
        component="p"
        color="text.secondary"
        sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}
      >
        {aiDisclaimerText}
      </Typography>
    </Paper>
  );
};
