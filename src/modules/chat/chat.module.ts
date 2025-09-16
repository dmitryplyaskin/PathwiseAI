import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { ClarificationMessage } from './entities/clarification-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClarificationMessage])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
