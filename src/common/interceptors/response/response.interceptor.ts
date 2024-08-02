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

        // response가 객체이고, response.data도 존재하는 객체인 경우
        if (
          typeof response === 'object' &&
          response !== null &&
          'data' in response &&
          typeof response.data === 'object'
        ) {
          const { statusCode, message = defaultMessage, data = response, code, status } = response;
          const finalStatusCode = statusCode || code || status || defaultStatusCode;
          return { statusCode: finalStatusCode, message, data };
        }

        // response가 객체가 아닌 경우
        else {
          return { statusCode: defaultStatusCode, message: defaultMessage, data: response };
        }
      }),
    );
  }
}
