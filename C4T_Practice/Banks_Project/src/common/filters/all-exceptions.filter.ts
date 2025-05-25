import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { isAxiosError } from 'axios';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = {
      status: httpStatus,
      message: 'Internal server error',
    };

    // Prisma-specific error handling
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaHandled = this.handlePrismaError(exception);
      httpStatus = prismaHandled.status;
      responseBody = prismaHandled;
    }

    // NestJS HttpExceptions
    else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody = exception.getResponse();
    }

    // Other JS errors
    else if (exception instanceof Error && !isAxiosError(exception)) {
      responseBody = {
        status: httpStatus,
        message: exception.message,
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (error.code) {
      case 'P2002': {
        const uniqueFields = error.meta?.target;
        const tableName = error.meta?.modelName || 'unknown table';

        let fieldName = 'unknown field';

        if (Array.isArray(uniqueFields)) {
          fieldName = uniqueFields.join(', ');
        } else if (typeof uniqueFields === 'string') {
          fieldName = uniqueFields;
        }

        return {
          status: HttpStatus.CONFLICT,
          message: `A record with the same value for ${fieldName} already exists in the ${tableName} table. Please use a different value.`,
        };
      }

      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'The requested resource was not found.',
        };

      default:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Database error: ${error.message}`,
        };
    }
  }
}
