import React, { useState } from 'react';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
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
  codeTheme?: Record<string, unknown>;
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
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks((prev) => new Set(prev).add(blockId));
      setTimeout(() => {
        setCopiedBlocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(blockId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

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
    code: ({ children, className, node }) => {
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
      const codeText = String(children).replace(/\n$/, '');
      const blockId = `code-${Math.random().toString(36).substr(2, 9)}`;
      const isCopied = copiedBlocks.has(blockId);

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
          {(language || !isInline) && (
            <Box
              sx={{
                backgroundColor: 'grey.100',
                px: 2,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {language && (
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
              )}
              <Tooltip title={isCopied ? 'Скопировано!' : 'Копировать код'}>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(codeText, blockId)}
                  sx={{
                    ml: 'auto',
                    color: isCopied ? 'success.main' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {isCopied ? (
                    <Check fontSize="small" />
                  ) : (
                    <ContentCopy fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              style={codeTheme || oneLight}
              language={language}
              showLineNumbers={showLineNumbers}
              customStyle={{
                margin: 0,
                padding: theme.spacing(2),
                fontSize: codeFontSize,
                backgroundColor: 'transparent',
              }}
            >
              {codeText}
            </SyntaxHighlighter>
          </Box>
        </Box>
      );
    },

    // Блоки кода (pre)
    pre: ({ children }) => <Box>{children}</Box>,

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
    blockquote: ({ children }) => (
      <Box
        sx={{
          backgroundColor: 'info.50',
          borderLeft: '4px solid',
          borderColor: 'info.main',
          p: 2,
          my: 2,
          fontStyle: 'italic',
          borderRadius: 1,
        }}
      >
        {children}
      </Box>
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
    th: ({ children }) => (
      <TableCell
        component="th"
        sx={{
          backgroundColor: 'action.hover',
          fontWeight: 600,
          borderBottom: '2px solid',
          borderColor: 'divider',
        }}
      >
        {children}
      </TableCell>
    ),
    td: ({ children }) => (
      <TableCell
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
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
