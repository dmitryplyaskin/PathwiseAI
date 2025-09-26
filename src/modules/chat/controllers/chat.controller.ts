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
} from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from '../services/chat.service';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
import { GetChatMessagesDto } from '../dto/get-chat-messages.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() createChatMessageDto: CreateChatMessageDto) {
    return this.chatService.sendMessage(createChatMessageDto);
  }

  @Get('messages')
  async getChatMessages(@Query() getChatMessagesDto: GetChatMessagesDto) {
    return this.chatService.getChatMessages(getChatMessagesDto);
  }

  @Get('messages/:lessonId')
  async getChatMessagesByLessonId(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.chatService.getChatMessages({ lessonId });
  }

  @Delete(':lessonId')
  async deleteChat(@Param('lessonId', ParseUUIDPipe) lessonId: string) {
    return this.chatService.deleteChat(lessonId);
  }

  @Delete(':lessonId/messages')
  async clearChatHistory(@Param('lessonId', ParseUUIDPipe) lessonId: string) {
    return this.chatService.clearChatHistory(lessonId);
  }

  @Post('message/stream')
  async sendMessageStream(
    @Body() createChatMessageDto: CreateChatMessageDto,
    @Res() res: Response,
  ) {
    return this.chatService.sendMessageStream(createChatMessageDto, res);
  }
}
