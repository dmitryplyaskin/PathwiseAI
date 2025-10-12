import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from '../services/access-control.service';
import { AccessDeniedException } from '../exceptions/access-denied.exception';

@Injectable()
export class AccessControlInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceType = this.reflector.get<string>(
      'resourceType',
      context.getHandler(),
    );

    if (!user || !resourceType) {
      return next.handle();
    }

    const resourceId = request.params.id;
    if (!resourceId) {
      return next.handle();
    }

    let hasAccess = false;

    switch (resourceType) {
      case 'course':
        hasAccess = await this.accessControlService.checkCourseAccess(
          resourceId,
          user.id,
        );
        break;
      case 'unit':
        hasAccess = await this.accessControlService.checkUnitAccess(
          resourceId,
          user.id,
        );
        break;
      case 'lesson':
        hasAccess = await this.accessControlService.checkLessonAccess(
          resourceId,
          user.id,
        );
        break;
    }

    if (!hasAccess) {
      throw new AccessDeniedException(resourceType, resourceId);
    }

    return next.handle();
  }
}
