import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Internal server error';
    let errors: unknown[] = [];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const body = exceptionResponse as { message?: string | string[]; errors?: unknown[] };
      if (Array.isArray(body.message)) {
        message = 'Validation failed';
        errors = body.message;
      } else if (typeof body.message === 'string') {
        message = body.message;
      }
      if (Array.isArray(body.errors)) {
        errors = body.errors;
      }
    } else if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR && process.env.NODE_ENV !== 'production') {
      message = exception instanceof Error ? exception.message : message;
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }
}
