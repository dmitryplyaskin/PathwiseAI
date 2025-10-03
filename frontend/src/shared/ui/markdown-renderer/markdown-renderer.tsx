import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Components } from 'react-markdown';

export interface MarkdownRendererProps {
  /**
   * Markdown контент для отображения
   */
  children: string;
  /**
   * Дополнительные стили для корневого контейнера
   */
  sx?: object;
  /**
   * Кастомная тема для подсветки синтаксиса
   */
  codeTheme?: any;
  /**
   * Размер шрифта для кода
   */
  codeFontSize?: string;
  /**
   * Показывать ли номера строк в блоках кода
   */
  showLineNumbers?: boolean;
  /**
   * Максимальная высота блоков кода (с прокруткой)
   */
  maxCodeHeight?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children,
  sx = {},
  codeTheme,
  codeFontSize = '0.875rem',
  showLineNumbers = false,
  maxCodeHeight = '400px',
}) => {
  const theme = useTheme();

  const customComponents: Components = {
    // Заголовки
    h1: ({ children, ...props }) => (
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          mt: 3,
          mb: 2,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          pb: 1,
        }}
        {...props}
      >
        {children}
      </Typography>
    ),
    h2: ({ children, ...props }) => (
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          mt: 3,
          mb: 2,
        }}
        {...props}
      >
        {children}
      </Typography>
    ),
    h3: ({ children, ...props }) => (
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 500,
          mt: 2.5,
          mb: 1.5,
        }}
        {...props}
      >
        {children}
      </Typography>
    ),
    h4: ({ children, ...props }) => (
      <Typography
        variant="subtitle1"
        component="h4"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 500,
          mt: 2,
          mb: 1,
        }}
        {...props}
      >
        {children}
      </Typography>
    ),
    h5: ({ children, ...props }) => (
      <Typography
        variant="subtitle2"
        component="h5"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 500,
          mt: 2,
          mb: 1,
        }}
        {...props}
      >
        {children}
      </Typography>
    ),
    h6: ({ children, ...props }) => (
      <Typography
        variant="body1"
        component="h6"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 500,
          mt: 1.5,
          mb: 1,
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    // Параграфы
    p: ({ children, ...props }) => (
      <Typography
        variant="body1"
        paragraph
        sx={{
          lineHeight: 1.7,
          color: 'text.primary',
          mb: 2,
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    // Инлайн код
    code: ({ children, className, node, ...props }) => {
      console.log('children', children);
      console.log('className', className);
      console.log('props', props);

      const isInline =
        node?.position?.start?.line === node?.position?.end?.line;

      if (isInline) {
        return (
          <Chip
            label={children}
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: 'action.hover',
              fontSize: codeFontSize,
              fontFamily: 'monospace',
              height: 'auto',
              py: 0.5,
              px: 1,
              '& .MuiChip-label': {
                px: 0.5,
              },
            }}
          />
        );
      }

      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return (
        <Box
          sx={{
            my: 2,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {language && (
            <Box
              sx={{
                backgroundColor: 'grey.100',
                px: 2,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                {language}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              maxHeight: maxCodeHeight,
              overflow: 'auto',

              '& code': {
                background: 'transparent !important',
              },
            }}
          >
            <SyntaxHighlighter
              style={codeTheme || oneLight}
              language={language}
              showLineNumbers={showLineNumbers}
              customStyle={{
                margin: 0,
                padding: theme.spacing(2),
                fontSize: codeFontSize,
                backgroundColor: 'transparent',
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </Box>
        </Box>
      );
    },

    // Блоки кода (pre)
    pre: ({ children, ...props }) => (
      <Box component="div" {...props}>
        {children}
      </Box>
    ),

    // Ссылки
    a: ({ href, children, ...props }) => (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'primary.main',
          textDecoration: 'underline',
          '&:hover': {
            textDecoration: 'none',
          },
        }}
        {...props}
      >
        {children}
      </Link>
    ),

    // Списки
    ul: ({ children, ...props }) => (
      <List dense sx={{ pl: 2 }} {...props}>
        {children}
      </List>
    ),
    ol: ({ children, ...props }) => (
      <List dense sx={{ pl: 2, listStyleType: 'decimal' }} {...props}>
        {children}
      </List>
    ),
    li: ({ children, ...props }) => (
      <ListItem disablePadding sx={{ display: 'list-item' }} {...props}>
        <ListItemText
          primary={children}
          sx={{
            '& .MuiTypography-root': {
              fontSize: 'inherit',
              lineHeight: 1.6,
            },
          }}
        />
      </ListItem>
    ),

    // Цитаты
    blockquote: ({ children, ...props }) => (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'info.50',
          borderLeft: '4px solid',
          borderColor: 'info.main',
          p: 2,
          my: 2,
          fontStyle: 'italic',
        }}
        {...props}
      >
        {children}
      </Paper>
    ),

    // Горизонтальная линия
    hr: (props) => (
      <Divider
        sx={{
          my: 3,
          borderColor: 'divider',
        }}
        {...props}
      />
    ),

    // Таблицы
    table: ({ children, ...props }) => (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ my: 2, border: '1px solid', borderColor: 'divider' }}
        {...props}
      >
        <Table size="small">{children}</Table>
      </TableContainer>
    ),
    thead: ({ children, ...props }) => (
      <TableHead {...props}>{children}</TableHead>
    ),
    tbody: ({ children, ...props }) => (
      <TableBody {...props}>{children}</TableBody>
    ),
    tr: ({ children, ...props }) => <TableRow {...props}>{children}</TableRow>,
    th: ({ children, ...props }) => (
      <TableCell
        component="th"
        sx={{
          backgroundColor: 'action.hover',
          fontWeight: 600,
          borderBottom: '2px solid',
          borderColor: 'divider',
        }}
        {...props}
      >
        {children}
      </TableCell>
    ),
    td: ({ children, ...props }) => (
      <TableCell
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        {...props}
      >
        {children}
      </TableCell>
    ),

    // Жирный и курсивный текст
    strong: ({ children, ...props }) => (
      <Typography component="strong" sx={{ fontWeight: 700 }} {...props}>
        {children}
      </Typography>
    ),
    em: ({ children, ...props }) => (
      <Typography component="em" sx={{ fontStyle: 'italic' }} {...props}>
        {children}
      </Typography>
    ),
  };

  return (
    <Box
      sx={{
        '& > *:first-of-type': {
          mt: 0,
        },
        '& > *:last-child': {
          mb: 0,
        },
        ...sx,
      }}
    >
      <ReactMarkdown components={customComponents} remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </Box>
  );
};
