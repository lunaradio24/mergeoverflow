import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        // 기본값 설정
        const defaultStatusCode = HttpStatus.OK;
        const defaultMessage = '요청이 성공적으로 완료되었습니다.';

        const { statusCode, message, data, code, status, ...restResponse } = response;
        const finalStatusCode = statusCode || code || status || defaultStatusCode;
        const finalMessage = message || defaultMessage;
        const finalData = response.data || restResponse;

        return { statusCode: finalStatusCode, message: finalMessage, data: finalData };
      }),
    );
  }
}
