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

        let finalStatusCode;
        let finalMessage;
        let finalData;

        if (response) {
          const { statusCode, code, status, message, data, ...restResponse } = response;
          finalStatusCode = statusCode || code || status || defaultStatusCode;
          finalMessage = message || defaultMessage;
          finalData = data || restResponse;
        } else {
          finalStatusCode = defaultStatusCode;
          finalMessage = defaultMessage;
          finalData = null;
        }

        return { statusCode: finalStatusCode, message: finalMessage, data: finalData };
      }),
    );
  }
}
