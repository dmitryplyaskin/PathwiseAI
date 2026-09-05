import { Stack } from '@mui/material';
import { MessageItem } from './message_item';
import type { Message } from '../model/lesson_api';

interface MessageListProps {
  messages: Message[];
  regeneratingMessageId: string | null;
  onOpenMessageMenu: (
    messageId: string,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
}

export const MessageList = ({
  messages,
  regeneratingMessageId,
  onOpenMessageMenu,
}: MessageListProps) => {
  return (
    <Stack spacing={3}>
      {messages.map((msg: Message) => (
        <MessageItem
          key={msg.id}
          message={msg}
          regeneratingMessageId={regeneratingMessageId}
          onOpenMessageMenu={onOpenMessageMenu}
        />
      ))}
    </Stack>
  );
};
