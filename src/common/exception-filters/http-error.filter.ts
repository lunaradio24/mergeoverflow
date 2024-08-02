import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      errorCode: status || 500,
      errorStatus: exceptionResponse['error'],
      path: request.url,
      method: request.method,
      message: exceptionResponse['message'] || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
