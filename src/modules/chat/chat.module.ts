import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './services/chat.service';
import { OpenRouterService } from './services/openrouter.service';
import { ChatController } from './controllers/chat.controller';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ClarificationMessage } from './entities/clarification-message.entity';
import openrouterConfig from '../../config/openrouter.config';
import { Lesson } from '../courses/entities/lesson.entity';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMessage, ClarificationMessage, Lesson]),
    ConfigModule.forFeature(openrouterConfig),
    SharedModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, OpenRouterService],
  exports: [ChatService, OpenRouterService],
})
export class ChatModule {}
