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

type ResourceType = 'course' | 'unit' | 'lesson';

interface RequestWithUserAndParams {
  user?: { id: string };
  params?: Record<string, string | undefined>;
}

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
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUserAndParams>();
    const userId = request.user?.id;
    const resourceType = this.reflector.get<ResourceType>(
      'resourceType',
      context.getHandler(),
    );

    if (!userId || !resourceType) {
      return next.handle();
    }

    const resourceId = request.params?.['id'];
    if (typeof resourceId !== 'string' || resourceId.length === 0) {
      return next.handle();
    }

    let hasAccess = false;

    switch (resourceType) {
      case 'course':
        hasAccess = await this.accessControlService.checkCourseAccess(
          resourceId,
          userId,
        );
        break;
      case 'unit':
        hasAccess = await this.accessControlService.checkUnitAccess(
          resourceId,
          userId,
        );
        break;
      case 'lesson':
        hasAccess = await this.accessControlService.checkLessonAccess(
          resourceId,
          userId,
        );
        break;
    }

    if (!hasAccess) {
      throw new AccessDeniedException(resourceType, resourceId);
    }

    return next.handle();
  }
}
