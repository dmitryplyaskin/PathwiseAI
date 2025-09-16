import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateClarificationMessageDto } from '../dto/create-clarification-message.dto';
import { UpdateClarificationMessageDto } from '../dto/update-clarification-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createClarificationMessageDto: CreateClarificationMessageDto) {
    return this.chatService.create(createClarificationMessageDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClarificationMessageDto: UpdateClarificationMessageDto,
  ) {
    return this.chatService.update(id, updateClarificationMessageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.remove(id);
  }
}
