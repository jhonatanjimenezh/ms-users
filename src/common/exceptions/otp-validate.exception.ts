import { HttpException, HttpStatus } from '@nestjs/common';

export class OTPValidateException extends HttpException {
  constructor(message: string = 'El código de validación no es valido') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'El código OTP o el identificador de sesión no son validos',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
