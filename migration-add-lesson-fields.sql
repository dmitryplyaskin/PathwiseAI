-- Добавление новых полей в таблицу lessons
ALTER TABLE lessons 
ADD COLUMN description TEXT,
ADD COLUMN reading_time INTEGER,
ADD COLUMN difficulty INTEGER;

-- Комментарии к новым полям
COMMENT ON COLUMN lessons.description IS 'Краткое описание урока';
COMMENT ON COLUMN lessons.reading_time IS 'Время чтения урока в минутах';
COMMENT ON COLUMN lessons.difficulty IS 'Уровень сложности урока от 1 до 10';
