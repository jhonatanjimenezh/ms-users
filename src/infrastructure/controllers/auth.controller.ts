import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from '../dtos/response/response.dto';
import { TokenDto } from '../dtos/request/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() tokenDto: TokenDto): Promise<ResponseDto> {
    try {
      const decoded = this.jwtService.verify(tokenDto.token);
      return new ResponseDto({
        message: 'Token válido',
        data: { decoded },
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new UnauthorizedException(`Token inválid= ${error}`);
    }
  }
}
