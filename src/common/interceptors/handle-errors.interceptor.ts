import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class HandleErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.name == 'NotFoundError') {
          const dbName = error.message.split(' ')[1];
          throw new NotFoundException(`${dbName} not found`);
        }
        return throwError(() => error);
      }),
    );
  }
}
