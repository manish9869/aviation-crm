import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: string;
  data: T;
  errors: any;
  message: string;
}

@Injectable()
export class ResponseHandlerInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        data,
        errors: context.switchToHttp().getResponse().locals.errors || {},
        message: context.switchToHttp().getResponse().locals.message || '',
      })),
    );
  }
}
