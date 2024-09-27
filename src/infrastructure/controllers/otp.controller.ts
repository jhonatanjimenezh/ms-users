import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  HttpCode,
  Request,
} from '@nestjs/common';

import { ResponseDto } from '../dtos/response/response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ValidateOTPDto } from '../dtos/request/validate-otp.dto';
import { OTPService } from '../../application/services/otp.service';
import { OTPValidateException } from '../../common/exceptions/otp-validate.exception';

@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async generateOTP(@Request() req): Promise<ResponseDto> {
    const userSession = req.user;
    const otp = await this.otpService.generateOTP(userSession);
    return new ResponseDto({
      message: 'OTP generado correctamente',
      data: otp,
      statusCode: HttpStatus.CREATED,
    });
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async validateOTP(
    @Request() req,
    @Body() validateOTPDto: ValidateOTPDto,
  ): Promise<ResponseDto> {
    try {
      console.log();
      const userSession = req.user;
      const isValid = await this.otpService.validateOTP(
        validateOTPDto,
        userSession,
      );
      return new ResponseDto({
        message: 'OTP validado correctamente',
        data: { isValid },
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new OTPValidateException(
        `Error en la verificación del OTP: ${error}`,
      );
    }
  }
}
