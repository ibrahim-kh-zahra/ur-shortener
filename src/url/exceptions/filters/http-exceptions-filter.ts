import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import {Response} from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const message =
            exception instanceof BadRequestException
                ? exception.getResponse()['message']
                : exception.getResponse();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        response.status(status)
            .json({
                ERROR: message.toString()
            });
    }
}