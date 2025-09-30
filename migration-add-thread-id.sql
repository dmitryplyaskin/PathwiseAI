-- Миграция для добавления поддержки веток разговоров
-- Добавляем поле thread_id в таблицу chat_messages

-- Добавить колонку thread_id
ALTER TABLE chat_messages 
ADD COLUMN thread_id VARCHAR(255) DEFAULT 'main';

-- Обновить существующие записи
UPDATE chat_messages 
SET thread_id = 'main' 
WHERE thread_id IS NULL;

-- Создать индекс для быстрого поиска по ветке
CREATE INDEX idx_chat_messages_thread_id ON chat_messages(thread_id);

-- Создать составной индекс для chat_id + thread_id
CREATE INDEX idx_chat_messages_chat_thread ON chat_messages(chat_id, thread_id);
