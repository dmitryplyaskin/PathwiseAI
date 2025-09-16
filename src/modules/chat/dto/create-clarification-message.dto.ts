import { IsString, IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { SenderType } from '../entities/clarification-message.entity';

export class CreateClarificationMessageDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(SenderType)
  @IsNotEmpty()
  sender: SenderType;

  @IsString()
  @IsNotEmpty()
  message_text: string;
}
