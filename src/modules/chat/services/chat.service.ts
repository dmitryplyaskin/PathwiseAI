import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClarificationMessage } from '../entities/clarification-message.entity';
import { CreateClarificationMessageDto } from '../dto/create-clarification-message.dto';
import { UpdateClarificationMessageDto } from '../dto/update-clarification-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ClarificationMessage)
    private readonly clarificationMessageRepository: Repository<ClarificationMessage>,
  ) {}

  create(createClarificationMessageDto: CreateClarificationMessageDto) {
    const message = this.clarificationMessageRepository.create({
      ...createClarificationMessageDto,
      lesson: { id: createClarificationMessageDto.lessonId },
      user: { id: createClarificationMessageDto.userId },
    });
    return this.clarificationMessageRepository.save(message);
  }

  findAll() {
    return this.clarificationMessageRepository.find();
  }

  findOne(id: string) {
    return this.clarificationMessageRepository.findOneBy({ id });
  }

  update(
    id: string,
    updateClarificationMessageDto: UpdateClarificationMessageDto,
  ) {
    return this.clarificationMessageRepository.update(
      id,
      updateClarificationMessageDto,
    );
  }

  remove(id: string) {
    return this.clarificationMessageRepository.delete(id);
  }
}
