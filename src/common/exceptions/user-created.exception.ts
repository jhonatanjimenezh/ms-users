import { HttpException, HttpStatus } from '@nestjs/common';

export class UserCreatedException extends HttpException {
  constructor(message: string = 'Error con la creación del usuario') {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        error: 'Error durante el proceso',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
