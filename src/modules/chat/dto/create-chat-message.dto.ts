import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateChatMessageDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  threadId?: string;

  @IsString()
  @IsOptional()
  lessonContent?: string;
}
