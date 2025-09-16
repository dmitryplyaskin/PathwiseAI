import { PartialType } from '@nestjs/mapped-types';
import { CreateClarificationMessageDto } from './create-clarification-message.dto';

export class UpdateClarificationMessageDto extends PartialType(
  CreateClarificationMessageDto,
) {}
