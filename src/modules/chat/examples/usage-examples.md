# Примеры использования Chat API

## 1. Отправка сообщения (обычный запрос)

```typescript
// Отправка сообщения пользователя
const response = await fetch('/chat/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    lessonId: '123e4567-e89b-12d3-a456-426614174000',
    userId: '456e7890-e89b-12d3-a456-426614174001',
    content: 'Объясни, пожалуйста, что такое переменные в программировании?',
  }),
});

const data = await response.json();
console.log('Ответ AI:', data.aiMessage.content);
```

## 2. Отправка сообщения с потоковым ответом (SSE)

```typescript
// Функция для обработки потокового ответа
function sendMessageStream(lessonId: string, content: string, userId?: string) {
  const eventSource = new EventSource('/chat/message/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lessonId,
      userId,
      content,
    }),
  });

  let fullResponse = '';

  eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'chunk':
        fullResponse += data.content;
        console.log('Частичный ответ:', data.content);
        // Обновить UI с новым фрагментом
        updateChatUI(data.content);
        break;

      case 'end':
        console.log('Полный ответ получен:', fullResponse);
        console.log('ID сообщения:', data.messageId);
        eventSource.close();
        break;

      case 'error':
        console.error('Ошибка:', data.error);
        eventSource.close();
        break;
    }
  };

  eventSource.onerror = function (event) {
    console.error('Ошибка соединения:', event);
    eventSource.close();
  };
}

// Использование
sendMessageStream(
  '123e4567-e89b-12d3-a456-426614174000',
  'Что такое функции в JavaScript?',
  '456e7890-e89b-12d3-a456-426614174001',
);
```

## 3. Получение истории сообщений

```typescript
// Получить все сообщения чата урока
const response = await fetch(
  `/chat/messages/123e4567-e89b-12d3-a456-426614174000`,
);
const messages = await response.json();

messages.forEach((message) => {
  console.log(`[${message.role}] ${message.content}`);
});
```

## 4. Очистка истории чата

```typescript
// Очистить историю сообщений
const response = await fetch(
  `/chat/123e4567-e89b-12d3-a456-426614174000/messages`,
  {
    method: 'DELETE',
  },
);

const result = await response.json();
console.log(result.message); // "История чата очищена"
```

## 5. Удаление чата

```typescript
// Полностью удалить чат урока
const response = await fetch(`/chat/123e4567-e89b-12d3-a456-426614174000`, {
  method: 'DELETE',
});

const result = await response.json();
console.log(result.message); // "Чат успешно удален"
```

## React компонент для чата

```tsx
import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatProps {
  lessonId: string;
  userId?: string;
}

const Chat: React.FC<ChatProps> = ({ lessonId, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Загрузить историю сообщений при монтировании
  useEffect(() => {
    loadMessages();
  }, [lessonId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/chat/messages/${lessonId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          userId,
          content: input,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: data.aiMessage.id,
          role: 'assistant',
          content: data.aiMessage.content,
          created_at: data.aiMessage.created_at,
        },
      ]);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <strong>{message.role === 'user' ? 'Вы' : 'AI'}:</strong>
            <p>{message.content}</p>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <strong>AI:</strong>
            <p>Печатает...</p>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Задайте вопрос..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;
```
