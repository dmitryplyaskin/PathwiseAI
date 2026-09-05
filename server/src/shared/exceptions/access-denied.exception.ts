import { HttpException, HttpStatus } from '@nestjs/common';

export class AccessDeniedException extends HttpException {
  constructor(resource: string, resourceId: string) {
    super(
      `Доступ к ${resource} с ID "${resourceId}" запрещен`,
      HttpStatus.FORBIDDEN,
    );
  }
}
