import { IsUUID, IsNotEmpty } from 'class-validator';

export class GetChatMessagesDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;
}
