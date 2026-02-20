import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseUUIDPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from '../services/chat.service';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
import { GetChatMessagesDto } from '../dto/get-chat-messages.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '../../users/entities/user.entity';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(
    @Body() createChatMessageDto: CreateChatMessageDto,
    @CurrentUser() user: User,
  ) {
    return this.chatService.sendMessage(createChatMessageDto, user.id);
  }

  @Get('messages')
  async getChatMessages(
    @Query() getChatMessagesDto: GetChatMessagesDto,
    @CurrentUser() user: User,
  ) {
    return this.chatService.getChatMessages(getChatMessagesDto, user.id);
  }

  @Get('messages/:lessonId')
  async getChatMessagesByLessonId(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.chatService.getChatMessages({ lessonId }, user.id);
  }

  @Delete(':lessonId')
  async deleteChat(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.chatService.deleteChat(lessonId, user.id);
  }

  @Delete(':lessonId/messages')
  async clearChatHistory(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.chatService.clearChatHistory(lessonId, user.id);
  }

  @Post('message/stream')
  async sendMessageStream(
    @Body() createChatMessageDto: CreateChatMessageDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    return this.chatService.sendMessageStream(createChatMessageDto, user.id, res);
  }
}