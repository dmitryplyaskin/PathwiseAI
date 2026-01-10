import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { AccessControlInterceptor } from '../interceptors/access-control.interceptor';

export const CheckAccess = (resourceType: 'course' | 'unit' | 'lesson') =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    SetMetadata('resourceType', resourceType),
    UseInterceptors(AccessControlInterceptor),
  );
