import {
  IsUUID,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CheckTextAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Ответ пользователя не может быть пустым' })
  @MaxLength(5000, {
    message: 'Ответ пользователя не может превышать 5000 символов',
  })
  userAnswer: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Ожидаемый ответ не может быть пустым' })
  @MaxLength(5000, {
    message: 'Ожидаемый ответ не может превышать 5000 символов',
  })
  expectedAnswer: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Текст вопроса не может быть пустым' })
  @MaxLength(10000, {
    message: 'Текст вопроса не может превышать 10000 символов',
  })
  questionText: string;
}
