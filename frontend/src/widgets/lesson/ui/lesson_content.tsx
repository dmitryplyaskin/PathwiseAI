import { Paper, Box, Typography, Fade, Divider } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { MarkdownRenderer } from '@shared/ui';

interface LessonContentProps {
  content: string;
}

export const LessonContent = ({ content }: LessonContentProps) => {
  const aiDisclaimerText =
    'Материал урока сгенерирован/сформирован с помощью ИИ в образовательных целях и может содержать неточности или ошибки. Пожалуйста, перепроверяйте важную информацию по первоисточникам.';

  return (
    <Fade in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: 3,
          transition:
            'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
          position: 'relative',
          '&:hover': {
            borderColor: 'primary.100',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12)',
          },
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
          <AutoAwesome sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography
            variant="caption"
            fontWeight={600}
            color="primary.main"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 1,
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
    </Fade>
  );
};
