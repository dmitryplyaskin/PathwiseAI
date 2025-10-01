import { Box, Container, Stack } from '@mui/material';
import { useParams } from 'react-router';
import { mockLessonContent } from '../model/mock';
import { StickyInfoBlock } from './StickyInfoBlock';
import { useLesson } from '../../../shared/model/lessons';
import { useLessonPage } from '../model/use_lesson_page';
import { LoadingScreen } from './loading_screen';
import { LessonHeader } from './lesson_header';
import { LessonContent } from './lesson_content';
import { ThreadPanel } from './thread_panel';
import { MessageList } from './message_list';
import { QuestionInput } from './question_input';
import { ThreadMenu } from './thread_menu';
import { MessageMenu } from './message_menu';
import { DeleteDialog } from './delete_dialog';

export const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lesson, loading, notFound } = useLesson(lessonId);

  // Определяем контент урока: реальный или мок
  const lessonContent = lesson?.content || mockLessonContent;
  const lessonTitle = lesson?.title || 'Введение в машинное обучение';

  const {
    threads,
    currentThreadId,
    messages,
    showInput,
    inputValue,
    isLoading,
    regeneratingMessageId,
    threadMenuAnchor,
    deleteDialogOpen,
    messageMenuAnchor,
    setShowInput,
    setInputValue,
    setThreadMenuAnchor,
    setDeleteDialogOpen,
    setMessageMenuAnchor,
    setSelectedMessageId,
    handleSendMessage,
    handleCreateNewThread,
    handleSwitchThread,
    handleDeleteThread,
    handleRegenerateMessage,
    openDeleteDialog,
  } = useLessonPage(lessonId, lessonContent);

  // Показываем прелоадер при загрузке
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f8fbff 0%, #eff6ff 50%, #dbeafe 100%)',
      }}
    >
      <LessonHeader
        lesson={lesson}
        notFound={notFound}
        lessonTitle={lessonTitle}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {/* Материал урока - всегда сверху */}
              <LessonContent content={lessonContent} />

              {/* Панель управления ветками */}
              <ThreadPanel
                currentThreadId={currentThreadId}
                threads={threads}
                onCreateNewThread={handleCreateNewThread}
                onOpenThreadMenu={(e) => setThreadMenuAnchor(e.currentTarget)}
              />

              {/* Список сообщений текущей ветки */}
              {messages.length > 0 && (
                <MessageList
                  messages={messages}
                  regeneratingMessageId={regeneratingMessageId}
                  onOpenMessageMenu={(messageId, event) => {
                    setSelectedMessageId(messageId);
                    setMessageMenuAnchor(event.currentTarget);
                  }}
                />
              )}

              {/* Поле ввода вопроса */}
              <QuestionInput
                showInput={showInput}
                inputValue={inputValue}
                isLoading={isLoading}
                onInputChange={setInputValue}
                onSend={handleSendMessage}
                onShowInput={() => setShowInput(true)}
                onHideInput={() => {
                  setShowInput(false);
                  setInputValue('');
                }}
              />
            </Stack>
          </Box>

          <StickyInfoBlock lesson={lesson} notFound={notFound} />
        </Box>
      </Container>

      {/* Меню веток */}
      <ThreadMenu
        anchorEl={threadMenuAnchor}
        currentThreadId={currentThreadId}
        threads={threads}
        onClose={() => setThreadMenuAnchor(null)}
        onSwitchThread={handleSwitchThread}
        onDeleteThread={openDeleteDialog}
      />

      {/* Меню действий с сообщением */}
      <MessageMenu
        anchorEl={messageMenuAnchor}
        regeneratingMessageId={regeneratingMessageId}
        onClose={() => {
          setMessageMenuAnchor(null);
          setSelectedMessageId(null);
        }}
        onRegenerate={handleRegenerateMessage}
      />

      {/* Диалог подтверждения удаления */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteThread}
      />
    </Box>
  );
};
