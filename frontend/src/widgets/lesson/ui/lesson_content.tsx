import { Paper, Box, Typography, Fade } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { MarkdownRenderer } from '@shared/ui';

interface LessonContentProps {
  content: string;
}

export const LessonContent = ({ content }: LessonContentProps) => {
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
          transition: 'all 0.3s ease',
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
      </Paper>
    </Fade>
  );
};
