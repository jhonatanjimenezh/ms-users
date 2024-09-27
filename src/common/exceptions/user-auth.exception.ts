import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAuthException extends HttpException {
  constructor(message: string = 'El usuario no tiene sesión activa') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'El usuario no tiene sesión activa',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
